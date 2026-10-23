import { control as C, lab as L } from './lesson-data.mjs';
import { advancedModel } from './advanced-labs.mjs';
const t=(label,min,max,step,value)=>C('t',label,min,max,step,value);
export const solidBookLabs=[
 L('b2-s-frustum','上底缩小，台变成什么','下底半径3，上底半径t，形状是哪种？',['圆锥','圆台','圆柱'],[t('上底半径 r',0,3,0.5,1)],[['锥',{t:0}],['台',{t:1}],['柱',{t:3}]]),
 L('b2-s-section','平面越过球的边缘','半径3的球被z=t截取，截集是什么？',['截面圆','切点','无交点'],[t('截平面高度 z',-4,4,0.5,1)],[['大圆',{t:0}],['相切',{t:3}],['球外',{t:4}]]),
 L('b2-s-oblique-length','y方向缩成一半','原矩形x方向长4、y方向长t。斜二测y边长度与原来比？',['一半','不变'],[t('原y边长',1,5,1,3)],[['短边',{t:1}],['长边',{t:5}]]),
 L('b2-s-oblique-area','两条轴张成多少面积','原矩形t×4，斜二测轴角45°或135°。直观图与原图面积比？',['√2/4','1/2','2√2'],[t('原x边长',1,6,1,4),C('mode','轴角：0为45°、1为135°',0,1,1,0)],[['45度',{t:4,mode:0}],['135度',{t:4,mode:1}]]),
 L('b2-s-cylinder-net','柱体侧面展开与外露面','半径2、高3的封闭圆柱叠t层，接触面是否需要从简单面积和扣除？',['单层无接触面','多层须扣两侧接触圆面'],[t('叠放层数',1,3,1,2)],[['单层',{t:1}],['三层',{t:3}]]),
 L('b2-s-cone-net','锥面展开的扇形','底半径2、母线t，展开扇形圆心角与180°相比？',['小于180°','等于180°','大于180°'],[t('母线 l',3,6,1,4)],[['大扇形',{t:3}],['半圆',{t:4}],['小扇形',{t:6}]]),
 L('b2-s-volume','等底等高的柱和锥','正方形底边t、高3，锥体积是柱的几倍？',['相等','1/3','3倍'],[t('底边 a',1,4,0.5,2)],[['底边1',{t:1}],['底边4',{t:4}]]),
 L('b2-s-insphere','球能装进圆柱吗','球半径2，圆柱半径2、高t，球心与圆柱中心重合。状态如何？',['高度不足','上下底相切','高度有余'],[t('圆柱高 h',2,6,1,4)],[['装不下',{t:2}],['恰好',{t:4}],['高一些',{t:6}]]),
 L('b2-s-position','投影相交就真相交吗','紫线x轴，绿线过(0,1,h)，方向可转动。两线是哪种？',['平行','相交','异面'],[C('alpha','绿色方向角（度）',0,90,15,90),C('h','高度 h',0,2,0.5,1)],[['异面',{alpha:90,h:1}],['相交',{alpha:90,h:0}],['平行',{alpha:0,h:1}]]),
 L('b2-s-line-plane','直线在面内还是面外','平面z=0，直线方向角φ、中点高h变化。关系是哪种？',['在面内','平行','一般相交','垂直'],[C('phi','方向仰角 φ（度）',0,90,15,0),C('h','直线中点高 h',0,2,0.5,1)],[['在面内',{phi:0,h:0}],['平行',{phi:0,h:1}],['相交',{phi:30,h:1}],['垂直',{phi:90,h:1}]]),
 L('b2-s-parallel-line','平面外条件不能漏','绿线方向与z=0内的x轴相同，高度为t。它与平面关系？',['在面内，不能叫线面平行','线面平行'],[t('绿线高度 h',0,3,0.5,1)],[['反例',{t:0}],['面外平行',{t:2}]]),
 L('b2-s-parallel-plane','一条平行线够不够','绿面过(0,0,1)，绕x方向转t度。面内x方向线一直平行底面，两面关系？',['平行','相交'],[t('绿面转角（度）',0,60,15,30)],[['两方向都平行',{t:0}],['只检查一条不够',{t:30}]]),
 L('b2-s-perp-line','只垂直面内一条线够吗','绿杆方向(0,sin t,cos t)，始终垂直x轴。杆是否垂直z=0？',['线面垂直','不垂直，只垂直x轴不够'],[t('杆偏离竖直角（度）',0,90,15,30)],[['两相交方向都垂直',{t:0}],['反例',{t:45}],['落在y轴',{t:90}]]),
 L('b2-s-perp-plane','找面内的一条垂线','绿面绕公共x轴转t度，它与z=0垂直吗？',['不垂直','面面垂直'],[t('两面转角（度）',0,90,15,45)],[['重合',{t:0}],['一般相交',{t:45}],['含竖直线',{t:90}]]),
 L('b2-s-angle-distance','先作射影再量线面角','OP长3，与底面角t，P到平面距离与3相比？',['等于3','小于3'],[t('线面角（度）',0,90,15,30)],[['平放',{t:0}],['抬高30度',{t:30}],['竖直投影为点',{t:90}]]),
 L('b2-s-dihedral','二面角有钝角吗','从公共棱作两条垂棱射线，张开t度，平面角属于哪类？',['小于90°','90°','大于90°'],[t('半平面张开角（度）',0,180,30,120)],[['锐角',{t:30}],['直角',{t:90}],['钝角',{t:150}],['展平边界',{t:180}]]),
];
export const solidBookLab=(...ids)=>ids.map(id=>solidBookLabs.find(l=>l.id===id));
const f=n=>String(Number((Math.abs(n)<1e-9?0:n).toFixed(3))),rad=d=>d*Math.PI/180;
const p=(x,y,label)=>({x,y,label}),O=p(0,0,'O');
const planeGraph=(points,segments,polygons=[],extra={})=>({points,segments,polygons,extent:Math.max(5,...points.flatMap(q=>[Math.abs(q.x)+1,Math.abs(q.y)+1])),description:'原图与构造图的长度和面积关系，数值在下方',...extra});
const base=[[-3,-3,0],[3,-3,0],[3,3,0],[-3,3,0]];
const space=(points,segments,faces=[],curves=[])=>({space:{points,segments,faces,curves,extent:Math.max(5,...points.map(q=>Math.hypot(...q.p)+1),...curves.flatMap(c=>c.points.map(q=>Math.hypot(...q)+1)))}});
const P=(p,label)=>({p,label}),face=(points,color='#7555dc')=>({points,color});
const ring=(r,z)=>Array.from({length:65},(_,i)=>[r*Math.cos(i*Math.PI/32),r*Math.sin(i*Math.PI/32),z]);
const result=(answer,status,formula,explanation,graph,measurements={})=>({answer,status,formula,explanation,graph,measurements});
export function solidBookModel(id,v){
 const t=v.t;
 if(id==='b2-s-frustum')return advancedModel('s-frustum',{r:t,h:3});
 if(id==='b2-s-section')return advancedModel('s-section',{z:t});
 if(id==='b2-s-position')return advancedModel('s-skew',v);
 if(id==='b2-s-line-plane'){const m=advancedModel('s-line-plane',v);return {...m,formula:'先看直线是否包含在平面内，再看公共点数',explanation:'φ=0时方向平行于底面；h=0线在面内，h>0才线面平行。φ>0时无限直线与底面相交，φ=90°为垂直。图中只画有限杆段。'};}
 if(id==='b2-s-volume')return advancedModel('s-volume',{a:t,h:3});
 if(id==='b2-s-oblique-length'||id==='b2-s-oblique-area'){const lengthMode=id==='b2-s-oblique-length',a=lengthMode?4:t,b=lengthMode?t:4,angle=lengthMode?45:v.mode?135:45,dx=b*Math.cos(rad(angle))/2,dy=b*Math.sin(rad(angle))/2,original=[p(-a-2,0,'A'),p(-2,0,'B'),p(-2,b,'C'),p(-a-2,b,'D')],sketch=[p(1,0,'A′'),p(1+a,0,'B′'),p(1+a+dx,dy,'C′'),p(1+dx,dy,'D′')],area=a*dy;return result(0,`原面积${a*b}；直观图面积≈${f(area)}；y边${b}→${b/2}`,'y边减半；S图/S原=(1/2)sin45°=√2/4','紫图为原平面矩形，绿图为斜二测表示；平行关系保持，角度与长度一般不保持。135°取同样的正面积比；该面积比例不直接套用任意空间表面。',planeGraph([...original,...sketch],[],[{points:original,color:'#7555dc'},{points:sketch,color:'#27846e'}]),{originalArea:a*b,sketchArea:area,ratio:Math.SQRT2/4,yLength:b/2});}
 if(id==='b2-s-cylinder-net'){const h=3*t,r=2,width=2*Math.PI*r,area=2*Math.PI*r*h+2*Math.PI*r*r,removed=(t-1)*4*Math.PI*r*r,rectangle=[O,p(width,0,'2πr'),p(width,h,'侧面'),p(0,h,'h')];return result(t===1?0:1,`外露面积=${f(area/Math.PI)}π；叠层接触扣除=${f(removed/Math.PI)}π`,'外露S=2πr·(3t)+2πr²，r=2','图示合并圆柱外表面的展开：矩形只代表圆柱侧面，上下另有两个圆底。每处接触需扣两个圆面；一般棱柱完整展开不能说成一个矩形。',planeGraph(rectangle,[],[{points:rectangle,color:'#27846e'}],{extent:Math.max(width+1,h+5),circles:[{a:width/2,b:h+r,r},{a:width/2,b:-r,r}]}),{area,removed,h,r});}
 if(id==='b2-s-cone-net'){const r=2,angle=360*r/t,arc=Array.from({length:65},(_,i)=>p(t*Math.cos(rad(angle*i/64)),t*Math.sin(rad(angle*i/64)))),area=Math.PI*r*t;return result(angle<180?0:angle===180?1:2,`扇形圆心角≈${f(angle)}°；侧面积=${2*t}π`,'弧长2πr，扇形半径l ⇒ θ=360°r/l','图中展开扇形的半径是母线l，不是底半径r或圆锥高；本实验l>r，圆锥非退化。完整表面积还要加底面πr²。',planeGraph([O,...arc],[[O,arc[0]],[O,arc.at(-1)]],[{points:[O,...arc],color:'#27846e'}]),{angle,area,height:Math.sqrt(t*t-r*r),arcLength:2*Math.PI*r});}
 if(id==='b2-s-insphere'){const curves=[{points:ring(2,-t/2)},{points:ring(2,t/2)},{points:ring(2,0),color:'#c57e27'},{points:Array.from({length:65},(_,i)=>[2*Math.cos(i*Math.PI/32),0,2*Math.sin(i*Math.PI/32)]),color:'#c57e27'}],segments=[[[2,0,-t/2],[2,0,t/2]],[[-2,0,-t/2],[-2,0,t/2]]],ballVolume=32*Math.PI/3,cylinderVolume=4*Math.PI*t;return result(t<4?0:t===4?1:2,`球体积32π/3；圆柱体积${4*t}π；${t<4?'装不下':t===4?'端面恰切':'高度有余'}`,'球半径R，最小外切圆柱r=R、h=2R；V球/V柱=2/3','轴截面把空间切接变为圆与矩形问题。只有h≥2R才容纳整球；体积大小不是充分容纳条件，必须核对半径和高度。',space([P([0,0,0],'O'),P([0,0,2],'球顶')],segments,[],curves),{ballVolume,cylinderVolume,fits:t>=4});}
 if(id==='b2-s-parallel-line')return result(t===0?0:1,`绿线高度${t}；${t?'无公共点':'整条线在平面内'}`,'a⊄α、b⊂α、a∥b ⇒ a∥α','紫线b在平面内。若漏掉平面外条件，t=0给反例：a与b平行却包含于平面。线面平行性质须用另一个过线平面与原面的交线。',space([P([0,1,t],'a'),P([0,0,0],'b')],[[[-3,1,t],[3,1,t],'#27846e'],[[-3,0,0],[3,0,0]]],[face(base)]),{height:t});
 if(id==='b2-s-parallel-plane'){const angle=rad(t),other=[[-3,-2],[3,-2],[3,2],[-3,2]].map(([x,y])=>[x,y*Math.cos(angle),1+y*Math.sin(angle)]);return result(t===0?0:1,`两面${t===0?'平行':'相交'}；绿面只有x方向线始终平行底面`,'面内两条相交直线都平行另一面 ⇒ 两面平行','只检查一条不够；转角非0时第二方向带竖直分量，两平面无限延伸后相交。面面平行性质给第三平面截线平行。',space([P([0,0,1],'Q')],[[[-3,0,1],[3,0,1],'#27846e'],[[0,-2*Math.cos(angle),1-2*Math.sin(angle)],[0,2*Math.cos(angle),1+2*Math.sin(angle)],'#c57e27']],[face(base),face(other,'#27846e')]),{parallel:t===0});}
 if(id==='b2-s-perp-line'){const endpoint=[0,3*Math.sin(rad(t)),3*Math.cos(rad(t))];return result(t===0?0:1,`与x轴始终垂直；与y轴${t===0?'也垂直':'不垂直'}`,'垂直于面内两条相交直线 ⇒ 线面垂直','“两条相交”不能替换为“两条平行”。本例杆始终垂直x轴，却可倾斜甚至落在y轴上，只有同时垂直y轴才垂直整个平面。',space([P([0,0,0],'O'),P(endpoint,'P')],[[[0,0,0],endpoint,'#27846e'],[[-3,0,0],[3,0,0]],[[0,-3,0],[0,3,0],'#c57e27']],[face(base)]),{perpendicular:t===0});}
 if(id==='b2-s-perp-plane'){const m=advancedModel('s-planes',{beta:t,h:0});return {...m,answer:t===90?1:0,formula:'一面经过另一面的垂线 ⇒ 两面垂直',explanation:'当t=90°时，绿面含z轴，z轴垂直底面，所以两面垂直。两面垂直时，一面内垂直公共交线x轴的线垂直另一面；任意面内直线不一定垂直另一面。'};}
 if(id==='b2-s-angle-distance'){const Q=[3*Math.cos(rad(t)),0,3*Math.sin(rad(t))],H=[Q[0],0,0],distance=Q[2];return result(t===90?0:1,`线面角${t}°，垂距PH≈${f(distance)}，OP=3`,'PH=OP sinθ；点面距离取垂线段，不取斜线OP','先作P到平面的垂足H，再用直角三角形OPH。θ=0°时OP在面内、距离0；θ=90°时射影退化为O点，按定义线面角90°。选学可用方向/法向量核对。',space([P([0,0,0],'O'),P(Q,'P'),P(H,'H')],[[[0,0,0],Q,'#27846e'],[[0,0,0],H,'#c57e27'],[Q,H,'#c57e27',true]],[face(base)]),{distance,angle:t});}
 if(id==='b2-s-dihedral'){const m=advancedModel('s-dihedral',{beta:t});return {...m,formula:'在两半平面内分别作垂直公共棱的射线，夹角为二面角平面角',explanation:'两射线都要垂直公共棱，张角可在[0°,180°]，不能把150°换成30°。0°/180°是边界重合/展平状态。选学法向量求角须按半平面方向判锐钝，不直接取绝对值。'};}
 throw new RangeError('未知必修二空间实验：'+id);
}
