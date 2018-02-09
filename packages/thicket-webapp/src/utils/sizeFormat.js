export const formatBytes = a => {
  if (0 === a) return ''
  const c = 1024
  const d = 2
  const e = ['b','kb','mb','gb','tb','pb','eb','zb','yb']
  const f = Math.floor(Math.log(a) / Math.log(c))
  let v = parseFloat((a / Math.pow(c, f)).toFixed(d))
  if (String(v).length > 5) {
    v = Math.round(v)
  }
  return (v > 0) ? `${v} ${e[f]}` : ''
}

