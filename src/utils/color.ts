//  转换为r g b a
export function parseColor (color?: string): {
  r: number
  g: number
  b: number
  a: number
} {
  if (!color) return { r: 0, g: 0, b: 0, a: 0 }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const a = parseInt(hex.slice(6, 8), 16) / 255
    return { r, g, b, a }
  }
  if (color.startsWith('rgb')) {
    const [r, g, b, a] = color
      .replace(/rgb[a]?\(|\)/g, '')
      .split(',')
      .map((v) => parseInt(v))
    return { r, g, b, a }
  }
  return { r: 0, g: 0, b: 0, a: 0 }
}

// alpha
export function alpha (color: string, opacity: number): string {
  const { r, g, b } = parseColor(color)
  return `rgba(${r},${g},${b},${opacity})`
}
