// Importamos el router de express y la conexión a la base de datos
import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Ruta para insertar uno o varios préstamos
router.post('/', async (req, res) => {
  try {
    const prestamos = Array.isArray(req.body) ? req.body : [req.body]

    const errores = []
    let insertados = 0

    for (const [indice, prestamo] of prestamos.entries()) {
      const {
        identificacion_usuario,
        isbn_libro,
        estado_nombre,
        fecha_prestamo,
        fecha_devolucion
      } = prestamo || {}

      // Validación básica de campos requeridos
      if (!identificacion_usuario || !isbn_libro || !estado_nombre) {
        errores.push({
          indice,
          error: 'Faltan campos requeridos',
          detalle: { identificacion_usuario, isbn_libro, estado_nombre }
        })
        continue
      }

      // Resolvemos IDs relacionados
      const [usuario] = await db.promise().query(
        'SELECT id_usuario FROM usuarios WHERE identificacion = ?',
        [identificacion_usuario]
      )
      if (usuario.length === 0) {
        errores.push({ indice, error: 'Usuario no encontrado', identificacion_usuario })
        continue
      }

      const [libro] = await db.promise().query(
        'SELECT id_libro FROM libros WHERE isbn = ?',
        [isbn_libro]
      )
      if (libro.length === 0) {
        errores.push({ indice, error: 'Libro no encontrado', isbn_libro })
        continue
      }

      const [estado] = await db.promise().query(
        'SELECT id_estado FROM estados WHERE nombre_estado = ?',
        [estado_nombre]
      )
      if (estado.length === 0) {
        errores.push({ indice, error: 'Estado no encontrado', estado_nombre })
        continue
      }

      // Insertamos el préstamo
      await db.promise().query(
        `INSERT INTO prestamos (
          id_usuario, id_libro, id_estado, fecha_prestamo, fecha_devolucion
        ) VALUES (?, ?, ?, ?, ?)`,
        [
          usuario[0].id_usuario,
          libro[0].id_libro,
          estado[0].id_estado,
          fecha_prestamo || null,
          fecha_devolucion || null
        ]
      )

      insertados += 1
    }

    // Si todos fallaron, retornamos 400 con detalle
    if (insertados === 0 && errores.length > 0) {
      return res.status(400).json({ error: 'No se insertaron préstamos', errores })
    }

    // Respondemos con resumen (multi-resultado)
    return res.status(201).json({ mensaje: 'Préstamos procesados', insertados, errores })
  } catch (error) {
    console.error('Error al insertar el préstamo:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
  