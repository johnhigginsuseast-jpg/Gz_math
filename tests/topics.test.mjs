import test from 'node:test';
import assert from 'node:assert/strict';
import { experiment, lineCircle, distanceExtrema, movingLine, tangentLines, constructionSnapshot } from '../site/math.mjs';
import { initialState, restoreState, practiceProgress } from '../site/state.mjs';
import { topics, course, exercises } from '../site/course.mjs';

const close = (actual, expected, tolerance = 1e-8) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} ≠ ${expected}`);

test('弦长：已知答案、直径最大值、退化点与无弦，以及真实端点距离', () => {
  close(experiment(3, 0, 0).chordLength, 6);
  close(experiment(3, 2, 0).chordLength, 2 * Math.sqrt(5));
  close(lineCircle({ r: 5 }, { A: 3, B: 4, C: -15 }).chordLength, 8);
  assert.equal(experiment(3, 3, 45).chordLength, 0);
  assert.equal(experiment(3, 4, 0).chordLength, null);
  for (const radius of [1, 2, 3, 4]) for (const offset of [-3, -1, 0, 1, 3]) for (const angle of [0, 45, 90, 180]) {
    const result = experiment(radius, offset, angle);
    if (result.points.length === 2) {
      close(result.chordLength, Math.hypot(result.points[0].x - result.points[1].x, result.points[0].y - result.points[1].y));
      assert.ok(result.chordLength <= 2 * radius + 1e-8);
    }
  }
});

test('距离最值：相离、相交、相切、两侧直线，并以圆周采样独立验证', () => {
  assert.deepEqual(distanceExtrema(3, 4), { min: 1, max: 7 });
  assert.deepEqual(distanceExtrema(3, 2), { min: 0, max: 5 });
  assert.deepEqual(distanceExtrema(3, 0), { min: 0, max: 3 });
  assert.deepEqual(distanceExtrema(3, 3), { min: 0, max: 6 });
  assert.deepEqual(distanceExtrema(3, 2, 'point'), { min: 1, max: 5 });
  assert.deepEqual(distanceExtrema(3, 4, 'point'), { min: 1, max: 7 });
  assert.deepEqual(distanceExtrema(3, 0, 'point'), { min: 3, max: 3 });
  for (const radius of [1, 2, 3, 4]) for (const offset of [-5, -2, 0, 2, 5]) {
    const samples = Array.from({ length: 720 }, (_, index) => Math.abs(radius * Math.sin(index * Math.PI / 360) - offset));
    const expected = distanceExtrema(radius, Math.abs(offset));
    close(Math.min(...samples), expected.min, .03);
    close(Math.max(...samples), expected.max, .03);
    const pointDistances = Array.from({ length: 720 }, (_, index) => Math.hypot(radius * Math.cos(index * Math.PI / 360) - Math.abs(offset), radius * Math.sin(index * Math.PI / 360)));
    const pointExpected = distanceExtrema(radius, Math.abs(offset), 'point');
    close(Math.min(...pointDistances), pointExpected.min, .03);
    close(Math.max(...pointDistances), pointExpected.max, .03);
  }
  assert.throws(() => distanceExtrema(0, 1), RangeError);
  assert.throws(() => distanceExtrema(3, -1), RangeError);
  assert.throws(() => distanceExtrema(3, 1, 'unknown'), RangeError);
});

test('动直线恒过F(4,0)，包含竖直线与两条临界切线', () => {
  for (let angle = 0; angle <= 180; angle++) {
    const result = movingLine(3, angle);
    close(result.line.A * 4 + result.line.C, 0);
    close(result.line.A * result.direction.x + result.line.B * result.direction.y, 0);
  }
  assert.equal(movingLine(3, 0).kind, 'intersect');
  assert.equal(movingLine(3, 90).kind, 'separate');
  for (const slope of [3 / Math.sqrt(7), -3 / Math.sqrt(7)]) {
    assert.equal(lineCircle({ r: 3 }, { A: slope, B: -1, C: -4 * slope }).kind, 'tangent');
  }
  for (const parameter of [-100, -1, 0, 1, 100]) close((parameter + 1) + (parameter - 1) - 2 * parameter, 0);
});

test('切线：圆内0条、圆上1条、圆外2条，不漏竖直切线', () => {
  assert.equal(tangentLines({ r: 3 }, { x: 0, y: 0 }).length, 0);
  assert.equal(tangentLines({ r: 3 }, { x: 2, y: 0 }).length, 0);
  const on = tangentLines({ r: 3 }, { x: 3, y: 0 });
  assert.equal(on.length, 1);
  close(on[0].line.B, 0);
  close(-on[0].line.C / on[0].line.A, 3);
  const external = tangentLines({ r: 3 }, { x: 5, y: 0 });
  assert.equal(external.length, 2);
  for (const tangent of external) {
    close(tangent.point.x, 1.8);
    close(Math.abs(tangent.point.y), 2.4);
    close(Math.abs(tangent.line.B / tangent.line.A), 4 / 3);
    close(-tangent.line.C / tangent.line.A, 5);
  }
});

test('平移圆的切线同时满足过已知点、切点在圆上和半径垂直', () => {
  for (const circle of [{ a: 0, b: 0, r: 3 }, { a: 1, b: -2, r: 5 }]) {
    for (const point of [{ x: circle.a + circle.r, y: circle.b }, { x: circle.a + 2 * circle.r, y: circle.b + 1 }, { x: circle.a - 2 * circle.r, y: circle.b - 1 }]) {
      for (const tangent of tangentLines(circle, point)) {
        const T = tangent.point;
        close((T.x - circle.a) ** 2 + (T.y - circle.b) ** 2, circle.r ** 2);
        close(tangent.line.A * point.x + tangent.line.B * point.y + tangent.line.C, 0);
        close((T.x - circle.a) * (point.x - T.x) + (T.y - circle.b) * (point.y - T.y), 0);
      }
    }
  }
  const example = tangentLines({ a: 1, b: -2, r: 5 }, { x: 4, y: 2 })[0];
  close(example.line.A, 3); close(example.line.B, 4); close(-example.line.C, 20);
  assert.throws(() => tangentLines({ r: 0 }, { x: 1, y: 0 }), RangeError);
  assert.throws(() => tangentLines({ r: 3 }, { x: NaN, y: 0 }), RangeError);
});

test('连续构造在每个阶段存在中间状态，边界连续且公式最后出现', () => {
  assert.deepEqual(constructionSnapshot(0), { center: 0, radius: 0, circle: 0, line: 0, formulaVisible: false });
  for (const [index, name] of ['center', 'radius', 'circle', 'line'].entries()) {
    const middle = constructionSnapshot(index + .5);
    close(middle[name], .5);
    for (const phase of ['center', 'radius', 'circle', 'line']) assert.ok(middle[phase] >= 0 && middle[phase] <= 1);
    assert.equal(middle.formulaVisible, false);
  }
  for (let index = 1; index <= 400; index++) {
    const previous = constructionSnapshot((index - 1) / 100);
    const current = constructionSnapshot(index / 100);
    for (const phase of ['center', 'radius', 'circle', 'line']) {
      assert.ok(current[phase] >= previous[phase]);
      assert.ok(current[phase] - previous[phase] < .02);
    }
  }
  assert.equal(constructionSnapshot(4).formulaVisible, true);
});

test('v0.1旧记录迁移保留三轮与原六题，新题未完成，不冒充新版100%', () => {
  const old = { version: 1, stage: 7, unlocked: 7, completed: [0, 1, 2, 3, 4, 5, 6, 7], prediction: 1, construction: 4, records: [{ t: 2, count: 2, guess: 2 }, { t: 3, count: 1, guess: 1 }, { t: 4, count: 0, guess: 0 }], ruleAnswer: 1, free: { radius: 3, offset: 2, angle: 0 }, exampleSteps: [4, 4], answers: {} };
  for (const [index, selected] of [[0, [0]], [1, [1]], [2, [2]], [3, [0]], [4, [0, 1]], [5, [1]]]) old.answers[`q${index + 1}`] = { selected, submitted: true, correct: true, hadError: false };
  const { state, upgraded, recovered } = restoreState(JSON.stringify(old));
  assert.equal(recovered, false); assert.equal(upgraded, true);
  assert.equal(state.stage, 4); assert.deepEqual(state.completed, [0, 1, 2, 3]);
  assert.deepEqual(state.records, old.records); assert.equal(practiceProgress(state), 6);
  assert.deepEqual(state.exampleSteps, [4, 4, 0, 0, 0, 0, 0]);
  assert.equal(state.answers.q7, undefined);
  state.topic = 'tangent'; state.free.tangentMode = 'through'; state.free.externalX = 3;
  assert.deepEqual(restoreState(JSON.stringify(state)).state, state);
});

test('五题型、七例题、十五练习都有对应内容，旧题答案不变', () => {
  assert.equal(topics.length, 5); assert.equal(course.examples.length, 7); assert.equal(exercises.length, 15);
  assert.equal(new Set(exercises.map(question => question.id)).size, 15);
  assert.deepEqual(exercises.slice(6).map(question => question.answer), [[1], [1], [0], [1], [1], [0, 1], [0], [0, 1], [0]]);
  for (const topic of topics) {
    assert.ok(course.examples.some(example => example.topic === topic.id));
    assert.ok(exercises.some(question => (question.topic || 'position') === topic.id));
  }
  assert.equal(initialState().exampleSteps.length, 7);
});
