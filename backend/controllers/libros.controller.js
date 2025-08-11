// controllers/libros.controller.js
import { buscarLibroPorISBN, insertarLibro } from '../models/librosModel.js'

export async function insertarLibros(req, res) {
    try {
        const libros = req.body

        for (const libro of libros) {
            const existe = await buscarLibroPorISBN(libro.isbn)

            if (existe.length === 0) {
                await insertarLibro(libro)
            } else {
                console.log(`Libro duplicado: ${libro.isbn}`)
            }
        }

        res.status(200).json({ mensaje: 'Libros insertados correctamente' })
    } catch (error) {
        console.error('Error insertando libros:', error.message)
        res.status(500).json({ error: 'Error al insertar libros' })
    }
}
