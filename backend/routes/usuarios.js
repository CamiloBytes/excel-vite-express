// Importamos express para crear la ruta
import express from 'express'

// Importamos la conexión a la base de datos
import db from '../db.js'

// Creamos el router, que es como el manejador de esta ruta
const router = express.Router()

// Ruta POST: esta recibe los usuarios que vienen del frontend
router.post('/', async (req, res) => {
    try {
        const usuarios = req.body //  Recibimos el arreglo de usuarios

        for (const u of usuarios) {
            // Revisamos si ya existe un usuario con esa identificación o correo
            const [existe] = await db.promise().query(
                'SELECT * FROM usuarios WHERE identificacion = ? OR correo = ? OR telefono = ?',
                [u.identificacion, u.correo, u.telefono]
            )

            if (existe.length === 0) {
                // Si no existe, lo insertamos
                await db.promise().query(
                    'INSERT INTO usuarios (nombre, identificacion, correo, telefono) VALUES (?, ?, ?, ?)',
                    [u.nombre, u.identificacion, u.correo, u.telefono]
                )
            } else {
                //  Si ya existe, lo ignoramos (evitamos duplicados)
                console.log(`Usuario duplicado: ${u.identificacion}`)
            }
        }

        res.status(200).json({ mensaje: 'Usuarios insertados correctamente' })
    } catch (error) {
        console.error(' Error insertando usuarios:', error.message)
        res.status(500).json({ error: 'Error al insertar usuarios' })
    }
})

router.get ('/', async (req,res)=>{
    try {
        const usuarios = await db.promise.query(
            'SELECT * FROM usuarios'
        )

        res.status(200).json({
        mensaje: 'Lista de préstamos obtenida exitosamente',
        total_usuarios: usuarios.length,
        usuarios_encontrados: usuarios
    });
    } catch (error) {
        console.error('Error al consultar los préstamos:', error);
        res.status(500).json({ 
        error: 'Error interno del servidor al obtener préstamos',
        detalle_tecnico: error.message 
    });
    }
})

// Exportamos el router para usarlo en el index.js
export default router
