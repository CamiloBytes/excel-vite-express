// Importamos el router de express y la conexión a la base de datos
import { Router } from 'express'
import db from '../db.js'

const router = Router()

// Utilidades para normalizar fechas provenientes de Excel o strings
const EXCEL_EPOCH_MS = Date.UTC(1899, 11, 30)
function convertExcelSerialToISO(serial) {
  if (typeof serial !== 'number' || !isFinite(serial)) return null
  const ms = EXCEL_EPOCH_MS + Math.round(serial) * 86400000
  return new Date(ms).toISOString().slice(0, 10)
}
function normalizeDateInput(input) {
  if (input == null || input === '') return null
  if (typeof input === 'number') return convertExcelSerialToISO(input)
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
    const ddmmyyyy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
    if (ddmmyyyy) {
      const dd = parseInt(ddmmyyyy[1], 10)
      const mm = parseInt(ddmmyyyy[2], 10)
      const yyyy = parseInt(ddmmyyyy[3], 10)
      if (mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
        return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
      }
    }
    const parsed = new Date(trimmed)
    if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10)
    return null
  }
  return null
}

router.post('/', async (req, res) => {
  try {
    const prestamos = Array.isArray(req.body) ? req.body : [req.body]

    let insertados = 0 // Contador de préstamos que sí se insertan

    for (const [indice, prestamo] of prestamos.entries()) {
      const {
        identificacion_usuario,
        isbn_libro,
        estado_nombre,
        fecha_prestamo,
        fecha_devolucion
      } = prestamo || {}

      // Validación básica: campos obligatorios
      if (!identificacion_usuario || !isbn_libro || !estado_nombre) {
        console.error(`Fila ${indice}: Faltan campos requeridos`)
        continue
      }

      // Buscar ID del usuario
      const [usuario] = await db.promise().query(
        'SELECT id_usuario FROM usuarios WHERE identificacion = ?',
        [identificacion_usuario]
      )
      if (usuario.length === 0) {
        console.error(`Fila ${indice}: Usuario no encontrado (${identificacion_usuario})`)
        continue
      }

      // Buscar ID del libro
      const [libro] = await db.promise().query(
        'SELECT id_libro FROM libros WHERE isbn = ?',
        [isbn_libro]
      )
      if (libro.length === 0) {
        console.error(`Fila ${indice}: Libro no encontrado (${isbn_libro})`)
        continue
      }

      // Buscar ID del estado
      const [estado] = await db.promise().query(
        'SELECT id_estado FROM estados WHERE nombre_estado = ?',
        [estado_nombre]
      )
      if (estado.length === 0) {
        console.error(`Fila ${indice}: Estado no encontrado (${estado_nombre})`)
        continue
      }

      // Normalizamos las fechas
      const fechaPrestamoISO = normalizeDateInput(fecha_prestamo)
      const fechaDevolucionISO = normalizeDateInput(fecha_devolucion)

      // Comprobar si ya existe ese préstamo (mismo usuario, libro y fecha)
      const [prestamoExistente] = await db.promise().query(
        `SELECT id_prestamo 
         FROM prestamos 
         WHERE id_usuario = ? 
           AND id_libro = ? 
           AND fecha_prestamo = ?`,
        [usuario[0].id_usuario, libro[0].id_libro, fechaPrestamoISO]
      )

      if (prestamoExistente.length === 0) {
        // Si NO existe → lo insertamos
        await db.promise().query(
          `INSERT INTO prestamos (
            id_usuario, id_libro, id_estado, fecha_prestamo, fecha_devolucion
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            usuario[0].id_usuario,
            libro[0].id_libro,
            estado[0].id_estado,
            fechaPrestamoISO,
            fechaDevolucionISO
          ]
        )
        insertados++
      } else {
        // Si ya existe → solo mostramos el error en consola y no insertamos
        console.error(`Fila ${indice}: Préstamo duplicado → Usuario ${identificacion_usuario}, Libro ${isbn_libro}, Fecha ${fechaPrestamoISO}`)
      }
    }

    return res.status(201).json({
      mensaje: 'Proceso completado',
      insertados
    })

  } catch (error) {
    console.error('Error al insertar el préstamo:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// creo el enpoid para traer los datos de al frontend
router.get('/', async (req, res) => {
  try {
    const [prestamos] = await db.promise().query(`
    SELECT 
      prestamo.id_prestamo AS id_del_prestamo,
      usuario.nombre AS nombre_completo_usuario,
      usuario.identificacion AS documento_identificacion,
      usuario.correo AS email_usuario,
      usuario.telefono AS telefono_contacto,
      libro.titulo AS titulo_del_libro,
      libro.isbn AS codigo_isbn,
      libro.año_publicacion AS año_de_publicacion,
      libro.autor AS autor_del_libro,
      prestamo.fecha_prestamo AS fecha_de_prestamo,
      prestamo.fecha_devolucion AS fecha_de_devolucion,
      estado.nombre_estado AS estado_del_prestamo,
      prestamo.created_at AS fecha_creacion_registro,
      prestamo.updated_at AS fecha_ultima_actualizacion
    FROM prestamos prestamo
    INNER JOIN usuarios usuario ON prestamo.id_usuario = usuario.id_usuario
    INNER JOIN libros libro ON prestamo.id_libro = libro.id_libro
    INNER JOIN estados estado ON prestamo.id_estado = estado.id_estado
    ORDER BY usuario.id_usuario ASC;
    `);

    res.status(200).json({
      mensaje: 'Lista de préstamos obtenida exitosamente',
      total_prestamos: prestamos.length,
      prestamos_encontrados: prestamos
    });

  } catch (error) {
    console.error('Error al consultar los préstamos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener préstamos',
      detalle_tecnico: error.message 
    });
  }
});

// creo el endpoint de elliminar un dato de la tabla prestamo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // verifico si me esta enviando el id para enviarlo
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  try {
    const [result] = await db.promise().query(
      'DELETE FROM prestamos WHERE id_prestamo = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    res.json({ mensaje: 'Préstamo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  // verifico si me esta enviando el id para enviarlo
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  try {
    const [result] = await db.promise().query(
      `UPDATE prestamos 
       SET id_estado = ?, fecha_devolucion = ? 
       WHERE id_prestamo = ?`
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Préstamo no encontrado' });
    }

    res.json({ mensaje: 'Préstamo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar préstamo:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});



export default router
  