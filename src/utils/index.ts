export function generateUUID (len = 8) {
  let str = new Array(len);
  const  d = Date.now().toString(36).split('');
  let r, c;
  while (len-- > 0) {
    r = Math.random() * 36 | 0;
    c = r.toString(36);
    str[len] = r % 3 ? c : c.toUpperCase();
  }
  for (let i = 0; i < 8; i++) {
    str.splice(i * 3 + 2, 0, d[i]);
  }
  return str.join('');
}
