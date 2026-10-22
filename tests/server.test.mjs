import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createServer } from '../server.mjs';

test('本地服务只公开网站资源，拒绝项目资料和路径穿越', async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    const port = server.address().port;
    const request = resource => new Promise((resolve, reject) => {
      http.get({ host: '127.0.0.1', port, path: resource }, response => {
        let body = '';
        response.setEncoding('utf8');
        response.on('data', chunk => body += chunk);
        response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
      }).on('error', reject);
    });
    for (const resource of ['/', '/app.mjs', '/math.mjs', '/course.mjs', '/state.mjs', '/styles.css', '/assets/logo.svg']) assert.equal((await request(resource)).status, 200, resource);
    for (const resource of ['/README.md', '/package.json', '/.git/config', '/docs/requirements/requirements-v0.1.md', '/' + encodeURIComponent('高中数学知识点详解.docx'), '/../package.json', '/%2e%2e/package.json', '/%2e%2e%5cpackage.json', '/%00', '/%XX']) assert.equal((await request(resource)).status, 404, resource);
    const page = await request('/');
    assert.match(page.headers['content-security-policy'], /connect-src 'none'/);
    assert.equal(page.headers['x-content-type-options'], 'nosniff');
    assert.doesNotMatch(page.body, /https?:\/\//);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
