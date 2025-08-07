// Importamos el router de express y la conexión a la base de datos
import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Ruta para insertar un préstamo
router.post('/', async (req, res) => {
  try {
    // Extraemos los datos que vienen del frontend
    const {
      identificacion_usuario,
      isbn_libro,
      estado_nombre,
      fecha_prestamo,
      fecha_devolucion
    } = req.body

    // Buscamos el ID del usuario según su identificación
    const [usuario] = await db.promise().query(
      'SELECT id_usuario FROM usuarios WHERE identificacion = ?',
      [identificacion_usuario]
    )

    if (usuario.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    // Buscamos el ID del libro según su ISBN
    const [libro] = await db.promise().query(
      'SELECT id_libro FROM libros WHERE isbn = ?',
      [isbn_libro]
    )

    if (libro.length === 0) {
      return res.status(400).json({ error: 'Libro no encontrado' })
    }

    // Buscamos el ID del estado según su nombre
    const [estado] = await db.promise().query(
      'SELECT id_estado FROM estados WHERE nombre_estado = ?',
      [estado_nombre]
    )

    if (estado.length === 0) {
      return res.status(400).json({ error: 'Estado no encontrado' })
    }

    // 4. Insertamos el préstamo en la tabla
    await db.promise().query(
      `INSERT INTO prestamos (
        id_usuario, id_libro, id_estado, fecha_prestamo, fecha_devolucion
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        usuario[0].id_usuario,
        libro[0].id_libro,
        estado[0].id_estado,
        fecha_prestamo,
        fecha_devolucion
      ]
    )

    res.status(201).json({ mensaje: 'Préstamo insertado con éxito' })

  } catch (error) {
    console.error('Error al insertar el préstamo:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
  