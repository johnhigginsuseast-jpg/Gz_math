import { course, exercises, topics } from './course.mjs';
import { experiment, relations, format, lineCircle, movingLine, distanceExtrema, tangentLines, constructionSnapshot } from './math.mjs';
import { STORAGE_KEY, initialState, restoreState, canRecord, recordObservation, submitAnswer, practiceProgress } from './state.mjs';

const app = document.querySelector('#app');
document.title = '直线与圆的位置关系 · 几何实验室';
let storageNotice = '';
let storageWritable = true;
let restored;
try {
  restored = restoreState(localStorage.getItem(STORAGE_KEY));
  if (restored.recovered) storageNotice = '原来的学习记录无法读取，已从新的一课开始。';
  if (restored.upgraded) storageNotice = '课程已升级：原实验和已答题目已保留，新增四个专题还需要继续探索。';
} catch {
  restored = { state: initialState() };
  storageWritable = false;
  storageNotice = '浏览器无法使用本地存储。本次仍可学习，关闭页面后进度可能丢失。';
}
let state = restored.state;
let constructionProgress = state.construction;
let constructionTimer = null;
let resetDialog = false;

const paths = {
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z',
  compass: 'm9 4 3-2 3 2M12 5v4M10 9 4 21m10-12 6 12M7 16h10',
  sliders: 'M4 7h16M4 17h16M9 4v6m6 4v6',
  bulb: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 2H9Z',
  orbit: 'M20 11a8 8 0 1 1-3-5M20 3v6h-6M9 12l2 2 4-4',
  book: 'M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z',
  pen: 'm4 16 12-12 4 4L8 20H4Zm10-10 4 4M4 21h16',
  flag: 'M5 21V3m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  check: 'm5 12 4 4L19 6',
  lock: 'M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5Zm7 4v3',
  play: 'm8 4 12 8-12 8Z',
  pause: 'M8 5v14M16 5v14',
  refresh: 'M20 5v6h-6M4 19v-6h6M5 9a7 7 0 0 1 12-4l3 3M4 16l3 3a7 7 0 0 0 12-4',
  leaf: 'M19 3C7 3 3 7 5 15s14 4 14-12ZM5 20 15 8',
  info: 'M12 11v6m0-10v.1M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
};
function icon(name, extra = '') {
  return `<svg class="icon ${extra}" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[name] || paths.spark}"/></svg>`;
}
function escapeText(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function button(label, action, disabled = false, style = '', extra = '') {
  return `<button type="button" class="button ${style}" data-action="${action}" ${disabled ? 'disabled' : ''} ${extra}>${label}</button>`;
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    storageWritable = false;
    storageNotice = '学习记录未能写入浏览器。本次仍可学习，关闭页面后进度可能丢失。';
    const notice = document.querySelector('#storage-notice');
    if (notice) { notice.hidden = false; notice.textContent = storageNotice; }
    const badge = document.querySelector('.local-badge');
    if (badge) badge.textContent = '本地学习 · 临时会话';
  }
}
function stopConstruction() {
  cancelAnimationFrame(constructionTimer);
  constructionTimer = null;
}
function animateConstruction(target) {
  stopConstruction();
  const start = constructionProgress;
  const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 100 : (target - start) * 1400;
  let started;
  const tick = now => {
    started ??= now;
    const elapsed = duration > 0 ? Math.min(1, (now - started) / duration) : 1;
    constructionProgress = start + (target - start) * elapsed;
    state.construction = Math.max(state.construction, Math.floor(constructionProgress + 1e-8));
    const plotElement = document.querySelector('#plot');
    if (!plotElement || state.stage !== 1) return stopConstruction();
    plotElement.innerHTML = plot({ progress: constructionProgress, offset: 0, details: false, intersections: false });
    document.querySelector('#construction-counter').textContent = `${Math.floor(constructionProgress)} / 4`;
    document.querySelectorAll('.construction-list li').forEach((item, index) => item.classList.toggle('shown', constructionProgress >= index + 1));
    if (elapsed < 1) constructionTimer = requestAnimationFrame(tick);
    else {
      stopConstruction();
      save();
      render();
    }
  };
  constructionTimer = requestAnimationFrame(tick);
}
function navigate(stage) {
  if (stage > state.unlocked) return;
  stopConstruction();
  state.stage = stage;
  constructionProgress = state.construction;
  save();
  render();
  document.querySelector('#lesson').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: 'instant' });
}
function advance() {
  if (!state.completed.includes(state.stage)) state.completed.push(state.stage);
  state.unlocked = Math.max(state.unlocked, Math.min(7, state.stage + 1));
  if (state.stage === 5) state.topic = 'position';
  navigate(Math.min(7, state.stage + 1));
}
function choices(options, selected, action, { multiple = false, extra = '', count = false } = {}) {
  const values = Array.isArray(selected) ? selected : [selected];
  return `<div class="choices ${count ? 'count-choices' : ''}" role="group" aria-label="${multiple ? '多项选择' : '选择一个答案'}">${options.map((text, index) =>
    `<button type="button" class="choice ${multiple ? 'multiple' : ''} ${values.includes(index) ? 'selected' : ''}" data-action="${action}" data-index="${index}" aria-pressed="${values.includes(index)}" ${extra}><span class="choice-marker">${values.includes(index) ? '✓' : String.fromCharCode(65 + index)}</span>${text}</button>`).join('')}</div>`;
}
function countChoices(selected, action) {
  return choices(['0个', '1个', '2个'], selected, action, { count: true });
}
function recordTable() {
  return `<div class="table-scroll"><table class="record-table"><caption class="sr-only">实验观察记录，圆的半径始终为3</caption><thead><tr><th scope="col">直线位置</th><th scope="col">距离 d</th><th scope="col">公共点</th><th scope="col">观察结果</th></tr></thead><tbody>${state.records.length ? state.records.map(record =>
    `<tr><td>y = ${record.t}</td><td>${record.t}</td><td>${record.count}个</td><td>${relations[course.rounds.find(round => round.t === record.t).kind].label}</td></tr>`).join('') : '<tr><td class="empty" colspan="4">亲手记录，你的发现会留在这里。</td></tr>'}</tbody></table></div>`;
}
function parkArt() {
  return `<div class="hero-art"><span class="art-label">A LITTLE GEOMETRY, EVERY DAY</span>
  <svg viewBox="0 0 480 410" role="img" aria-labelledby="park-title"><title id="park-title">直线道路穿过圆形公园，与公园边界有两个公共点</title>
  <defs><pattern id="park-grid" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#cdd5c3"/></pattern><clipPath id="park-clip"><circle cx="241" cy="205" r="123"/></clipPath></defs>
  <path fill="url(#park-grid)" d="M0 0h480v410H0Z"/><circle cx="241" cy="205" r="150" fill="none" stroke="#dde4d7" stroke-dasharray="3 6"/><path d="M35 205h407M241 31v345" stroke="#c4cdbb" stroke-dasharray="4 5"/>
  <circle cx="241" cy="205" r="123" fill="#d6e9bd" stroke="#86a367" stroke-width="2.2"/>
  <g clip-path="url(#park-clip)"><path d="M210 68c-25 86 100 113 66 269M99 208c83-23 160 1 263-37" stroke="#eef3e1" stroke-width="17" fill="none"/><path d="M188 259c17-14 51-16 62 1s6 37-14 40-67-16-48-41" fill="#bbd8ca"/>
  <g fill="#8eaf73"><circle cx="175" cy="147" r="13"/><circle cx="321" cy="178" r="12"/><circle cx="287" cy="125" r="9"/><circle cx="168" cy="256" r="10"/><circle cx="290" cy="280" r="12"/></g><g fill="#adc88e"><circle cx="173" cy="144" r="8"/><circle cx="319" cy="175" r="8"/><circle cx="285" cy="122" r="6"/><circle cx="166" cy="253" r="7"/><circle cx="288" cy="277" r="8"/></g></g>
  <path d="m45 318 385-186" stroke="#fff" stroke-width="20"/><path d="m45 318 385-186" stroke="#8b83b3" stroke-width="14"/><path d="m45 318 385-186" stroke="#e9e4ff" stroke-width="1.5" stroke-dasharray="9 9"/>
  <circle cx="138.5" cy="272.8" r="5" fill="#7657d4" stroke="white" stroke-width="2"/><circle cx="357.9" cy="166.8" r="5" fill="#7657d4" stroke="white" stroke-width="2"/>
  <path d="M241 205v-123" stroke="#c19c45" stroke-width="1.6" stroke-dasharray="4 4"/><circle cx="241" cy="205" r="4" fill="#60794e"/><text x="251" y="212" class="handnote">O</text><text x="249" y="139" class="handnote">r</text>
  <rect x="49" y="86" width="99" height="32" rx="9" fill="white" opacity=".94"/><text x="65" y="107" class="handnote">圆形公园</text><path d="m150 103 28 18" stroke="#82976f" fill="none"/>
  <rect x="315" y="291" width="108" height="33" rx="9" fill="white" opacity=".94"/><text x="331" y="313" class="handnote">笔直的道路</text><path d="m365 286-9-61" stroke="#9991b0" fill="none" stroke-dasharray="3 3"/>
  <rect x="317" y="63" width="70" height="25" rx="12" fill="#fff" transform="rotate(9 352 76)"/><text x="329" y="80" font-size="10" fill="#8d7bad" transform="rotate(9 352 76)">试着想一想</text>
  </svg><span class="art-caption">生活里的问题，也可以用数学来回答。</span></div>`;
}
function plot({ radius = 3, offset = 2, angle = 0, level = 4, progress = null, details = true, intersections = true, geometry = null, overlay = '', chord = false, hideLine = false, hideRadius = false, distanceLabel = 'd', description = '' } = {}) {
  const result = geometry || experiment(radius, offset, angle);
  const frame = progress === null ? constructionSnapshot(level) : constructionSnapshot(progress);
  const point = (x, y) => [300 + x * 42, 300 - y * 42];
  const [hx, hy] = point(result.foot.x, result.foot.y);
  const direction = result.direction;
  const from = point(result.foot.x - 9 * direction.x * frame.line, result.foot.y - 9 * direction.y * frame.line);
  const to = point(result.foot.x + 9 * direction.x * frame.line, result.foot.y + 9 * direction.y * frame.line);
  const tickLabels = [-4, -2, 2, 4].map(n => `<text x="${300 + n * 42}" y="328" text-anchor="middle">${n}</text><text x="284" y="${304 - n * 42}" text-anchor="end">${n}</text>`).join('');
  const intersectionMarks = frame.line === 1 && intersections ? result.points.map((p, index) => {
    const [x, y] = point(p.x, p.y);
    return `<circle cx="${x}" cy="${y}" r="5.3" fill="#7655d9" stroke="white" stroke-width="2"/><text x="${x + 10}" y="${y - 10}" fill="#7555dc" font-size="17">${result.count === 1 ? 'T' : index === 0 ? 'P' : 'Q'}</text>`;
  }).join('') : '';
  const chordPath = chord && result.count === 2 ? `<path d="M300 300L${hx} ${hy}L${point(result.points[0].x, result.points[0].y).join(' ')}Z" fill="#f5ce80" fill-opacity=".25"/><path d="M${point(result.points[0].x, result.points[0].y).join(' ')}L${point(result.points[1].x, result.points[1].y).join(' ')}" stroke="#c67d2b" stroke-width="6" stroke-linecap="round"/>` : '';
  const circumference = 2 * Math.PI * radius * 42;
  const tracer = point(radius * Math.cos(Math.PI / 2 - frame.circle * Math.PI * 2), radius * Math.sin(Math.PI / 2 - frame.circle * Math.PI * 2));
  return `<svg viewBox="0 0 600 600" role="img" aria-labelledby="graph-title" data-construction-progress="${progress ?? 4}"><title id="graph-title">${description || (frame.line === 1 && details ? `半径${format(radius)}，圆心到直线距离${format(result.distance)}，${relations[result.kind].label}，${result.count}个公共点` : '直角坐标系中的圆与直线，按步骤观察图形')}</title>
  <defs><pattern id="graph-grid" width="42" height="42" x="48" y="48" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#e9e7f1" stroke-width="1"/></pattern><clipPath id="graph-clip"><rect x="42" y="42" width="516" height="516" rx="6"/></clipPath></defs>
  <rect x="48" y="48" width="504" height="504" fill="url(#graph-grid)"/><path d="M48 300H557M300 552V42" stroke="#bab7cc" stroke-width="1.3"/><path d="m550 296 7 4-7 4m-254-255 4-7 4 7" fill="none" stroke="#bab7cc" stroke-width="1.3"/>
  <g font-size="16" fill="#8c889f" font-family="Segoe UI,sans-serif">${tickLabels}<text x="564" y="306">x</text><text x="308" y="39">y</text></g>
  <g clip-path="url(#graph-clip)">${frame.circle > 0 ? `<circle class="constructed-circle" cx="300" cy="300" r="${radius * 42}" fill="#eee8fd" fill-opacity="${.65 * frame.circle}" stroke="#8666df" stroke-width="2.8" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference * (1 - frame.circle)}" transform="rotate(-90 300 300)"/>${frame.circle < 1 ? `<circle cx="${tracer[0]}" cy="${tracer[1]}" r="5" fill="#7555dc"/>` : ''}` : ''}
  ${frame.radius > 0 && !hideRadius ? `<path d="M300 300 ${300 + radius * 42 * frame.radius / Math.sqrt(2)} ${300 - radius * 42 * frame.radius / Math.sqrt(2)}" stroke="#dca14b" stroke-width="2.5"/>${frame.radius > .95 ? `<text x="${310 + radius * 42 / Math.sqrt(2)}" y="${290 - radius * 42 / Math.sqrt(2)}" fill="#bd893e" font-size="18">r</text>` : ''}` : ''}
  ${frame.line > 0 && !hideLine ? `<path d="M${from[0]} ${from[1]}L${to[0]} ${to[1]}" stroke="#348b76" stroke-width="3"/>` : ''}
  ${frame.line === 1 && details ? `<path d="M300 300L${hx} ${hy}" stroke="#d89a3f" stroke-width="2.2" stroke-dasharray="6 5"/><circle cx="${hx}" cy="${hy}" r="3" fill="#d89a3f"/><text x="${(300 + hx) / 2 + 12}" y="${(300 + hy) / 2 + (offset < 0 ? 17 : -7)}" fill="#ac782d" font-size="17">${distanceLabel} = ${format(result.distance)}</text>${result.distance > .15 ? `<text x="${hx + 10}" y="${hy + 18}" fill="#a97c36" font-size="17">H</text>` : ''}` : ''}
  ${chordPath}${intersectionMarks}${overlay}</g>
  ${frame.center > 0 ? `<g opacity="${frame.center}"><circle cx="300" cy="300" r="${4.2 * frame.center}" fill="#545068"/><text x="308" y="322" fill="#69617d" font-size="17">O</text></g>` : ''}
  </svg>`;
}
function plotCard(options, label = '几何观察窗') {
  return `<div class="card plot-card"><div class="plot-top"><strong>${icon('compass')} ${label}</strong><span>等比例坐标系</span></div><div class="plot" id="plot">${plot(options)}</div><div class="plot-legend"><span class="legend-key">圆周</span><span class="legend-key road">直线</span><span class="legend-key distance">半径 / 距离</span></div></div>`;
}
function metrics() {
  const result = experiment(state.free.radius, state.free.offset, state.free.angle);
  const relation = relations[result.kind];
  return `<div class="status-row"><div class="metric"><span>半径 r</span><strong>${format(state.free.radius)}</strong></div><div class="metric"><span>距离 d = |s|</span><strong>${format(result.distance)}</strong></div><div class="metric"><span>公共点</span><strong>${result.count}<small> 个</small></strong></div></div><div class="relation" data-kind="${result.kind}" role="status"><strong>${relation.label}</strong><div><p>d ${relation.sign} r</p><p>${relation.description}</p></div></div><div class="coordinate-list">${result.count ? `公共点：${result.points.map(p => `(${format(p.x)}, ${format(p.y)})`).join('、')}` : '公共点：无'}<br>垂足 H： (${format(result.foot.x)}, ${format(result.foot.y)})；O： (0, 0)</div>`;
}
function control(name, label, value, min, max, step, disabled = false) {
  return `<div class="control"><div class="control-head"><label for="${name}-range">${label}</label><label class="sr-only" for="${name}-number">${label}的数值</label><input class="number-input" id="${name}-number" type="number" min="${min}" max="${max}" step="${step}" value="${format(value)}" data-control="${name}" ${disabled ? 'disabled' : ''}></div><input class="range" id="${name}-range" type="range" min="${min}" max="${max}" step="${step}" value="${value}" data-control="${name}" ${disabled ? 'disabled' : ''}><div class="range-labels"><span>${min}</span><span>${max}</span></div></div>`;
}
function scenario() {
  return `<div class="hero fade-in"><div class="hero-copy"><span class="tiny-tag">从生活里，发现数学</span><h2>${course.scenario.title}</h2><p>${course.scenario.description}</p><div class="tags"><span class="tag">直线</span><span class="tag">圆</span><span class="tag">公共点</span></div></div>${parkArt()}</div>
  <div class="prediction-panel"><div class="panel-title"><span class="icon-box">${icon('bulb')}</span><h3>先别急着算，说说你的猜想</h3><small>猜错也没关系</small></div><p class="prompt">从图中的位置开始，把道路不断向上平移，公共点可能怎样变化？</p>${choices(course.scenario.options, state.prediction, 'scenario-choice')}
  ${state.prediction !== null ? '<p class="feedback" role="status">猜想已记下。接下来用图形和实验验证，你可以随时修正自己的想法。</p>' : ''}<div class="bottom-actions"><p>${icon('info')}把道路看作向两端无限延伸的直线，边界看作圆周。</p>${button(`带着猜想去探索 ${icon('arrow')}`, 'next', state.prediction === null)}</div></div>
  <div class="objectives">${course.objectives.map((text, i) => `<div class="objective"><span class="icon-box">${icon(['orbit', 'bulb', 'pen'][i])}</span><span><strong>0${i + 1}</strong>${text}</span></div>`).join('')}</div>`;
}
function construction() {
  const frame = Math.floor(constructionProgress);
  const labels = ['确定圆心 O，建立位置的参照。', '从圆心出发，取长度为3的半径。', '与圆心距离为3的所有点，组成圆周。', '放入一条直线，准备观察它与圆周的相遇。'];
  return `<div class="workspace fade-in">${plotCard({ progress: constructionProgress, offset: 0, details: false, intersections: false }, '跟着轨迹，看图形慢慢形成')}<div class="card"><div class="eyebrow">BUILD THE GEOMETRY <span class="step-counter" id="construction-counter">${frame} / 4</span></div><h2>先看图形怎样生成</h2><p class="subtext">半径慢慢伸展，圆周沿轨迹描出，再把直线放进来。你可以随时暂停，或只看下一小步。</p><ol class="construction-list">${labels.map((label, i) => `<li class="${frame > i ? 'shown' : ''}"><span>${frame > i ? '✓' : i + 1}</span>${label}</li>`).join('')}</ol>
  <div class="toolbar">${button(icon(constructionTimer ? 'pause' : 'play') + (constructionTimer ? '暂停' : frame === 4 ? '再演示一遍' : constructionProgress > 0 ? '继续播放' : '播放构造'), 'play-construction', false, 'small')}${button('下一小步', 'construction-step', frame === 4 || constructionTimer !== null, 'secondary small')}${button(icon('refresh') + '重播', 'construction-replay', false, 'quiet small')}</div>
  ${frame === 4 ? '<div class="formula mt">x² + y² = 9<br>y = t<small>圆心 (0, 0)，半径3；直线的位置由 t 决定。</small></div>' : '<div class="key-question mt"><strong>观察重点</strong><p>圆周上的每一点，到圆心的距离始终是3。</p></div>'}
  <div class="bottom-actions"><p>构造完成后，再用方程描述它。</p>${button('进入动手实验 ' + icon('arrow'), 'next', frame < 4)}</div></div></div>`;
}
function guided() {
  const round = course.rounds[state.records.length];
  if (!round) return `<div class="workspace fade-in">${plotCard({ offset: state.t })}<div class="card"><span class="tiny-tag">三次观察，三个发现</span><h2 class="mt">你已经收集到关键证据</h2>${recordTable()}<p class="subtext mt">距离从2变为3、再变为4时，公共点从2个变为1个、再变为0个。这个变化与哪个量有关？</p>${button('用数学语言归纳 ' + icon('arrow'), 'next')}</div></div>`;
  return `<div class="workspace fade-in">${plotCard({ offset: state.t, details: state.guess !== null, intersections: state.guess !== null })}<div><div class="card"><div class="eyebrow">PREDICT · TRY · OBSERVE <span class="step-counter">${state.records.length + 1} / 3</span></div><h2>${['先试着靠近圆的边缘', '寻找刚好相遇的位置', '再向外移动一点'][state.records.length]}</h2><p class="prompt">${round.prompt}</p><p class="subtext">固定条件：圆心 (0, 0)，半径 r = 3。</p><h3>① 先猜想：会有几个公共点？</h3>${countChoices(state.guess, 'guess')}
  <div class="controls"><h3>② 动手验证：将直线移到目标位置</h3>${control('t', '直线位置 t', state.t, -5, 5, .1, state.guess === null)}${button(`准确移到 y = ${round.t}`, 'target', state.guess === null, 'secondary small')}<p class="control-note">滑动、方向键或输入数值都可以。每轮只改变 t。</p></div><p id="input-error" class="control-note" role="status"></p>
  <div class="observation-block"><h3>③ 我观察到的公共点数</h3>${countChoices(state.observation, 'observation')}<div id="guided-feedback">${guidedFeedback()}</div><div class="mt">${button('记下这次发现 ' + icon('pen'), 'record', !canRecord(state), '', 'id="record-button"')}</div></div></div><div class="card mt"><div class="panel-title"><h3>我的实验记录</h3><small>r 始终为3</small></div>${recordTable()}</div></div></div>`;
}
function guidedFeedback() {
  const round = course.rounds[state.records.length];
  if (!round || state.guess === null) return '<p class="control-note">先做预测，再开始操作。</p>';
  if (Math.abs(state.t - round.t) > 1e-9) return `<p class="control-note">目标是 t = ${round.t}，当前是 ${format(state.t)}。移动到目标后再记录。</p>`;
  if (state.observation === null) return '<p class="control-note">已经到达目标。仔细数一数图中直线与圆周重合的位置。</p>';
  if (state.observation !== round.count) return '<p class="feedback warning" role="status">再看一次：只数直线与圆周的公共点，圆心和垂足不一定是公共点。</p>';
  return `<p class="feedback success" role="status">观察正确！${state.guess === round.count ? '这次实验支持了你的猜想。' : '你的观察修正了原来的猜想，这也是重要的发现。'}现在可以保存记录。</p>`;
}
function miniDiagram(kind) {
  const y = { intersect: 57, tangent: 25, separate: 10 }[kind];
  return `<svg class="mini-diagram" viewBox="0 0 180 110" aria-hidden="true"><circle cx="90" cy="64" r="39" fill="#f0eafb" stroke="#9a7bde" stroke-width="2"/><path d="M16 ${y}h148" stroke="#388a76" stroke-width="2.3"/><path d="M90 64V${y}" stroke="#d19a48" stroke-dasharray="3 3"/><circle cx="90" cy="64" r="2.6" fill="#69617d"/></svg>`;
}
function rule() {
  return `<div class="chapter-intro">${icon('bulb')}<div><h2>让距离，告诉我们答案</h2><p>把你记录的现象，整理成能够解决新问题的规律。</p></div></div><div class="rule-grid">${['intersect', 'tangent', 'separate'].map(kind => `<div class="rule-card">${miniDiagram(kind)}<h3>${relations[kind].label}</h3><div class="comparison">d ${relations[kind].sign} r</div><p>${{ intersect: '2个公共点', tangent: '1个公共点', separate: '0个公共点' }[kind]}</p></div>`).join('')}</div>
  <div class="knowledge-grid"><div class="card"><h3>把“远近”说准确</h3><p>d 是圆心到直线的<strong>垂直距离</strong>，不是圆心到直线上任意一点的距离。</p><div class="formula">d = |Aa + Bb + C| / √(A² + B²)<small>圆心 (a, b)，直线 Ax + By + C = 0；A、B 不能同时为0。</small></div><p>圆的标准方程：(x − a)² + (y − b)² = r²，r > 0。</p><p>距离公式也适用于竖直线 x = c，不需要先求斜率。</p></div><div class="card"><h3>回头看看，你已经亲手验证了</h3>${recordTable()}<p class="subtext mt">本次圆心在原点、直线是 y = t，所以 d = |t|。t = −3 和 t = 3 都与圆相切。</p></div></div>
  <div class="card mt rule-check"><div class="panel-title"><span class="icon-box">${icon('bulb')}</span><h3>进入下一步前，想清楚一件事</h3></div><p class="prompt">决定直线与圆位置关系的关键比较是什么？</p>${choices(['直线是否水平，与圆画得是否漂亮', '圆心到直线的距离 d，与半径 r', '直线在圆的上方，还是下方'], state.ruleAnswer, 'rule-answer')}
  ${state.ruleAnswer !== null ? `<p class="feedback ${state.ruleAnswer === 1 ? 'success' : 'warning'}" role="status">${state.ruleAnswer === 1 ? '正是这样！接下来改变直线方向和圆的大小，看看规律能否继续成立。' : '回看三次记录：每次比较的是圆心到直线的垂直距离和固定半径。再想一想。'}</p>` : ''}
  <div class="bottom-actions"><p>把观察变成可以迁移的结论。</p>${button('解锁自由探索 ' + icon('arrow'), 'next', state.ruleAnswer !== 1)}</div></div>`;
}
function topicTabs() {
  return `<nav class="topic-tabs" aria-label="题型选择">${topics.map(topic => `<button type="button" class="topic-tab ${state.topic === topic.id ? 'active' : ''}" data-action="topic" data-topic="${topic.id}" aria-pressed="${state.topic === topic.id}">${topic.label}</button>`).join('')}</nav>`;
}
function nextTopicButton() {
  const next = topics[(topics.findIndex(topic => topic.id === state.topic) + 1) % topics.length];
  return button(`下一题型：${next.label} ${icon('arrow')}`, 'topic', false, 'secondary small', `data-topic="${next.id}"`);
}
function diagramPoint(point, label, color = '#c37e2f') {
  return `<circle cx="${300 + point.x * 42}" cy="${300 - point.y * 42}" r="6" fill="${color}" stroke="white" stroke-width="2"/><text x="${300 + point.x * 42 + (point.x > 3.5 ? -12 : 10)}" y="${288 - point.y * 42}" text-anchor="${point.x > 3.5 ? 'end' : 'start'}" font-size="18" fill="${color}">${label}</text>`;
}
function diagramSegment(from, to, dashed = false) {
  return `<path d="M${300 + from.x * 42} ${300 - from.y * 42}L${300 + to.x * 42} ${300 - to.y * 42}" fill="none" stroke="#ce8a30" stroke-width="2.5" ${dashed ? 'stroke-dasharray="6 4"' : ''}/>`;
}
function lineEquation(line) {
  const norm = Math.hypot(line.A, line.B);
  let values = [line.A / norm, line.B / norm, -line.C / norm];
  if (values[0] < -1e-9 || Math.abs(values[0]) < 1e-9 && values[1] < 0) values = values.map(value => -value);
  let exact = false;
  for (let scale = 1; scale <= 20; scale++) {
    const scaled = values.map(value => value * scale);
    if (scaled.every(value => Math.abs(value - Math.round(value)) < 1e-8)) {
      values = scaled.map(Math.round);
      exact = true;
      break;
    }
  }
  const [A, B, C] = values;
  const term = (value, symbol) => `${Math.abs(value) === 1 ? '' : format(Math.abs(value), 3)}${symbol}`;
  const left = [Math.abs(A) > 1e-9 ? term(A, 'x') : '', Math.abs(B) > 1e-9 ? `${Math.abs(A) > 1e-9 ? B < 0 ? ' − ' : ' + ' : B < 0 ? '−' : ''}${term(B, 'y')}` : ''].join('');
  return `${left} ${exact ? '=' : '≈'} ${format(C, 3)}`;
}
function labModel() {
  const { radius, offset, angle, pointAngle, externalX, tangentMode, extremaMode } = state.free;
  if (state.topic === 'position') return { options: { radius, offset, angle }, metrics: metrics() };
  if (state.topic === 'chord') {
    const result = experiment(radius, offset, 0);
    return { options: { radius, offset, chord: true }, metrics: `<div class="status-row"><div class="metric"><span>半径 r</span><strong>${format(radius)}</strong></div><div class="metric"><span>圆心距 d</span><strong>${format(result.distance)}</strong></div><div class="metric"><span>弦长 L</span><strong>${result.chordLength === null ? '不存在' : format(result.chordLength)}</strong></div></div><div class="live-result" role="status"><strong>${result.kind === 'intersect' ? `弦长 L ≈ ${format(result.chordLength)}` : result.kind === 'tangent' ? '相切：弦退化为一个点' : '相离：没有弦'}</strong><p>${result.kind === 'intersect' ? '橙色线段是整条弦。圆心到弦的垂线，将它分成相等的两半。' : '弦长公式不能把负数开平方；先判断直线与圆的位置关系。'}</p></div>` };
  }
  if (state.topic === 'extrema') {
    const radians = pointAngle * Math.PI / 180;
    const P = { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
    const target = extremaMode === 'point' ? { x: externalX, y: 0 } : { x: P.x, y: offset };
    const D = extremaMode === 'point' ? externalX : Math.abs(offset);
    const extrema = distanceExtrema(radius, D, extremaMode);
    const distance = Math.hypot(P.x - target.x, P.y - target.y);
    const targetLabel = extremaMode === 'point' ? 'E' : 'J';
    const markers = distance < 1e-8 ? diagramPoint(P, `P=${targetLabel}`) : diagramPoint(P, 'P') + diagramPoint(target, targetLabel);
    return { options: { radius, offset: extremaMode === 'point' ? 0 : offset, distanceLabel: 'D', hideLine: extremaMode === 'point', details: extremaMode === 'line', hideRadius: true, intersections: false, overlay: diagramSegment(P, target) + diagramSegment({ x: 0, y: 0 }, P, true) + markers, description: `圆上动点P到${extremaMode === 'point' ? '定点E' : '直线'}的距离${format(distance)}，最小${format(extrema.min)}，最大${format(extrema.max)}` }, metrics: `<div class="status-row"><div class="metric"><span>当前距离 P${targetLabel}</span><strong>${format(distance)}</strong></div><div class="metric"><span>最小距离</span><strong>${format(extrema.min)}</strong></div><div class="metric"><span>最大距离</span><strong>${format(extrema.max)}</strong></div></div><div class="live-result" role="status"><strong>${extremaMode === 'point' ? 'OE' : '圆心距 D'} = ${format(D)}，半径 r = ${format(radius)}</strong><p>${extremaMode === 'point' ? '这是到定点的距离，最小值为|OE−r|；定点在圆内时通常也不为0。' : Math.abs(offset) < radius ? '直线穿过圆，动点到达交点时距离为0。最近点不一定在过圆心的垂线上。' : '沿圆周移动P，对比最近与最远位置。圆心距不能代替动点到直线的距离。'}</p></div>` };
  }
  if (state.topic === 'moving') {
    const result = movingLine(3, angle);
    return { options: { radius: 3, angle, geometry: result, overlay: diagramPoint({ x: 4, y: 0 }, 'F(4,0)') }, metrics: `<div class="live-result" role="status"><strong>不变的点：F(4,0)</strong><p>当前圆心距 d ≈ ${format(result.distance)}，直线与圆${relations[result.kind].label}，有${result.count}个公共点。</p><p>${lineEquation(result.line)}</p></div><p class="control-note">直线族：sinθ(x−4)−cosθ·y=0。θ=90°时为x=4；有限k的y=k(x−4)不含这条竖直线。</p>` };
  }
  const radians = pointAngle * Math.PI / 180;
  const known = tangentMode === 'on' ? { x: 3 * Math.cos(radians), y: 3 * Math.sin(radians) } : { x: externalX, y: 0 };
  const tangents = tangentLines({ r: 3 }, known);
  let overlay = diagramPoint(known, tangentMode === 'on' ? 'T' : 'E');
  for (const [index, tangent] of tangents.entries()) {
    const norm = Math.hypot(tangent.line.A, tangent.line.B);
    const dx = -tangent.line.B / norm * 15;
    const dy = tangent.line.A / norm * 15;
    overlay += `<path d="M${300 + (tangent.point.x - dx) * 42} ${300 - (tangent.point.y - dy) * 42}L${300 + (tangent.point.x + dx) * 42} ${300 - (tangent.point.y + dy) * 42}" stroke="#348b76" stroke-width="3"/>`;
    overlay += diagramSegment({ x: 0, y: 0 }, tangent.point, true);
    if (tangentMode === 'through') overlay += diagramPoint(tangent.point, `T${index + 1}`, '#7555dc');
  }
  return { options: { radius: 3, hideLine: true, hideRadius: true, details: false, intersections: false, overlay, description: `已知点(${format(known.x)},${format(known.y)})，共有${tangents.length}条切线，圆的半径3` }, metrics: `<div class="live-result" role="status"><strong>${tangents.length}条切线</strong><p>已知点 ${tangentMode === 'on' ? 'T' : 'E'}： (${format(known.x)}, ${format(known.y)})</p>${tangents.length ? tangents.map(tangent => `<div class="live-equation">${lineEquation(tangent.line)}</div>`).join('') : '<p>已知点在圆内，经过它的直线都会穿过圆，因此没有切线。</p>'}</div><p class="control-note">实线是切线，虚线是对应半径，二者互相垂直。“≈”表示方程系数仅作近似展示，计算使用未舍入值。</p>` };
}
function freeExplore() {
  const topic = topics.find(item => item.id === state.topic);
  const model = labModel();
  let controls = '';
  if (state.topic === 'position') controls += control('angle', '直线旋转角 θ（度）', state.free.angle, 0, 180, 1);
  if (['position', 'chord'].includes(state.topic) || state.topic === 'extrema' && state.free.extremaMode === 'line') controls += control('offset', '直线位置 s（圆心距为|s|）', state.free.offset, -5, 5, .1);
  if (['position', 'chord', 'extrema'].includes(state.topic)) controls += control('radius', '圆的半径 r', state.free.radius, 1, 4, .1);
  if (state.topic === 'extrema') controls = `<div class="toolbar tangent-modes">${button('到定直线', 'extrema-mode', false, state.free.extremaMode === 'line' ? 'small' : 'secondary small', 'data-mode="line"')}${button('到定点E', 'extrema-mode', false, state.free.extremaMode === 'point' ? 'small' : 'secondary small', 'data-mode="point"')}</div>` + control('pointAngle', '动点P沿圆周的位置（度）', state.free.pointAngle, 0, 360, 'any') + `<div class="toolbar">${button('移动到最近位置', 'nearest', false, 'secondary small')}${button('移动到最远位置', 'farthest', false, 'secondary small')}</div>` + (state.free.extremaMode === 'point' ? control('externalX', '定点E的横坐标（纵坐标为0）', state.free.externalX, 0, 6, .1) : '') + controls;
  if (state.topic === 'moving') controls = control('angle', '绕固定点F旋转（度）', state.free.angle, 0, 180, 1);
  if (state.topic === 'tangent') controls = `<div class="toolbar tangent-modes">${button('已知切点', 'tangent-mode', false, state.free.tangentMode === 'on' ? 'small' : 'secondary small', 'data-mode="on"')}${button('过已知点', 'tangent-mode', false, state.free.tangentMode === 'through' ? 'small' : 'secondary small', 'data-mode="through"')}</div>` + (state.free.tangentMode === 'on' ? control('pointAngle', '切点T沿圆周的位置（度）', state.free.pointAngle, 0, 360, 'any') : control('externalX', '已知点E的横坐标（纵坐标为0）', state.free.externalX, 0, 6, .1));
  return `${topicTabs()}<div class="key-question"><strong>这次只想清楚一个问题</strong><h2>${topic.question}</h2></div><div class="workspace fade-in">${plotCard(model.options, topic.label + ' · 几何观察窗')}<div class="card"><div class="eyebrow">动手改一改，观察图形</div>${['moving', 'tangent'].includes(state.topic) ? '<p class="subtext">固定圆：x²+y²=9，半径 r=3。</p>' : ''}${controls}<p id="input-error" class="control-note" role="status"></p><div id="metrics">${model.metrics}</div><details class="method-details" ${state.topic === 'position' ? 'open' : ''}><summary>观察之后，查看重点结论与方法</summary><div class="key-takeaway"><strong>${topic.takeaway}</strong><p>${escapeText(topic.method)}</p></div></details><div class="toolbar mt">${button(icon('refresh') + '恢复初始状态', 'reset-free', false, 'secondary small')}${nextTopicButton()}</div></div></div><div class="bottom-actions"><p>五类问题都可以切换探索，再用例题把方法串起来。</p>${button('进入分题型例题 ' + icon('arrow'), 'next')}</div>`;
}
function examples() {
  const completed = state.exampleSteps.filter(value => value === 4).length;
  return `<div class="chapter-intro">${icon('book')}<div><h2>按题型，把解题方法看清楚</h2><p>已学完 ${completed} / ${course.examples.length} 道例题。每次先想一小步，再展开解释。</p></div></div>${topicTabs()}<div class="example-list">${course.examples.map((example, index) => example.topic !== state.topic ? '' : `<div class="card"><div class="eyebrow">${example.tag}</div><div class="example-head"><h2>${example.title}</h2><span class="step-counter">${state.exampleSteps[index]} / 4</span></div><div class="example-question">${example.question}</div><ol class="solution">${example.steps.slice(0, state.exampleSteps[index]).map(([title, text], i) => `<li><span>${i + 1}</span><div><h3>${title}</h3><p>${text}</p></div></li>`).join('')}</ol><div class="toolbar">${button(state.exampleSteps[index] === 4 ? icon('check') + '已学完这道例题' : `展开第${state.exampleSteps[index] + 1}步 ${icon('arrow')}`, 'example-step', state.exampleSteps[index] === 4, 'small', `data-example="${index}"`)}${button('重新推一遍', 'example-reset', state.exampleSteps[index] === 0, 'quiet small', `data-example="${index}"`)}</div></div>`).join('')}</div><div class="toolbar mt">${nextTopicButton()}</div><div class="bottom-actions"><p>五类题型，各有方法；别漏掉绝对值的两个分支和竖直切线。</p>${button('自己试一试 ' + icon('arrow'), 'next', completed !== course.examples.length)}</div>`;
}
function practice() {
  return `<div class="chapter-intro">${icon('pen')}<div><h2>分题型练习，知道自己掌握了什么</h2><p>全部题型已答对 ${practiceProgress(state)} / ${exercises.length} 题。错了可以重试，小结会保留你的复习点。</p></div></div>${topicTabs()}<div class="quiz-list">${exercises.map((question, i) => {
    if ((question.topic || 'position') !== state.topic) return '';
    const answer = state.answers[question.id] || { selected: [], submitted: false };
    return `<section class="card quiz-card" aria-labelledby="${question.id}-title"><div class="question-title"><span class="quiz-number">${String(i + 1).padStart(2, '0')}</span><div><div class="quiz-meta">${question.tag} · ${question.multiple ? '多选题' : '单选题'}</div><h2 id="${question.id}-title">${question.question}</h2></div></div>${choices(question.options, answer.selected, 'quiz-choice', { multiple: question.multiple, extra: `data-question="${question.id}"` })}${answer.submitted ? `<p class="feedback ${answer.correct ? 'success' : 'warning'}" role="status">${answer.correct ? '✓ 回答正确。' + question.explanation : '还差一点。' + question.mistake}</p>` : ''}<div class="quiz-controls"><span>${answer.submitted && answer.correct ? '这道题已经掌握' : question.multiple ? '请选出全部正确项后提交' : '选择后提交，看看你的思路'}</span>${button(answer.submitted ? '再次核对' : '提交答案', 'submit-quiz', answer.selected.length === 0, 'secondary small', `data-question="${question.id}"`)}</div></section>`;
  }).join('')}</div><div class="toolbar mt">${nextTopicButton()}</div><div class="bottom-actions"><p>五类题型的每道题回答一次后，可查看完整小结。</p>${button('查看学习小结 ' + icon('arrow'), 'practice-next', !exercises.every(question => state.answers[question.id]?.submitted))}</div>`;
}
function summary() {
  const correct = practiceProgress(state);
  const reviews = exercises.filter(question => !state.answers[question.id]?.correct || state.answers[question.id]?.hadError);
  return `<div class="summary-hero"><div class="summary-icon">${icon(correct === exercises.length ? 'flag' : 'bulb')}</div><h2>${correct === exercises.length ? '已完成直线与圆的五类问题' : '看看哪些方法还值得巩固'}</h2><p>从生活问题出发，用自己的观察走到数学结论。</p><div class="summary-stats"><div><strong>5</strong><span>类典型问题</span></div><div><strong>${correct} / ${exercises.length}</strong><span>练习已答对</span></div><div><strong>${course.examples.length}</strong><span>道分步例题</span></div></div></div>
  <div class="summary-grid"><div class="card"><h3>五类方法，放在一起记</h3><div class="topic-recap">${topics.map(topic => `<div><strong>${topic.label}</strong><p>${escapeText(topic.method)}</p></div>`).join('')}</div></div><div class="card"><h3>${reviews.length ? '值得再看一眼的地方' : '这次的练习全部完成'}</h3>${reviews.length ? `<ul class="review-list">${reviews.map(question => `<li>${question.review}${state.answers[question.id]?.correct ? '（已经修正）' : '（还需练习）'}</li>`).join('')}</ul>` : '<p class="review-complete">试着不看公式，分别解释：弦为什么会变短、最近距离为什么可能是0、切线为什么不能漏掉竖直线。</p>'}<p class="subtext">进度保存在当前浏览器；清除浏览器数据后会丢失。</p>${button(correct === exercises.length ? '再做一次巩固' : '回到练习继续巩固', 'go-practice', false, 'secondary small')}</div></div><div class="bottom-actions"><p>${state.completed.includes(7) ? '本课已完成，可以随时回看各环节。' : '理解了规律，才算真正学会。'}</p>${button(state.completed.includes(7) ? icon('check') + '本课已完成' : '完成这节课 ' + icon('check'), 'finish', correct < exercises.length || state.completed.includes(7))}</div>`;
}
function dialog() {
  return `<div class="dialog-backdrop"><section class="dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title" aria-describedby="reset-description"><h2 id="reset-title">从头再学一遍？</h2><p id="reset-description">这会清除本课在当前浏览器中的学习进度、实验记录和练习答案。</p><div class="dialog-actions">${button('保留进度', 'cancel-reset', false, 'secondary', 'id="cancel-reset"')}${button('清空并重新开始', 'confirm-reset', false, '', 'id="confirm-reset"')}</div></section></div>`;
}
function render() {
  const stage = course.stages[state.stage];
  const percent = Math.round(state.completed.length / 8 * 100);
  app.innerHTML = `<div class="shell"><aside class="sidebar" aria-label="课程导航"><a class="brand" href="#lesson" aria-label="几何实验室，跳到学习内容"><img src="./assets/logo.svg" alt=""><div><strong>几何实验室</strong><small>GEOMETRY LAB</small></div></a><p class="sidebar-label">MY LEARNING JOURNEY</p><p class="chapter-label">直线与圆 · 五类问题</p><nav class="steps" aria-label="学习步骤">${course.stages.map(([name, description, symbol], index) => `<button type="button" class="step ${state.stage === index ? 'active' : ''} ${state.completed.includes(index) ? 'done' : ''}" data-action="navigate" data-stage="${index}" ${index > state.unlocked ? 'disabled' : ''} ${state.stage === index ? 'aria-current="step"' : ''} title="${description}">${icon(symbol)}<span>${name}</span><span class="step-number">${state.completed.includes(index) ? '✓' : String(index + 1).padStart(2, '0')}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-note"><strong>${icon('leaf')} 学习，是一场小小的探索</strong>不急着记住答案，先亲手发现规律。</div><button type="button" class="reset" data-action="open-reset">清空进度，重新学习</button></div></aside>
  <main class="main"><header class="topbar"><div class="crumb"><a href="./">全部模块</a><span>/</span><a href="?module=elective1">← 本模块</a></div><div class="top-right"><button type="button" class="button quiet small reset-mobile" data-action="open-reset" aria-label="清空进度，重新学习">${icon('refresh')}</button><span class="local-badge">${storageWritable ? '本地学习 · 自动保存' : '本地学习 · 临时会话'}</span><span class="avatar" aria-hidden="true">数</span></div></header>
  <div class="course-header"><div><div class="eyebrow"><span class="pill">探究课 01</span> ANALYTIC GEOMETRY</div><h1>${course.title}</h1><p>位置关系 · 弦长 · 最值 · 动直线与定点 · 切线方程</p></div><div class="course-progress"><div class="progress-caption"><span>本课学习进度</span><span>${percent}%</span></div><div class="progress-track" role="progressbar" aria-label="本课学习进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div></div></div>
  <div id="storage-notice" class="notice" role="status" ${storageNotice ? '' : 'hidden'}>${storageNotice}</div><div class="stage-banner"><span class="stage-dot"></span><strong>STEP ${String(state.stage + 1).padStart(2, '0')} · ${stage[0]}</strong><span class="line"></span><span>${stage[1]}</span></div><section id="lesson" tabindex="-1" aria-label="${stage[0]}">${[scenario, construction, guided, rule, freeExplore, examples, practice, summary][state.stage]()}</section>
  <footer class="lesson-footer"><span><span class="dot">✦</span>每一个“为什么”，都是发现的开始。</span><span>典型题型课 v0.2 · 数据仅保存在当前浏览器</span></footer></main></div>${resetDialog ? dialog() : ''}`;
}
function refreshPlot() {
  const target = document.querySelector('#plot');
  const model = state.stage === 4 ? labModel() : null;
  if (target) target.innerHTML = plot(model ? model.options : { offset: state.t, details: state.guess !== null, intersections: state.guess !== null });
  if (model) document.querySelector('#metrics').innerHTML = model.metrics;
  if (state.stage === 2) {
    document.querySelector('#guided-feedback').innerHTML = guidedFeedback();
    document.querySelector('#record-button').disabled = !canRecord(state);
  }
}
app.addEventListener('input', event => {
  const controlName = event.target.dataset.control;
  if (!controlName) return;
  const limits = { t: [-5, 5], angle: [0, 180], offset: [-5, 5], radius: [1, 4], pointAngle: [0, 360], externalX: [0, 6] };
  const value = event.target.value === '' ? NaN : Number(event.target.value);
  const [min, max] = limits[controlName];
  const valid = Number.isFinite(value) && value >= min && value <= max && !event.target.validity.stepMismatch;
  event.target.setAttribute('aria-invalid', String(!valid));
  document.querySelector('#input-error').textContent = valid ? '' : `请输入${min}到${max}之间${event.target.step === 'any' ? '的有效数值' : `、步长为${event.target.step}的数值`}，图形暂时保留上次有效状态。`;
  if (!valid) return;
  if (controlName === 't') {
    if (state.guess === null) return;
    state.t = value;
    state.observation = null;
  } else state.free[controlName] = value;
  for (const input of document.querySelectorAll(`[data-control="${controlName}"]`)) {
    if (input !== event.target) input.value = value;
    input.setAttribute('aria-invalid', 'false');
  }
  if (state.stage === 2) {
    for (const input of document.querySelectorAll('[data-action="observation"]')) {
      input.classList.remove('selected');
      input.setAttribute('aria-pressed', 'false');
      input.querySelector('.choice-marker').textContent = String.fromCharCode(65 + Number(input.dataset.index));
    }
  }
  save();
  refreshPlot();
});
app.addEventListener('click', event => {
  const target = event.target.closest('[data-action]');
  if (!target || target.disabled) return;
  const action = target.dataset.action;
  const index = Number(target.dataset.index);
  if (action === 'navigate') return navigate(Number(target.dataset.stage));
  if (action === 'next') return advance();
  if (action === 'scenario-choice') state.prediction = index;
  if (action === 'play-construction') {
    if (constructionTimer) stopConstruction();
    else {
      if (constructionProgress >= 4) constructionProgress = 0;
      animateConstruction(4);
    }
  }
  if (action === 'construction-step') {
    animateConstruction(Math.min(4, Math.floor(constructionProgress) + 1));
  }
  if (action === 'construction-replay') { stopConstruction(); constructionProgress = 0; animateConstruction(4); }
  if (action === 'guess') state.guess = index;
  if (action === 'observation' && state.guess !== null) state.observation = index;
  if (action === 'target') {
    state.t = course.rounds[state.records.length].t;
    state.observation = null;
  }
  if (action === 'record') recordObservation(state);
  if (action === 'rule-answer') state.ruleAnswer = index;
  if (action === 'reset-free') state.free = initialState().free;
  if (action === 'topic' && topics.some(topic => topic.id === target.dataset.topic)) state.topic = target.dataset.topic;
  if (action === 'tangent-mode') state.free.tangentMode = target.dataset.mode;
  if (action === 'extrema-mode') state.free.extremaMode = target.dataset.mode;
  if (action === 'nearest' || action === 'farthest') {
    const { radius, offset } = state.free;
    const angle = state.free.extremaMode === 'point' ? action === 'nearest' ? 0 : 180 : action === 'nearest' ? Math.abs(offset) <= radius ? Math.asin(offset / radius) * 180 / Math.PI : offset >= 0 ? 90 : 270 : offset >= 0 ? 270 : 90;
    state.free.pointAngle = (angle + 360) % 360;
  }
  if (action === 'example-step') state.exampleSteps[Number(target.dataset.example)] = Math.min(4, state.exampleSteps[Number(target.dataset.example)] + 1);
  if (action === 'example-reset') state.exampleSteps[Number(target.dataset.example)] = 0;
  if (action === 'quiz-choice') {
    const question = exercises.find(item => item.id === target.dataset.question);
    const answer = state.answers[question.id] ||= { selected: [], submitted: false, correct: false, hadError: false };
    answer.selected = question.multiple ? answer.selected.includes(index) ? answer.selected.filter(value => value !== index) : [...answer.selected, index] : [index];
    answer.submitted = false;
    answer.correct = false;
    state.completed = state.completed.filter(stage => stage !== 6 && stage !== 7);
  }
  if (action === 'submit-quiz') submitAnswer(state, target.dataset.question);
  if (action === 'practice-next') {
    if (practiceProgress(state) === exercises.length && !state.completed.includes(6)) state.completed.push(6);
    state.unlocked = 7;
    return navigate(7);
  }
  if (action === 'go-practice') return navigate(6);
  if (action === 'finish' && practiceProgress(state) === exercises.length) {
    state.completed = [...new Set([...state.completed, 6, 7])];
  }
  if (action === 'open-reset') { resetDialog = true; stopConstruction(); }
  if (action === 'cancel-reset') resetDialog = false;
  if (action === 'confirm-reset') {
    stopConstruction();
    state = initialState();
    constructionProgress = 0;
    resetDialog = false;
  }
  save();
  render();
  if (resetDialog) document.querySelector('#cancel-reset').focus();
  else if (action === 'cancel-reset') document.querySelector('[data-action="open-reset"]').focus();
  else if (action === 'confirm-reset') { document.querySelector('#lesson').focus(); window.scrollTo({ top: 0 }); }
  else {
    const matching = [...document.querySelectorAll('[data-action]')].find(el => el.dataset.action === action && (!target.hasAttribute('data-index') || el.dataset.index === target.dataset.index) && (!target.hasAttribute('data-example') || el.dataset.example === target.dataset.example) && (!target.hasAttribute('data-question') || el.dataset.question === target.dataset.question) && (!target.hasAttribute('data-topic') || el.dataset.topic === target.dataset.topic) && (!target.hasAttribute('data-mode') || el.dataset.mode === target.dataset.mode));
    if (matching && !matching.disabled) matching.focus({ preventScroll: true });
  }
});
document.addEventListener('keydown', event => {
  if (!resetDialog) return;
  if (event.key === 'Escape') {
    resetDialog = false;
    render();
    document.querySelector('[data-action="open-reset"]').focus();
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    document.querySelector(document.activeElement.id === 'cancel-reset' ? '#confirm-reset' : '#cancel-reset').focus();
  }
});
window.addEventListener('pagehide', stopConstruction);
render();
