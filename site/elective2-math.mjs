const integer = n => { if (!Number.isInteger(n) || n < 1) throw new RangeError('下标须为正整数'); };
export function ap(a,d,n) { integer(n); return {term:a+(n-1)*d,sum:n*a+n*(n-1)*d/2}; }
export function gp(a,q,n) { integer(n); if (!Number.isFinite(a)||!Number.isFinite(q)||a===0||q===0) return null; return {term:a*q**(n-1),sum:q===1?n*a:a*(1-q**n)/(1-q)}; }
export function weightedSum(q,n) { integer(n); return q===1?n*(n+1)/2:(1-(n+1)*q**n+n*q**(n+1))/(1-q)**2; }
export function apSumExtrema(a,d,N) {
  integer(N); const values=Array.from({length:N},(_,i)=>ap(a,d,i+1).sum),min=Math.min(...values),max=Math.max(...values);
  return {min,max,minAt:values.flatMap((y,i)=>y===min?[i+1]:[]),maxAt:values.flatMap((y,i)=>y===max?[i+1]:[])};
}
export function root(fn,lo,hi) {
  let a=fn(lo),b=fn(hi);
  if (![lo,hi,a,b].every(Number.isFinite)||lo>hi||a*b>0) throw new RangeError('根须有有限异号括区间');
  if(a===0)return lo;if(b===0)return hi;
  for(let i=0;i<90;i++){const mid=(lo+hi)/2,c=fn(mid);if(!Number.isFinite(c))throw new RangeError('区间内无定义');if(c===0)return mid;if(a*c<0){hi=mid;b=c;}else{lo=mid;a=c;}}
  return (lo+hi)/2;
}
export function cubicRoots(m) {
  const fn=x=>x**3-3*x-m,R=Math.abs(m)+3;
  return [[-R,-1],[-1,1],[1,R]].filter(([a,b])=>fn(a)*fn(b)<=0).map(([a,b])=>root(fn,a,b)).filter((x,i,arr)=>!arr.slice(0,i).some(y=>Math.abs(y-x)<1e-8));
}
export function logRoots(a) {
  const fn=x=>Math.log(x)-a*x;
  if(a<=0)return [root(fn,Math.exp(-Math.abs(a)-3),a===0?2:1)];
  const c=1/a,peak=-Math.log(a)-1;
  if(Math.abs(a-1/Math.E)<1e-12)return [Math.E];
  if(peak<0)return [];
  let lo=Math.min(c/2,Math.exp(-Math.abs(a)-3)),hi=2*c;
  while(fn(lo)>=0)lo/=2;while(fn(hi)>=0)hi*=2;
  return [root(fn,lo,c),root(fn,c,hi)];
}
export function levelRoots(m) { if(m<1)return [];if(m===1)return [1];return [root(x=>x-Math.log(x)-m,Math.exp(-m),1),root(x=>x-Math.log(x)-m,1,Math.exp(m))]; }
export function cubicExtrema(L,R) {
  const xs=[L,R,...[-1,1].filter(x=>x>L&&x<R)].filter((x,i,a)=>a.indexOf(x)===i),values=xs.map(x=>x**3-3*x),min=Math.min(...values),max=Math.max(...values);
  return {xs,values,min,max,minAt:xs.filter((x,i)=>values[i]===min),maxAt:xs.filter((x,i)=>values[i]===max)};
}
export function quantified(open,mode,a) { return mode===0?a<=0:mode===1?(open?a<=0:a<0):mode===2?(open?a<1:a<=1):a<1; }
export function basicFunction(mode,x) {
  const functions=[['C=2',()=>2,()=>0],['x²',x=>x*x,x=>2*x],['∛x',Math.cbrt,x=>x===0?null:1/(3*Math.cbrt(x)**2)],['sin x',Math.sin,Math.cos],['cos x',Math.cos,x=>-Math.sin(x)],['eˣ',Math.exp,Math.exp],['2ˣ',x=>2**x,x=>2**x*Math.LN2],['ln x',x=>x>0?Math.log(x):null,x=>x>0?1/x:null],['log₂x',x=>x>0?Math.log2(x):null,x=>x>0?1/(x*Math.LN2):null],['1/x',x=>x===0?null:1/x,x=>x===0?null:-1/x**2],['√x',x=>x<0?null:Math.sqrt(x),x=>x>0?1/(2*Math.sqrt(x)):null]];
  const [name,fn,df]=functions[mode];return {name,value:fn(x),derivative:df(x)};
}
