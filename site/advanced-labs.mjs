import { dot3, vectorAngle, linePlaneAngle, pointPlaneDistance, skewDistance, project3, sphereSection, cubeSection, conicParameters, conicLine, parabolaPoint, focalChord } from './advanced-math.mjs';
const rad = d=>d*Math.PI/180;
const f = v=>Number((Math.abs(v)<1e-9?0:v).toFixed(3));
const result=(answer,status,formula,explanation,graph,measurements={})=>({answer,status,formula,explanation,graph,measurements});
const P=(p,label,color)=>({p,label,color});
const basePlane=[[-3,-3,0],[3,-3,0],[3,3,0],[-3,3,0]];
const face=(points,color='#7555dc')=>({points,color});
const space=(points=[],segments=[],faces=[],curves=[])=>{
  const coordinates=[...points.map(p=>p.p),...segments.flatMap(s=>s.slice(0,2)),...faces.flatMap(f=>f.points),...curves.flatMap(c=>c.points)];
  const extent=Math.max(4,...coordinates.map(p=>Math.hypot(...p)*1.1));
  return {space:{points,segments,faces,curves,extent}};
};
const ring=(r,z=0)=>Array.from({length:97},(_,i)=>[r*Math.cos(i*Math.PI/48),r*Math.sin(i*Math.PI/48),z]);
const rotate=(p,angle)=>{const a=rad(angle);return {x:p.x*Math.cos(a)-p.y*Math.sin(a),y:p.x*Math.sin(a)+p.y*Math.cos(a)};};
const ellipse=(a,b,angle=0)=>({points:Array.from({length:181},(_,i)=>rotate({x:a*Math.cos(i*Math.PI/90),y:b*Math.sin(i*Math.PI/90)},angle))});
const hyperbola=(a,b,extent=8,angle=0)=>[-1,1].map(sign=>({points:Array.from({length:161},(_,i)=>{const y=-extent+2*extent*i/160;return rotate({x:sign*a*Math.sqrt(1+y*y/(b*b)),y},angle);})}));
const parabola=(p,extent=6,angle=0)=>({points:Array.from({length:161},(_,i)=>{const y=(-1+2*i/160)*Math.sqrt(2*p*extent);return rotate({x:y*y/(2*p),y},angle);})});
const point=(p,label,color)=>({...p,label,color});
const triangle=(a,b,p)=>({points:[a,b,p],color:'#c57e27'});

export function advancedModel(id,v) {
  if(id==='s-vector') {
    const beta=rad(v.beta),u=[3,0,0],w=[3*Math.cos(beta),3*Math.sin(beta)/Math.sqrt(2),3*Math.sin(beta)/Math.sqrt(2)],dot=dot3(u,w);
    return result(Math.abs(dot)<1e-9?1:dot>0?0:2,`|u|=|v|=3；u·v≈${f(dot)}；β=${v.beta}°`,'u·v=|u||v|cosβ=9cosβ','长度与方向是两个量。转动视角只改变投影，不改变真实向量、点积或夹角。',space([P([0,0,0],'O'),P(u,'u'),P(w,'v','#27846e')],[[[0,0,0],u],[[0,0,0],w,'#27846e']]),{dot,angle:vectorAngle(u,w)});
  }
  if(id==='s-combine') {
    const a=[-2,0,1],b=[2,2,3],p=a.map((x,i)=>x+v.t*(b[i]-x));
    return result(v.t===0||v.t===1?0:v.t>0&&v.t<1?1:2,`P≈(${p.map(f).join(',')})；t=${v.t}`,'P=A+t(B−A)，线段上要求0≤t≤1','t=1/2给中点；参数超出[0,1]时在延长线上，不能算题设线段内存在。',space([P(a,'A'),P(b,'B'),P(p,'P','#c57e27')],[[a,b],[a,p,'#c57e27']]),{point:p});
  }
  if(id==='s-line-plane'||id==='s-elevation') {
    const phi=rad(v.phi),h=id==='s-elevation'?0:v.h,u=[Math.cos(phi),0,Math.sin(phi)],o=[0,0,h];
    const endpoints=[-3,3].map(t=>o.map((x,i)=>x+t*u[i]));
    const answer=id==='s-elevation'?(v.phi===0?0:v.phi===90?2:1):(v.phi===90?3:v.phi!==0?2:h===0?0:1);
    const projection=endpoints.map(([x,y])=>[x,y,0]);
    return result(answer,`线面角=${v.phi}°；与法向量锐夹角=${90-v.phi}°${id==='s-line-plane'?`；参考点高度=${h}`:''}`,'sinφ=|u·n|/(|u||n|)','紫色平面z=0，橙线为杆段的正投影；竖直时投影退化为H点。u·n=0还需排除直线包含在平面内。直线向两端无限延伸。',space([P(o,'P'),P([0,0,0],'H')],[[...endpoints,'#27846e'],[...projection,'#c57e27',true],[o,[0,0,0],'#c57e27',true]],[face(basePlane)]),{angle:linePlaneAngle(u,[0,0,1])});
  }
  if(id==='s-planes') {
    const b=rad(v.beta),offset=v.h,plane=[[-3,-2], [3,-2],[3,2],[-3,2]].map(([x,t])=>[x,t*Math.cos(b),offset+t*Math.sin(b)]);
    const answer=v.beta===0?(v.h===0?0:1):v.beta===90?3:2;
    return result(answer,`平面转角=${v.beta}°；参考点高度=${v.h}；${['重合','平行','一般相交','垂直'][answer]}`,'平行看法向量共线；垂直看n₁·n₂=0','半透明区域只是无限平面的示意范围。平面重合要排除后才能叫两平面平行。',space([P([0,0,offset],'Q')],[],[face(basePlane),face(plane,'#27846e')]));
  }
  if(id==='s-skew'||id==='s-acute-angle') {
    const degree=id==='s-skew'?v.alpha:v.beta,a=rad(degree),h=id==='s-skew'?v.h:1,q=[0,1,h],u=[Math.cos(a),Math.sin(a),0];
    const endpoints=[-3,3].map(t=>q.map((x,i)=>x+t*u[i])),angle=vectorAngle([1,0,0],u,true);
    const parallel=degree===0||degree===180,answer=id==='s-skew'?(parallel?0:h===0?1:2):(parallel?2:Math.abs(angle-90)<1e-9?1:0);
    return result(answer,`两线方向所成角≈${f(angle)}°${parallel?'；方向平行，不是异面线':id==='s-skew'?`；${h===0?'相交':'异面'}`:'；两线异面'}`,'cosθ=|u·v|/(|u||v|)','异面线不相交且不平行，所成角取锐角或直角。方向点积0只说明方向垂直，不能证明有交点。',space([P([0,0,0],'O'),P(q,'Q')],[[[-3,0,0],[3,0,0]], [...endpoints,'#27846e']]),{angle});
  }
  if(id==='s-dihedral'||id==='s-fold') {
    const fold=id==='s-fold',beta=fold?180-v.beta:v.beta,b=rad(beta),a=[0,2,0],p=[0,2*Math.cos(b),2*Math.sin(b)],plane=[[-2,0,0],[2,0,0],[2,p[1],p[2]],[-2,p[1],p[2]]];
    const answer=fold?(v.beta===0?0:v.beta===90?1:2):(beta<90?0:beta===90?1:2),distance=Math.hypot(...a.map((x,i)=>x-p[i]));
    return result(answer,`两垂棱射线夹角=${beta}°；跨板端点距离≈${f(distance)}${fold?`；折起角=${v.beta}°`:''}`,'cosβ=OA·OB/(|OA||OB|)，此处不取绝对值','公共棱是x轴。OA和OB都垂直棱，它们构成二面角的平面角。每块板内长度2保持不变，跨板距离变化；150°不能替换成30°。',space([P([0,0,0],'O'),P(a,'A'),P(p,'B')],[[[-3,0,0],[3,0,0],'#5d536d'],[[0,0,0],a],[[0,0,0],p,'#27846e'],[a,p,'#c57e27',true]],[face([[-2,0,0],[2,0,0],[2,2,0],[-2,2,0]]),face(plane,'#27846e')]),{angle:vectorAngle(a,p),distance});
  }
  if(id==='s-plane-distance') {
    const p=[v.h/3,2*v.h/3,2*v.h/3],n=[1,2,2],plane=[[-2,-2,3],[2,-2,1],[2,2,-3],[-2,2,-1]],d=pointPlaneDistance(p,n);
    return result(v.h===0?0:1,`P≈(${p.map(f).join(',')})；点面距离=${f(d)}`,'d=|x+2y+2z|/3','橙色PH沿法向量，是最短的垂线段。平面乘以常数时分子分母一起倍乘，距离不变。',space([P([0,0,0],'H'),P(p,'P')],[[[0,0,0],p,'#c57e27']],[face(plane)]),{distance:d});
  }
  if(id==='s-skew-distance') {
    const d=skewDistance([0,0,0],[1,0,0],[0,0,v.h],[0,1,0]);
    return result(v.h===0?0:1,`两线距离=${f(d)}；${v.h===0?'在O相交':'异面，橙段为公垂线'}`,'d=|(Q−P)·(u×v)|/|u×v|','u沿x轴、v沿y轴，公垂方向沿z轴。h=0时相交距离0；平行方向的另一个公式分支不能用零叉积作分母。',space([P([0,0,0],'P'),P([0,0,v.h],'Q')],[[[-3,0,0],[3,0,0]],[[0,-3,v.h],[0,3,v.h],'#27846e'],[[0,0,0],[0,0,v.h],'#c57e27']]),{distance:d});
  }
  if(id==='s-volume') {
    const a=v.a/2,h=v.h,bottom=[[-a,-a,0],[a,-a,0],[a,a,0],[-a,a,0]],top=bottom.map(p=>[p[0],p[1],h]),apex=[0,0,h],segments=[];
    for(let i=0;i<4;i++){segments.push([bottom[i],bottom[(i+1)%4]],[top[i],top[(i+1)%4],'#7555dc',true],[bottom[i],top[i],'#7555dc',true],[bottom[i],apex,'#27846e']);}
    const prism=v.a*v.a*h,pyramid=prism/3;
    return result(1,`S底=${f(v.a*v.a)}，h=${h}；V柱=${f(prism)}，V锥=${f(pyramid)}，比值=1/3`,'V柱=S底h；V锥=S底h/3','虚线是同底同高的柱体轮廓，绿色是锥体侧棱。高度是到底面垂直距离，不能用斜棱代替。',space([P(apex,'顶点')],segments,[face(bottom)]),{prism,pyramid});
  }
  if(id==='s-frustum') {
    const R=3,r=v.r,h=v.h,volume=Math.PI*h*(R*R+R*r+r*r)/3,slant=Math.hypot(h,R-r),segments=[];
    for(let i=0;i<4;i++){const t=i*Math.PI/2;segments.push([[R*Math.cos(t),R*Math.sin(t),0],[r*Math.cos(t),r*Math.sin(t),h],'#27846e']);}
    return result(r===0?0:r===R?2:1,`V≈${f(volume)}；母线l≈${f(slant)}；S侧≈${f(Math.PI*(R+r)*slant)}`,'V=πh(R²+Rr+r²)/3；l²=h²+(R−r)²','r=0为圆锥，r=R为圆柱，两者都是圆台体积公式的边界。表面积还要加上下底，不能只用侧面积。',space([P([0,0,0],'C₁'),P([0,0,h],'C₂')],segments,[],[{points:ring(R),color:'#7555dc'},{points:ring(r,h),color:'#27846e'}]),{volume,slant});
  }
  if(id==='s-section') {
    const section=sphereSection(3,v.z),curves=[{points:ring(3),color:'#aaa2b8'},{points:ring(3).map(([x,y])=>[x,0,y]),color:'#7555dc'},{points:ring(3).map(([x,y])=>[0,x,y]),color:'#aaa2b8'}];
    if(section.kind==='circle')curves.push({points:ring(section.radius,v.z),color:'#c57e27'});
    const points=[P([0,0,0],'球心'),P([0,0,v.z],section.kind==='empty'?'平面参考点':'截面中心')];
    return result({circle:0,point:1,empty:2}[section.kind],`球心距d=${Math.abs(v.z)}；${section.kind==='circle'?`截圆半径≈${f(section.radius)}，面积≈${f(Math.PI*section.radius**2)}`:section.kind==='point'?'只有一个切点':'无截面'}`,'r截²+d²=R²（先要求d≤R）','球心投影为截面圆心。平面过球心时得到最大截圆；球面上的几条经纬线只是帮助观察球形的辅助线。',space(points,[[[0,0,0],[0,0,v.z],'#c57e27',true]],[face(basePlane.map(p=>[p[0],p[1],v.z]),'#27846e')],curves),{radius:section.radius});
  }
  if(id==='s-cube-section') {
    const cut=cubeSection(2,v.t),answer={triangle:0,hexagon:1,point:2,none:3}[cut.kind];
    return result(answer,`平面x+y+z=${v.t}；${['三角形','六边形','一个点','没有截面'][answer]}；截面面积≈${f(cut.area)}`,'先与12条棱求交，再在同一面内连接相邻截点','正方体坐标范围[0,2]³。橙色顶点均在原棱上；t=3为过中心的正六边形，t=1为三角形。透视投影的形状不能直接用来判断真实边长。',space(cut.points.map((p,i)=>P(p,'P'+(i+1),'#c57e27')),cut.edges.map(e=>[...e,'#aaa2b8']),cut.points.length>=3?[face(cut.points,'#c57e27')]:[]),{area:cut.area,points:cut.points});
  }
  if(id==='s-unfold') {
    const arc=2*rad(v.alpha),width=4*Math.PI,a={x:-width/2,y:-1.5},b={x:-width/2+arc,y:1.5},length=Math.hypot(arc,3);
    return result(v.alpha===0?0:1,`展开横向距离≈${f(arc)}；最短侧面路径≈${f(length)}；侧高=3`,'L=√((rα)²+h²)，α用弧度','展开矩形宽2πr，这里r=2。只走侧面；α限制在0°到180°，选较短的环绕方向。横坐标原点的选取不影响距离。',{curves:[{points:[a,{x:width/2,y:-1.5},{x:width/2,y:1.5},{x:-width/2,y:1.5},a]}],points:[point(a,'A'),point(b,'B')],segments:[[a,b,'#c57e27']],extent:8,description:'圆柱侧面展开矩形及两点间最短直线段'},{length});
  }
  return conicModel(id,v);
}

function conicModel(id,v) {
  if(id==='e-point') {
    const t=rad(v.theta),p={x:5*Math.cos(t),y:3*Math.sin(t)},left={x:-4,y:0},right={x:4,y:0},dl=Math.hypot(p.x+4,p.y),dr=Math.hypot(p.x-4,p.y);
    return result(Math.abs(dl-dr)<1e-9?1:dl<dr?0:2,`PF左≈${f(dl)}，PF右≈${f(dr)}；和=${f(dl+dr)}`,'PF左+PF右=10=2a','点P=(5cosθ,3sinθ)满足椭圆方程。距离和不变，哪个焦点更近取决于P在哪一侧。',{curves:[ellipse(5,3)],points:[point(left,'F左'),point(right,'F右'),point(p,'P')],segments:[[left,p],[right,p,'#27846e']],description:'椭圆上的点到两个焦点的线段'},{sum:dl+dr});
  }
  if(id==='e-shape'||id==='h-shape') {
    const isEllipse=id==='e-shape',a=isEllipse?5:3,b=v.b,parameters=conicParameters(isEllipse?'ellipse':'hyperbola',a,b),axis=v.axis,e=parameters.e,threshold=isEllipse?0.8:Math.SQRT2;
    const focus=[-1,1].map(sign=>rotate({x:sign*parameters.c,y:0},axis));
    const asymptotes=[-1,1].map(sign=>axis===0?{A:sign*b,B:-a,C:0,color:'#c57e27',dash:true}:{A:sign*a,B:-b,C:0,color:'#c57e27',dash:true});
    return result(Math.abs(e-threshold)<1e-9?1:e<threshold?0:2,`a=${a}，b=${b}，c≈${f(parameters.c)}，e≈${f(e)}；焦点在${axis===0?'x':'y'}轴`,isEllipse?'c²=a²−b²；e=c/a':'c²=a²+b²；e=c/a','转动长轴/实轴时，焦点和方程一起转向。双曲线看正项，椭圆看较大分母；虚线是渐近线，并非双曲线的一部分。',{curves:isEllipse?[ellipse(a,b,axis)]:hyperbola(a,b,8,axis),lines:isEllipse?[]:asymptotes,points:focus.map((p,i)=>point(p,'F'+(i+1))),extent:isEllipse?6:8,description:`${axis===0?'x':'y'}轴焦点${isEllipse?'椭圆':'双曲线'}`},{...parameters});
  }
  if(id==='h-point') {
    const a=3,b=2,c=Math.sqrt(13),p={x:v.branch*a*Math.sqrt(1+v.t*v.t),y:b*v.t},left={x:-c,y:0},right={x:c,y:0},dl=Math.hypot(p.x+c,p.y),dr=Math.hypot(p.x-c,p.y);
    return result(v.branch===1?0:1,`PF左−PF右≈${f(dl-dr)}；差的绝对值=${f(Math.abs(dl-dr))}`,'|PF左−PF右|=6=2a','去掉绝对值时正负不同对应不同分支。焦距2√13大于6，满足非退化双曲线的定义条件。',{curves:hyperbola(a,b),points:[point(left,'F左'),point(right,'F右'),point(p,'P')],segments:[[left,p],[right,p,'#27846e']],extent:8,description:'双曲线两支和焦点距离差'},{difference:Math.abs(dl-dr)});
  }
  if(id==='p-definition') {
    const original=parabolaPoint(v.p,v.y),p=rotate(original,v.axis),focus=rotate({x:v.p/2,y:0},v.axis),foot=rotate({x:-v.p/2,y:v.y},v.axis),d=original.focalDistance;
    return result(0,`PF≈${f(d)}；到准线距离≈${f(d)}；焦点到准线距离=${v.p}`,'PF=d(P,准线)，p是焦点到准线距离','橙线PH垂直准线；紫色曲线与焦点、准线一起旋转。右/上/左/下开口依次为0°/90°/180°/270°。',{curves:[parabola(v.p,6,v.axis)],lines:[{A:Math.cos(rad(v.axis)),B:Math.sin(rad(v.axis)),C:v.p/2,color:'#27846e'}],points:[point(p,'P'),point(focus,'F'),point(foot,'H')],segments:[[p,focus],[p,foot,'#c57e27']],description:'四向抛物线上的点到焦点与准线等距'},{focalDistance:Math.hypot(p.x-focus.x,p.y-focus.y),directrixDistance:Math.hypot(p.x-foot.x,p.y-foot.y)});
  }
  if(id==='p-tangent') {
    const p=parabolaPoint(2,v.y),line={A:2,B:-p.y,C:2*p.x};
    return result(v.y===0?0:2,`切点T≈(${f(p.x)},${f(p.y)})；${v.y===0?'切线x=0，斜率不存在':`切线斜率≈${f(2/v.y)}`}`,'y₀y=2(x+x₀)','T必须在y²=4x上。纵坐标为0时公式仍给竖直切线，不必用斜率除以0。',{curves:[parabola(2)],lines:[{...line,color:'#27846e'}],points:[point(p,'T')],description:'抛物线上切点与切线'},{line,point:p});
  }
  if(id==='c-ellipse-triangle'||id==='c-hyperbola-triangle') {
    const ellipseMode=id==='c-ellipse-triangle',a=ellipseMode?5:3,b=ellipseMode?3:2,c=ellipseMode?4:Math.sqrt(13),p=ellipseMode?{x:a*Math.cos(rad(v.theta)),y:b*Math.sin(rad(v.theta))}:{x:a*Math.sqrt(1+v.t*v.t),y:b*v.t},left={x:-c,y:0},right={x:c,y:0};
    const angle=vectorAngle([left.x-p.x,-p.y,0],[right.x-p.x,-p.y,0]),area=c*Math.abs(p.y),half=rad(angle/2),formulaArea=ellipseMode?b*b*Math.tan(half):b*b/Math.tan(half);
    return result(ellipseMode?(v.theta===90?0:1):(v.t===0?0:1),`顶角θ≈${f(angle)}°；面积≈${f(area)}；公式值≈${f(formulaArea)}`,ellipseMode?'S=b²tan(θ/2)':'S=b²cot(θ/2)','θ是P处焦点三角形顶角，不是控制点的参数角。底边长2c、高|y|，可用c|y|独立核对面积。',{curves:ellipseMode?[ellipse(a,b)]:hyperbola(a,b),polygons:[triangle(left,right,p)],points:[point(left,'F₁'),point(right,'F₂'),point(p,'P')],segments:[[left,p],[right,p,'#27846e']],extent:ellipseMode?6:8,description:'焦点三角形及曲线'}, {area,formulaArea,angle});
  }
  if(id==='p-focal-chord') {
    const chord=focalChord(2,v.alpha),[a,b]=chord.points,T=chord.tangentIntersection;
    return result(v.alpha===90?0:1,`弦长≈${f(chord.length)}；x₁x₂≈${f(a.x*b.x)}；y₁y₂≈${f(a.y*b.y)}；T≈(${f(T.x)},${f(T.y)})`,'AB=4/sin²α；x₁x₂=1；y₁y₂=−4','F(1,0)，准线x=−1。两端切线的交点T位于准线上，且两条切线互相垂直。α=90°保留竖直焦点弦，不漏解。',{curves:[parabola(2,8)],lines:[{A:1,B:0,C:1,color:'#aaa2b8',dash:true},...[a,b].map(p=>({A:2,B:-p.y,C:2*p.x,color:'#27846e'}))],points:[point(a,'A'),point(b,'B'),point({x:1,y:0},'F'),point(T,'T')],segments:[[a,b,'#c57e27']],extent:8,description:'抛物线焦点弦、两端切线与准线'},{...chord});
  }
  if(id==='c-ellipse-line'||id==='c-area') {
    const areaMode=id==='c-area',t=areaMode?3*Math.sin(rad(v.theta)):v.t,line={A:0,B:1,C:-t},cut=conicLine({xx:1/25,yy:1/9},line),area=Math.abs(t)*(cut.chord||0)/2;
    const answer=areaMode?(v.theta===0||v.theta===90?0:v.theta===45?1:2):(cut.points.length===2?0:cut.points.length===1?1:2);
    return result(answer,`t≈${f(t)}；${cut.points.length}个公共点；弦长${cut.chord===null?'不存在':'≈'+f(cut.chord)}；三角形面积≈${f(area)}`,areaMode?'S=5|t|√(1−t²/9)，最大15/2':'L=10√(1−t²/9)，|t|<3才有实弦','直径弦长最大，但经过O使三角形面积0。相切时只剩一个点，不是有两个不同端点的实弦。',{curves:[ellipse(5,3)],lines:[{...line,color:'#27846e'}],points:cut.points.map((p,i)=>point(p,i?'B':'A')),polygons:cut.points.length===2?[triangle(cut.points[0],cut.points[1],{x:0,y:0})]:[],segments:cut.points.length===2?[[...cut.points,'#c57e27']]:[],description:'水平直线与椭圆公共点和三角形'}, {area,...cut});
  }
  if(id==='c-hyperbola-line') {
    const k=2*v.s/3,m=v.m,line={A:k,B:-1,C:m},cut=conicLine({xx:1/9,yy:-1/4},line),A=1/9-k*k/4,B=-k*m/2,C=-m*m/4-1,delta=B*B-4*A*C;
    const extent=Math.max(8,...cut.points.map(p=>Math.max(Math.abs(p.x),Math.abs(p.y))+1));
    return result({secant:0,tangent:1,linear:2,none:3}[cut.kind],`k≈${f(k)}，m=${m}；二次系数A≈${f(A)}；${cut.kind==='linear'?'降次：一个有限交点':cut.kind==='none'?'没有交点':cut.kind==='tangent'?'一个切点':'两个交点'}`,'先A≠0，再用Δ；A=0必须解一次/常数方程','斜率等于渐近线±2/3时二次项消失；平移后的直线可能只交一点，这不等于相切。图会随交点范围缩放。',{curves:hyperbola(3,2,extent),lines:[{...line,color:'#27846e'}],points:cut.points.map((p,i)=>point(p,'P'+(i+1))),extent,description:'双曲线与含参直线，含渐近线方向降次'}, {...cut,A,delta});
  }
  if(id==='c-ellipse-midpoint'||id==='c-parabola-midpoint') {
    const ellipseMode=id==='c-ellipse-midpoint',m={x:v.x,y:v.y},center=ellipseMode&&v.x===0&&v.y===0;
    const line=ellipseMode?(center?{A:0,B:1,C:0}:{A:v.x/25,B:v.y/9,C:-v.x*v.x/25-v.y*v.y/9}):{A:2,B:-v.y,C:-2*v.x+v.y*v.y};
    const cut=conicLine(ellipseMode?{xx:1/25,yy:1/9}:{xx:0,yy:1,D:-4,F:0},line),answer=center?3:cut.points.length===2?0:cut.points.length===1?1:2;
    return result(answer,center?'中心：任一直径均可，图中仅示例一条':`${cut.points.length===2?'存在真实弦':cut.points.length===1?'退化为切点':'不存在真实弦'}；M(${v.x},${v.y})`,ellipseMode?'x₀(x−x₀)/25+y₀(y−y₀)/9=0':'2(x−x₀)−y₀(y−y₀)=0','先由点差法给方向，再回到原曲线求交检验。没有两个不同端点就不能称真实弦；斜率不存在时保留无除法方程。',{curves:ellipseMode?[ellipse(5,3)]:[parabola(2,7)],lines:[{...line,color:'#27846e'}],points:[point(m,'M','#c57e27'),...cut.points.map((p,i)=>point(p,i?'B':'A'))],segments:cut.points.length===2?[[...cut.points,'#c57e27']]:[],extent:ellipseMode?6:7,description:'给定中点的候选弦线与原曲线交点'}, {...cut,midpoint:m});
  }
  if(id==='c-slope-product') {
    const t=rad(v.theta),p={x:5*Math.cos(t),y:3*Math.sin(t)},a={x:-5,y:0},b={x:5,y:0},k1=p.y/(p.x+5),k2=p.y/(p.x-5);
    return result(1,`kPA≈${f(k1)}，kPB≈${f(k2)}；乘积≈${f(k1*k2)}`,'kPA·kPB=−9/25=−0.36','在曲线方程中用y²=−(9/25)(x²−25)消参，得到一般证明；P取长轴端点时分母为0，须排除。',{curves:[ellipse(5,3)],points:[point(a,'A'),point(b,'B'),point(p,'P')],segments:[[a,p],[b,p,'#27846e']],description:'椭圆上动点与长轴两端点连线'},{product:k1*k2});
  }
  if(id==='c-fixed') {
    const line={A:1/5,B:v.lambda/3,C:-1},cut=conicLine({xx:1/25,yy:1/9},line);
    return result(v.lambda===0?1:0,`λ=${v.lambda}；${cut.points.length}个公共点；F(5,0)始终在线上`,'(x/5−1)+λy/3=0 ⇒ F(5,0)','常数部分和参数部分同时为0给定点。λ=0时是竖直切线x=5；其他参数对应实弦，原直线始终有效。',{curves:[ellipse(5,3)],lines:[{...line,color:'#27846e'}],points:[point({x:5,y:0},'F'),...cut.points.map((p,i)=>point(p,'P'+(i+1)))],description:'始终经过椭圆顶点的直线族'},{...cut});
  }
  throw new Error('未知实验：'+id);
}

export function spaceSvg(scene,view) {
  const scale=252/scene.extent, screen=p=>{const q=project3(p,view.yaw,view.pitch);return [300+q.x*scale,330-q.y*scale];};
  const path=points=>points.map((p,i)=>`${i?'L':'M'}${screen(p).join(' ')}`).join('');
  const axes=[[[0,0,0],[4,0,0]],[[0,0,0],[0,4,0]],[[0,0,0],[0,0,4]]];
  const merged=[];
  for(const p of scene.points){const same=merged.find(q=>Math.hypot(...p.p.map((v,i)=>v-q.p[i]))<1e-9);if(same)same.label+='/'+p.label;else merged.push({...p});}
  return `<svg class="module-graph space-graph" data-space="true" viewBox="0 0 600 600" role="img" aria-label="可旋转的空间几何正投影视图"><rect width="600" height="600" rx="18" fill="#fcfbff"/><defs><clipPath id="space-clip"><rect x="30" y="30" width="540" height="540"/></clipPath></defs><g clip-path="url(#space-clip)">${scene.faces.map(face=>`<path d="${path(face.points)}Z" fill="${face.color}" fill-opacity=".12" stroke="${face.color}" stroke-width="1.5"/>`).join('')}${axes.map(a=>`<path d="${path(a)}" fill="none" stroke="#aaa5b7" stroke-width="1.4"/>`).join('')}${scene.curves.map(c=>`<path d="${path(c.points)}" fill="none" stroke="${c.color||'#7555dc'}" stroke-width="2.5"/>`).join('')}${scene.segments.map(([p,q,color,dash])=>`<path d="${path([p,q])}" fill="none" stroke="${color||'#7555dc'}" stroke-width="3" ${dash?'stroke-dasharray="7 6"':''}/>`).join('')}${merged.map(p=>{const [x,y]=screen(p.p);return `<circle cx="${x}" cy="${y}" r="5" fill="${p.color||'#7555dc'}"/><text x="${x+9}" y="${y-10}">${p.label}</text>`;}).join('')}</g>${axes.map((a,i)=>{const [x,y]=screen(a[1]);return `<text x="${x+8}" y="${y+8}">${['x','y','z'][i]}</text>`;}).join('')}<text x="35" y="570">空间投影 · 真实数值见下方</text></svg>`;
}
