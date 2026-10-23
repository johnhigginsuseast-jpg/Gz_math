import { control, lab, note, example, quiz } from './lesson-data.mjs';
import { solidLessons } from './solid-course.mjs';
import { conicLessons } from './conic-course.mjs';
import { bookLessons } from './book-course.mjs';
import { book2Lessons } from './book2-course.mjs';

const lineLessons = [
  {
    id: 'line', title: '直线的方程', subtitle: '倾斜角、斜率与五类方程', symbol: '↗',
    scene: '一条登山步道经过地图上的两个营地。地图中横向走多少、纵向升多少，能决定步道的方向；如果两个营地在同一条竖线上呢？',
    sceneQ: '你猜：所有直线都能写成 y=kx+b 吗？', sceneOptions: ['都可以', '可能有例外'],
    labs: [
      lab('angle', '转动步道，观察斜率', '倾斜角改变后，斜率会属于哪一类？先选一个猜想，再验证。', ['正数', '零', '不存在', '负数'], [control('alpha', '倾斜角 α（度）', 0, 179, 1, 30)], [['水平', { alpha: 0 }], ['竖直', { alpha: 90 }], ['向右下降', { alpha: 135 }]]),
      lab('points', '两点确定一条直线', '固定 A(-2,-1)，移动 B。你猜得到的直线是哪一种？', ['一般斜线', '水平线', '竖直线'], [control('x', 'B 的横坐标', -4, 4, 1, 3), control('y', 'B 的纵坐标', -4, 4, 1, 2)], [['同横坐标', { x: -2, y: 2 }], ['同纵坐标', { x: 3, y: -1 }], ['普通两点', { x: 3, y: 2 }]]),
    ],
    notes: [
      note('倾斜角与斜率', '0°≤α<180°；k=tanα（α≠90°）', '向右上升为正斜率，水平为0，向右下降为负斜率；90°时斜率不存在，直线方程仍存在。两点不同且x₁≠x₂时，k=(y₂-y₁)/(x₂-x₁)。'),
      note('点斜式与斜截式', 'y-y₀=k(x-x₀)；y=kx+b', '已知一点和斜率选点斜式；已知斜率和纵截距选斜截式。二者都不能表示竖直直线x=x₀。截距是坐标，可正可负，不是距离。'),
      note('两点式与稳妥写法', '(y-y₁)(x₂-x₁)=(x-x₁)(y₂-y₁)', '通常两点式写成两个分式相等，要求横、纵坐标差均不为0。这里交叉相乘的形式可处理水平和竖直线，但两点不能重合。'),
      note('截距式', 'x/a+y/b=1（ab≠0）', 'a、b分别为横、纵截距。过原点或平行坐标轴时，不能用这种截距式；不要把“截距相等”直接等同于a=b≠0而漏掉过原点的情况。'),
      note('一般式与向量', 'Ax+By+C=0（A²+B²>0）', '一般式可表示所有直线。法向量n=(A,B)，方向向量u=(B,-A)，n·u=0；斜率存在时k=-A/B，B=0时x=-C/A。方向向量也可取两点坐标差或(1,k)。'),
    ],
    examples: [
      example('过两点求方程', '求过A(1,2)、B(3,6)的直线方程。', '横坐标不同，斜率存在：k=(6-2)/(3-1)=2。', '用点斜式：y-2=2(x-1)。', '化为一般式：2x-y=0；两点代入均成立。'),
      example('竖直线不能漏', '求过A(2,-1)、B(2,4)的直线。', '两点横坐标相同、纵坐标不同，图上是一条竖直线。', '斜率不存在，不能把分母0代入斜率公式。', '方程是x=2，即x-2=0；一般式依然适用。'),
      example('截距式的适用条件', '直线与两轴分别交于A(-3,0)、B(0,2)，求方程。', '两截距均非0，a=-3、b=2。', '写成x/(-3)+y/2=1。', '乘6得-2x+3y-6=0，负截距保留负号。'),
    ],
    quizzes: [
      quiz('倾斜角135°的直线斜率是？', ['1', '-1', '不存在'], 1, 'tan135°=-1；倾斜角在90°与180°之间时斜率为负。'),
      quiz('经过(2,1)、(2,5)的直线是？', ['y=2', 'x=2', 'y=2x+1'], 1, '同横坐标且两点不同，直线竖直，方程x=2。'),
      quiz('哪条直线不能用 x/a+y/b=1（ab≠0）表示？', ['x+y=2', '2x-y=3', 'y=2x'], 2, 'y=2x过原点，两截距都是0，截距式不适用。'),
      quiz('3x-4y+2=0的一组法向量和方向向量是？', ['(3,-4)与(4,3)', '(3,4)与(4,3)', '(4,3)与(3,4)'], 0, '法向量取系数(3,-4)，与(4,3)数量积12-12=0。'),
      quiz('一般式Ax+By+C=0表示直线的条件是？', ['A、B都非0', 'A、B不同时为0', 'C必须非0'], 1, '允许水平线或竖直线；A=B=0则是空集或整个平面，不能表示直线。'),
    ],
  },
  {
    id: 'lines', title: '两直线的位置关系与距离', subtitle: '相交、平行、重合、垂直与距离', symbol: '⋈',
    scene: '城市规划中，两条道路可能交叉，也可能平行。图纸上两条式子看起来不同，它们会不会其实画出了同一条路？',
    sceneQ: '把一条直线方程两边同时乘以-2，会得到另一条平行线吗？', sceneOptions: ['会，式子不同了', '不会，仍是同一条线'],
    labs: [
      lab('relation', '旋转、平移第二条道路', '紫线固定为y=x。你猜绿色直线与它是什么关系？', ['普通相交', '平行', '重合', '垂直'], [control('alpha', '第二条线的倾斜角（度）', 0, 179, 1, 45), control('offset', '沿法向量平移的有向量 s', -3, 3, 0.5, 2)], [['平行', { alpha: 45, offset: 2 }], ['重合', { alpha: 45, offset: 0 }], ['垂直', { alpha: 135, offset: 0 }], ['普通相交', { alpha: 90, offset: 1 }]]),
      lab('distance', '量一量垂直距离', 'P(2,3)固定，绿线y=t上下移动。你猜P位于绿线的哪一侧？', ['在线上', '上方', '下方'], [control('t', '绿线高度 t', -4, 4, 0.5, 1)], [['经过P', { t: 3 }], ['下移', { t: -1 }], ['上移', { t: 4 }]]),
    ],
    notes: [
      note('先分清平行与重合', 'Δ=A₁B₂-A₂B₁', '每条线先保证A、B不同时为0。Δ≠0时唯一相交；Δ=0时，再看A₁C₂-A₂C₁与B₁C₂-B₂C₁：二者都为0是重合，否则平行。避免系数比出现除以0。斜率存在时，k相同且b不同才是平行。'),
      note('垂直的通用条件', 'A₁A₂+B₁B₂=0', '两法向量垂直时两直线也垂直，含水平与竖直线。只有两条斜率都存在时，才能用k₁k₂=-1。相交点通过联立方程求得并代入检验。'),
      note('点到直线距离', 'd=|Ax₀+By₀+C|/√(A²+B²)', '距离取垂线段长度。分子必须取绝对值；方程整体倍乘后分子分母同步变化，距离不变。垂足H=P-[(Ax₀+By₀+C)/(A²+B²)](A,B)。'),
      note('平行线距离', 'd=|C₁-C₂|/√(A²+B²)', '此式要求两条方程的x、y系数已经统一为同一个A、B。不能直接相减未统一的常数；重合时距离0，相交直线的集合最小距离也是0。'),
      note('中点与分点', 'M=((x₁+x₂)/2,(y₁+y₂)/2)', '设向量AP=λ·PB，则P=(A+λB)/(1+λ)，λ≠-1；λ>0内分，λ<0外分（须满足题目的点位条件）。也可设P=A+t(B-A)，线段内t∈[0,1]。'),
    ],
    examples: [
      example('排除重合', '判断x-2=0与-2x+4=0的位置关系。', '第二式除以-2，得到x-2=0。', '两个方程表示相同点集，不能只因为Δ=0就说平行。', '结论：重合，有无数公共点，距离0。'),
      example('水平与竖直线', '求x=2与y=3的交点及所成角。', '联立得交点(2,3)。', '法向量分别(1,0)、(0,1)，数量积0。', '因此垂直，所成角90°；不能使用不存在的斜率乘积。'),
      example('平行线距离先统一', '求3x+4y-5=0与6x+8y+10=0的距离。', '第二式除以2：3x+4y+5=0。', '统一A=3、B=4后，d=|-5-5|/√25。', '距离为2；若直接用原常数相减会出错。'),
      example('内分与中点', 'A(0,0)、B(6,3)，P满足AP:PB=2:1且在线段AB内，求P。', '取λ=2，P=(A+2B)/3。', '得P(4,2)，中点另为M(3,1.5)。', 'AP为AB的2/3，符合2:1；分点与中点不要混淆。'),
    ],
    quizzes: [
      quiz('x+2y-3=0与2x+4y-6=0的关系是？', ['平行', '重合', '垂直'], 1, '第二式整体是第一式的2倍，所有点相同。'),
      quiz('x=1与y=-2的关系是？', ['垂直', '平行', '重合'], 0, '竖直与水平直线垂直，一般式系数数量积为0。'),
      quiz('P(0,0)到3x+4y-10=0的距离是？', ['10', '5', '2'], 2, '|-10|/√(9+16)=2。'),
      quiz('x+y=0与2x+2y-4=0之间的距离是？', ['2', '√2', '4'], 1, '第二式除以2得到x+y-2=0，距离2/√2=√2。'),
      quiz('两条有效直线Δ≠0，则它们？', ['必垂直', '必有唯一交点', '可能平行'], 1, '系数行列式非0，联立方程有唯一解；垂直还需点积条件。'),
      quiz('A(0,0)、B(6,3)，AP:PB=2:1且P在AB内，P为？', ['(3,1.5)', '(2,1)', '(4,2)'], 2, 'P=(A+2B)/3=(4,2)，不是中点。'),
    ],
  },
  {
    id: 'circle', title: '圆的方程', subtitle: '圆心、半径、配方与点圆关系', symbol: '◯',
    scene: '喷泉周围等距离安装灯带。地图上的每盏灯到喷泉中心距离相同，这个条件能写成一个方程吗？如果算出的“半径平方”是负数，又意味着什么？',
    sceneQ: '只要有x²+y²，方程就一定表示一个圆吗？', sceneOptions: ['一定', '还要检查其他条件'],
    labs: [
      lab('complete', '配方后，圆还存在吗？', '改变一般方程的系数。你猜当前方程表示什么？', ['一个圆', '一个点', '没有实点'], [control('D', 'x项系数 D', -6, 6, 1, -2), control('E', 'y项系数 E', -6, 6, 1, 4), control('F', '常数项 F', -8, 8, 1, -4)], [['圆', { D: -2, E: 4, F: -4 }], ['退化为点', { D: -2, E: 4, F: 5 }], ['没有实点', { D: -2, E: 4, F: 6 }]]),
      lab('point-circle', '一盏灯在圆内还是圆外？', '灯带圆心C(1,-1)、半径2，移动P。你猜P的位置？', ['圆内', '圆上', '圆外'], [control('x', '点P的横坐标（纵坐标固定为-1）', -3, 5, 0.5, 2)], [['圆内', { x: 1 }], ['圆上', { x: 3 }], ['圆外', { x: 4 }]]),
    ],
    notes: [
      note('从距离定义到标准式', '(x-a)²+(y-b)²=r²，r>0', '圆心C(a,b)，半径r。圆是平面内到定点的距离等于正数r的所有点的集合。读圆心注意括号内的减号：x+2对应a=-2。'),
      note('一般方程与配方', 'x²+y²+Dx+Ey+F=0', '圆心(-D/2,-E/2)，r²=(D²+E²-4F)/4。r²>0才是圆；r²=0只一个点；r²<0没有实点。二次项系数须相等且非0，没有xy项，先归一化再判断。'),
      note('求圆方程的两条路', '已知圆心半径用标准式；三个不共线点可用一般式', '代入三个不共线点解D、E、F，再验证r²>0。以A、B为直径端点时，圆心是AB中点、半径为|AB|/2；也可用(P-A)·(P-B)=0。三个共线点不能确定一个圆。'),
      note('点与圆的位置关系', 'PC<r内；PC=r上；PC>r外', '也可比较PC²与r²，避免不必要的开方。代入标准式后，左边减r²的值负/零/正，分别对应内/上/外。'),
    ],
    examples: [
      example('配方识别圆', '把x²+y²-2x+4y-4=0化为标准式。', '分别配方：x²-2x=(x-1)²-1，y²+4y=(y+2)²-4。', '移常数得(x-1)²+(y+2)²=9。', '圆心(1,-2)、半径3；半径是3而不是9。'),
      example('由直径求圆', 'A(-1,2)、B(3,2)为直径端点，求圆方程。', '圆心为中点C(1,2)。', '|AB|=4，所以半径r=2。', '标准式(x-1)²+(y-2)²=4；可代入A、B检验。'),
      example('三点定圆', '圆过O(0,0)、A(2,0)、B(0,2)，求方程。', '三点不共线，设x²+y²+Dx+Ey+F=0。', '代入O得F=0；代入A、B得D=E=-2。', '得(x-1)²+(y-1)²=2，r²=2>0。'),
    ],
    quizzes: [
      quiz('(x+2)²+(y-1)²=9的圆心、半径是？', ['(2,-1)，3', '(-2,1)，3', '(-2,1)，9'], 1, '与(x-a)²+(y-b)²=r²对照，a=-2、b=1、r=3。'),
      quiz('x²+y²-2x+4y+5=0表示？', ['圆', '一个点', '没有实点'], 1, '配方为(x-1)²+(y+2)²=0，只表示(1,-2)。'),
      quiz('x²+y²+1=0表示？', ['单位圆', '原点', '没有实点'], 2, '两个平方和不能为-1，不是实圆。'),
      quiz('P(4,0)相对圆x²+y²=9的位置是？', ['圆内', '圆上', '圆外'], 2, 'OP²=16>9，P在圆外。'),
      quiz('关于“三点确定圆”，哪项正确？', ['任意三点都能定圆', '三个不同且不共线的点唯一确定圆', '三个共线点确定无数圆'], 1, '三个不同共线点不能同时在一个圆上；不共线才唯一确定。'),
    ],
  },
  {
    id: 'line-circle', title: '直线与圆的位置关系', subtitle: '已有探究课：位置、弦长、最值、动直线、切线', symbol: '⊘', legacy: true,
  },
  {
    id: 'circles', title: '圆与圆的位置关系', subtitle: '圆心距、内外切与公共弦', symbol: '◎',
    scene: '两座基站的覆盖边界都是圆。移动其中一座基站，两条边界会有几个交点？小圆整个落在大圆内部时，是否一定有交点？',
    sceneQ: '两圆圆心重合且半径相等时，它们是内切吗？', sceneOptions: ['是，满足d=|r₁-r₂|', '不是，应当单独判断重合'],
    labs: [
      lab('two-circles', '移动圆心，改变半径', '圆心距与半径改变后，你猜两圆是什么关系？', ['外离', '外切', '相交', '内切', '内含（不同心）', '同心不等圆', '重合'], [control('d', '圆心距 d', 0, 6, 0.5, 3), control('r1', '紫圆半径 r₁', 1, 3, 0.5, 3), control('r2', '绿圆半径 r₂', 1, 3, 0.5, 1)], [['外离', { d: 5, r1: 3, r2: 1 }], ['外切', { d: 4, r1: 3, r2: 1 }], ['相交', { d: 3, r1: 3, r2: 1 }], ['内切', { d: 2, r1: 3, r2: 1 }], ['内含', { d: 1, r1: 3, r2: 1 }], ['同心', { d: 0, r1: 3, r2: 1 }], ['重合', { d: 0, r1: 3, r2: 3 }]]),
    ],
    notes: [
      note('先看圆心是否相同', 'd=0：r₁=r₂重合；r₁≠r₂同心不等圆', '重合有无数公共点；同心不等圆无公共点。不能把d=|r₁-r₂|=0套进“内切”。同心不等圆也是包含关系的特殊情况，本课单列以便辨认。'),
      note('两条临界线索', 's=r₁+r₂；t=|r₁-r₂|', 'd>s外离，d=s外切，t<d<s相交，0<d=t内切，0<d<t内含。依次对应0、1、2、1、0个公共点。相切必须分内切和外切。'),
      note('公共弦所在直线', 'F₁-F₂=0（两个一般方程均先归一化）', '相减消去x²+y²，得到根轴。两圆相交时它是公共弦所在直线，且垂直连心线；外离时根轴可能存在，但没有真实公共弦。重合时相减得0=0，不能当作唯一公共弦。'),
      note('公共弦长与圆系', 'L=2√(r₁²-h²)', 'h是第一圆心到公共弦直线的距离。F₁+λ(F₂-F₁)=0经过公共交点；还要检验结果为实圆。若用F₁+λF₂=0，λ=-1可能退化为根轴，不能仍称圆。圆与直线的圆系见综合方法。'),
    ],
    examples: [
      example('内切还是相交', '两圆半径3和1，圆心距2，判断位置关系。', '和s=4，差t=2，圆心距d=2。', 'd=t>0，所以内切，有一个公共点。', '若改为d=3，则2<3<4，相交；若d=0，则同心不等圆。'),
      example('公共弦求法', '圆x²+y²=9与(x-4)²+y²=9的公共弦长是多少？', '两圆圆心距4，半径均3，0<4<6所以相交。', '方程相减得8x-16=0，即公共弦所在直线x=2。', '圆心到弦距离2，L=2√(9-4)=2√5。'),
      example('参数与位置关系', '半径3和1，两圆心分别O(0,0)、C(t,0)，何时相切？', '圆心距为|t|，不能直接用t作距离。', '外切|t|=4；内切|t|=2。', 't=±4或±2，共四个参数值；t=0同心，不相切。'),
    ],
    quizzes: [
      quiz('两圆半径3、1，圆心距5，它们？', ['外离', '外切', '内含'], 0, '5>3+1，外离，无公共点。'),
      quiz('两圆半径3、1，圆心距4，它们？', ['相交', '外切', '内切'], 1, 'd=r₁+r₂=4，外切一个公共点。'),
      quiz('两圆半径3、1，圆心距2，它们？', ['内切', '外切', '同心'], 0, 'd=|3-1|=2>0，内切。'),
      quiz('两个半径都是3、圆心相同的圆有几个公共点？', ['0', '1', '无数个'], 2, '它们重合，不能套内切的单点结论。'),
      quiz('两圆相减得到一条直线，就一定存在公共弦吗？', ['一定', '还需确认两圆相交', '只能在相切时有弦'], 1, '相减得到根轴；两圆相交才有两端点构成真实公共弦。'),
      quiz('x²+y²=9与(x-4)²+y²=9的公共弦长为？', ['4', '2√5', '6'], 1, '公共弦x=2，半弦长√(9-4)=√5。'),
    ],
  },
  {
    id: 'methods', title: '对称、定点、圆系与轨迹', subtitle: '用几何方法连接方程与综合题', symbol: '✦',
    scene: '巡检员从A走到河岸边补水，再去B。怎样选补水点路程最短？这类问题看似在算长度，常常只需要作一次对称。方程中的参数变化，也能留下始终不动的点。',
    sceneQ: '在一条直线上选点使两段路程和最短，先作对称有帮助吗？', sceneOptions: ['可能把折线变直线', '只会增加计算'],
    labs: [
      lab('reflection', '把折线拉直', 'A(-3,2)、B(2,3)，M在x轴上。你猜当前M已经让总路程最短了吗？', ['已达到最短', '还没有'], [control('t', '岸边点 M 的横坐标', -5, 5, 0.5, 1)], [['最短位置', { t: -1 }], ['向左试试', { t: -3 }], ['向右试试', { t: 2 }]]),
      lab('fixed', '参数在变，定点不动', '转动直线(x+y-2)+λ(x-y)=0。你猜当前直线是哪一种？', ['一般斜线', '竖直线', '水平线'], [control('lambda', '参数 λ', -3, 3, 0.5, 0)], [['竖直', { lambda: 1 }], ['水平', { lambda: -1 }], ['斜线', { lambda: 0 }]]),
      lab('family', '经过同一对点的圆', '圆系x²+y²-9+λ(x-1)=0。你猜当前圆心在原点哪一侧？', ['左侧', '原点', '右侧'], [control('lambda', '圆系参数 λ', -4, 4, 0.5, 0)], [['原圆 λ=0', { lambda: 0 }], ['向左', { lambda: 3 }], ['向右', { lambda: -3 }]]),
      lab('locus', '距离比画出的轨迹', 'A(-2,0)、B(2,0)，动点P满足PA/PB=λ。你猜轨迹类型？', ['圆', '直线'], [control('ratio', '距离比 λ', 0.5, 2, 0.25, 0.5)], [['λ=1', { ratio: 1 }], ['λ=1/2', { ratio: 0.5 }], ['λ=2', { ratio: 2 }]]),
    ],
    notes: [
      note('点关于直线对称与最短路', 'P′=P-2(Ax₀+By₀+C)(A,B)/(A²+B²)', '等价条件：PP′中点在对称轴上，PP′垂直轴。特殊对称：x轴(x,-y)，y轴(-x,y)，原点(-x,-y)，y=x交换坐标，y=-x为(-y,-x)。两定点在直线同侧时，反射一个点可把距离和转为直线段；异侧直接连线。最小值必须检验交点属于允许的线段/射线。三角形不等式给和的下界及差的绝对值上界，取等条件仍须检查。'),
      note('含参直线恒过定点', 'f(x,y)+λg(x,y)=0 ⇒ 解f=g=0', '参数任意变化时仍成立，需要常数部分和参数系数同时为0。还须检查每个参数值是否退化为0=0或无解；本实验的两系数不同时为0，λ=1的竖直线也保留。'),
      note('圆与直线构成圆系', 'F+λl=0', 'F=x²+y²+Dx+Ey+F₀，l=Ax+By+C。它经过F=0与l=0的公共点，λ=0就是原圆，不能遗漏。每个λ还要检验半径平方>0。两圆公共弦及两圆圆系见上一课。'),
      note('阿波罗尼斯圆与轨迹', '|PA|/|PB|=λ>0，A≠B', 'λ≠1为圆；λ=1为AB的垂直平分线。直接法：设P(x,y)，列距离平方等式，再配方并检验限制。定义法看距离关系；相关点法把主动点代入；参数法先写P(t)再消参。平方、除法与消参可能引入不符合原题的点，要回验。'),
      note('圆上线性、平方与斜率最值', 'ux+vy∈[ua+vb-r√(u²+v²), ua+vb+r√(u²+v²)]', '线性目标看平行直线与圆相切。距离平方先求距离范围再平方：到定点E的距离在[|CE-r|,CE+r]。斜率(y-b)/(x-a)看连接定点的直线族；定点在圆外且无竖直切线等特殊情况时，用切线找边界，必须排除分母0，并检查所得是区间还是两个无界区间。'),
      note('切线长与切点弦', '外点E：ET=√(CE²-r²)', '只对圆外点适用；圆内无切线，圆上切线唯一、切线长0。过外点E的两切点T₁、T₂都在以CE为直径的圆上；切点弦为(xE-a)(x-a)+(yE-b)(y-b)=r²。它不是“过E的切线”；圆上点才可直接用切点切线公式。'),
      note('弦中点、动弦与恒相交', '半弦²+弦心距²=r²', '给弦中点M≠C时，CM垂直弦；M=C时任一直径都可。动直线过圆内点P，弦长范围[2√(r²-CP²),2r]；P在圆上，相交弦长(0,2r]（切线对应0）；P在圆外，相交弦长也为(0,2r]，切线可逼近，不能把垂直CP的相离线当最短弦。恒过圆内定点的有效直线必与圆有两个交点，含参退化值须排除。'),
      note('圆、向量与弧', '(P-A)·(P-B)=0；弧长s=rθ（θ用弧度）', 'A、B为直径端点，P在圆上时PA·PB=0；反向利用可识别圆的轨迹。弦长L=2r sin(θ/2)，劣弧圆心角≤π，优弧对应2π-θ。弦心距d=r cos(θ/2)只对劣弧角θ∈[0,π]取非负；对应圆心角越大弦心距越小，不能混用优弧角。'),
    ],
    examples: [
      example('将军饮马', 'A(-3,2)、B(2,3)，M在x轴上，求AM+MB最小值与M。', '把B关于x轴反射为B′(2,-3)，则MB=MB′。', 'AM+MB′≥AB′=√(5²+(-5)²)=5√2。', 'AB′与x轴交于M(-1,0)，在允许直线上且取到等号；最短5√2。'),
      example('分组求定点', '求(x+y-2)+λ(x-y)=0恒过的定点。', '令常数部分x+y-2=0、参数部分x-y=0。', '解得x=y=1，定点F(1,1)。', '回代任意λ均为0；λ=1为x=1，λ=-1为y=1，不要漏掉。'),
      example('圆系求圆', '求过圆x²+y²=9与直线x=1交点、圆心横坐标为-1的圆。', '设x²+y²-9+λ(x-1)=0，圆心横坐标-λ/2。', '-λ/2=-1得λ=2，方程x²+y²+2x-11=0。', '标准式(x+1)²+y²=12；r²=12>0。λ=0时原圆也属于这个圆系。'),
      example('距离比轨迹', 'A(-2,0)、B(2,0)，PA/PB=1/2，求P的轨迹。', '距离非负，平方得4[(x+2)²+y²]=(x-2)²+y²。', '整理3x²+3y²+20x+12=0。', '配方(x+10/3)²+y²=64/9，是圆；B不在此圆上，原比例分母不为0。λ=1则为x=0。'),
      example('线性与平方最值', 'P在x²+y²=9上，求2x+y的范围及PA²范围，A(2,0)。', '线性目标法向量(2,1)长度√5，故2x+y∈[-3√5,3√5]。', 'OA=2，PA∈[|3-2|,3+2]=[1,5]。', '距离均非负，平方后PA²∈[1,25]，不能把距离最小误写0。'),
      example('外点切线长、切点弦与斜率', 'E(5,0)，圆x²+y²=9，求切线长、切点弦与EP的斜率范围。', 'ET=√(25-9)=4；切点弦5x=9，即x=9/5。', '设过E直线y=k(x-5)，相切需5|k|/√(1+k²)=3，得k=±3/4。', '圆上P的x在[-3,3]，x-5始终非0，故EP斜率范围[-3/4,3/4]。注意切点弦不是任一条切线。'),
      example('中点弦、动弦与向量', '圆x²+y²=9，弦中点M(1,0)，求弦长；若P(1,0)是动直线必过点，弦长范围？', 'OM沿x轴，弦垂直OM，所以弦所在直线x=1。', '弦心距1，弦长2√8=4√2。过圆内点P旋转，弦心距在[0,1]，弦长范围[4√2,6]。', '若A、B为该圆一直径端点，则任意圆上Q满足QA·QB=0，可用数量积反向写轨迹方程。'),
    ],
    quizzes: [
      quiz('P(2,3)关于y=x对称的点是？', ['(-2,-3)', '(3,2)', '(2,-3)'], 1, '关于y=x交换横、纵坐标；x轴对称才只改变纵坐标符号。'),
      quiz('(x+y-2)+λ(x-y)=0恒过？', ['(0,0)', '(1,1)', '(2,2)'], 1, '解x+y=2与x=y得(1,1)。'),
      quiz('圆系F+λl=0在λ=0时？', ['无意义', '退化为直线', '就是原圆F=0'], 2, '代入λ=0得到F=0，原圆包含在此参数表达中。'),
      quiz('A≠B，轨迹PA/PB=1是？', ['圆', '线段AB', 'AB的垂直平分线'], 2, '距离相等的点集合是垂直平分线，λ=1须单独讨论。'),
      quiz('圆x²+y²=9上，2x+y的最大值？', ['3', '3√5', '15'], 1, '线性目标方向长度√5，最大r√5=3√5。'),
      quiz('E(5,0)到圆x²+y²=9的切线长是？', ['2', '4', '5'], 1, '切点处半径垂直切线，ET²=25-9=16。'),
      quiz('过圆内点P且CP=1、r=3的动直线，其弦长范围？', ['[4√2,6]', '[0,6]', '[2,6]'], 0, '弦心距最大CP=1，最小0，代入2√(r²-d²)。'),
      quiz('半径3、劣弧圆心角π/3的弧长是？', ['π', '3π', '1'], 0, '弧长s=rθ=3·π/3=π；角度要用弧度。'),
    ],
  },
];

export const modules = [
  { id:'solid',title:'立体几何',subtitle:'从空间中的方向、位置，走向角度、距离与几何体',symbol:'▱',number:'01',lessonIds:solidLessons.map(l=>l.id) },
  { id:'lines',title:'直线与圆的方程',subtitle:'直线、圆与位置关系，用方程连接图形与方法',symbol:'⊘',number:'02',lessonIds:lineLessons.map(l=>l.id) },
  { id:'conics',title:'圆锥曲线',subtitle:'从距离定义出发，探索焦点、弦、轨迹与综合题',symbol:'⬭',number:'03',lessonIds:conicLessons.map(l=>l.id) },
  { id:'book',title:'必修一',subtitle:'集合与逻辑、不等式、函数、指数对数、三角函数，五章循序探究',symbol:'f(x)',number:'04',lessonIds:bookLessons.map(l=>l.id) },
  { id:'book2',title:'必修二',subtitle:'平面向量、复数、立体几何初步、统计与概率，五章循序探究',symbol:'Ω',number:'05',lessonIds:book2Lessons.map(l=>l.id) },
];
export const lessons = [...lineLessons.map(l=>({...l,moduleId:'lines'})),...solidLessons.map(l=>({...l,moduleId:'solid'})),...conicLessons.map(l=>({...l,moduleId:'conics'})),...bookLessons.map(l=>({...l,moduleId:'book'})),...book2Lessons.map(l=>({...l,moduleId:'book2'}))];
export const moduleKey = 'geometry-module-v1';

export function freshLesson(lesson) {
  return { stage: 0, unlocked: 0, scene: null, lab: 0, view: {yaw:35,pitch:25}, labs: Object.fromEntries(lesson.labs.map(item => [item.id, { guess: null, shown: false, observation: null, records: [], values: Object.fromEntries(item.controls.map(c => [c.key, c.value])) }])), examples: lesson.examples.map(() => 0), answers: lesson.quizzes.map(() => ({ selected: null, submitted: false, hadError: false })), complete: false };
}

export function restoreModule(raw) {
  const result = { lessons: {}, recovered: false };
  let saved = {};
  if (raw != null) {
    try { saved = JSON.parse(raw); if (saved?.version !== 1 || typeof saved.lessons !== 'object' || !saved.lessons) throw new Error(); }
    catch { result.recovered = true; saved = {}; }
  }
  for (const lesson of lessons.filter(l => !l.legacy)) {
    const state = freshLesson(lesson), old = saved.lessons?.[lesson.id];
    result.lessons[lesson.id] = state;
    if (!old || typeof old !== 'object') continue;
    for(const [key,low,high] of [['yaw',-180,180],['pitch',10,80]]) if(Number.isFinite(old.view?.[key]) && old.view[key]>=low && old.view[key]<=high) state.view[key]=old.view[key];
    const index = (v, max) => Number.isInteger(v) && v >= 0 && v < max;
    if (index(old.scene, lesson.sceneOptions.length)) state.scene = old.scene;
    if (index(old.lab, lesson.labs.length)) state.lab = old.lab;
    for (const item of lesson.labs) {
      const target = state.labs[item.id], source = old.labs?.[item.id];
      if (!source || typeof source !== 'object') continue;
      for (const c of item.controls) {
        const value = source.values?.[c.key];
        if (Number.isFinite(value) && value >= c.min && value <= c.max && Math.abs((value - c.min) / c.step - Math.round((value - c.min) / c.step)) < 1e-7) target.values[c.key] = value;
      }
      if (item.id === 'points' && target.values.x === -2 && target.values.y === -1) target.values = { x: 3, y: 2 };
      if (index(source.guess, item.options.length)) target.guess = source.guess;
      target.shown = source.shown === true && target.guess !== null;
      if (index(source.observation, item.options.length)) target.observation = source.observation;
      if (Array.isArray(source.records)) target.records = source.records.slice(-12).filter(r => r && index(r.guess, item.options.length) && index(r.observation, item.options.length) && typeof r.summary === 'string' && r.summary.length < 500).map(r => ({ guess: r.guess, observation: r.observation, summary: r.summary }));
    }
    state.examples = lesson.examples.map((ex, i) => index(old.examples?.[i], ex.steps.length + 1) ? old.examples[i] : 0);
    state.answers = lesson.quizzes.map((q, i) => { const a = old.answers?.[i]; return { selected: index(a?.selected, q.options.length) ? a.selected : null, submitted: a?.submitted === true && index(a?.selected, q.options.length), hadError: a?.hadError === true }; });
    state.unlocked = state.scene === null ? 0 : lesson.labs.every(l => state.labs[l.id].records.length) ? (state.examples.every((n, i) => n === lesson.examples[i].steps.length) ? 4 : old.unlocked >= 3 ? 3 : 2) : 1;
    state.stage = index(old.stage, state.unlocked + 1) ? old.stage : 0;
    state.complete = old.complete === true && state.unlocked === 4 && state.answers.every((a, i) => a.submitted && a.selected === lesson.quizzes[i].answer);
  }
  return result;
}

export function lessonProgress(lesson, state) {
  if (state.complete) return 100;
  const records = lesson.labs.filter(l => state.labs[l.id].records.length).length / lesson.labs.length;
  const examples = state.examples.reduce((a, b) => a + b, 0) / lesson.examples.reduce((a, e) => a + e.steps.length, 0);
  const correct = state.answers.filter((a, i) => a.submitted && a.selected === lesson.quizzes[i].answer).length / lesson.quizzes.length;
  return Math.min(99, Math.round((Number(state.scene !== null) + records + Number(state.unlocked >= 3) + examples + correct) * 20));
}
