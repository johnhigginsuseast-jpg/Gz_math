import test from 'node:test';
import assert from 'node:assert/strict';
import { vectorInfo, triangleSSS, triangleSSA, complexOperation, dataSummary, stratifiedSummary, drawSample, histogram } from '../site/book2-math.mjs';
import { dataLabs, dataModel, dataSvg } from '../site/book2-data-labs.mjs';
import { complexLabs, complexModel } from '../site/book2-complex-labs.mjs';
import { complexLessons } from '../site/book2-complex.mjs';
import { vectorLabs, vectorModel } from '../site/book2-vector-labs.mjs';
import { vectorLessons } from '../site/book2-vectors.mjs';
import { solidBookLabs, solidBookModel } from '../site/book2-solid-labs.mjs';
import { book2Chapters, book2Lessons } from '../site/book2-course.mjs';
import { book2Labs, book2Model } from '../site/book2-labs.mjs';
import { modules, lessons, restoreModule } from '../site/module-course.mjs';
import { readFile } from 'node:fs/promises';
const near = (a,b) => assert.ok(Math.abs(a-b)<1e-8, `${a} != ${b}`);
test('必修二向量：零向量、点积/投影/行列式与独立坐标不变量',()=>{
 const v=vectorInfo([3,4],[-4,3]);near(v.lengthA,5);near(v.lengthB,5);near(v.dot,0);near(v.cross,25);near(v.angle,90);near(v.projection,0);
 assert.equal(vectorInfo([0,0],[1,0]).angle,null);assert.equal(vectorInfo([0,0],[1,0]).projection,null);
 near(vectorInfo([2,0],[-3,4]).projection,-3);near(vectorInfo([1,0],[-1,0]).angle,180);
 assert.throws(()=>vectorInfo([NaN,0],[1,0]),RangeError);
 for(let x=-3;x<=3;x++)for(let y=-3;y<=3;y++){
  const q=vectorInfo([2,1],[x,y]);near(q.dot**2+q.cross**2,5*(x*x+y*y));
 }
});
test('全部140题与56实验全部默认/预设对照独立答案表',async()=>{
 const quizExpected=JSON.parse(await readFile(new URL('../docs/testing/v0.6/quiz-expectations.json',import.meta.url),'utf8')).answers;
 const labExpected=JSON.parse(await readFile(new URL('../docs/testing/v0.6/lab-expectations.json',import.meta.url),'utf8')).answers;
 assert.equal(Object.keys(quizExpected).length,28);assert.equal(Object.keys(labExpected).length,56);
 for(const lesson of book2Lessons)assert.deepEqual(lesson.quizzes.map(q=>q.answer),quizExpected[lesson.id],lesson.id);
 for(const lab of book2Labs){const defaults=Object.fromEntries(lab.controls.map(c=>[c.key,c.value])),cases=[defaults,...lab.presets.map(([,v])=>({...defaults,...v}))];assert.deepEqual(cases.map(v=>book2Model(lab.id,v).answer),labExpected[lab.id],lab.id);}
});
test('实际v0.5浏览器42课记录逐字段保留，新28课从0开始',async()=>{
 const raw=await readFile(new URL('../docs/testing/v0.6/fixtures/v0.5-actual-module.json',import.meta.url),'utf8'),old=JSON.parse(raw),upgraded=restoreModule(raw);
 assert.equal(Object.keys(old.lessons).length,42);assert.equal(Object.values(old.lessons).filter(s=>s.complete).length,42);
 for(const [id,state] of Object.entries(old.lessons))assert.deepEqual(upgraded.lessons[id],state,id);
 for(const l of book2Lessons){assert.equal(upgraded.lessons[l.id].complete,false);assert.equal(upgraded.lessons[l.id].scene,null);}
});
test('必修二空间：全部预设与控件角点，斜二测/展开/体积/垂距独立核对',()=>{
 assert.equal(solidBookLabs.length,16);
 const finite=v=>{if(typeof v==='number')assert.ok(Number.isFinite(v));else if(v&&typeof v==='object')for(const x of Object.values(v))finite(x);};
 for(const lab of solidBookLabs){const d=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));let inputs=[d,...lab.presets.map(([,v])=>({...d,...v}))];for(const c of lab.controls)for(let n=c.min;n<=c.max+1e-9;n+=c.step)inputs.push({...d,[c.key]:n});for(const v of inputs){const m=solidBookModel(lab.id,v);assert.ok(lab.options[m.answer],lab.id);finite(m);}}
 near(solidBookModel('b2-s-oblique-area',{t:4,mode:0}).measurements.sketchArea,4*Math.SQRT2);near(solidBookModel('b2-s-oblique-area',{t:4,mode:1}).measurements.sketchArea,4*Math.SQRT2);
 near(solidBookModel('b2-s-cylinder-net',{t:2}).measurements.area,32*Math.PI);near(solidBookModel('b2-s-cone-net',{t:4}).measurements.angle,180);
 const fit=solidBookModel('b2-s-insphere',{t:4}).measurements;near(fit.ballVolume/fit.cylinderVolume,2/3);assert.equal(fit.fits,true);
 near(solidBookModel('b2-s-angle-distance',{t:30}).measurements.distance,1.5);near(solidBookModel('b2-s-dihedral',{t:150}).measurements.angle,150);
 assert.deepEqual([2,3,4].map(t=>solidBookModel('b2-s-section',{t}).answer),[0,1,2]);
});
test('五章28课、56实验、至少84例题140练习，95课唯一ID与全新进度',()=>{
 assert.equal(modules.length,6);assert.equal(lessons.length,95);assert.equal(book2Lessons.length,28);assert.deepEqual(book2Chapters.map(c=>c.lessons.length),[8,3,8,5,4]);
 assert.equal(new Set(lessons.map(l=>l.id)).size,95);assert.equal(book2Labs.length,56);assert.equal(new Set(book2Lessons.flatMap(l=>l.labs.map(b=>b.id))).size,56);
 const state=restoreModule(null);
 for(const l of book2Lessons){assert.ok(l.scene&&l.sceneQ&&l.sceneOptions.length>=2&&l.chapter);assert.ok(l.labs.length>=2&&l.notes.length>=4&&l.examples.length>=3&&l.quizzes.length>=5,l.id);for(const e of l.examples)assert.ok(e.steps.length>=3);for(const q of l.quizzes)assert.ok(q.options[q.answer]&&q.explanation);assert.equal(state.lessons[l.id].complete,false);for(const b of l.labs)assert.ok(book2Model(b.id,Object.fromEntries(b.controls.map(c=>[c.key,c.value]))));}
 assert.ok(book2Lessons.reduce((n,l)=>n+l.examples.length,0)>=84);assert.equal(book2Lessons.reduce((n,l)=>n+l.quizzes.length,0),140);
});
test('统计独立数据：百分位整数/非整数与端点、空样本、层间方差、仿射变换',()=>{
 const s=dataSummary([4,1,3,2]);near(s.mean,2.5);near(s.median,2.5);near(s.variance,1.25);assert.deepEqual(s.sorted,[1,2,3,4]);
 assert.deepEqual([0,20,25,50,100].map(p=>dataSummary([1,2,3,4],p).percentile),[1,1,1.5,2.5,4]);
 assert.equal(dataSummary([]),null);assert.deepEqual(dataSummary([1,1,2,2]).modes,[1,2]);assert.deepEqual(dataSummary([1,2,3]).modes,[]);
 assert.throws(()=>dataSummary([1],101),RangeError);assert.throws(()=>dataSummary([NaN]),RangeError);
 const combined=stratifiedSummary([{weight:.5,values:[1,3]},{weight:.5,values:[5,7]}]);near(combined.mean,4);near(combined.variance,5);
 for(let a=-2;a<=2;a+=.5)for(let b=-3;b<=3;b++){const q=dataSummary([1,2,3].map(x=>a*x+b));near(q.mean,2*a+b);near(q.variance,a*a*2/3);}
 const bins=histogram([.5,1.5,2.5,3.5,4],[0,1,4]);near(bins.reduce((sum,b)=>sum+b.density*(b.hi-b.lo),0),1);assert.equal(bins[1].count,4);
 assert.throws(()=>histogram([5],[0,1,4]),RangeError);
});
test('抽样复现、不放回不重复；精确概率独立计数与频率前缀',()=>{
 const values=Array.from({length:12},(_,i)=>i+1),sample=drawSample(values,12,1);
 assert.equal(new Set(sample).size,12);assert.deepEqual(drawSample(values,4,1),sample.slice(0,4));assert.deepEqual(drawSample(values,4,1),drawSample(values,4,1));assert.throws(()=>drawSample(values,13,1),RangeError);
 let count=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)if(a+b>=8)count++;
 assert.equal(dataModel('b2-p-dice',{t:8}).measurements.count,count);assert.equal(count,15);
 near(dataModel('b2-p-balls',{t:0}).measurements.probability,1/3);near(dataModel('b2-p-balls',{t:1}).measurements.probability,4/9);
 assert.deepEqual([0,1,2,3].map(t=>dataModel('b2-p-independent',{t}).answer),[0,1,0,0]);
 near(dataModel('b2-p-atleast',{t:5}).measurements.probability,.9);
 for(const t of [10,50,500]){const m=dataModel('b2-p-frequency',{t,seed:1}).measurements,draws=drawSample([0,1],t,1,true);near(m.frequency,draws.reduce((a,b)=>a+b,0)/t);}
 near(dataModel('b2-p-integrated',{t:2}).measurements.probability,2/5);
});
test('统计概率18实验：全部预设/单控件取值合法，图表有限且防HTML注入',()=>{
 assert.equal(dataLabs.length,18);
 const finite=v=>{if(typeof v==='number')assert.ok(Number.isFinite(v));else if(v&&typeof v==='object')for(const x of Object.values(v))finite(x);};
 for(const lab of dataLabs){const defaults=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));const cases=[defaults,...lab.presets.map(([,v])=>({...defaults,...v}))];for(const c of lab.controls)for(let x=c.min;x<=c.max+1e-9;x+=c.step)cases.push({...defaults,[c.key]:x});for(const v of cases){const m=dataModel(lab.id,v);assert.ok(lab.options[m.answer],lab.id);finite(m);assert.ok(dataSvg(m.graph.chart).includes('<svg'));}}
 assert.ok(dataSvg({rows:['<script>alert(1)</script>']}).includes('&lt;script>'));
 assert.equal(dataModel('b2-d-percentile',{t:0}).answer,0);assert.equal(dataModel('b2-d-percentile',{t:100}).answer,2);
});
test('复数：四则独立已知值、除零、共轭、模与旋转不变量',()=>{
 assert.deepEqual(complexOperation([2,1],[1,-3],2),[5,-5]);assert.deepEqual(complexOperation([1,1],[1,-1],3),[0,1]);
 assert.equal(complexOperation([1,1],[0,0],3),null);
 for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++){
  const z=[a,b],m=complexModel('b2-z-conjugate',{a,b}).measurements;
  near(m.modulus**2,a*a+b*b);assert.deepEqual(complexOperation(z,m.conjugate,2),[a*a+b*b,0]);
  assert.equal(complexModel('b2-z-class',{a,b}).answer,b===0?0:a===0?1:2);
  if(a||b){const q=complexOperation([1,1],z,3),back=complexOperation(q,z,2);near(back[0],1);near(back[1],1);}
 }
 assert.equal(complexModel('b2-z-conjugate',{a:0,b:0}).answer,0);
 assert.equal(complexLessons.length,3);assert.equal(complexLabs.length,6);
 for(const l of complexLessons)assert.ok(l.labs.length>=2&&l.notes.length>=4&&l.examples.length>=3&&l.quizzes.length>=5);
 for(const lab of complexLabs){const d=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));for(const input of [d,...lab.presets.map(([,v])=>({...d,...v}))]){const m=complexModel(lab.id,input);assert.ok(lab.options[m.answer]);assert.ok(!JSON.stringify(m.graph).includes('null'));}}
 for(let theta=0;theta<=360;theta+=30){const m=complexModel('b2-z-polar',{r:2,theta}).measurements;near(Math.hypot(...m.before),2);near(Math.hypot(...m.after),2);near(m.before[0]*m.after[0]+m.before[1]*m.after[1],0);}
});
test('三边有效性与SSA全部分支：临界、直/钝角与代回',()=>{
 assert.equal(triangleSSS(1,2,3),null);assert.equal(triangleSSS(0,2,2),null);
 const right=triangleSSS(5,3,4);near(right.A,90);near(right.area,6);
 assert.deepEqual([1,2,3,4,5].map(a=>triangleSSA(a,4,30).length),[0,1,2,1,1]);
 assert.equal(triangleSSA(4,4,90).length,0);assert.equal(triangleSSA(5,4,90).length,1);
 assert.equal(triangleSSA(3,4,120).length,0);assert.equal(triangleSSA(5,4,120).length,1);
 for(let A=15;A<180;A+=15)for(let a=1;a<=6;a++)for(const s of triangleSSA(a,4,A)){
  near(s.A+s.B+s.C,180);assert.ok(s.C>0);near(s.a/Math.sin(s.A*Math.PI/180),s.b/Math.sin(s.B*Math.PI/180));
  near(s.a*s.a,s.b*s.b+s.c*s.c-2*s.b*s.c*Math.cos(s.A*Math.PI/180));
  assert.ok(triangleSSS(s.a,s.b,s.c));
 }
});
test('向量8课16实验：内容结构、所有控件值及预设有合法有限模型',()=>{
 assert.equal(vectorLessons.length,8);assert.equal(vectorLabs.length,16);
 const ids=vectorLessons.flatMap(l=>l.labs.map(b=>b.id));assert.equal(new Set(ids).size,16);
 for(const l of vectorLessons){assert.ok(l.scene&&l.sceneQ&&l.notes.length>=4);assert.ok(l.examples.length>=3&&l.quizzes.length>=5);for(const e of l.examples)assert.ok(e.steps.length>=3);for(const q of l.quizzes)assert.ok(q.options[q.answer]&&q.explanation);}
 const finite=(value)=>{if(typeof value==='number')assert.ok(Number.isFinite(value));else if(value&&typeof value==='object')for(const x of Object.values(value))finite(x);};
 for(const lab of vectorLabs){const defaults=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));const inputs=[defaults,...lab.presets.map(([,v])=>({...defaults,...v}))];for(const c of lab.controls)for(let v=c.min;v<=c.max+1e-9;v+=c.step)inputs.push({...defaults,[c.key]:v});for(const input of inputs){const m=vectorModel(lab.id,input);assert.ok(lab.options[m.answer],lab.id);assert.ok(m.status&&m.formula&&m.explanation&&m.graph);finite(m.graph);finite(m.measurements);}}
 assert.deepEqual([1,2,3,4].map(t=>vectorModel('b2-v-ssa',{t}).answer),[0,1,2,1]);
 near(vectorModel('b2-v-area',{t:90}).measurements.area,12);near(vectorModel('b2-v-height',{t:45}).measurements.height,100);
});
