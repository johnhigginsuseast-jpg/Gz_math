import { control as C, lab as L } from './lesson-data.mjs';
import { vectorInfo, triangleSSS, triangleSSA } from './book2-math.mjs';
const t = (label, min, max, step, value) => C('t', label, min, max, step, value);
export const vectorLabs = [
  L('b2-v-length','箭头从零长到单位长','改变向量长度，当前属于哪一类？',['零向量','单位向量','其他非零向量'],[t('横向分量 t',0,5,1,2)],[['零',{t:0}],['单位',{t:1}],['一般',{t:3}]]),
  L('b2-v-translate','搬家以后还是同一向量吗','将箭头整体平移，大小和方向是否改变？',['仍为同一向量','向量改变'],[t('起点横坐标 t',-3,3,1,0)],[['向左',{t:-3}],['向右',{t:3}]]),
  L('b2-v-sum','首尾相接，走到哪里','先走(3,0)，再走(0,t)。合位移的长度与3相比？',['小于3','等于3','大于3'],[t('第二段纵向位移 t',-4,4,1,2)],[['第二段为零',{t:0}],['向下',{t:-4}],['向上',{t:4}]]),
  L('b2-v-difference','同起点作差','a=(2,2)，b=(t,1)。b的终点指向a终点的箭头横向如何？',['向右','竖直','向左'],[t('b的横向分量 t',-1,4,1,1)],[['向右',{t:0}],['竖直',{t:2}],['向左',{t:4}]]),
  L('b2-v-scale','数乘会翻转箭头吗','对a=(2,1)数乘t，与原a相比是哪种？',['同向','反向','零向量'],[t('数乘系数 t',-2,2,0.5,1)],[['正系数',{t:2}],['负系数',{t:-1}],['零',{t:0}]]),
  L('b2-v-collinear','移动一点，寻找共线','A(0,0)、B(2,t)、C(4,2)。三点共线吗？',['共线','不共线'],[t('B的纵坐标 t',-1,3,0.5,0)],[['共线',{t:1}],['反例',{t:2}]]),
  L('b2-v-basis','基底压平后还能分解吗','e₁=(1,0)、e₂=(1,t)，能作为平面基底吗？',['可以，分解唯一','不可以，基底共线'],[t('e₂纵分量 t',0,2,0.5,1)],[['压平',{t:0}],['独立',{t:1}]]),
  L('b2-v-coordinates','从起点坐标到向量坐标','A(-1,1)、B(t,3)。AB横向分量属于哪种？',['正','零','负'],[t('终点B横坐标 t',-3,3,1,1)],[['同横坐标',{t:-1}],['向左',{t:-3}],['向右',{t:2}]]),
  L('b2-v-dot','夹角怎样改变数量积','两个向量的模均为3。数量积是正、零还是负？',['正','零','负'],[t('夹角 θ（度）',0,180,30,60)],[['同向',{t:0}],['垂直',{t:90}],['反向',{t:180}]]),
  L('b2-v-project','有向投影也会为负','a=(2,0)、b=(t,2)，b在a方向上的有向投影如何？',['正','零','负'],[t('b横向分量 t',-3,3,1,1)],[['负投影',{t:-2}],['垂直',{t:0}],['正投影',{t:2}]]),
  L('b2-v-sas','两边夹角构造三角形','b=3、c=4，改变夹角A。当前A是什么角？',['锐角','直角','钝角','退化，不成三角形'],[t('夹角 A（度）',0,180,15,60)],[['直角',{t:90}],['钝角',{t:120}],['退化',{t:0}]]),
  L('b2-v-sss','最长边决定三角形形状','三边为a=t、b=3、c=4。它是哪种三角形？',['锐角三角形','直角三角形','钝角三角形','不成三角形'],[t('边长 a',1,8,1,5)],[['直角',{t:5}],['锐角',{t:4}],['钝角',{t:6}],['退化',{t:7}]]),
  L('b2-v-ssa','SSA会留下两个三角形吗','A=30°、b=4、a=t。可能有几个不同三角形？',['0个','1个','2个'],[t('角A的对边 a',1,5,1,3)],[['无解',{t:1}],['相切一解',{t:2}],['两解',{t:3}],['一般一解',{t:4}]]),
  L('b2-v-circumradius','弦长与外接圆直径','外接圆半径R=2。a=4sinA与直径4相比？',['小于4','等于4'],[t('内角 A（度）',30,150,30,60)],[['直径弦',{t:90}],['锐角',{t:30}],['钝角',{t:150}]]),
  L('b2-v-area','同两边，面积何时最大','两边长4和6，夹角t。面积达到12了吗？',['达到最大值12','小于12','退化面积0'],[t('夹角（度）',0,180,15,60)],[['垂直',{t:90}],['一般',{t:30}],['压平',{t:180}]]),
  L('b2-v-height','站远一点测楼高','水平测量距离100米，视点与楼底等高。仰角t对应的楼高与100米相比？',['更高','等高','更低'],[t('仰角（度）',0,75,15,30)],[['45度',{t:45}],['较低',{t:30}],['较高',{t:60}]]),
];
export const vectorLab = (...ids) => ids.map(id => vectorLabs.find(item => item.id === id));
const rad = d => d * Math.PI / 180;
const f = n => String(Number((Math.abs(n)<1e-9?0:n).toFixed(3)));
const p = (x,y,label) => ({x,y,label});
const o = p(0,0,'O');
const graph = (points,segments,extra={}) => ({points,segments,extent:Math.max(4,...points.flatMap(q=>[Math.abs(q.x)+1,Math.abs(q.y)+1])),description:points.map(q=>q.label).join('，')+'；箭头方向由起点指向终点',...extra});
const result = (answer,status,formula,explanation,g,measurements={}) => ({answer,status,formula,explanation,graph:g,measurements});
const triGraph = (a,b,c,A) => {const B=p(c,0,'B'),C=p(b*Math.cos(rad(A)),b*Math.sin(rad(A)),'C'),O=p(0,0,'A');return graph([O,B,C],[[O,B],[O,C],[B,C]],{polygons:[{points:[O,B,C],color:'#27846e'}]});};

export function vectorModel(id,v) {
  const t=v.t;
  if(id==='b2-v-length'){const a=p(t,0,'a终点'),u=p(t?1:0,0,t?'单位方向u':'零点');return result(t===0?0:t===1?1:2,`|a|=${t}；${t?'u=(1,0)':'零向量无确定方向'}`,'非零时u=a/|a|；|u|=1','长度0不允许除以模；零向量与任意向量平行是约定，不能据此确定方向。',graph([o,a,u],[[o,a],[o,u,'#27846e']]),{length:t});}
  if(id==='b2-v-translate'){const A=p(t,0,'A'),B=p(t+2,1,'B');return result(0,`起点A(${t},0)，终点B(${t+2},1)；AB=(2,1)`,'终点−起点=(2,1)，模√5不变','向量相等只比较大小方向，与起点位置无关；相反向量还须方向相反。',graph([o,p(2,1,'原a'),A,B],[[o,p(2,1)],[A,B,'#27846e']]),{vector:[2,1]});}
  if(id==='b2-v-sum'){const A=p(3,0,'A'),B=p(3,t,'B'),Q=p(0,t,'b');return result(t===0?1:2,`合位移(3,${t})，长度≈${f(Math.hypot(3,t))}`,'OA+AB=OB；a+b=b+a','首尾相接时总位移从最初起点指向最后终点。交换路线可走到相同终点；长度一般不等于两段长度相加。',graph([o,A,B,Q],[[o,A],[A,B,'#27846e'],[o,B,'#c57e27'],[o,Q],[Q,B]]),{sum:[3,t]});}
  if(id==='b2-v-difference'){const A=p(2,2,'a终点A'),B=p(t,1,'b终点B');return result(t<2?0:t===2?1:2,`a−b=(${2-t},1)，方向B→A`,'OA−OB=BA','同起点相减，差向量指向被减向量a的终点。误写AB会得到相反向量。',graph([o,A,B],[[o,A],[o,B,'#27846e'],[B,A,'#c57e27']]),{difference:[2-t,1]});}
  if(id==='b2-v-scale'){const A=p(2,1,'a'),B=p(2*t,t,'ta');return result(t>0?0:t<0?1:2,`ta=(${2*t},${t})；模≈${f(Math.abs(t)*Math.sqrt(5))}`,'|ta|=|t||a|；正同向，负反向，0为零','数乘分配律t(a+b)=ta+tb；(s+t)a=sa+ta。负倍数改变方向，不能把模写成负数。',graph([o,A,B],[[o,A],[o,B,'#27846e']]),{scaled:[2*t,t]});}
  if(id==='b2-v-collinear'){const A=p(0,0,'A'),B=p(2,t,'B'),C=p(4,2,'C'),det=4-4*t;return result(det===0?0:1,`AB与AC行列式=${det}；${det===0?'AB=AC/2':'不共线'}`,'x₁y₂−x₂y₁=0 ⇔ 共线','AC非零，存在唯一实数λ使AB=λAC才共线；若参考向量为零，不能照搬唯一λ结论。',graph([A,B,C],[[A,C],[A,B,'#27846e']]),{cross:det});}
  if(id==='b2-v-basis'){const E=p(1,0,'e₁'),F=p(1,t,'e₂'),T=p(3,2,'a');return result(t?0:1,t?`a=(${f(3-2/t)})e₁+(${f(2/t)})e₂`:'两基向量共线，不能表示a=(3,2)','非共线基底 ⇒ 分解存在且唯一','正交单位基底i、j给出坐标a=(x,y)。一般基底不必垂直，但必须不共线；t=0时只能到达x轴。',graph([o,E,F,T],[[o,E],[o,F,'#27846e'],[o,T,'#c57e27']]),{determinant:t,coefficients:t?[3-2/t,2/t]:null});}
  if(id==='b2-v-coordinates'){const A=p(-1,1,'A'),B=p(t,3,'B');return result(t>-1?0:t===-1?1:2,`AB=(${t+1},2)，长度≈${f(Math.hypot(t+1,2))}`,'AB=(xB−xA,yB−yA)','点坐标与向量坐标不是同一对象。横分量为零仍可能是非零竖直向量；长度由两坐标差平方和求得。',graph([o,A,B,p(t+1,2,'自由向量终点')],[[A,B],[o,p(t+1,2),'#27846e']]),{vector:[t+1,2]});}
  if(id==='b2-v-dot'){const A=p(3,0,'a'),B=p(3*Math.cos(rad(t)),3*Math.sin(rad(t)),'b'),dot=9*Math.cos(rad(t));return result(Math.abs(dot)<1e-9?1:dot>0?0:2,`θ=${t}°；a·b≈${f(dot)}`,'a·b=|a||b|cosθ；夹角范围[0°,180°]','数量积是数，不是向量。垂直对应0，同向/反向的夹角为0°/180°，两者都不叫锐角或钝角。',graph([o,A,B],[[o,A],[o,B,'#27846e']]),{dot,angle:t});}
  if(id==='b2-v-project'){const A=p(2,0,'a'),B=p(t,2,'b'),H=p(t,0,'投影H'),info=vectorInfo([2,0],[t,2]);return result(t>0?0:t===0?1:2,`有向投影=${t}；a·b=${2*t}`,'projₐb=(a·b)/|a|，a≠0','投影是有向长度，可以为负；数量积等于|a|乘有向投影。|a·b|≤|a||b|，相等需共线；点积一般不满足结合律。',graph([o,A,B,H],[[o,A],[o,B,'#27846e'],[B,H,'#c57e27'],[o,H]]),info);}
  if(id==='b2-v-sas'){const a=Math.sqrt(25-24*Math.cos(rad(t))),valid=t>0&&t<180;return result(valid?(t<90?0:t===90?1:2):3,`a≈${f(a)}；${valid?'A='+t+'°':'三点共线，非三角形'}`,'a²=b²+c²−2bc cosA，b=3,c=4','已知两边夹角可唯一构造非退化三角形；夹角须在(0°,180°)。求边后用三角形不等式再检验。',triGraph(a,3,4,t),{a,area:6*Math.sin(rad(t)),valid});}
  if(id==='b2-v-sss'){const s=triangleSSS(t,3,4),long=Math.max(t,3,4),delta=2*long*long-(t*t+25);return result(!s?3:delta===0?1:delta<0?0:2,s?`A≈${f(s.A)}°；最大边${long}`:'不满足任意两边和大于第三边','cosA=(b²+c²−a²)/(2bc)','判断整个三角形须比较最大边平方与另两边平方和。某个角锐不代表三个角都锐。',s?triGraph(t,3,4,s.A):graph([o,p(4,0,'B'),p(t,0,'候选点')],[]),{triangle:s});}
  if(id==='b2-v-ssa'){const solutions=triangleSSA(t,4,30),gs=solutions.map(s=>triGraph(s.a,s.b,s.c,s.A)),g=gs[0]||graph([o,p(4*Math.cos(rad(30)),2,'C')],[]);if(gs[1]){g.points.push(...gs[1].points.map(q=>({...q,label:q.label+'₂'})));g.segments.push(...gs[1].segments.map(s=>[s[0],s[1],'#27846e']));}return result(solutions.length,`${solutions.length}个有效三角形；${solutions.map(s=>`B≈${f(s.B)}°`).join(' / ')}`,'sinB=4sin30°/a=2/a；检查B与180°−B','逐一检查B>0且A+B<180°；反三角主值只能给一个候选，不能漏另一支。a=2只有B=90°一个解。',g,{solutions});}
  if(id==='b2-v-circumradius'){const a=4*Math.sin(rad(t)),B=p(2*Math.cos(rad(t)),2*Math.sin(rad(t)),'圆周点');return result(t===90?1:0,`R=2；a≈${f(a)}，2R=4`,'a/sinA=2R；a≤2R','正弦定理适用有效三角形；A=90°时对边为直径，同一弦可能对应互补的圆周角。图中橙色段为长度a的弦。',graph([o,B,p(B.x,-B.y,'对称点')],[[B,p(B.x,-B.y),'#c57e27']],{circles:[{a:0,b:0,r:2}]}),{a,R:2});}
  if(id==='b2-v-area'){const area=12*Math.sin(rad(t));return result(t===0||t===180?2:t===90?0:1,`面积≈${f(area)}；理论上界12`,'S=½bc sinA，b=4,c=6','0<sinA≤1，A=90°能取到最大12；固定两边改变夹角时，周长也随第三边变化，不能误用定周长结论。',triGraph(Math.sqrt(52-48*Math.cos(rad(t))),4,6,t),{area});}
  if(id==='b2-v-height'){const h=100*Math.tan(rad(t)),A=p(0,0,'测点'),B=p(100,0,'楼底'),T=p(100,h,'楼顶');return result(t>45?0:t===45?1:2,`楼高≈${f(h)}米；水平距离100米`,'h=100tanα；坡度i=h/水平距离','视点与底部等高是本实验前提；若仪器有高度须加上。方位角从正北顺时针量，仰俯角从水平线量，不能混用；不可达距离可转为正余弦定理。',graph([A,B,T],[[A,B],[B,T],[A,T,'#27846e']]),{height:h});}
  throw new RangeError('未知向量实验：'+id);
}
