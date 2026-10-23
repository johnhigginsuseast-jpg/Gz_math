export const control = (key, label, min, max, step, value) => ({ key, label, min, max, step, value });
export const lab = (id, title, prompt, options, controls, presets) => ({ id, title, prompt, options, controls, presets });
export const note = (title, formula, text) => ({ title, formula, text });
export const example = (title, question, ...steps) => ({ title, question, steps });
export const quiz = (question, options, answer, explanation) => ({ question, options, answer, explanation });
