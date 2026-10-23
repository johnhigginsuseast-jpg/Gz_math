import {readFile,writeFile,readdir,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const root=new URL('../../../',import.meta.url),run=new URL('../../acceptance/runs/candidate-v0.8-r1/',import.meta.url);
const site=async dir=>{const entries=await readdir(new URL(dir,root),{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?site(dir+e.name+'/'):dir+e.name))).flat();};
const paths=[...await site('site/'),...(await readdir(new URL('tests/',root))).map(p=>'tests/'+p),'package.json','server.mjs','docs/requirements/requirements-v0.8.md','docs/acceptance/criteria-v0.8.md','docs/testing/v0.8/v0.7-courses.json'];
const hash=async path=>({path,sha256:createHash('sha256').update(await readFile(new URL(path,root))).digest('hex')});
const prior=JSON.parse(await readFile(new URL('docs/acceptance/runs/candidate-v0.7-r1/manifest.json',root),'utf8'));
await mkdir(run,{recursive:true});const manifest={candidate:'v0.8-r1',frozenAt:new Date().toISOString(),baseCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),files:await Promise.all(paths.map(hash)),sources:await Promise.all(prior.sources.map(s=>hash(s.path)))};await writeFile(new URL('manifest.json',run),JSON.stringify(manifest,null,2));console.log(JSON.stringify({files:manifest.files.length,sources:manifest.sources.length}));
