import test from 'node:test';
import assert from 'node:assert/strict';
import { experiment, lineCircle, EPSILON } from '../site/math.mjs';
import { course, exercises, checkAnswer } from '../site/course.mjs';

const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);

test('水平线：0、2、±3、4的公共点和距离', () => {
  for (const [offset, count] of [[0, 2], [2, 2], [3, 1], [-3, 1], [4, 0]]) {
    const result = experiment(3, offset, 0);
    assert.equal(result.count, count);
    close(result.distance, Math.abs(offset));
    for (const point of result.points) { close(point.y, offset); close(point.x ** 2 + point.y ** 2, 9); }
  }
  const intersection = experiment(3, 2, 0).points.map(point => point.x).sort((a, b) => a - b);
  close(intersection[0], -Math.sqrt(5));
  close(intersection[1], Math.sqrt(5));
});

test('252组独立几何不变量：交点在圆和直线上，垂足距离正确', () => {
  let cases = 0;
  for (const radius of [1, 2, 3, 4]) for (const offset of [-5, -3, -1, 0, 1, 3, 5]) for (const angle of [0, 30, 45, 60, 90, 120, 135, 150, 180]) {
    const result = experiment(radius, offset, angle);
    const { A, B, C } = result.line;
    close(Math.hypot(result.foot.x, result.foot.y), Math.abs(offset));
    close(A * result.foot.x + B * result.foot.y + C, 0);
    close(result.distance, Math.abs(offset));
    assert.equal(result.count, Math.abs(offset) > radius ? 0 : Math.abs(offset) === radius ? 1 : 2);
    for (const point of result.points) {
      close(point.x ** 2 + point.y ** 2, radius ** 2);
      close(A * point.x + B * point.y + C, 0);
    }
    cases++;
  }
  assert.equal(cases, 252);
});

test('竖直线、负偏移、旋转两端的语义', () => {
  for (const point of experiment(3, 2, 90).points) close(point.x, -2);
  for (const point of experiment(3, 2, 180).points) close(point.y, -2);
  close(experiment(3, -3, 0).points[0].y, -3);
  assert.equal(experiment(3, 0, 45).count, 2);
});

test('相切容差不产生重复点或NaN，显示舍入不用于判别', () => {
  assert.equal(experiment(3, 3 + EPSILON / 2, 90).count, 1);
  assert.equal(experiment(3, 3 + EPSILON * 4, 90).count, 0);
  assert.equal(experiment(3, 2.9999, 0).count, 2);
  assert.equal(experiment(3, 3.0001, 0).count, 0);
  assert.ok(experiment(3, 3 - EPSILON / 2, 45).points.every(point => Number.isFinite(point.x) && Number.isFinite(point.y)));
});

test('两道例题：斜线判断、平移圆与相切参数的两个分支', () => {
  const example1 = lineCircle({ r: 3 }, { A: 1, B: 1, C: -3 });
  close(example1.distance, 3 / Math.sqrt(2));
  assert.equal(example1.kind, 'intersect');
  for (const c of [-3 + 2 * Math.sqrt(2), -3 - 2 * Math.sqrt(2)]) {
    const result = lineCircle({ a: 1, b: 2, r: 2 }, { A: 1, B: 1, C: c });
    close(result.distance, 2);
    assert.equal(result.count, 1);
    close((result.points[0].x - 1) ** 2 + (result.points[0].y - 2) ** 2, 4);
  }
  close(lineCircle({ a: 1, b: 2, r: 2 }, { A: 3, B: 4, C: -1 }).distance, 2);
});

test('圆和直线的非法参数在边界拒绝', () => {
  for (const circle of [{ r: 0 }, { r: -1 }, { r: NaN }, { r: Infinity }]) assert.throws(() => lineCircle(circle, { A: 1, B: 1, C: 0 }), RangeError);
  assert.throws(() => lineCircle({ r: 3 }, { A: 0, B: 0, C: 1 }), RangeError);
  assert.throws(() => lineCircle({ r: 3 }, { A: Infinity, B: 1, C: 1 }), RangeError);
});

test('课程内容与明确答案一致，多选不接受漏选或多选', () => {
  assert.equal(course.stages.length, 8);
  assert.equal(course.examples.length, 7);
  assert.deepEqual(exercises.slice(0, 6).map(question => question.answer), [[0], [1], [2], [0], [0, 1], [1]]);
  assert.equal(checkAnswer(exercises[4], [0]), false);
  assert.equal(checkAnswer(exercises[4], [0, 1, 2]), false);
  assert.equal(checkAnswer(exercises[4], [1, 0]), true);
});
