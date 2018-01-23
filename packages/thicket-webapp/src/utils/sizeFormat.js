export const formatBytes = a => {
  if (0 === a) return ''
  const c = 1024
  const d = 2
  const e = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  const v = parseFloat((a / Math.pow(c, f)).toFixed(d))
  return (v > 0) ? `${v}${e[f]}` : ''
}

