import { course, exercises, topics, checkAnswer } from './course.mjs';

export const STORAGE_KEY = 'geometry-lab-v1';
const integer = (value, low, high) => Number.isInteger(value) && value >= low && value <= high;
const bounded = (value, low, high, fallback) => Number.isFinite(value) && value >= low && value <= high ? value : fallback;

export function initialState() {
  return { version: 1, revision: 2, stage: 0, unlocked: 0, completed: [], prediction: null, construction: 0, guess: null, observation: null, t: 0, records: [], ruleAnswer: null, topic: 'position', free: { radius: 3, offset: 2, angle: 0, pointAngle: 0, externalX: 5, tangentMode: 'on', extremaMode: 'line' }, exampleSteps: course.examples.map(() => 0), answers: {} };
}

export function restoreState(raw) {
  const state = initialState();
  if (raw == null) return { state, recovered: false };
  try {
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 1) throw new Error('旧版本或损坏的学习记录');
    state.unlocked = integer(saved.unlocked, 0, 7) ? saved.unlocked : 0;
    state.stage = integer(saved.stage, 0, state.unlocked) ? saved.stage : 0;
    state.completed = Array.isArray(saved.completed) ? [...new Set(saved.completed.filter(value => integer(value, 0, state.unlocked)))] : [];
    state.prediction = integer(saved.prediction, 0, 2) ? saved.prediction : null;
    state.construction = integer(saved.construction, 0, 4) ? saved.construction : 0;
    state.t = bounded(saved.t, -5, 5, 0);
    state.guess = integer(saved.guess, 0, 2) ? saved.guess : null;
    state.observation = integer(saved.observation, 0, 2) ? saved.observation : null;
    if (Array.isArray(saved.records)) {
      for (const record of saved.records.slice(0, 3)) {
        const expected = course.rounds[state.records.length];
        if (record?.t !== expected.t || record.count !== expected.count || !integer(record.guess, 0, 2)) break;
        state.records.push({ t: expected.t, count: expected.count, guess: record.guess });
      }
    }
    state.ruleAnswer = integer(saved.ruleAnswer, 0, 2) ? saved.ruleAnswer : null;
    state.topic = topics.some(topic => topic.id === saved.topic) ? saved.topic : 'position';
    state.free = { radius: bounded(saved.free?.radius, 1, 4, 3), offset: bounded(saved.free?.offset, -5, 5, 2), angle: bounded(saved.free?.angle, 0, 180, 0), pointAngle: bounded(saved.free?.pointAngle, 0, 360, 0), externalX: bounded(saved.free?.externalX, 0, 6, 5), tangentMode: saved.free?.tangentMode === 'through' ? 'through' : 'on', extremaMode: saved.free?.extremaMode === 'point' ? 'point' : 'line' };
    state.exampleSteps = course.examples.map((_, index) => integer(saved.exampleSteps?.[index], 0, 4) ? saved.exampleSteps[index] : 0);
    for (const question of exercises) {
      const answer = saved.answers?.[question.id];
      if (!answer || !Array.isArray(answer.selected)) continue;
      const selected = [...new Set(answer.selected.filter(value => integer(value, 0, question.options.length - 1)))];
      if (!question.multiple && selected.length > 1) continue;
      const submitted = answer.submitted === true && selected.length > 0;
      state.answers[question.id] = { selected, submitted, correct: submitted && checkAnswer(question, selected), hadError: answer.hadError === true };
    }
    // shortcut: 只保存这一课的状态；新增课程时为课程分配独立存储键。
    if (state.unlocked >= 1 && state.prediction === null) throw new Error('缺少情景预测');
    if (state.unlocked >= 2 && state.construction !== 4) throw new Error('构造未完成');
    if (state.unlocked >= 3 && state.records.length !== 3) throw new Error('实验记录不完整');
    // 已解锁步骤保留；学生回看时可以重推例题或修改尚未提交的答案。
    const upgraded = saved.revision !== 2;
    if (upgraded) {
      state.completed = state.completed.filter(stage => stage < 4);
      if (state.stage > 4) state.stage = 4;
    }
    return { state, recovered: false, upgraded };
  } catch {
    return { state: initialState(), recovered: true };
  }
}

export function canRecord(state) {
  const round = course.rounds[state.records.length];
  return Boolean(round && state.guess !== null && Math.abs(state.t - round.t) < 1e-9 && state.observation === round.count);
}

export function recordObservation(state) {
  if (!canRecord(state)) return false;
  const round = course.rounds[state.records.length];
  state.records.push({ t: round.t, count: round.count, guess: state.guess });
  state.guess = null;
  state.observation = null;
  return true;
}

export function submitAnswer(state, questionId) {
  const question = exercises.find(item => item.id === questionId);
  const answer = state.answers[questionId];
  if (!question || !answer?.selected.length) return false;
  answer.submitted = true;
  answer.correct = checkAnswer(question, answer.selected);
  answer.hadError = answer.hadError || !answer.correct;
  return true;
}

export function practiceProgress(state) {
  return exercises.filter(question => state.answers[question.id]?.correct).length;
}
