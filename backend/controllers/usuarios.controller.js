// controllers/usuarios.controller.js
import {
    existeUsuario,
    insertarUsuario,
    obtenerUsuarios,
    eliminarUsuarioPorId,
    contarUsuarios,
    reiniciarAutoIncrement
} from '../models/usuariosModel.js'

export const registrarUsuarios = async (req, res) => {
    try {
        const usuarios = req.body

        for (const u of usuarios) {
            const existe = await existeUsuario(u.identificacion, u.correo, u.telefono)

            if (!existe) {
                await insertarUsuario(u)
            } else {
                console.log(`Usuario duplicado: ${u.identificacion}`)
            }
        }

        res.status(200).json({ mensaje: 'Usuarios insertados correctamente' })
    } catch (error) {
        console.error('Error insertando usuarios:', error.message)
        res.status(500).json({ error: 'Error al insertar usuarios' })
    }
}

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await obtenerUsuarios()
        res.status(200).json({
            mensaje: 'Lista de usuarios obtenida exitosamente',
            total_usuarios: usuarios.length,
            usuarios_encontrados: usuarios
        })
    } catch (error) {
        console.error('Error obteniendo usuarios:', error.message)
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }
}

export const eliminarUsuario = async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'ID requerido' })

    try {
        const result = await eliminarUsuarioPorId(id)

        const total = await contarUsuarios()
        if (total === 0) {
            await reiniciarAutoIncrement()
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        res.json({ mensaje: 'Usuario eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar usuario:', error)
        res.status(500).json({ error: 'Error del servidor' })
    }
}
