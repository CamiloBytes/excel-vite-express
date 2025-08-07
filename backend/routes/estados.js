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
        const estados = req.body

        for (const estado of estados) {
            //  Verificamos si ya existe un estado con ese nombre
            const [existe] = await db.promise().query(
                'SELECT * FROM estados WHERE nombre_estado = ?',
                [estado]
            )

            //  Si no existe, lo insertamos
            if (existe.length === 0) {
                await db.promise().query(
                    'INSERT INTO estados (nombre_estado) VALUES (?)',
                    [estado]
                )
            } else {
                //  Si ya existe, lo ignoramos para evitar duplicados
                console.log(`Estado duplicado: ${estado}`)
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

//  Exportamos el router para que se use en index.js
export default router