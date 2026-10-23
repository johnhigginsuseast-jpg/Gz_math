import {sequenceLessons} from './elective2-sequences.mjs';
import {derivativeLessons} from './elective2-derivatives.mjs';
export const elective2Chapters=[{title:'第四章 · 数列',lessons:sequenceLessons},{title:'第五章 · 导数及其应用',lessons:derivativeLessons}];
export const elective2Lessons=elective2Chapters.flatMap(ch=>ch.lessons.map(l=>({...l,chapter:ch.title})));
