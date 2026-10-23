import { vectorLessons } from './book2-vectors.mjs';
import { complexLessons } from './book2-complex.mjs';
import { solidBookLessons } from './book2-solid.mjs';
import { statisticsLessons } from './book2-statistics.mjs';
import { probabilityLessons } from './book2-probability.mjs';
export const book2Chapters=[
 {title:'第六章 · 平面向量及其应用',lessons:vectorLessons},
 {title:'第七章 · 复数',lessons:complexLessons},
 {title:'第八章 · 立体几何初步',lessons:solidBookLessons},
 {title:'第九章 · 统计',lessons:statisticsLessons},
 {title:'第十章 · 概率',lessons:probabilityLessons},
];
export const book2Lessons=book2Chapters.flatMap(chapter=>chapter.lessons.map(l=>({...l,chapter:chapter.title})));
