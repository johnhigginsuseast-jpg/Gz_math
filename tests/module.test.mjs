import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizedLine, lineThrough, twoLines, generalCircle, twoCircles, reflectPoint, apollonius } from '../site/module-math.mjs';
import { lessons, modules, freshLesson, restoreModule, lessonProgress } from '../site/module-course.mjs';
const near = (x, y, error = 1e-8) => assert.ok(Math.abs(x - y) < error, `${x} != ${y}`);

test('两点定线含水平竖直；同点拒绝；方程归一化与倍乘不改关系和距离', () => {
  for (const [p, q] of [[{ x: 2, y: 1 }, { x: 2, y: 5 }], [{ x: -3, y: 2 }, { x: 4, y: 2 }], [{ x: -2, y: -1 }, { x: 3, y: 2 }]]) {
    const l = lineThrough(p, q);
    near(l.A * p.x + l.B * p.y + l.C, 0); near(l.A * q.x + l.B * q.y + l.C, 0);
  }
  assert.throws(() => lineThrough({ x: 1, y: 1 }, { x: 1, y: 1 }), RangeError);
  assert.throws(() => normalizedLine({ A: 0, B: 0, C: 1 }), RangeError);
  assert.equal(twoLines({ A: 1, B: 0, C: -2 }, { A: -2, B: 0, C: 4 }).kind, 'coincident');
  assert.deepEqual(twoLines({ A: 1, B: 0, C: -2 }, { A: 0, B: -3, C: 9 }).point, { x: 2, y: 3 });
  for (const scale of [-7, -0.5, 1, 5]) {
    const r = twoLines({ A: 3, B: 4, C: -5 }, { A: 6 * scale, B: 8 * scale, C: 10 * scale });
    assert.equal(r.kind, 'parallel'); near(r.distance, 2);
  }
  for (let i = 1; i < 100; i++) {
    const a = { A: i % 7 - 3, B: 2, C: i % 5 }, b = { A: 3, B: i % 9 - 4, C: -i / 10 };
    const r = twoLines(a, b);
    if (r.point) for (const l of [a, b]) near(l.A * r.point.x + l.B * r.point.y + l.C, 0);
  }
});

test('配方表示实圆、点、空集，读中心与半径一致', () => {
  assert.deepEqual(generalCircle(-2, 4, -4), { a: 1, b: -2, r2: 9, r: 3, kind: 'circle' });
  assert.equal(generalCircle(-2, 4, 5).kind, 'point');
  assert.equal(generalCircle(-2, 4, 6).kind, 'empty');
  assert.throws(() => generalCircle(NaN, 0, 0));
  for (let D = -6; D <= 6; D++) for (let E = -6; E <= 6; E++) {
    const c = generalCircle(D, E, -8);
    const x = c.a + c.r * Math.cos(D), y = c.b + c.r * Math.sin(D);
    near(x * x + y * y + D * x + E * y - 8, 0);
  }
});

test('两圆七种情况、内外切唯一点，重合不能当内切', () => {
  const p = { a: 0, b: 0, r: 3 };
  for (const [d, kind, count] of [[5, 'outside', 0], [4, 'external', 1], [3, 'intersect', 2], [2, 'internal', 1], [1, 'inside', 0], [0, 'concentric', 0]]) {
    const r = twoCircles(p, { a: d, b: 0, r: 1 });
    assert.equal(r.kind, kind); assert.equal(r.count, count);
  }
  const coincident = twoCircles(p, p);
  assert.equal(coincident.kind, 'coincident'); assert.equal(coincident.count, Infinity); assert.equal(coincident.axis, null);
  near(twoCircles(p, { a: 4, b: 0, r: 3 }).chord, 2 * Math.sqrt(5));
  assert.throws(() => twoCircles(p, { a: 0, b: 0, r: 0 }), RangeError);
});

test('240组平移和交换后的两圆交点满足原方程与根轴，弦长等于端点距离', () => {
  let intersections = 0;
  for (let i = 0; i < 240; i++) {
    const p = { a: -1.3, b: 2.1, r: 1 + i % 5 }, q = { a: p.a + Math.cos(i) * (1 + i % 7), b: p.b + Math.sin(i) * (1 + i % 7), r: 1 + i % 3 };
    const r = twoCircles(p, q), reversed = twoCircles(q, p);
    assert.equal(r.kind, reversed.kind); assert.equal(r.count, reversed.count);
    for (const t of r.points) {
      intersections++;
      near(Math.hypot(t.x - p.a, t.y - p.b), p.r);
      near(Math.hypot(t.x - q.a, t.y - q.b), q.r);
      near(r.axis.A * t.x + r.axis.B * t.y + r.axis.C, 0);
    }
    if (r.points.length === 2) near(r.chord, Math.hypot(r.points[0].x - r.points[1].x, r.points[0].y - r.points[1].y));
  }
  assert.ok(intersections > 100);
});

test('反射保持轴上任一点距离，对合回原点；最短路取到三角不等式下界', () => {
  for (let i = 0; i < 40; i++) {
    const p = { x: i / 3 - 5, y: i % 5 }, l = { A: 3, B: 4, C: -2 }, q = reflectPoint(p, l), back = reflectPoint(q, l);
    near(back.x, p.x); near(back.y, p.y);
    const axisPoint = { x: 2, y: -1 };
    near(Math.hypot(p.x - axisPoint.x, p.y - axisPoint.y), Math.hypot(q.x - axisPoint.x, q.y - axisPoint.y));
  }
  near(Math.hypot(2, -2) + Math.hypot(3, 3), Math.sqrt(50));
});

test('阿波罗尼斯轨迹上的采样点满足原距离比，λ=1退化垂直平分线', () => {
  const p = { x: -2, y: 0 }, q = { x: 2, y: 0 };
  assert.deepEqual(apollonius(p, q, 1), { kind: 'line', line: { A: 8, B: 0, C: 0 } });
  for (const ratio of [0.5, 0.75, 1.25, 1.5, 2]) {
    const c = apollonius(p, q, ratio);
    for (let i = 0; i < 36; i++) {
      const x = c.a + c.r * Math.cos(i), y = c.b + c.r * Math.sin(i);
      near(Math.hypot(x - p.x, y - p.y) / Math.hypot(x - q.x, y - q.y), ratio);
    }
  }
  assert.throws(() => apollonius(p, q, 0));
});

test('所有课程进度隔离、未知/损坏记录安全恢复，答题正确不等于所有环节完成', () => {
  const original = restoreModule(null);
  assert.equal(modules.length, 4); assert.equal(lessons.filter(l=>l.chapter==='第二章 · 直线与圆的方程').length, 6); assert.equal(lessons.filter(l => l.legacy).length, 1);
  for (const lesson of lessons.filter(l => !l.legacy)) {
    const s = freshLesson(lesson);
    assert.equal(lessonProgress(lesson, s), 0);
    assert.ok(lesson.labs.length && lesson.notes.length && lesson.examples.length && lesson.quizzes.length);
    for (const q of lesson.quizzes) assert.ok(Number.isInteger(q.answer) && q.options[q.answer]);
    s.answers = lesson.quizzes.map(q => ({ selected: q.answer, submitted: true, hadError: false })); s.complete = true;
    original.lessons[lesson.id] = s;
  }
  const restored = restoreModule(JSON.stringify({ version: 1, lessons: original.lessons }));
  assert.ok(Object.values(restored.lessons).every(s => !s.complete && s.unlocked === 0));
  assert.equal(restoreModule('{').recovered, true);
  assert.equal(restoreModule('{"version":99}').recovered, true);
  const l = lessons.find(l=>l.id==='line'), s = freshLesson(l);
  s.scene = 1; s.stage = 4; s.labs.angle.values.alpha = 999; s.labs.angle.guess = 88;
  const clean = restoreModule(JSON.stringify({ version: 1, lessons: { line: s } })).lessons.line;
  assert.equal(clean.stage, 0); assert.equal(clean.labs.angle.values.alpha, 30); assert.equal(clean.labs.angle.guess, null);
});

test('完整新课可刷新恢复，记录与订正历史保留，旧课键不复用', () => {
  const lesson = lessons.find(l=>l.id==='line'), s = freshLesson(lesson);
  s.scene = 1; s.stage = 4; s.unlocked = 4;
  for (const l of lesson.labs) { s.labs[l.id].guess = 0; s.labs[l.id].shown = true; s.labs[l.id].records.push({ guess: 0, observation: 0, summary: '实际观察' }); }
  s.examples = lesson.examples.map(e => e.steps.length);
  s.answers = lesson.quizzes.map(q => ({ selected: q.answer, submitted: true, hadError: true })); s.complete = true;
  const restored = restoreModule(JSON.stringify({ version: 1, lessons: { line: s } })).lessons.line;
  assert.equal(restored.complete, true); assert.equal(lessonProgress(lesson, restored), 100);
  assert.equal(restored.answers[0].hadError, true);
  s.answers[0].submitted = false;
  assert.equal(restoreModule(JSON.stringify({ version: 1, lessons: { line: s } })).lessons.line.complete, false);
});
