//  Importamos express para crear la ruta
import express from 'express'

//  Importamos la conexión a la base de datos
import db from '../db.js'

//  Creamos un enrutador con Express
const router = express.Router()

//  Creamos una ruta POST para insertar los estados que vengan desde el frontend
router.post('/', async (req, res) => {
    try {
        //  Recibimos el arreglo de estados
        const estados = Array.isArray(req.body) ? req.body : [req.body]

        for (const estado of estados) {
            const nombre = typeof estado === 'string' ? estado : estado?.nombre_estado
            if (!nombre) continue
            //  Verificamos si ya existe un estado con ese nombre
            const [existe] = await db.promise().query(
                'SELECT * FROM estados WHERE nombre_estado = ?',
                [nombre]
            )

            //  Si no existe, lo insertamos
            if (existe.length === 0) {
                await db.promise().query(
                    'INSERT INTO estados (nombre_estado) VALUES (?)',
                    [nombre]
                )
            } else {
                //  Si ya existe, lo ignoramos para evitar duplicados
                console.log(`Estado duplicado: ${nombre}`)
            }
        }

        //  Respondemos al cliente
        res.status(200).json({ mensaje: ' Estados insertados correctamente' })
    } catch (error) {
        //  Si hay error, lo mostramos
        console.error(' Error insertando estados:', error.message)
        res.status(500).json({ error: 'Error al insertar estados' })
    }
})

//  Nueva ruta GET: lista todos los estados
router.get('/', async (req, res) => {
  try {
    const [estados] = await db.promise().query(
      'SELECT id_estado, nombre_estado FROM estados ORDER BY nombre_estado ASC'
    )
    res.status(200).json({
      mensaje: 'Lista de estados obtenida exitosamente',
      total_estados: estados.length,
      estados_encontrados: estados
    })
  } catch (error) {
    console.error(' Error obteniendo estados:', error.message)
    res.status(500).json({ error: 'Error al obtener estados' })
  }
})

//  Exportamos el router para que se use en index.js
export default router