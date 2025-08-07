//  Importamos express para poder crear la ruta
import express from 'express'

//  Importamos la conexión a la base de datos
import db from '../db.js'

//  Creamos un enrutador con Express
const router = express.Router()

//  Creamos una ruta POST para insertar libros que vengan desde el frontend
router.post('/', async (req, res) => {
    try {
        //  Recibimos el arreglo de libros que viene en el cuerpo de la petición
        const libros = req.body

        //  Recorremos cada libro recibido
        for (const libro of libros) {
            //  Verificamos si el libro ya existe por ISBN
            const [existe] = await db.promise().query(
                'SELECT * FROM libros WHERE isbn = ?',
                [libro.isbn]
            )

            //  Si no existe, lo insertamos
            if (existe.length === 0) {
                await db.promise().query(
                    'INSERT INTO libros (titulo, isbn, año_publicacion, autor) VALUES (?, ?, ?, ?)',
                    [libro.titulo, libro.isbn, libro.año_publicacion, libro.autor]
                )
            } else {
                // Si ya existe, lo ignoramos para evitar duplicados
                console.log(`Libro duplicado: ${libro.isbn}`)
            }
        }

        //  Enviamos respuesta positiva
        res.status(200).json({ mensaje: ' Libros insertados correctamente' })
    } catch (error) {
        //  Si algo falla, mostramos el error y avisamos al cliente
        console.error(' Error insertando libros:', error.message)
        res.status(500).json({ error: 'Error al insertar libros' })
    }
})

//  Exportamos el router para que se use en index.js
export default router
