// models/usuarios.model.js
import db from '../db.js'

export const existeUsuario = async (identificacion, correo, telefono) => {
    const [rows] = await db.promise().query(
        'SELECT * FROM usuarios WHERE identificacion = ? OR correo = ? OR telefono = ?',
        [identificacion, correo, telefono]
    )
    return rows.length > 0
}

export const insertarUsuario = async (usuario) => {
    const { nombre, identificacion, correo, telefono } = usuario
    await db.promise().query(
        'INSERT INTO usuarios (nombre, identificacion, correo, telefono) VALUES (?, ?, ?, ?)',
        [nombre, identificacion, correo, telefono]
    )
}

export const obtenerUsuarios = async () => {
    const [usuarios] = await db.promise().query(
        'SELECT id_usuario, nombre, identificacion, correo, telefono FROM usuarios ORDER BY id_usuario ASC'
    )
    return usuarios
}

export const eliminarUsuarioPorId = async (id) => {
    const [result] = await db.promise().query(
        'DELETE FROM usuarios WHERE id_usuario = ?',
        [id]
    )
    return result
}

export const contarUsuarios = async () => {
    const [rows] = await db.promise().query('SELECT COUNT(*) AS total FROM usuarios')
    return rows[0].total
}

export const reiniciarAutoIncrement = async () => {
    await db.promise().query('ALTER TABLE usuarios AUTO_INCREMENT = 1')
}
