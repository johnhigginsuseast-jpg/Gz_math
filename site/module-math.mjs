import { EPSILON } from './math.mjs';

export function normalizedLine({ A, B, C }) {
  if (![A, B, C].every(Number.isFinite) || Math.hypot(A, B) === 0) throw new RangeError('A、B不能同时为0。');
  const n = Math.hypot(A, B);
  const sign = A < 0 || (A === 0 && B < 0) ? -1 : 1;
  return { A: sign * A / n, B: sign * B / n, C: sign * C / n };
}

export function lineThrough(p, q) {
  if (![p.x, p.y, q.x, q.y].every(Number.isFinite) || (p.x === q.x && p.y === q.y)) throw new RangeError('需要两个不同的有限点。');
  return { A: p.y - q.y, B: q.x - p.x, C: p.x * q.y - q.x * p.y };
}

export function twoLines(first, second) {
  const p = normalizedLine(first), q = normalizedLine(second);
  const det = p.A * q.B - q.A * p.B;
  const dot = p.A * q.A + p.B * q.B;
  if (Math.abs(det) < EPSILON) {
    const distance = Math.abs(p.C - q.C);
    return { kind: distance < EPSILON ? 'coincident' : 'parallel', distance, point: null };
  }
  return { kind: Math.abs(dot) < EPSILON ? 'perpendicular' : 'intersect', distance: 0, point: { x: (p.B * q.C - q.B * p.C) / det, y: (p.C * q.A - q.C * p.A) / det } };
}

export function generalCircle(D, E, F) {
  if (![D, E, F].every(Number.isFinite)) throw new RangeError('圆方程系数须为有限数。');
  const r2 = (D * D + E * E) / 4 - F;
  return { a: -D / 2, b: -E / 2, r2, r: r2 > 0 ? Math.sqrt(r2) : 0, kind: Math.abs(r2) < EPSILON ? 'point' : r2 > 0 ? 'circle' : 'empty' };
}

export function twoCircles(p, q) {
  if (![p.a, p.b, p.r, q.a, q.b, q.r].every(Number.isFinite) || p.r <= 0 || q.r <= 0) throw new RangeError('两个圆均须半径大于0。');
  const dx = q.a - p.a, dy = q.b - p.b;
  const d = Math.hypot(dx, dy), sum = p.r + q.r, diff = Math.abs(p.r - q.r);
  if (d < EPSILON) return { kind: diff < EPSILON ? 'coincident' : 'concentric', d, count: diff < EPSILON ? Infinity : 0, points: [], chord: null, axis: null };
  const kind = d > sum + EPSILON ? 'outside' : Math.abs(d - sum) < EPSILON ? 'external' : d < diff - EPSILON ? 'inside' : Math.abs(d - diff) < EPSILON ? 'internal' : 'intersect';
  const axis = { A: 2 * dx, B: 2 * dy, C: p.a * p.a + p.b * p.b - p.r * p.r - q.a * q.a - q.b * q.b + q.r * q.r };
  if (['outside', 'inside'].includes(kind)) return { kind, d, count: 0, points: [], chord: null, axis };
  const along = (p.r * p.r - q.r * q.r + d * d) / (2 * d);
  const half = kind === 'intersect' ? Math.sqrt(Math.max(0, p.r * p.r - along * along)) : 0;
  const foot = { x: p.a + along * dx / d, y: p.b + along * dy / d };
  const points = half < EPSILON ? [foot] : [{ x: foot.x - half * dy / d, y: foot.y + half * dx / d }, { x: foot.x + half * dy / d, y: foot.y - half * dx / d }];
  return { kind, d, count: points.length, points, chord: 2 * half, axis };
}

export function reflectPoint(point, line) {
  const { A, B, C } = normalizedLine(line);
  const signed = A * point.x + B * point.y + C;
  return { x: point.x - 2 * A * signed, y: point.y - 2 * B * signed };
}

export function apollonius(p, q, ratio) {
  if (![p.x, p.y, q.x, q.y, ratio].every(Number.isFinite) || ratio <= 0 || (p.x === q.x && p.y === q.y)) throw new RangeError('取不同定点且距离比为正数。');
  const t = ratio * ratio, u = 1 - t;
  if (Math.abs(u) < EPSILON) return { kind: 'line', line: { A: 2 * (q.x - p.x), B: 2 * (q.y - p.y), C: p.x * p.x + p.y * p.y - q.x * q.x - q.y * q.y } };
  return { kind: 'circle', a: (p.x - t * q.x) / u, b: (p.y - t * q.y) / u, r: ratio * Math.hypot(p.x - q.x, p.y - q.y) / Math.abs(u) };
}
