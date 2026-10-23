import { setLessons } from './book-sets.mjs';
import { inequalityLessons } from './book-inequalities.mjs';
import { functionLessons } from './book-functions.mjs';
import { expLogLessons } from './book-explog.mjs';
import { trigLessons } from './book-trig.mjs';
export const bookChapters=[
 {title:'第一章 · 集合与常用逻辑用语',lessons:setLessons},
 {title:'第二章 · 一元二次函数、方程和不等式',lessons:inequalityLessons},
 {title:'第三章 · 函数的概念与性质',lessons:functionLessons},
 {title:'第四章 · 指数函数与对数函数',lessons:expLogLessons},
 {title:'第五章 · 三角函数',lessons:trigLessons},
];
export const bookLessons=bookChapters.flatMap(chapter=>chapter.lessons.map(l=>({...l,chapter:chapter.title})));
