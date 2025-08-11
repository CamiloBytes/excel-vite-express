// models/prestamos.model.js
import db from '../db.js'

export async function buscarUsuarioPorIdentificacion(identificacion) {
    const [usuario] = await db.promise().query(
        'SELECT id_usuario FROM usuarios WHERE identificacion = ?',
        [identificacion]
    )
    return usuario
}

export async function buscarLibroPorISBN(isbn) {
    const [libro] = await db.promise().query(
        'SELECT id_libro FROM libros WHERE isbn = ?',
        [isbn]
    )
    return libro
}

export async function buscarEstadoPorNombre(nombre) {
    const [estado] = await db.promise().query(
        'SELECT id_estado FROM estados WHERE nombre_estado = ?',
        [nombre]
    )
    return estado
}

export async function buscarPrestamoExistente(idUsuario, idLibro, fechaPrestamo) {
    const [prestamo] = await db.promise().query(
        `SELECT id_prestamo FROM prestamos WHERE id_usuario = ? AND id_libro = ? AND fecha_prestamo = ?`,
        [idUsuario, idLibro, fechaPrestamo]
    )
    return prestamo
}

export async function insertarPrestamo({ idUsuario, idLibro, idEstado, fechaPrestamo, fechaDevolucion }) {
    await db.promise().query(
        `INSERT INTO prestamos (id_usuario, id_libro, id_estado, fecha_prestamo, fecha_devolucion)
        VALUES (?, ?, ?, ?, ?)`,
        [idUsuario, idLibro, idEstado, fechaPrestamo, fechaDevolucion]
    )
}

export async function obtenerPrestamos() {
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
    ORDER BY usuario.id_usuario ASC
    `)
    return prestamos
}

export async function eliminarPrestamo(id) {
    const [result] = await db.promise().query(
        'DELETE FROM prestamos WHERE id_prestamo = ?',
        [id]
    )
    return result
}

export async function contarPrestamos() {
    const [rows] = await db.promise().query(
        'SELECT COUNT(*) AS total FROM prestamos'
    )
    return rows[0].total
}

export async function resetAutoIncrement() {
    await db.promise().query('ALTER TABLE prestamos AUTO_INCREMENT = 1')
}

export async function actualizarPrestamo(id, { id_estado, fecha_devolucion }) {
    const [result] = await db.promise().query(
        `UPDATE prestamos SET id_estado = ?, fecha_devolucion = ? WHERE id_prestamo = ?`,
        [id_estado, fecha_devolucion, id]
    )
    return result
}
