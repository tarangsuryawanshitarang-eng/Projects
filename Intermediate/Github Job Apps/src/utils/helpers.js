import { formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(dateString){
  if(!dateString) return ''
  try{
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true })
  }catch(e){
    return dateString
  }
}

export function formatSalary(min, max, currency){
  if(!min && !max) return ''
  const minStr = min ? new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(min) : ''
  const maxStr = max ? new Intl.NumberFormat(undefined, { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(max) : ''
  if(min && max) return `${minStr} - ${maxStr}`
  return minStr || maxStr
}

export function truncateText(text, maxLength){
  if(!text) return ''
  if(text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function getJobTypeColor(type){
  switch(type){
    case 'FULLTIME': return '#10b981'
    case 'PARTTIME': return '#3b82f6'
    case 'CONTRACTOR': return '#f59e0b'
    case 'INTERN': return '#8b5cf6'
    default: return '#64748b'
  }
}

export function generateColorFromString(str){
  let hash = 0
  for(let i=0;i<str?.length;i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 60%, 60%)`
}

export function sanitizeHTML(html){
  // Very basic sanitization for demo purposes
  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent || div.innerText || ''
}

export function buildQueryString(params){
  const esc = encodeURIComponent
  return Object.keys(params)
    .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join('&')
}

export function parseQueryString(qs){
  const params = {}
  new URLSearchParams(qs).forEach((value, key)=>{ params[key] = value })
  return params
}
