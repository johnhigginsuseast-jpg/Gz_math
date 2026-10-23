export const EPSILON = 1e-9;

export function lineCircle({ a = 0, b = 0, r }, { A, B, C }) {
  if (![a, b, r, A, B, C].every(Number.isFinite) || r <= 0 || Math.hypot(A, B) === 0) {
    throw new RangeError('圆的半径须大于0，直线系数A、B不能同时为0，所有参数须为有限数。');
  }
  const norm = Math.hypot(A, B);
  const nx = A / norm;
  const ny = B / norm;
  const signed = nx * a + ny * b + C / norm;
  const distance = Math.abs(signed);
  const foot = { x: a - signed * nx, y: b - signed * ny };
  const difference = distance - r;
  const kind = Math.abs(difference) <= EPSILON ? 'tangent' : difference < 0 ? 'intersect' : 'separate';
  let points = [];
  if (kind === 'tangent') points = [foot];
  if (kind === 'intersect') {
    const half = Math.sqrt(Math.max(0, r * r - distance * distance));
    points = [
      { x: foot.x - ny * half, y: foot.y + nx * half },
      { x: foot.x + ny * half, y: foot.y - nx * half },
    ];
  }
  return { distance, foot, kind, points, count: points.length, chordLength: kind === 'intersect' ? 2 * Math.sqrt(Math.max(0, r * r - distance * distance)) : kind === 'tangent' ? 0 : null };
}

export function experiment(radius, offset, angle) {
  const radians = angle * Math.PI / 180;
  const line = { A: -Math.sin(radians), B: Math.cos(radians), C: -offset };
  return { ...lineCircle({ r: radius }, line), line, direction: { x: Math.cos(radians), y: Math.sin(radians) } };
}

export const relations = {
  intersect: { label: '相交', sign: '<', description: '直线穿过圆周，有两个公共点。' },
  tangent: { label: '相切', sign: '=', description: '直线刚好接触圆周，只有一个公共点。' },
  separate: { label: '相离', sign: '>', description: '直线与圆周不接触，没有公共点。' },
};

export function format(value, digits = 2) {
  return Number(value.toFixed(digits)).toString();
}

export function distanceExtrema(radius, distance, target = 'line') {
  if (![radius, distance].every(Number.isFinite) || radius <= 0 || distance < 0 || !['line', 'point'].includes(target)) throw new RangeError('半径须为正数，距离须为非负有限数，目标为直线或定点。');
  return { min: target === 'point' ? Math.abs(distance - radius) : Math.max(0, distance - radius), max: distance + radius };
}

export function movingLine(radius, angle) {
  const radians = angle * Math.PI / 180;
  const line = { A: -Math.sin(radians), B: Math.cos(radians), C: 4 * Math.sin(radians) };
  return { ...lineCircle({ r: radius }, line), line, direction: { x: Math.cos(radians), y: Math.sin(radians) } };
}

export function tangentLines({ a = 0, b = 0, r }, { x, y }) {
  if (![a, b, r, x, y].every(Number.isFinite) || r <= 0) throw new RangeError('圆和已知点必须有效，半径须为正数。');
  const ux = x - a;
  const uy = y - b;
  const distance = Math.hypot(ux, uy);
  if (distance === 0 || distance < r - EPSILON) return [];
  let points;
  if (Math.abs(distance - r) <= EPSILON) {
    points = [{ x: a + ux * r / distance, y: b + uy * r / distance }];
  } else {
    const q = distance * distance;
    const base = r * r / q;
    const offset = r * Math.sqrt(Math.max(0, q - r * r)) / q;
    points = [
      { x: a + base * ux - offset * uy, y: b + base * uy + offset * ux },
      { x: a + base * ux + offset * uy, y: b + base * uy - offset * ux },
    ];
  }
  return points.map(point => {
    const A = point.x - a;
    const B = point.y - b;
    return { point, line: { A, B, C: -A * point.x - B * point.y } };
  });
}

export function constructionSnapshot(progress) {
  if (!Number.isFinite(progress)) throw new RangeError('构造进度必须是有限数。');
  const phase = start => {
    const value = Math.max(0, Math.min(1, progress - start));
    return value * value * (3 - 2 * value);
  };
  return { center: phase(0), radius: phase(1), circle: phase(2), line: phase(3), formulaVisible: progress >= 4 };
}
