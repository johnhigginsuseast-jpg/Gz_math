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
  return { distance, foot, kind, points, count: points.length };
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
