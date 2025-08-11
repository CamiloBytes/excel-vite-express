// models/estadosModel.js
import db from '../db.js'

export const estadoExiste = async (nombre_estado) => {
    const [result] = await db.promise().query(
        'SELECT * FROM estados WHERE nombre_estado = ?',
        [nombre_estado]
    )
    return result.length > 0
}

export const insertarEstado = async (nombre_estado) => {
    await db.promise().query(
        'INSERT INTO estados (nombre_estado) VALUES (?)',
        [nombre_estado]
    )
}
