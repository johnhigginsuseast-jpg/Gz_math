import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, restoreState, canRecord, recordObservation, submitAnswer, practiceProgress } from '../site/state.mjs';
import { course, exercises } from '../site/course.mjs';

test('引导实验必须先预测、到目标并观察正确，才能写入下一行', () => {
  const state = initialState();
  assert.equal(recordObservation(state), false);
  state.guess = 0;
  state.t = 1;
  state.observation = 2;
  assert.equal(canRecord(state), false);
  state.t = 2;
  state.observation = 1;
  assert.equal(recordObservation(state), false);
  state.observation = 2;
  assert.equal(recordObservation(state), true);
  assert.deepEqual(state.records[0], { t: 2, count: 2, guess: 0 });
  assert.equal(state.guess, null);
  assert.equal(state.observation, null);
  for (const [t, count] of [[3, 1], [4, 0]]) {
    state.guess = count;
    state.t = t;
    state.observation = count;
    assert.equal(recordObservation(state), true);
  }
  assert.equal(recordObservation(state), false);
  assert.equal(state.records.length, 3);
});

test('正确、错误、重复提交与错误历史分开计算', () => {
  const state = initialState();
  assert.equal(submitAnswer(state, 'q1'), false);
  state.answers.q1 = { selected: [1], submitted: false, correct: false, hadError: false };
  submitAnswer(state, 'q1');
  assert.equal(practiceProgress(state), 0);
  assert.equal(state.answers.q1.hadError, true);
  state.answers.q1.selected = [0];
  submitAnswer(state, 'q1');
  submitAnswer(state, 'q1');
  assert.equal(practiceProgress(state), 1);
  assert.equal(state.answers.q1.hadError, true);
  for (const question of exercises.slice(1)) {
    state.answers[question.id] = { selected: [...question.answer], hadError: false };
    submitAnswer(state, question.id);
  }
  assert.equal(practiceProgress(state), 15);
});

test('完整进度刷新恢复，并保留回看重推和未提交修改', () => {
  const state = initialState();
  Object.assign(state, { stage: 7, unlocked: 7, completed: [0, 1, 2, 3, 4, 5], prediction: 1, construction: 4, records: [{ t: 2, count: 2, guess: 0 }, { t: 3, count: 1, guess: 1 }, { t: 4, count: 0, guess: 0 }], ruleAnswer: 1, exampleSteps: course.examples.map(() => 4) });
  state.answers.q1 = { selected: [0], submitted: true, correct: true, hadError: true };
  assert.deepEqual(restoreState(JSON.stringify(state)).state, state);
  state.stage = 5;
  state.exampleSteps[0] = 0;
  assert.equal(restoreState(JSON.stringify(state)).recovered, false);
  state.stage = 6;
  state.answers.q1 = { selected: [1], submitted: false, correct: false, hadError: true };
  assert.equal(restoreState(JSON.stringify(state)).recovered, false);
});

test('损坏、旧版本与不完整记录安全恢复，合法值被规范化', () => {
  assert.equal(restoreState(null).recovered, false);
  for (const raw of ['invalid', 'null', '{"version":2}', '{"version":1,"unlocked":3}']) assert.equal(restoreState(raw).recovered, true);
  const raw = { version: 1, stage: 99, unlocked: -2, completed: [9, 0, 0], free: { radius: -1, angle: Infinity, offset: 100 }, answers: { q1: { selected: [0], submitted: true, correct: false }, q2: { selected: [0, 1], submitted: true }, q5: { selected: [0, 0, 1, 999], submitted: true } } };
  const { state } = restoreState(JSON.stringify(raw));
  assert.equal(state.stage, 0);
  assert.deepEqual(state.free, initialState().free);
  assert.deepEqual(state.completed, [0]);
  assert.equal(state.answers.q1.correct, true);
  assert.equal(state.answers.q2, undefined);
  assert.equal(state.answers.q5.correct, true);
});
