// utils/fechas.js
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30)

export function convertExcelSerialToISO(serial) {
    if (typeof serial !== 'number' || !isFinite(serial)) return null
    const ms = EXCEL_EPOCH_MS + Math.round(serial) * 86400000
    return new Date(ms).toISOString().slice(0, 10)
}

export function normalizeDateInput(input) {
    if (!input) return null

    if (typeof input === 'number') return convertExcelSerialToISO(input)

    if (typeof input === 'string') {
        const s = input.trim()

        if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s

        const parts = s.split('/')
        if (parts.length === 3) {
            const [dd, mm, yyyy] = parts
            if (+dd > 0 && +dd <= 31 && +mm > 0 && +mm <= 12) {
                return `${yyyy.padStart(4, '0')}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
            }
        }

        const d = new Date(s)
        if (!isNaN(d)) return d.toISOString().slice(0, 10)
    }

    return null
}
