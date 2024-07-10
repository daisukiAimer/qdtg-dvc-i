
export const formatDuration = s => {
    if (!s) return '0s'
    if (s < 0) s = -s
    const time = {
        day: Math.floor(s / 60 / 60 / 24),
        h: Math.floor(s / 60 / 60) % 24,
        m: Math.floor(s / 60) % 60,
        s: Math.floor(s) % 60,
    }
    return Object.entries(time).filter(val => val[1] !== 0)
        .map(([k , v]) => `${v}${k}`).join(' ')
}

export const formatSize = s => {
    if (!s) return '0MB'
    return (s / 1024 / 1024).toFixed(2) + 'MB'
}