import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dot3,cross3,length3,vectorAngle,linePlaneAngle,pointPlaneDistance,skewDistance,project3,sphereSection,cubeSection,quadratic,conicLine,focalChord } from '../site/advanced-math.mjs';
import { advancedModel,spaceSvg } from '../site/advanced-labs.mjs';
import { lessons,modules,restoreModule,lessonProgress } from '../site/module-course.mjs';
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const model=(id,values)=>advancedModel(id,values);

test('空间点积叉积与真实角：独立坐标不变量，锐角与二面角不能混用',()=>{
  near(vectorAngle([1,0,0],[-Math.sqrt(3)/2,0.5,0]),150);
  near(vectorAngle([1,0,0],[-Math.sqrt(3)/2,0.5,0],true),30);
  near(linePlaneAngle([1,0,1],[0,0,1]),45);
  assert.throws(()=>vectorAngle([0,0,0],[1,0,0]));
  for(let i=1;i<80;i++){
    const u=[i%7-3,2,i%5],v=[1,i%3-1,3],cross=cross3(u,v);
    near(dot3(cross,u),0);near(dot3(cross,v),0);
    near(length3(cross)**2,length3(u)**2*length3(v)**2-dot3(u,v)**2);
  }
  for(const beta of [30,90,150])near(model('s-dihedral',{beta}).measurements.angle,beta);
  for(const phi of [0,30,90]){
    const graph=model('s-elevation',{phi}).graph.space;
    const [a,b]=graph.segments[1];
    near(a[2],0);near(b[2],0);
    near(Math.hypot(...a.map((x,i)=>x-b[i])),6*Math.cos(phi*Math.PI/180));
  }
});

test('空间距离：法向量倍乘不变，异面、平行与相交边界',()=>{
  near(pointPlaneDistance([1,2,2],[1,2,2]),3);
  near(pointPlaneDistance([1,2,2],[-3,-6,-6]),3);
  near(skewDistance([0,0,0],[1,0,0],[0,0,2],[0,1,0]),2);
  near(skewDistance([0,0,0],[1,0,0],[0,1,0],[2,0,0]),1);
  near(skewDistance([0,0,0],[1,0,0],[0,0,0],[0,1,0]),0);
  assert.throws(()=>pointPlaneDistance([1,0,0],[0,0,0]));
});

test('柱锥台与球截面：已知值和退化，翻折保持板内长度',()=>{
  const volume=model('s-volume',{a:2,h:3}).measurements;
  near(volume.prism,12);near(volume.pyramid,4);
  near(model('s-frustum',{r:1,h:3}).measurements.volume,13*Math.PI);
  near(model('s-frustum',{r:0,h:3}).measurements.volume,9*Math.PI);
  near(model('s-frustum',{r:3,h:3}).measurements.volume,27*Math.PI);
  assert.equal(sphereSection(3,0).radius,3);assert.equal(sphereSection(3,3).kind,'point');assert.equal(sphereSection(3,4).kind,'empty');
  for(let beta=0;beta<=150;beta+=15){const m=model('s-fold',{beta});near(m.measurements.distance,4*Math.cos(beta*Math.PI/360));}
  near(model('s-unfold',{alpha:180}).measurements.length,Math.hypot(2*Math.PI,3));
});

test('全部32新实验及134默认/预设情形有效；三维转动不改变模型数据',()=>{
  let cases=0,labs=0;
  for(const lesson of lessons.filter(l=>l.moduleId==='elective1'&&l.chapter!=='第二章 · 直线与圆的方程'))for(const lab of lesson.labs){
    labs++;
    const defaults=Object.fromEntries(lab.controls.map(c=>[c.key,c.value]));
    for(const [,preset] of [['默认',{}],...lab.presets]){
      const values={...defaults,...preset},m=model(lab.id,values);cases++;
      assert.ok(lab.options[m.answer],lab.id);assert.doesNotMatch(m.status,/NaN|Infinity/);
      for(const c of lab.controls){assert.ok(values[c.key]>=c.min&&values[c.key]<=c.max);near((values[c.key]-c.min)/c.step,Math.round((values[c.key]-c.min)/c.step));}
      if(m.graph.space){const before=JSON.stringify(m);for(const view of [{yaw:35,pitch:25},{yaw:-90,pitch:70}])assert.doesNotMatch(spaceSvg(m.graph.space,view),/NaN|Infinity/);assert.equal(JSON.stringify(m),before);}
    }
  }
  assert.equal(labs,32);assert.equal(cases,134);
  assert.notDeepEqual(project3([1,2,3],0,20),project3([1,2,3],90,20));
});

test('多面体截面：棱上截点、三角/正六边形面积与点/空边界',()=>{
  near(cubeSection(2,1).area,Math.sqrt(3)/2);near(cubeSection(2,3).area,3*Math.sqrt(3));
  assert.equal(cubeSection(2,3).points.length,6);assert.equal(cubeSection(2,0).kind,'point');assert.equal(cubeSection(2,7).kind,'none');
  for(let t=-1;t<=7;t+=0.25){const r=cubeSection(2,t);for(const p of r.points){near(p.reduce((s,x)=>s+x,0),t);assert.ok(p.every(x=>x>=0&&x<=2));assert.ok(p.filter(x=>Math.abs(x)<1e-9||Math.abs(x-2)<1e-9).length>=2);}}
});

test('椭圆距离和、双曲线绝对距离差、四向抛物线等距的采样不变量',()=>{
  for(let theta=0;theta<=360;theta+=15)near(model('e-point',{theta}).measurements.sum,10);
  for(const branch of [-1,1])for(let t=-2;t<=2;t+=0.25)near(model('h-point',{branch,t}).measurements.difference,6);
  for(const axis of [0,90,180,270])for(const p of [1,2,4])for(const y of [-3,0,3]){
    const r=model('p-definition',{axis,p,y}).measurements;
    near(r.focalDistance,r.directrixDistance);
  }
  near(model('e-shape',{b:3,axis:90}).measurements.e,0.8);
  near(model('h-shape',{b:4,axis:90}).measurements.e,5/3);
});

test('两种焦点三角形面积公式与坐标面积独立吻合',()=>{
  for(let theta=15;theta<180;theta+=15){const m=model('c-ellipse-triangle',{theta}).measurements;near(m.area,12*Math.sin(theta*Math.PI/180));near(m.area,m.formulaArea);}
  for(let t=0;t<=2;t+=0.25){const m=model('c-hyperbola-triangle',{t}).measurements;near(m.area,2*Math.sqrt(13)*t);near(m.area,m.formulaArea);}
});

test('抛物线焦点弦：端点代回、坐标积、倒数和及端点切线垂直',()=>{
  for(let angle=45;angle<=135;angle+=15){
    const r=focalChord(2,angle),[a,b]=r.points,T=r.tangentIntersection;
    for(const p of r.points){near(p.y*p.y,4*p.x);near(p.y*T.y,2*(T.x+p.x));}
    near(a.x*b.x,1);near(a.y*b.y,-4);near(T.x,-1);
    near(Math.hypot(a.x-b.x,a.y-b.y),r.length);
    near(1/Math.hypot(a.x-1,a.y)+1/Math.hypot(b.x-1,b.y),1);
    near((2/a.y)*(2/b.y),-1);
  }
  assert.throws(()=>focalChord(2,0));
  const tangent=model('p-tangent',{y:0}).measurements;
  near(tangent.line.B,0);near(tangent.point.x,0);
});

test('联立先判二次系数，稳定求根含一次、相切、无根和大系数',()=>{
  assert.equal(quadratic(0,2,-4).kind,'linear');assert.equal(quadratic(0,0,1).roots.length,0);
  assert.equal(quadratic(1,-2,1).kind,'tangent');assert.equal(quadratic(1,0,1).kind,'none');
  const roots=quadratic(1,1e8,1).roots;near(roots[0]*roots[1],1);near(roots[0]+roots[1],-1e8,1e-6);
  for(const [s,m,answer] of [[0,0,0],[1.25,1.5,1],[1,1,2],[1,0,3],[2,0,3]])assert.equal(model('c-hyperbola-line',{s,m}).answer,answer);
  const single=model('c-hyperbola-line',{s:1,m:1}).measurements.points[0];near(single.x,-15/4);near(single.y,-3/2);
});

test('椭圆/双曲线/抛物线交点同时满足原曲线与直线，实弦长度符合端点距离',()=>{
  for(const curve of [{xx:1/25,yy:1/9,F:-1},{xx:1/9,yy:-1/4,F:-1},{xx:0,yy:1,D:-4,F:0}])for(let i=0;i<80;i++){
    const line={A:i%7-3,B:1,C:i%9-4},r=conicLine(curve,line);
    for(const p of r.points){near(curve.xx*p.x*p.x+curve.yy*p.y*p.y+(curve.D||0)*p.x+curve.F,0,1e-6);near(line.A*p.x+p.y+line.C,0,1e-6);}
    if(r.points.length===2)near(r.chord,Math.hypot(r.points[0].x-r.points[1].x,r.points[0].y-r.points[1].y),1e-6);
  }
});

test('点差法：真实弦的端点平均是指定中点；中心、切点和不存在须区分',()=>{
  for(const [id,values,answer] of [['c-ellipse-midpoint',{x:1,y:1},0],['c-ellipse-midpoint',{x:0,y:3},1],['c-ellipse-midpoint',{x:5,y:3},2],['c-ellipse-midpoint',{x:0,y:0},3],['c-parabola-midpoint',{x:2,y:0},0],['c-parabola-midpoint',{x:1,y:2},1],['c-parabola-midpoint',{x:0,y:2},2]]){
    const m=model(id,values);assert.equal(m.answer,answer);
    if(answer===0){const [a,b]=m.measurements.points;near((a.x+b.x)/2,values.x);near((a.y+b.y)/2,values.y);}
  }
});

test('椭圆面积最大15/2、斜率积-9/25以及含参直线恒过点',()=>{
  near(model('c-area',{theta:45}).measurements.area,15/2);
  for(let theta=0;theta<=90;theta+=5)assert.ok(model('c-area',{theta}).measurements.area<=7.5+1e-8);
  for(let theta=15;theta<180;theta+=15)near(model('c-slope-product',{theta}).measurements.product,-9/25);
  for(let lambda=-2;lambda<=2;lambda+=0.5){const m=model('c-fixed',{lambda});assert.equal(m.answer,lambda===0?1:0);assert.ok(m.measurements.points.some(p=>Math.abs(p.x-5)<1e-8&&Math.abs(p.y)<1e-8));}
});

test('保留原三个模块19课程并新增必修一与唯一实验ID，实际v0.3浏览器记录升级保留',async()=>{
  assert.deepEqual(modules.filter(m=>!['book2','elective2'].includes(m.id)).map(m=>m.title),['必修一','选择性必修一']);
  assert.deepEqual(modules.filter(m=>!['book2','elective2'].includes(m.id)).map(m=>m.lessonIds.length),[24,19]);assert.equal(new Set(lessons.filter(l=>!['book2','elective2'].includes(l.moduleId)).map(l=>l.id)).size,43);
  const ids=lessons.filter(l=>!l.legacy).flatMap(l=>l.labs.map(lab=>lab.id));assert.equal(new Set(ids).size,ids.length);
  const raw=await readFile(new URL('../docs/testing/v0.4/fixtures/v0.3-module-state.json',import.meta.url),'utf8'),old=JSON.parse(raw),restored=restoreModule(raw);
  assert.equal(restored.recovered,false);
  for(const [id,s] of Object.entries(old.lessons)){const {view,...updated}=restored.lessons[id];assert.deepEqual(updated,s);assert.equal(lessonProgress(lessons.find(l=>l.id===id),restored.lessons[id]),100);}
  for(const l of lessons.filter(l=>!l.legacy&&!Object.hasOwn(old.lessons,l.id))){assert.equal(lessonProgress(l,restored.lessons[l.id]),0);assert.equal(restored.lessons[l.id].complete,false);}
});
