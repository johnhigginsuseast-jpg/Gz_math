const radians = degrees => degrees * Math.PI / 180;
const degrees = angle => angle * 180 / Math.PI;
const clamp = value => Math.max(-1, Math.min(1, value));

export function vectorInfo(a, b) {
  if (a.length !== 2 || b.length !== 2 || ![...a, ...b].every(Number.isFinite)) throw new RangeError('需要两个有限二维向量');
  const lengthA = Math.hypot(...a), lengthB = Math.hypot(...b), dot = a[0] * b[0] + a[1] * b[1];
  return { lengthA, lengthB, dot, cross: a[0] * b[1] - a[1] * b[0], angle: lengthA && lengthB ? degrees(Math.acos(clamp(dot / lengthA / lengthB))) : null, projection: lengthA ? dot / lengthA : null };
}

export function triangleSSS(a, b, c) {
  if (![a, b, c].every(x => Number.isFinite(x) && x > 0) || a + b <= c || a + c <= b || b + c <= a) return null;
  const A = degrees(Math.acos(clamp((b * b + c * c - a * a) / (2 * b * c))));
  const B = degrees(Math.acos(clamp((a * a + c * c - b * b) / (2 * a * c))));
  return { a, b, c, A, B, C: 180 - A - B, area: b * c * Math.sin(radians(A)) / 2 };
}

export function triangleSSA(a, b, A) {
  if (![a, b, A].every(Number.isFinite) || a <= 0 || b <= 0 || A <= 0 || A >= 180) return [];
  const sineB = b * Math.sin(radians(A)) / a;
  if (sineB > 1 + 1e-12) return [];
  const first = degrees(Math.asin(Math.abs(sineB - 1) < 1e-12 ? 1 : clamp(sineB))), candidates = [first];
  if (Math.abs(first - 90) > 1e-9) candidates.push(180 - first);
  return candidates.filter(B => B > 0 && A + B < 180 - 1e-9).map(B => {
    const C = 180 - A - B, c = a * Math.sin(radians(C)) / Math.sin(radians(A));
    return { a, b, c, A, B, C, area: b * c * Math.sin(radians(A)) / 2 };
  });
}

export function complexOperation(a, b, operation) {
  if (![...a,...b].every(Number.isFinite) || a.length!==2 || b.length!==2 || ![0,1,2,3].includes(operation)) throw new RangeError('复数分量或运算无效');
  const [x,y]=a,[u,v]=b;
  if(operation===0)return [x+u,y+v];
  if(operation===1)return [x-u,y-v];
  if(operation===2)return [x*u-y*v,x*v+y*u];
  const denominator=u*u+v*v;
  return denominator ? [(x*u+y*v)/denominator,(y*u-x*v)/denominator] : null;
}

export function dataSummary(values, percentile=50) {
  if (!Array.isArray(values) || !values.every(Number.isFinite) || !Number.isFinite(percentile) || percentile<0 || percentile>100) throw new RangeError('数据须有限，百分位须在0到100');
  if (!values.length) return null;
  const sorted=[...values].sort((a,b)=>a-b), n=sorted.length, mean=sorted.reduce((s,x)=>s+x,0)/n;
  const quantile=p=>{if(p===0)return sorted[0];if(p===100)return sorted[n-1];const i=n*p/100;return Number.isInteger(i)?(sorted[i-1]+sorted[i])/2:sorted[Math.floor(i)];};
  const counts=new Map();for(const x of values)counts.set(x,(counts.get(x)||0)+1);
  const maxCount=Math.max(...counts.values()),modes=maxCount===1?[]:[...counts].filter(([,c])=>c===maxCount).map(([x])=>x).sort((a,b)=>a-b);
  const variance=values.reduce((s,x)=>s+(x-mean)**2,0)/n;
  return {n,sorted,mean,median:quantile(50),percentile:quantile(percentile),modes,variance,standardDeviation:Math.sqrt(variance)};
}

export function stratifiedSummary(groups) {
  if(!groups.length || groups.some(g=>!Number.isFinite(g.weight)||g.weight<0||!g.values.length) || Math.abs(groups.reduce((s,g)=>s+g.weight,0)-1)>1e-9)throw new RangeError('非空各层需有效数据，层权和须为1');
  const parts=groups.map(g=>({...dataSummary(g.values),weight:g.weight})),mean=parts.reduce((s,g)=>s+g.weight*g.mean,0);
  return {mean,variance:parts.reduce((s,g)=>s+g.weight*(g.variance+(g.mean-mean)**2),0)};
}

export function drawSample(values,count,seed,replacement=false) {
  if(!values.length||!Number.isInteger(count)||count<0||(!replacement&&count>values.length)||!Number.isInteger(seed))throw new RangeError('抽样容量或种子无效');
  let state=seed>>>0;const pool=[...values],sample=[];
  for(let i=0;i<count;i++){state=(state+0x6D2B79F5)>>>0;let bits=Math.imul(state^(state>>>15),1|state);bits^=bits+Math.imul(bits^(bits>>>7),61|bits);const random=((bits^(bits>>>14))>>>0)/4294967296,index=Math.floor(random*pool.length);sample.push(pool[index]);if(!replacement)pool.splice(index,1);}
  return sample;
}

export function histogram(values,edges) {
  if(edges.length<2||!edges.every(Number.isFinite)||edges.some((x,i)=>i&&x<=edges[i-1])||!values.every(x=>Number.isFinite(x)&&x>=edges[0]&&x<=edges.at(-1)))throw new RangeError('数据须在严格递增的分组端点范围内');
  return edges.slice(0,-1).map((lo,i)=>{const hi=edges[i+1],count=values.filter(x=>x>=lo&&(x<hi||i===edges.length-2&&x===hi)).length,frequency=values.length?count/values.length:0;return {lo,hi,count,frequency,density:frequency/(hi-lo)};});
}
