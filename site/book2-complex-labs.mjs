import { control as C, lab as L } from './lesson-data.mjs';
import { complexOperation } from './book2-math.mjs';
const real=C('a','实部 a',-2,2,1,1),imag=C('b','虚部 b',-2,2,1,1);
export const complexLabs=[
 L('b2-z-class','走过实轴与虚轴','z=a+bi属于哪类？',['实数','纯虚数','非纯虚的虚数'],[real,imag],[['原点',{a:0,b:0}],['纯虚',{a:0,b:2}],['实数',{a:2,b:0}]]),
 L('b2-z-equal','两分量同时相等','z=a+bi与固定w=1+i相等吗？',['相等','不相等'],[real,imag],[['相等',{a:1,b:1}],['只实部相等',{a:1,b:0}],['只虚部相等',{a:0,b:1}]]),
 L('b2-z-operation','四则运算搬动平面点','固定z=1+i，改变w=a+bi及运算。结果有定义吗？',['有定义','无定义，除数为0'],[real,imag,C('op','运算：0加、1减、2乘、3除',0,3,1,2)],[['乘法',{a:1,b:1,op:2}],['商为i',{a:1,b:-1,op:3}],['除零',{a:0,b:0,op:3}],['加法',{a:1,b:1,op:0}]]),
 L('b2-z-powers','i的幂转四次会回来吗','n为非负整数，iⁿ是哪一个？',['1','i','−1','−i'],[C('n','指数 n',0,20,1,5)],[['0次方',{n:0}],['一整圈',{n:4}],['余3',{n:19}]]),
 L('b2-z-conjugate','关于实轴翻折','z̄=−z是否成立？注意原点。',['成立','不成立'],[real,imag],[['原点',{a:0,b:0}],['纯虚',{a:0,b:2}],['一般复数',{a:1,b:2}]]),
 L('b2-z-polar','选学：乘i，旋转并保持模','z=r(cosθ+i sinθ)，乘i后，模是否改变？',['非零，模保持且转90°','零复数，辐角不确定'],[C('r','模 r',0,3,1,2),C('theta','辐角 θ（度）',0,360,30,30)],[['第一象限',{r:2,theta:30}],['整周等价',{r:2,theta:360}],['零复数',{r:0,theta:30}]]),
];
export const complexLab=(...ids)=>ids.map(id=>complexLabs.find(l=>l.id===id));
const f=n=>String(Number((Math.abs(n)<1e-9?0:n).toFixed(3)));
const ztext=([a,b])=>`${f(a)}${b<0?'−':'+'}${f(Math.abs(b))}i`;
const point=(z,label)=>({x:z[0],y:z[1],label});
const graph=(zs)=>({points:zs.map(([z,label])=>point(z,label)),segments:zs.map(([z])=>[{x:0,y:0},point(z)]),extent:Math.max(4,...zs.flatMap(([z])=>z.map(x=>Math.abs(x)+1))),description:zs.map(([z,label])=>`${label}对应${ztext(z)}`).join('；')+'，横轴为实部，纵轴为虚部'});
const result=(answer,status,formula,explanation,g,measurements={})=>({answer,status,formula,explanation,graph:g,measurements});
export function complexModel(id,v){
 const z=[v.a,v.b];
 if(id==='b2-z-class')return result(v.b===0?0:v.a===0?1:2,`z=${ztext(z)}；实部${v.a}，虚部${v.b}`,'a+bi：b=0实数；a=0且b≠0纯虚数','虚部是实数b，不是bi。原点0是实数，不是纯虚数；复数之间没有一般的大小顺序。',graph([[z,'z']]),{real:v.a,imaginary:v.b});
 if(id==='b2-z-equal')return result(v.a===1&&v.b===1?0:1,`z=${ztext(z)}，w=1+i；${v.a===1?'实部相等':'实部不同'}，${v.b===1?'虚部相等':'虚部不同'}`,'a+bi=c+di ⇔ a=c且b=d','实部和虚部必须同时相等；模相等也可能是圆周上的不同点，不能用模代替复数相等。',graph([[z,'z'],[[1,1],'w']]),{equal:v.a===1&&v.b===1});
 if(id==='b2-z-operation'){const a=[1,1],value=complexOperation(a,z,v.op);return result(value?0:1,value?`(1+i)${['+','−','×','÷'][v.op]}(${ztext(z)})=${ztext(value)}`:'w=0，复数除法无定义','乘法：(ac−bd)+(ad+bc)i；除法乘分母共轭','加减逐分量；乘法用i²=−1展开；除法分子分母同乘a−bi，分母a²+b²必须大于0。',graph([[a,'z'],[z,'w'],...(value?[[value,'结果']]:[])]),{value});}
 if(id==='b2-z-powers'){const values=[[1,0],[0,1],[-1,0],[0,-1]],k=v.n%4;return result(k,`n=${v.n}=4×${Math.floor(v.n/4)}+${k}；iⁿ=${['1','i','−1','−i'][k]}`,'i⁴=1；指数除以4看余数','从1开始，每乘一次i逆时针转90°，四次回到初始方向。圆周上的初始点是1，不是复平面的原点0。',graph(values.map((z,i)=>[z,['1','i','−1','−i'][i]])),{value:values[k],remainder:k});}
 if(id==='b2-z-conjugate'){const conjugate=[v.a,-v.b],modulus=Math.hypot(...z);return result(v.a===0?0:1,`z̄=${ztext(conjugate)}；|z|≈${f(modulus)}；z z̄=${v.a*v.a+v.b*v.b}`,'z̄=a−bi，z z̄=|z|²；z̄=−z ⇔ a=0','关于实轴反射，模保持。z̄=z等价于b=0；z̄=−z也包含0，若还要求z≠0才是纯虚数。',graph([[z,'z'],[conjugate,'共轭z̄']]),{modulus,conjugate,product:v.a*v.a+v.b*v.b});}
 if(id==='b2-z-polar'){const theta=v.theta*Math.PI/180,a=[v.r*Math.cos(theta),v.r*Math.sin(theta)],b=[-a[1],a[0]];return result(v.r?0:1,`z≈${ztext(a)}；iz≈${ztext(b)}；两模均${v.r}`,'选学：模相乘，辐角相加；乘i即转90°','非零复数辐角相差360°的整数倍表示同方向。0的模是0，辐角不确定；除法要求分母模非零。',graph([[a,'z'],[b,'iz']]),{before:a,after:b,modulus:v.r});}
 throw new RangeError('未知复数实验：'+id);
}
