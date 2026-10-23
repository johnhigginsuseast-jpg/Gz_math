import { lessons, modules, moduleKey, restoreModule, freshLesson, lessonProgress } from './module-course.mjs';
import { advancedModel, spaceSvg } from './advanced-labs.mjs';
import { bookModel, bookSvg } from './book-labs.mjs';
import { format } from './math.mjs';
import { normalizedLine, lineThrough, twoLines, generalCircle, twoCircles, reflectPoint, apollonius } from './module-math.mjs';
import { STORAGE_KEY, restoreState } from './state.mjs';

const app = document.querySelector('#app');
const lesson = lessons.find(l => l.id === new URLSearchParams(location.search).get('lesson'));
const currentModule = modules.find(m => m.id === (lesson?.moduleId || new URLSearchParams(location.search).get('module')));
const moduleLessons = currentModule ? lessons.filter(l => l.moduleId === currentModule.id) : [];
const lessonLink = l => `?module=${l.moduleId}&lesson=${l.id}`;
let notice = '', writable = true, saved, legacyPercent = 0, resetOpen = false;
try {
  saved = restoreModule(localStorage.getItem(moduleKey));
  if (saved.recovered) notice = '模块学习记录无法读取，已恢复为新的学习记录。原直线与圆课记录未受影响。';
  const legacy = restoreState(localStorage.getItem(STORAGE_KEY));
  legacyPercent = Math.round(legacy.state.completed.length / 8 * 100);
} catch {
  saved = restoreModule(null); writable = false;
  notice = '浏览器无法使用本地存储；本次仍可学习，关闭后进度可能丢失。';
}
let state = lesson ? saved.lessons[lesson.id] : null;
const stages = ['情景引入', '动手实验', '知识归纳', '例题拆解', '学以致用'];
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const f = value => format(Math.abs(value) < 1e-9 ? 0 : value, 3);
const btn = (label, action, extra = '', disabled = false) => `<button type="button" class="button" data-action="${action}" ${extra} ${disabled ? 'disabled' : ''}>${label}</button>`;
const equation = ({ A, B, C }) => {
  const parts = [[A, 'x'], [B, 'y'], [C, '']].filter(([c]) => Math.abs(c) > 1e-9);
  return parts.map(([c, name], i) => `${c < 0 ? '−' : i ? '+' : ''}${name && Math.abs(Math.abs(c) - 1) < 1e-9 ? '' : f(Math.abs(c))}${name}`).join('') + '=0';
};
const circleEq = (a, b, r2) => `(x${a < 0 ? '+' : '−'}${f(Math.abs(a))})²+(y${b < 0 ? '+' : '−'}${f(Math.abs(b))})²=${f(r2)}${[a, b, r2].some(v => Math.abs(v - Number(f(v))) > 1e-9) ? '（各系数为近似值）' : ''}`;
function save() {
  try { localStorage.setItem(moduleKey, JSON.stringify({ version: 1, lessons: saved.lessons })); }
  catch { writable = false; notice = '学习记录未能写入浏览器；本次可继续，关闭后进度可能丢失。'; }
  const n = document.querySelector('#storage-notice');
  if (n) { n.hidden = !notice; n.textContent = notice; }
  const b = document.querySelector('.local-badge');
  if (b) b.textContent = writable ? '本地学习 · 自动保存' : '本地学习 · 临时会话';
}

function graph({ circles = [], lines = [], points = [], segments = [], curves = [], polygons = [], space = null, diagram = null, extent = 6, description = '' }) {
  if(diagram) return bookSvg(diagram);
  if(space) return spaceSvg(space,state.view);
  const scale = 252 / extent, x = v => 300 + v * scale, y = v => 300 - v * scale;
  const color = ['#7555dc', '#27846e', '#c57e27'];
  const segment = (p, q, stroke, dash = '') => `<path d="M${x(p.x)} ${y(p.y)}L${x(q.x)} ${y(q.y)}" stroke="${stroke}" stroke-width="3" ${dash ? 'stroke-dasharray="8 7"' : ''} fill="none"/>`;
  let grid = '';
  const step = extent > 10 ? Math.ceil(extent / 5) : 1;
  for (let i = -Math.floor(extent); i <= extent; i += step) grid += `<path d="M${x(i)} 48V552M48 ${y(i)}H552" stroke="#edeaf3" stroke-width="1"/>`;
  const merged = [];
  for (const p of points) {
    const same = merged.find(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-9);
    if (same) same.label += '/' + p.label;
    else merged.push({ ...p });
  }
  const path2 = points => points.map((p,i)=>`${i?'L':'M'}${x(p.x)} ${y(p.y)}`).join('');
  const shapeMarkup = polygons.map(p=>`<path d="${path2(p.points)}Z" fill="${p.color}" fill-opacity=".12"/>`).join('') + curves.map(c=>`<path d="${path2(c.points)}" fill="none" stroke="${c.color||color[0]}" stroke-width="3"/>`).join('');
  const labels = shapeMarkup + merged.map(p => `<circle cx="${x(p.x)}" cy="${y(p.y)}" r="5" fill="${p.hollow?'white':p.color || color[0]}" stroke="${p.color || color[0]}" stroke-width="2"/><text x="${x(p.x) + (p.x > extent * 0.65 ? -12 : 10)}" y="${y(p.y) - 12}" text-anchor="${p.x > extent * 0.65 ? 'end' : 'start'}">${esc(p.label || '')}</text>`).join('');
  return `<svg class="module-graph" viewBox="0 0 600 600" role="img" aria-label="${esc(description)}"><defs><clipPath id="graph-clip"><rect x="40" y="35" width="520" height="530"/></clipPath></defs><rect width="600" height="600" rx="18" fill="#fcfbff"/>${grid}<path d="M40 300H560M300 40V560" stroke="#a7a3b5" stroke-width="1.5"/><text x="560" y="330">x</text><text x="315" y="42">y</text><text x="278" y="327">O</text><text x="${x(step)}" y="328">${step}</text><g clip-path="url(#graph-clip)">${circles.map((c, i) => `<circle cx="${x(c.a)}" cy="${y(c.b)}" r="${c.r * scale}" fill="${color[i % 3]}" fill-opacity=".045" stroke="${color[i % 3]}" stroke-width="3" ${c.dash ? 'stroke-dasharray="8 7"' : ''}/>`).join('')}${lines.map((line, i) => { const n = normalizedLine(line), p = { x: -n.A * n.C, y: -n.B * n.C }, u = { x: n.B * extent * 4, y: -n.A * extent * 4 }; return segment({ x: p.x - u.x, y: p.y - u.y }, { x: p.x + u.x, y: p.y + u.y }, line.color || color[i % 3], line.dash); }).join('')}${segments.map(s => segment(s[0], s[1], s[2] || color[2], s[3])).join('')}${labels}</g></svg>`;
}

function model(item, values) {
  if(item.id.startsWith('b-')) return bookModel(item.id,values);
  if(/^(s-|e-|h-|p-|c-)/.test(item.id)) return advancedModel(item.id,values);
  const v = values, radians = (v.alpha || 0) * Math.PI / 180;
  if (item.id === 'angle') {
    const A = -Math.sin(radians), B = Math.cos(radians), C = -A - B;
    const answer = v.alpha === 90 ? 2 : v.alpha === 0 ? 1 : v.alpha < 90 ? 0 : 3;
    return { answer, status: `α=${v.alpha}°；斜率${v.alpha === 90 ? '不存在' : ' k≈' + f(Math.tan(radians))}`, formula: v.alpha === 90 ? 'x=1' : `y−1=${f(Math.tan(radians))}(x−1)`, explanation: '直线固定经过P(1,1)。倾斜角从x轴正方向逆时针量起，范围[0°,180°)；竖直时改写x=1。非特殊角的数值按三位小数近似显示。', graph: { lines: [{ A, B, C }], points: [{ x: 1, y: 1, label: 'P' }], description: `经过P的直线倾斜角${v.alpha}度` } };
  }
  if (item.id === 'points') {
    const p = { x: -2, y: -1 }, q = { x: v.x, y: v.y }, line = lineThrough(p, q);
    const answer = v.x === -2 ? 2 : v.y === -1 ? 1 : 0;
    return { answer, status: `A(-2,-1)，B(${v.x},${v.y})；${item.options[answer]}`, formula: equation(line), explanation: '(y−y₁)(x₂−x₁)=(x−x₁)(y₂−y₁)可统一处理水平与竖直线。两点重合不能确定唯一的直线。', graph: { lines: [line], points: [{ ...p, label: 'A' }, { ...q, label: 'B' }], description: `过A和B的${item.options[answer]}` } };
  }
  if (item.id === 'relation') {
    const p = { A: 1, B: -1, C: 0 }, q = { A: -Math.sin(radians), B: Math.cos(radians), C: -v.offset }, result = twoLines(p, q);
    const answer = { intersect: 0, parallel: 1, coincident: 2, perpendicular: 3 }[result.kind];
    return { answer, status: `${item.options[answer]}${result.point ? `，交点≈(${f(result.point.x)},${f(result.point.y)})` : `，距离≈${f(result.distance)}`}`, formula: `Δ=A₁B₂−A₂B₁；垂直看 A₁A₂+B₁B₂=0`, explanation: 'Δ=0只说明方向相同，还要排除重合。图上重合时绿线盖住紫线。此处s是沿单位法向量平移的有向量，不是纵截距。', graph: { lines: [p, q], points: result.point ? [{ ...result.point, label: '交点' }] : [], description: `紫线y=x与绿线${item.options[answer]}` } };
  }
  if (item.id === 'distance') {
    const p = { x: 2, y: 3 }, h = { x: 2, y: v.t };
    const answer = v.t === 3 ? 0 : v.t < 3 ? 1 : 2;
    return { answer, status: `点线距离=${f(Math.abs(3 - v.t))}；两平行线距离=${f(Math.abs(v.t + 2))}`, formula: 'd点线=|3−t|；d平行线=|t−(−2)|', explanation: '紫线y=−2与绿线y=t。橙色垂线段PH才是点到直线距离；t=−2时两线重合、线间距离为0。', graph: { lines: [{ A: 0, B: 1, C: 2 }, { A: 0, B: 1, C: -v.t }], points: [{ ...p, label: 'P' }, { ...h, label: 'H' }], segments: [[p, h]], description: '点P到绿线的垂线段，以及两条水平线' } };
  }
  if (item.id === 'complete') {
    const c = generalCircle(v.D, v.E, v.F), answer = { circle: 0, point: 1, empty: 2 }[c.kind];
    return { answer, status: `r²=${f(c.r2)}，${item.options[answer]}${c.kind === 'circle' ? '；r≈' + f(c.r) : ''}`, formula: circleEq(c.a, c.b, c.r2), explanation: '配方右边必须为正才是圆。右边为0是一个点，为负时没有实点，图中只标出配方中心作参考（不是该方程的点）。', graph: { circles: c.kind === 'circle' ? [c] : [], points: [{ x: c.a, y: c.b, label: c.kind === 'empty' ? '参考中心' : 'C' }], extent: Math.max(6, Math.abs(c.a) + c.r + 1, Math.abs(c.b) + c.r + 1), description: `一般方程配方后表示${item.options[answer]}` } };
  }
  if (item.id === 'point-circle') {
    const d = Math.abs(v.x - 1), answer = d < 2 ? 0 : d === 2 ? 1 : 2;
    return { answer, status: `PC=${f(d)}，r=2，P在${item.options[answer]}`, formula: '(x−1)²+(y+1)²=4；比较PC²与4', explanation: '比较距离平方也可判断位置，圆内/圆上/圆外分别对应小于/等于/大于r²。', graph: { circles: [{ a: 1, b: -1, r: 2 }], points: [{ x: 1, y: -1, label: 'C' }, { x: v.x, y: -1, label: 'P', color: '#c57e27' }], segments: [[{ x: 1, y: -1 }, { x: v.x, y: -1 }]], description: `P位于圆${['内', '上', '外'][answer]}` } };
  }
  if (item.id === 'two-circles') {
    const p = { a: -2, b: 0, r: v.r1 }, q = { a: -2 + v.d, b: 0, r: v.r2 }, result = twoCircles(p, q);
    const answer = { outside: 0, external: 1, intersect: 2, internal: 3, inside: 4, concentric: 5, coincident: 6 }[result.kind];
    return { answer, status: `${item.options[answer]}；d=${v.d}，半径和=${v.r1 + v.r2}，半径差=${Math.abs(v.r1 - v.r2)}；${result.count === Infinity ? '无数' : result.count}个公共点${result.chord > 0 ? '；公共弦长≈' + f(result.chord) : ''}`, formula: result.axis ? `${equation(result.axis)}${result.count === 0 ? '（根轴，无真实公共弦）' : '（公共点所在直线）'}` : result.count === Infinity ? 'F₁−F₂=0 ⇒ 0=0，两圆重合' : '同心不等圆，相减为非零常数=0，无根轴', explanation: '先单独判断d=0。相交时橙色线段为公共弦，图中虚线是相减得到的直线；相离时虚线不是公共弦。相切时弦退化为一点。', graph: { circles: [p, q], lines: result.axis ? [{ ...result.axis, color: '#c57e27', dash: true }] : [], points: [{ x: p.a, y: 0, label: 'C₁' }, { x: q.a, y: 0, label: 'C₂', color: '#27846e' }, ...result.points.map((point, i) => ({ ...point, label: 'T' + (i + 1), color: '#c57e27' }))], segments: result.points.length === 2 ? [[...result.points]] : [], extent: Math.max(6, Math.abs(q.a) + q.r + 1), description: `两个圆${item.options[answer]}，${result.count === Infinity ? '无数' : result.count}个公共点` } };
  }
  if (item.id === 'reflection') {
    const A = { x: -3, y: 2 }, B = { x: 2, y: 3 }, M = { x: v.t, y: 0 }, reflected = reflectPoint(B, { A: 0, B: 1, C: 0 });
    const length = Math.hypot(M.x - A.x, M.y - A.y) + Math.hypot(M.x - B.x, M.y - B.y);
    return { answer: v.t === -1 ? 0 : 1, status: `AM+MB≈${f(length)}；理论下界5√2≈${f(Math.sqrt(50))}`, formula: 'AM+MB=AM+MB′≥AB′=5√2', explanation: 'M(−1,0)在AB′直线上，此时折线拉直并取到等号。图中B′为B的反射点，两条橙色路段MB和MB′等长。', graph: { lines: [{ A: 0, B: 1, C: 0, color: '#a7a3b5' }], points: [{ ...A, label: 'A' }, { ...B, label: 'B' }, { ...reflected, label: 'B′' }, { ...M, label: 'M' }], segments: [[A, M, '#7555dc'], [M, B], [M, reflected, '#27846e'], [A, reflected, '#a7a3b5', true]], description: '河岸x轴上的动点M，以及反射后的折线' } };
  }
  if (item.id === 'fixed') {
    const line = { A: 1 + v.lambda, B: 1 - v.lambda, C: -2 }, answer = v.lambda === 1 ? 1 : v.lambda === -1 ? 2 : 0;
    return { answer, status: `λ=${v.lambda}，${item.options[answer]}；F(1,1)始终在线上`, formula: equation(line), explanation: '把x+y−2=0与x−y=0联立，得F(1,1)。参数项与常数项同时为0，任意λ都不会改变这一点。', graph: { lines: [line], points: [{ x: 1, y: 1, label: 'F' }], description: '绕固定点F旋转的含参直线' } };
  }
  if (item.id === 'family') {
    const c = generalCircle(v.lambda, 0, -9 - v.lambda);
    return { answer: v.lambda > 0 ? 0 : v.lambda === 0 ? 1 : 2, status: `圆心(${f(c.a)},0)，r≈${f(c.r)}；两个标记点始终在圆上`, formula: circleEq(c.a, 0, c.r2), explanation: '公共点为(1,±√8)。λ=0时绿色圆与原紫圆完全重合，原圆确实属于圆系。此例r²=(λ+2)²/4+8始终为正；其他圆系仍要检验。', graph: { circles: [{ a: 0, b: 0, r: 3, dash: true }, c], lines: [{ A: 1, B: 0, C: -1, color: '#a7a3b5', dash: true }], points: [{ x: 1, y: Math.sqrt(8), label: 'T₁' }, { x: 1, y: -Math.sqrt(8), label: 'T₂' }, { x: c.a, y: 0, label: 'Cλ', color: '#27846e' }], extent: Math.max(6, Math.abs(c.a) + c.r + 1), description: '过直线x=1与原圆两交点的动圆' } };
  }
  const p = { x: -2, y: 0 }, q = { x: 2, y: 0 }, locus = apollonius(p, q, v.ratio);
  return { answer: locus.kind === 'circle' ? 0 : 1, status: `PA/PB=${v.ratio}；轨迹为${locus.kind === 'circle' ? `圆，圆心(${f(locus.a)},0)，半径≈${f(locus.r)}` : '直线x=0'}`, formula: locus.kind === 'line' ? 'x=0' : circleEq(locus.a, locus.b, locus.r * locus.r), explanation: '用PA²=λ²PB²列方程，λ≠1时配方得阿波罗尼斯圆；λ=1时二次项消掉，得到垂直平分线。A、B不同，λ>0，且B不属于轨迹。', graph: { circles: locus.kind === 'circle' ? [locus] : [], lines: locus.kind === 'line' ? [locus.line] : [], points: [{ ...p, label: 'A' }, { ...q, label: 'B' }], extent: locus.kind === 'circle' ? Math.max(6, Math.abs(locus.a) + locus.r + 1) : 6, description: '到A和B距离比为给定常数的点的轨迹' } };
}

function layout(body) {
  const percent=lesson?lessonProgress(lesson,state):null;
  const navLink=(l,i)=>`<a href="${lessonLink(l)}" ${l.id===lesson?.id?'aria-current="page"':''}><span>${String(i+1).padStart(2,'0')}</span>${l.title}</a>`;
  const sidebar=currentModule?.id==='book'?[...new Set(moduleLessons.map(l=>l.chapter))].map(ch=>`<details class="chapter-nav" ${lesson?.chapter===ch?'open':''}><summary>${ch}</summary>${moduleLessons.filter(l=>l.chapter===ch).map(l=>navLink(l,moduleLessons.indexOf(l))).join('')}</details>`).join(''):currentModule?moduleLessons.map(navLink).join(''):modules.map(m=>`<a href="?module=${m.id}"><span>${m.number}</span>${m.title}</a>`).join('');
  return `<div class="shell module-shell"><aside class="sidebar" aria-label="模块课程导航"><a class="brand" href="./"><img src="./assets/logo.svg" alt=""><div><strong>几何实验室</strong><small>GEOMETRY LAB</small></div></a><p class="sidebar-label">${currentModule?currentModule.title:'高中数学 · 四个学习模块'}</p><nav class="module-nav" aria-label="课程层级"><a href="./" ${!currentModule?'aria-current="page"':''}>⌂ 全部模块</a>${currentModule?`<a href="?module=${currentModule.id}" ${!lesson?'aria-current="page"':''}>${currentModule.title} · 总览</a>`:''}${sidebar}</nav><div class="sidebar-bottom"><div class="sidebar-note"><strong>先猜想，再验证</strong>一次改变一个参数，把观察变成自己的结论。</div>${lesson?'<button type="button" class="reset" data-action="open-reset">清空本课进度</button>':''}</div></aside><main class="main"><header class="topbar"><div class="crumb"><a href="./">高中数学</a>${currentModule?`<span>/</span><a href="?module=${currentModule.id}">${currentModule.title}</a>`:'<span>/</span><strong>学习地图</strong>'}</div><span class="local-badge">${writable?'本地学习 · 自动保存':'本地学习 · 临时会话'}</span></header><nav class="module-switcher" aria-label="同级模块">${modules.map(m=>`<a href="?module=${m.id}" ${m.id===currentModule?.id?'aria-current="page"':''}>${m.title}</a>`).join('')}</nav><div class="course-header"><div><div class="eyebrow"><span class="pill">${lesson?'探究课 '+String(moduleLessons.indexOf(lesson)+1).padStart(2,'0'):currentModule?'MODULE '+currentModule.number:'HIGH SCHOOL MATH'}</span> LEARN BY EXPLORING</div><h1>${lesson?lesson.title:currentModule?currentModule.title:'高中数学学习地图'}</h1><p>${lesson?(lesson.chapter?lesson.chapter+' · ':'')+lesson.subtitle:currentModule?currentModule.subtitle:'空间与平面，从观察走向方程，从猜想走向证明。'}</p></div>${lesson?`<div class="course-progress"><div class="progress-caption"><span>本课进度</span><span>${percent}%</span></div><div class="progress-track" role="progressbar" aria-label="本课进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div>`:''}</div><div id="storage-notice" class="notice" role="status" ${notice?'':'hidden'}>${esc(notice)}</div>${lesson?`<nav class="topic-tabs module-stages" aria-label="学习步骤">${stages.map((name,i)=>`<button type="button" class="topic-tab ${state.stage===i?'active':''}" data-action="stage" data-index="${i}" ${i>state.unlocked?'disabled':''} ${state.stage===i?'aria-current="step"':''}>${i+1} · ${name}</button>`).join('')}</nav>`:''}<section id="lesson" tabindex="-1">${body}</section><footer class="lesson-footer"><span>先看图，再用数学解释你的发现。</span><span>v0.5 · 学习数据仅保存在当前浏览器</span></footer></main></div>${resetOpen?`<div class="dialog-backdrop"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title"><h2 id="reset-title">清空本课进度？</h2><p>只清空“${lesson.title}”的实验、例题与答题记录，其他课程保留。</p><div class="dialog-actions">${btn('保留记录','cancel-reset','id="cancel-reset"')}${btn('确认清空本课','confirm-reset')}</div></section></div>`:''}`;
}
function coursePercent(l) { return l.legacy?legacyPercent:lessonProgress(l,saved.lessons[l.id]); }
function home() {
  if(!currentModule) return `<div class="module-intro"><div><span class="tiny-tag">选择一个模块，开始探索</span><h2>四个模块，同一条探究路径</h2><p>进入模块，再选择知识点课程。先猜想、亲手实验，最后用例题和练习检验理解。</p></div></div><div class="portal-map">${modules.map(m=>{const list=lessons.filter(l=>l.moduleId===m.id),done=list.filter(l=>coursePercent(l)===100).length;return `<a class="lesson-tile module-tile" href="?module=${m.id}"><span class="tile-number">MODULE ${m.number}</span><span class="tile-symbol" aria-hidden="true">${m.symbol}</span><h2>${m.title}</h2><p>${m.subtitle}</p><div class="tile-meta"><span>${list.length}节课 · ${done}/${list.length}已完成</span><strong>进入模块 →</strong></div></a>`;}).join('')}</div><div class="card module-source"><h3>把自己的观察，变成能解释的方法</h3><p>每节课包含情景引入、可操作实验、知识归纳、分步例题与练习。四个模块各自组织课程，学习进度按课程保存。</p></div>`;
  const completed=moduleLessons.filter(l=>coursePercent(l)===100).length;
  return `<div class="module-intro"><div><span class="tiny-tag">${currentModule.title} · 课程地图</span><h2>按知识点，一步一步深入</h2><p>建议按顺序学习，也可以选择需要巩固的课程。猜想可以出错，关键是用观察与推导修正。</p></div><div class="module-count"><strong>${completed} / ${moduleLessons.length}</strong><span>课程已完成</span></div></div><div class="lesson-map">${moduleLessons.map((l,i)=>{const percent=coursePercent(l);return `${l.chapter&&moduleLessons[i-1]?.chapter!==l.chapter?`<h2 class="chapter-heading">${l.chapter}</h2>`:''}<a class="lesson-tile" href="${lessonLink(l)}"><span class="tile-number">${String(i+1).padStart(2,'0')}</span><span class="tile-symbol" aria-hidden="true">${l.symbol}</span><h2>${l.title}</h2><p>${l.subtitle}</p><div class="tile-meta"><span>${l.legacy?'7例题 · 15练习':`${l.labs.length}实验 · ${l.examples.length}例题 · ${l.quizzes.length}练习`}</span><strong>${percent===100?'已完成 ✓':percent?percent+'% · 继续 →':'开始学习 →'}</strong></div></a>`;}).join('')}</div><div class="card module-source"><h3>先检查条件，再选择方法</h3><p>课程依据你提供的对应模块资料整理，包含公式、适用条件、典型题型与易错边界。例题逐步展开，练习可以订正，完成后可随时回看。</p></div>`;
}
function scenario() {
  return `<div class="module-scenario"><span class="tiny-tag">从一个真实问题出发</span><h2>${lesson.sceneQ}</h2><p>${lesson.scene}</p><div class="choice-list">${lesson.sceneOptions.map((o, i) => `<button type="button" class="choice ${state.scene === i ? 'selected' : ''}" aria-pressed="${state.scene === i}" data-action="scene" data-index="${i}">${esc(o)}</button>`).join('')}</div><p class="subtext">猜想可以不正确。带着它去实验，看看你的想法会不会改变。</p>${btn('带着猜想去实验 →', 'next', '', state.scene === null)}</div>`;
}
function liveExperiment(item, labState) {
  if (!labState.shown) return `<div class="graph-placeholder"><span aria-hidden="true">${lesson.symbol}</span><h3>先作一个猜想</h3><p>验证后，图形与观察结果会出现在这里。</p></div>`;
  const m = model(item, labState.values);
  return `<div class="plot">${graph(m.graph)}</div><div class="live-result" aria-live="polite"><strong>${esc(m.status)}</strong><p>紫色为基准图形，绿色为变化图形，橙色为辅助线或公共点。图中数值与结果中的“≈”按三位小数显示。</p></div>`;
}
function experimentView() {
  const item = lesson.labs[state.lab], l = state.labs[item.id], m = model(item, l.values);
  return `<div class="topic-tabs experiment-tabs" aria-label="实验主题">${lesson.labs.map((it, i) => `<button type="button" class="topic-tab ${i === state.lab ? 'active' : ''}" data-action="lab" data-index="${i}" aria-pressed="${i === state.lab}">${it.title}${state.labs[it.id].records.length ? ' ✓' : ''}</button>`).join('')}</div><div class="key-question"><strong>先猜想 → 调整参数 → 记录观察</strong><h2>${item.prompt}</h2></div>${m.graph.space && l.shown ? viewControls() : ''}<div class="workspace"><div class="card experiment-canvas" id="lab-live">${liveExperiment(item, l)}</div><div class="card"><h2>你的实验台</h2><fieldset class="module-fieldset"><legend>1. 我的猜想</legend><div class="module-options">${item.options.map((o, i) => `<button type="button" class="choice ${l.guess === i ? 'selected' : ''}" aria-pressed="${l.guess === i}" data-action="guess" data-index="${i}">${o}</button>`).join('')}</div></fieldset><div class="toolbar">${btn(l.shown ? '重新观察图形' : '验证猜想，构造图形', 'show', '', l.guess === null)}</div><fieldset class="module-fieldset" ${!l.shown ? 'disabled' : ''}><legend>2. 一次改变一个参数</legend>${item.controls.map(c => `<div class="module-control"><label for="range-${c.key}">${c.label}</label><div><input id="range-${c.key}" type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${l.values[c.key]}" data-field="${c.key}"><input type="number" aria-label="${c.label}数值" min="${c.min}" max="${c.max}" step="${c.step}" value="${l.values[c.key]}" data-field="${c.key}"></div></div>`).join('')}<div class="preset-list">${item.presets.map(([label], i) => `<button type="button" class="button secondary small" data-action="preset" data-index="${i}">${label}</button>`).join('')}</div></fieldset><p id="input-error" class="input-error" role="alert" hidden></p><fieldset class="module-fieldset" ${!l.shown ? 'disabled' : ''}><legend>3. 我实际观察到</legend><label for="observation">用图形和数值判断，选择当前结果</label><select id="observation"><option value="">请选择观察结果</option>${item.options.map((o, i) => `<option value="${i}" ${l.observation === i ? 'selected' : ''}>${o}</option>`).join('')}</select><p id="observation-help" class="subtext">${l.observation !== null && l.observation !== m.answer ? '再对照图形与数据看看；观察还不一致。' : '猜错也没有关系，观察符合当前图形就能记录。'}</p>${btn('记录这次观察', 'record', 'id="record-observation"', !l.shown || l.observation !== m.answer)}</fieldset></div></div>${l.records.length ? `<div class="card observation-card"><h3>我的观察记录</h3><ol>${l.records.map(r => `<li>猜想：${item.options[r.guess]} → 观察：${item.options[r.observation]}。${esc(r.summary)}</li>`).join('')}</ol><details class="method-details" open><summary>从观察走向公式</summary><div class="key-takeaway"><div class="live-equation" id="lab-formula">${esc(m.formula)}</div><p>${esc(m.explanation)}</p></div></details></div>` : ''}<div class="bottom-actions"><p>每个实验至少留下1条有效观察。已记录 ${lesson.labs.filter(it => state.labs[it.id].records.length).length} / ${lesson.labs.length} 个实验。</p>${btn('归纳知识与方法 →', 'next', '', !lesson.labs.every(it => state.labs[it.id].records.length))}</div>`;
}
function viewControls() {
  return `<div class="view-controls"><strong>转动观察视角</strong><span>只改变投影，真实长度、角度和距离保持不变。</span><label>水平旋转 <input type="range" min="-180" max="180" step="5" value="${state.view.yaw}" data-view="yaw" aria-label="空间图水平旋转"></label><label>抬高视角 <input type="range" min="10" max="80" step="5" value="${state.view.pitch}" data-view="pitch" aria-label="空间图抬高视角"></label></div>`;
}
function knowledge() {
  return `<div class="key-question"><strong>把发现整理成方法</strong><h2>先检查条件，再选择公式</h2></div><div class="module-knowledge">${lesson.notes.map(n => `<article class="card"><h2>${n.title}</h2><div class="live-equation">${esc(n.formula)}</div><p>${esc(n.text)}</p></article>`).join('')}</div><div class="bottom-actions"><p>试着用自己的话说出每个公式的适用条件。</p>${btn('用例题检验理解 →', 'next')}</div>`;
}
function examples() {
  return `<div class="key-question"><strong>先自己想一步，再展开一步</strong><h2>把方法用在具体题目里</h2></div><div class="module-examples">${lesson.examples.map((ex, i) => `<article class="card"><span class="tiny-tag">例题 ${i + 1}</span><h2>${ex.title}</h2><p>${esc(ex.question)}</p><ol class="module-solution">${ex.steps.slice(0, state.examples[i]).map(s => `<li>${esc(s)}</li>`).join('')}</ol>${btn(state.examples[i] === ex.steps.length ? '本题已推导完成 ✓' : state.examples[i] ? '展开下一步' : '展开第一步', 'example', `data-index="${i}"`, state.examples[i] === ex.steps.length)}</article>`).join('')}</div><div class="bottom-actions"><p>每道例题都推导完成后，再独立练习。</p>${btn('开始独立练习 →', 'next', '', !state.examples.every((n, i) => n === lesson.examples[i].steps.length))}</div>`;
}
function practice() {
  const correct = state.answers.filter((a, i) => a.submitted && a.selected === lesson.quizzes[i].answer).length;
  return `<div class="key-question"><strong>迁移应用 · ${correct} / ${lesson.quizzes.length} 题已答对</strong><h2>${state.complete ? '本课已完成，随时回来巩固' : '合上公式，试试能否独立判断'}</h2></div><div class="module-quizzes">${lesson.quizzes.map((q, i) => { const a = state.answers[i], pass = a.submitted && a.selected === q.answer; return `<article class="card module-quiz" data-quiz="${i}"><h2><span class="quiz-number">${i + 1}</span>${esc(q.question)}</h2><div class="choice-list">${q.options.map((o, j) => `<button type="button" class="choice ${a.selected === j ? 'selected' : ''}" data-action="answer" data-index="${i}" data-option="${j}" aria-pressed="${a.selected === j}">${String.fromCharCode(65 + j)}. ${esc(o)}</button>`).join('')}</div>${btn(a.submitted ? '再次提交' : '提交答案', 'submit', `data-index="${i}"`, a.selected === null)}${a.submitted ? `<div class="quiz-feedback ${pass ? 'correct' : 'incorrect'}" role="status"><strong>${pass ? '回答正确' : '还需要再想想'}</strong><p>${esc(q.explanation)}</p>${a.hadError && pass ? '<p>这道题已经订正。</p>' : ''}</div>` : ''}</article>`; }).join('')}</div><div class="bottom-actions"><p>全部答对后，模块目录会标记本课已完成。</p>${btn(state.complete ? '本课已完成 ✓' : '完成这节课 ✓', 'finish', '', state.complete || correct !== lesson.quizzes.length)}</div>${state.complete ? `<a class="button secondary" href="?module=${currentModule.id}">返回模块，继续学习 →</a>` : ''}`;
}
function render(focus = false) {
  document.title = `${lesson ? lesson.title : currentModule ? currentModule.title : '高中数学学习地图'} · 几何实验室`;
  app.innerHTML = layout(lesson ? [scenario, experimentView, knowledge, examples, practice][state.stage]() : home());
  if (focus) document.querySelector('#lesson').focus();
}

app.addEventListener('input', event => {
  const view = event.target.dataset.view;
  if(view && lesson && state.stage===1 && ['yaw','pitch'].includes(view)) {
    if(!event.target.validity.valid) return;
    state.view[view]=event.target.valueAsNumber;
    const item=lesson.labs[state.lab];
    document.querySelector('#lab-live').innerHTML=liveExperiment(item,state.labs[item.id]);
    save(); return;
  }
  const field = event.target.dataset.field;
  if (!field || !lesson || state.stage !== 1) return;
  const item = lesson.labs[state.lab], l = state.labs[item.id], c = item.controls.find(it => it.key === field);
  if (!c || !l.shown) return;
  const input = event.target, value = input.valueAsNumber, error = document.querySelector('#input-error');
  const candidate = { ...l.values, [field]: value };
  if (!Number.isFinite(value) || !input.validity.valid || (item.id === 'points' && candidate.x === -2 && candidate.y === -1)) {
    error.hidden = false; error.textContent = '请输入范围内符合步长的数值；两点不能重合。图形保留上一次有效值。'; return;
  }
  error.hidden = true; l.values[field] = value; l.observation = null;
  document.querySelectorAll(`[data-field="${field}"]`).forEach(el => { if (el !== input) el.value = value; });
  document.querySelector('#observation').value = '';
  document.querySelector('#record-observation').disabled = true;
  document.querySelector('#observation-help').textContent = '参数已改变，请重新选择当前观察结果。';
  document.querySelector('#lab-live').innerHTML = liveExperiment(item, l);
  const formula = document.querySelector('#lab-formula');
  if (formula) formula.textContent = model(item, l.values).formula;
  save();
});
app.addEventListener('change', event => {
  if (event.target.id !== 'observation') return;
  const item = lesson.labs[state.lab], l = state.labs[item.id];
  l.observation = event.target.value === '' ? null : Number(event.target.value);
  document.querySelector('#record-observation').disabled = !l.shown || l.observation !== model(item, l.values).answer;
  document.querySelector('#observation-help').textContent = l.observation !== null && l.observation !== model(item, l.values).answer ? '再对照图形与数据看看；观察还不一致。' : '观察与当前图形一致，可以记录。';
  save();
});
app.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled || !lesson) return;
  const action = target.dataset.action, i = Number(target.dataset.index);
  if (action === 'scene') state.scene = i;
  else if (action === 'stage' && i <= state.unlocked) { state.stage = i; render(true); save(); return; }
  else if (action === 'next') {
    if (state.stage === 0 && state.scene === null) return;
    if (state.stage === 1 && !lesson.labs.every(it => state.labs[it.id].records.length)) return;
    if (state.stage === 3 && !state.examples.every((n, j) => n === lesson.examples[j].steps.length)) return;
    state.stage = Math.min(4, state.stage + 1); state.unlocked = Math.max(state.unlocked, state.stage); render(true); save(); return;
  } else if (action === 'lab') state.lab = i;
  else if (['guess', 'show', 'preset', 'record'].includes(action)) {
    const item = lesson.labs[state.lab], l = state.labs[item.id];
    if (action === 'guess') l.guess = i;
    if (action === 'show' && l.guess !== null) l.shown = true;
    if (action === 'preset' && l.shown) { l.values = { ...l.values, ...item.presets[i][1] }; l.observation = null; }
    if (action === 'record') {
      const m = model(item, l.values);
      if (!l.shown || l.observation !== m.answer) return;
      const summary = item.controls.map(c => `${c.label}=${l.values[c.key]}`).join('；') + '。' + m.status;
      if (!l.records.some(r => r.summary === summary)) l.records.push({ guess: l.guess, observation: l.observation, summary });
      l.records = l.records.slice(-12);
    }
  } else if (action === 'example') state.examples[i] = Math.min(lesson.examples[i].steps.length, state.examples[i] + 1);
  else if (action === 'answer') { state.answers[i].selected = Number(target.dataset.option); state.answers[i].submitted = false; state.complete = false; }
  else if (action === 'submit') {
    const a = state.answers[i];
    if (a.selected === null) return;
    a.submitted = true; a.hadError ||= a.selected !== lesson.quizzes[i].answer;
  } else if (action === 'finish') {
    if (!state.answers.every((a, j) => a.submitted && a.selected === lesson.quizzes[j].answer)) return;
    state.complete = true;
  } else if (action === 'open-reset') resetOpen = true;
  else if (action === 'cancel-reset') resetOpen = false;
  else if (action === 'confirm-reset') { state = saved.lessons[lesson.id] = freshLesson(lesson); resetOpen = false; }
  save(); render();
  if (resetOpen) document.querySelector('#cancel-reset').focus();
  else if (['cancel-reset', 'confirm-reset'].includes(action)) document.querySelector('[data-action="open-reset"]').focus();
  else {
    const match = [...document.querySelectorAll('[data-action]')].find(el => el.dataset.action === action && (!target.hasAttribute('data-index') || el.dataset.index === target.dataset.index) && (!target.hasAttribute('data-option') || el.dataset.option === target.dataset.option));
    if (match && !match.disabled) match.focus();
  }
});
document.addEventListener('keydown', event => {
  if (!resetOpen) return;
  if (event.key === 'Escape') { resetOpen = false; render(); document.querySelector('[data-action="open-reset"]').focus(); }
  if (event.key === 'Tab') {
    const items = [...document.querySelectorAll('[role="dialog"] button')], first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
render();
