import { quadratic } from './advanced-math.mjs';
export const setCounts=n=>({subsets:2**n,proper:2**n-1,nonemptyProper:n===0?0:2**n-2});
export function setRelation(p,q){const pq=p.every(x=>q.includes(x)),qp=q.every(x=>p.includes(x));return pq?(qp?0:1):(qp?2:3);}
export function intervalIntersection(a,b){
  const lo=Math.max(a.lo,b.lo),hi=Math.min(a.hi,b.hi),left=(lo!==a.lo||a.left)&&(lo!==b.lo||b.left),right=(hi!==a.hi||a.right)&&(hi!==b.hi||b.right);
  return lo>hi||lo===hi&&!(left&&right)?null:{lo,hi,left,right};
}
const interval=(lo,hi,left=false,right=false)=>({lo,hi,left:Number.isFinite(lo)&&left,right:Number.isFinite(hi)&&right});
export function quadraticPositive(a,b,c,inclusive=false){
  if(a===0){if(b===0)return (inclusive?c>=0:c>0)?[interval(-Infinity,Infinity)]:[];const root=-c/b;return [b>0?interval(root,Infinity,inclusive):interval(-Infinity,root,false,inclusive)];}
  const {roots}=quadratic(a,b,c);
  if(!roots.length)return a>0?[interval(-Infinity,Infinity)]:[];
  if(roots.length===1){const x=roots[0];return a>0?(inclusive?[interval(-Infinity,Infinity)]:[interval(-Infinity,x),interval(x,Infinity)]):(inclusive?[interval(x,x,true,true)]:[]);}
  const [lo,hi]=[...roots].sort((x,y)=>x-y);
  return a>0?[interval(-Infinity,lo,false,inclusive),interval(hi,Infinity,inclusive)]:[interval(lo,hi,inclusive,inclusive)];
}
export function bisect(fn,lo,hi,steps){
  if(![lo,hi].every(Number.isFinite)||lo>=hi||!Number.isInteger(steps)||steps<0||!Number.isFinite(fn(lo))||!Number.isFinite(fn(hi))||fn(lo)*fn(hi)>=0)throw new RangeError('二分需连续函数的异号有效端点');
  const history=[];
  for(let i=0;i<steps;i++){const mid=(lo+hi)/2,y=fn(mid);if(!Number.isFinite(y))throw new RangeError('区间内函数无定义');history.push({lo,hi,mid,y});if(y===0){lo=hi=mid;break;}if(fn(lo)*y<0)hi=mid;else lo=mid;}
  return {lo,hi,history};
}
export function sampleCurve(fn,lo=-5,hi=5,{breaks=[],steps=160,color}={}){
  const stops=[lo,...breaks.filter(x=>x>lo&&x<hi).sort((a,b)=>a-b),hi],curves=[];
  for(let j=0;j<stops.length-1;j++){
    let points=[];
    const flush=()=>{if(points.length>1)curves.push({points,color});points=[];};
    for(let i=0;i<=steps;i++){
      const x=stops[j]+(stops[j+1]-stops[j])*i/steps;
      const y=breaks.some(b=>Math.abs(x-b)<1e-10)?null:fn(x);
      if(y===null||!Number.isFinite(y)){flush();continue;}points.push({x,y});
    }flush();
  }return curves;
}
export function powerValue(mode,x){return mode===3?(x<0?null:Math.sqrt(x)):mode===4?(x===0?null:1/x):x**[1,2,3][mode];}
export function sineParameters(A,w,phi,b=0){
  const constant=A===0||w===0,value=A*Math.sin(phi)+b;
  return {amplitude:Math.abs(A),min:constant?value:b-Math.abs(A),max:constant?value:b+Math.abs(A),period:constant?null:2*Math.PI/Math.abs(w),constant};
}
