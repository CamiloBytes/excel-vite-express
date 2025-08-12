// Importamos express para crear la ruta
import express from 'express'

// Importamos la conexión a la base de datos
import db from '../db.js'

// Creamos el router, que es como el manejador de esta ruta
const router = express.Router()

// Ruta POST: esta recibe los usuarios que vienen del frontend
router.post('/', async (req, res) => {
    try {
        const usuarios = Array.isArray(req.body) ? req.body : [req.body]

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

// Nueva ruta GET: lista todos los usuarios
router.get('/', async (req, res) => {
    try {
        const [usuarios] = await db.promise().query(
            'SELECT id_usuario, nombre, identificacion, correo, telefono FROM usuarios ORDER BY id_usuario ASC'
        )
        res.status(200).json({
        mensaje: 'Lista de usuarios obtenida exitosamente',
        total_usuarios: usuarios.length,
        usuarios_encontrados: usuarios
    })
    } catch (error) {
        console.error(' Error obteniendo usuarios:', error.message)
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }
})

// creo el endpoint de elliminar un dato de la tabla prestamo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  // verifico si me esta enviando el id para enviarlo
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  try {
    const [result] = await db.promise().query(
      'DELETE FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    // Reiniciar el contador AUTO_INCREMENT si la tabla está vacía
    const [rows] = await db.promise().query('SELECT COUNT(*) AS total FROM usuarios');
    if (rows[0].total === 0) {
      await db.promise().query('ALTER TABLE usuarios AUTO_INCREMENT = 1');
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const { nombre, identificacion, correo, telefono } = req.body || {}

  if (!id) return res.status(400).json({ error: 'ID requerido' })

  // Construcción dinámica de los campos a actualizar
  const campos = []
  const valores = []

  if (typeof nombre === 'string' && nombre.trim() !== '') {
    campos.push('nombre = ?')
    valores.push(nombre.trim())
  }
  if (typeof identificacion === 'string' && identificacion.trim() !== '') {
    campos.push('identificacion = ?')
    valores.push(identificacion.trim())
  }
  if (typeof correo === 'string' && correo.trim() !== '') {
    campos.push('correo = ?')
    valores.push(correo.trim())
  }
  if (typeof telefono === 'string' && telefono.trim() !== '') {
    campos.push('telefono = ?')
    valores.push(telefono.trim())
  }

  if (campos.length === 0) {
    return res.status(400).json({ error: 'No hay campos válidos para actualizar' })
  }

  try {
    const sql = `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`
    valores.push(id)

    const [result] = await db.promise().query(sql, valores)

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' })
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
})
// Exportamos el router para usarlo en el index.js
export default router
