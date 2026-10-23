const EPS = 1e-9;
export const dot3 = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
export const cross3 = (u, v) => [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
export const length3 = u => Math.hypot(...u);
const clamp = n => Math.max(-1, Math.min(1, n));
export function vectorAngle(u, v, acute = false) {
  const denominator = length3(u) * length3(v);
  if (!denominator) throw new RangeError('零向量不能确定夹角。');
  const cos = dot3(u, v) / denominator;
  return Math.acos(clamp(acute ? Math.abs(cos) : cos)) * 180 / Math.PI;
}
export function linePlaneAngle(u, n) {
  if (!length3(u) || !length3(n)) throw new RangeError('方向和法向量须非零。');
  return Math.asin(clamp(Math.abs(dot3(u, n)) / (length3(u)*length3(n)))) * 180 / Math.PI;
}
export function pointPlaneDistance(p, n, C = 0) {
  if (!length3(n)) throw new RangeError('平面法向量不能为零。');
  return Math.abs(dot3(p, n)+C)/length3(n);
}
export function skewDistance(p, u, q, v) {
  const delta = q.map((x, i) => x - p[i]), normal = cross3(u, v);
  if (!length3(u) || !length3(v)) throw new RangeError('方向向量不能为零。');
  return length3(normal) < EPS ? length3(cross3(delta, u))/length3(u) : Math.abs(dot3(normal, delta))/length3(normal);
}
export function project3([x,y,z], yaw = 35, pitch = 25) {
  const a=yaw*Math.PI/180, b=pitch*Math.PI/180;
  return { x:x*Math.cos(a)-y*Math.sin(a), y:(x*Math.sin(a)+y*Math.cos(a))*Math.sin(b)+z*Math.cos(b) };
}
export function sphereSection(radius, height) {
  if (!(radius>0) || !Number.isFinite(height)) throw new RangeError('球半径须为正数，高度须有限。');
  const diff=radius-Math.abs(height);
  return { kind:Math.abs(diff)<EPS?'point':diff<0?'empty':'circle', radius:Math.sqrt(Math.max(0,radius*radius-height*height)) };
}
export function cubeSection(side, level) {
  if(!(side>0)||!Number.isFinite(level)) throw new RangeError('边长须为正数，截平面参数须有限。');
  const vertices=Array.from({length:8},(_,i)=>[(i&1)?side:0,(i&2)?side:0,(i&4)?side:0]);
  const edges=[],points=[];
  const add=p=>{if(!points.some(q=>Math.hypot(...p.map((x,i)=>x-q[i]))<EPS))points.push(p);};
  for(let i=0;i<8;i++)for(const bit of [1,2,4])if(!(i&bit)){
    const a=vertices[i],b=vertices[i|bit];edges.push([a,b]);
    const da=a.reduce((s,x)=>s+x,0)-level,db=b.reduce((s,x)=>s+x,0)-level;
    if(Math.abs(da)<EPS)add([...a]);
    if(Math.abs(db)<EPS)add([...b]);
    if(da*db<0){const t=da/(da-db);add(a.map((x,j)=>x+t*(b[j]-x)));}
  }
  const center=[0,1,2].map(i=>points.reduce((s,p)=>s+p[i],0)/(points.length||1));
  const angle=p=>{const d=p.map((x,i)=>x-center[i]);return Math.atan2((d[0]+d[1]-2*d[2])/Math.sqrt(6),(d[0]-d[1])/Math.sqrt(2));};
  points.sort((a,b)=>angle(a)-angle(b));
  let twiceArea=0;
  for(let i=0;i<points.length;i++){const cross=cross3(points[i].map((x,j)=>x-center[j]),points[(i+1)%points.length].map((x,j)=>x-center[j]));twiceArea+=dot3(cross,[1/Math.sqrt(3),1/Math.sqrt(3),1/Math.sqrt(3)]);}
  return {points,edges,area:Math.abs(twiceArea)/2,kind:points.length===0?'none':points.length===1?'point':points.length===3?'triangle':'hexagon'};
}
export function quadratic(A,B,C) {
  if (![A,B,C].every(Number.isFinite)) throw new RangeError('方程系数须为有限数。');
  if (Math.abs(A)<EPS) return Math.abs(B)<EPS ? {kind:'none', roots:[], delta:null} : {kind:'linear', roots:[-C/B], delta:null};
  const delta=B*B-4*A*C;
  if (delta < -EPS) return {kind:'none',roots:[],delta};
  if (Math.abs(delta)<EPS) return {kind:'tangent',roots:[-B/(2*A)],delta:0};
  const root=Math.sqrt(delta), q=-0.5*(B+(B<0?-root:root));
  return {kind:'secant',roots:[q/A,C/q].sort((x,y)=>x-y),delta};
}
export function conicLine({xx,yy,D=0,E=0,F=-1},{A,B,C}) {
  const norm=Math.hypot(A,B);
  if (!norm) throw new RangeError('需要有效直线。');
  const base={x:-A*C/(norm*norm),y:-B*C/(norm*norm)}, u={x:B/norm,y:-A/norm};
  const result=quadratic(xx*u.x*u.x+yy*u.y*u.y,2*xx*base.x*u.x+2*yy*base.y*u.y+D*u.x+E*u.y,xx*base.x*base.x+yy*base.y*base.y+D*base.x+E*base.y+F);
  const points=result.roots.map(t=>({x:base.x+t*u.x,y:base.y+t*u.y}));
  return {...result,points,chord:points.length===2?Math.abs(result.roots[1]-result.roots[0]):points.length===1?0:null};
}
export function conicParameters(type,a,b) {
  if (!(a>0&&b>0) || (type==='ellipse'&&a<=b) || !['ellipse','hyperbola'].includes(type)) throw new RangeError('椭圆须a>b>0；双曲线须a,b>0。');
  const c=Math.sqrt(type==='ellipse'?a*a-b*b:a*a+b*b);
  return {a,b,c,e:c/a,latus:2*b*b/a};
}
export function parabolaPoint(p,y) {
  if (!(p>0)||!Number.isFinite(y)) throw new RangeError('p须为正数，坐标须有限。');
  const x=y*y/(2*p);
  return {x,y,focalDistance:x+p/2};
}
export function focalChord(p,angle) {
  const t=angle*Math.PI/180, sine=Math.sin(t), cosine=Math.cos(t);
  if (!(p>0)||Math.abs(sine)<EPS) throw new RangeError('轴线方向没有两个有限交点。');
  const roots=[p*(cosine-1)/(sine*sine),p*(cosine+1)/(sine*sine)];
  const points=roots.map(s=>({x:p/2+s*cosine,y:s*sine}));
  return {points,length:2*p/(sine*sine),tangentIntersection:{x:-p/2,y:p*cosine/sine}};
}
