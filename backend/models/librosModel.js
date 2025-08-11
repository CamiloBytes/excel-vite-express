// models/libros.model.js
import db from '../db.js'

export async function buscarLibroPorISBN(isbn) {
    const [result] = await db.promise().query(
        'SELECT * FROM libros WHERE isbn = ?',
        [isbn]
    )
    return result
}

export async function insertarLibro(libro) {
    await db.promise().query(
        'INSERT INTO libros (titulo, isbn, año_publicacion, autor) VALUES (?, ?, ?, ?)',
        [libro.titulo, libro.isbn, libro.año_publicacion, libro.autor]
    )
}
