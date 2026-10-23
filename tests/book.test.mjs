import test from 'node:test';
import assert from 'node:assert/strict';
import { setCounts, setRelation, intervalIntersection, quadraticPositive, bisect, sampleCurve, powerValue, sineParameters } from '../site/book-math.mjs';
import { bookLabs, bookModel } from '../site/book-labs.mjs';
import { bookLessons, bookChapters } from '../site/book-course.mjs';
import { modules, lessons, restoreModule } from '../site/module-course.mjs';
import { readFile } from 'node:fs/promises';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('集合计数含空集，四种条件关系与区间开闭端点',()=>{
  assert.deepEqual(setCounts(0),{subsets:1,proper:0,nonemptyProper:0});
  assert.deepEqual(setCounts(3),{subsets:8,proper:7,nonemptyProper:6});
  assert.deepEqual([[1,2],[1,2,3],[1],[2,3]].map(q=>setRelation([1,2],q)),[0,1,2,3]);
  assert.equal(setRelation([],[]),0);assert.equal(setRelation([],[1]),1);
  assert.equal(intervalIntersection({lo:-2,hi:2,left:true,right:true},{lo:2,hi:4,left:false,right:true}),null);
  assert.deepEqual(intervalIntersection({lo:-2,hi:2,left:true,right:true},{lo:2,hi:4,left:true,right:true}),{lo:2,hi:2,left:true,right:true});
});
test('二次恒正解集：降次、Δ、严格端点，按区间独立代回',()=>{
  const contains=(ranges,x)=>ranges.some(r=>(x>r.lo||r.left&&x===r.lo)&&(x<r.hi||r.right&&x===r.hi));
  for(const a of [-1,0,1])for(const b of [-2,0,2])for(const c of [-1,0,1])for(const inclusive of [false,true]){
    const ranges=quadraticPositive(a,b,c,inclusive);
    for(let x=-4;x<=4;x+=0.125){const y=a*x*x+b*x+c;assert.equal(contains(ranges,x),inclusive?y>=0:y>0,`${a},${b},${c},${x}`);}
  }
});
test('二分保持√2区间、每步折半；不合法输入拒绝',()=>{
  for(let n=0;n<=10;n++){const r=bisect(x=>x*x-2,1,2,n);assert.ok(r.lo<Math.SQRT2&&r.hi>Math.SQRT2);near(r.hi-r.lo,2**(-n));}
  assert.throws(()=>bisect(x=>x*x+1,1,2,3));
});
test('曲线在已知断点分段，五幂函数定义域，正弦负振幅和常值退化',()=>{
  const curves=sampleCurve(x=>1/x,-2,2,{breaks:[0]});
  assert.equal(curves.length,2);assert.ok(curves.every(c=>!c.points.some(p=>p.x===0)&&!(c.points[0].x<0&&c.points.at(-1).x>0)));
  assert.equal(powerValue(3,-1),null);assert.equal(powerValue(4,0),null);near(powerValue(2,-2),-8);
  assert.deepEqual(sineParameters(-2,2,Math.PI/2,1),{amplitude:2,min:-1,max:3,period:Math.PI,constant:false});
  const c=sineParameters(2,0,Math.PI/2,1);assert.equal(c.constant,true);near(c.min,3);near(c.max,3);assert.equal(c.period,null);
});
test('48实验的192个默认/预设答案与独立解析期望吻合，全部曲线点为有限数',async()=>{
 const expected=JSON.parse(await readFile(new URL('../docs/testing/v0.5/lab-expectations.json',import.meta.url),'utf8')).answers;
 assert.equal(Object.keys(expected).length,48);
 for(const lab of bookLabs){
  const defaults=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));
  const cases=[defaults,...lab.presets.map(([,p])=>({...defaults,...p}))];
  assert.equal(cases.length,expected[lab.id].length);
  for(const [i,v] of cases.entries()){
   const m=bookModel(lab.id,v);assert.equal(m.answer,expected[lab.id][i],`${lab.id} case ${i}`);
   assert.ok(m.status&&m.formula&&m.explanation&&m.graph);
   for(const p of [...(m.graph.points||[]),...(m.graph.curves||[]).flatMap(c=>c.points)])assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y),lab.id);
  }
 }
});
test('平移正切图象不能跨任何真实渐近线连线',()=>{
 for(const s of [.5,1,1.5,2]){
  const m=bookModel('b-trig-period',{kind:2,s});
  const poles=Array.from({length:9},(_,i)=>Math.PI/2+(i-4)*Math.PI+s*Math.PI);
  for(const c of m.graph.curves.filter(c=>c.color==='#27846e'))for(const p of c.points)assert.ok(Math.abs(Math.cos(p.x-s*Math.PI))>1e-9,`s=${s} undefined sample x=${p.x}`);
  for(const c of m.graph.curves.filter(c=>c.color==='#27846e'))for(let i=1;i<c.points.length;i++){
   const a=c.points[i-1].x,b=c.points[i].x;
   assert.ok(!poles.some(p=>p>a+1e-9&&p<b-1e-9),`s=${s} ${a} to ${b}`);
  }
 }
});
test('全部24课五章结构、来源ID、内容底线与原19课进度隔离',()=>{
 assert.equal(modules.length,4);assert.equal(lessons.length,43);assert.equal(bookLessons.length,24);
 assert.deepEqual(bookChapters.map(c=>c.lessons.length),[5,3,4,5,7]);
 assert.equal(new Set(lessons.map(l=>l.id)).size,43);
 assert.equal(new Set(bookLessons.flatMap(l=>l.labs.map(b=>b.id))).size,48);
 const fresh=restoreModule(null);
 for(const l of bookLessons){
  assert.ok(l.scene&&l.sceneQ&&l.sceneOptions.length>=2&&l.chapter);
  assert.ok(l.labs.length>=2&&l.notes.length>=4&&l.examples.length>=3&&l.quizzes.length>=5,l.id);
  for(const lab of l.labs)assert.ok(lab&&lab.controls.length&&lab.presets.length);
  for(const e of l.examples)assert.ok(e.question&&e.steps.length>=3);
  for(const q of l.quizzes)assert.ok(q.options[q.answer]&&q.explanation);
  assert.equal(fresh.lessons[l.id].complete,false);
 }
});
test('五点代回正弦原式、单位圆比值、定和/定积与反函数独立不变量',()=>{
 const points=bookModel('b-sine-build',{t:5}).measurements.points;
 assert.equal(points.length,5);for(const p of points)near(p.y,2*Math.sin(2*p.x+Math.PI/2)+1);
 for(let t=0;t<=360;t+=30)for(let r=1;r<=3;r++){
  const m=bookModel('b-trig-from-point',{t,r}).measurements;
  near(m.sin*m.sin+m.cos*m.cos,1);near(m.p.y/r,m.sin);near(m.p.x/r,m.cos);
 }
 for(let t=.5;t<=4;t+=.5)assert.ok(bookModel('b-amgm',{t}).measurements.value>=4);
 for(let t=0;t<=6;t+=.5)assert.ok(bookModel('b-fixed-sum',{t}).measurements.area<=9);
 near(bookModel('b-wheel',{t:0}).measurements.height,2);near(bookModel('b-wheel',{t:6}).measurements.height,18);
 for(let t=-2;t<=2;t+=.5){const m=bookModel('b-inverse',{t}).measurements;near(Math.log2(m.y),m.x);}
});
test('120道练习独立答案核对，原v0.4真实测试浏览器18课记录逐字段兼容',async()=>{
 const q=JSON.parse(await readFile(new URL('../docs/testing/v0.5/quiz-expectations.json',import.meta.url),'utf8')).answers;
 for(const l of bookLessons)assert.deepEqual(l.quizzes.map(q=>q.answer),q[l.id],l.id);
 const raw=await readFile(new URL('../docs/testing/v0.5/fixtures/v0.4-qa-module-state.json',import.meta.url),'utf8');
 const old=JSON.parse(raw),current=restoreModule(raw);assert.equal(Object.keys(old.lessons).length,18);
 for(const [id,s] of Object.entries(old.lessons))assert.deepEqual(current.lessons[id],s,id);
 for(const l of bookLessons)assert.equal(current.lessons[l.id].complete,false);
});
