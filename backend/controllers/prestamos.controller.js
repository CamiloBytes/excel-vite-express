// controllers/prestamos.controller.js
import {
    buscarUsuarioPorIdentificacion,
    buscarLibroPorISBN,
    buscarEstadoPorNombre,
    buscarPrestamoExistente,
    insertarPrestamo,
    obtenerPrestamos,
    eliminarPrestamo,
    contarPrestamos,
    resetAutoIncrement,
    actualizarPrestamo
} from '../models/prestamosModel.js'

import { normalizeDateInput } from '../utils/fechas.js'

export async function registrarPrestamos(req, res) {
    try {
        const prestamos = Array.isArray(req.body) ? req.body : [req.body]
        let insertados = 0

        for (const [indice, prestamo] of prestamos.entries()) {
            const {
                identificacion_usuario,
                isbn_libro,
                estado_nombre,
                fecha_prestamo,
                fecha_devolucion
            } = prestamo || {}

            if (!identificacion_usuario || !isbn_libro || !estado_nombre) {
                console.error(`Fila ${indice}: Faltan campos requeridos`)
                continue
            }

            const usuario = await buscarUsuarioPorIdentificacion(identificacion_usuario)
            if (usuario.length === 0) {
                console.error(`Fila ${indice}: Usuario no encontrado (${identificacion_usuario})`)
                continue
            }

            const libro = await buscarLibroPorISBN(isbn_libro)
            if (libro.length === 0) {
                console.error(`Fila ${indice}: Libro no encontrado (${isbn_libro})`)
                continue
            }

            const estado = await buscarEstadoPorNombre(estado_nombre)
            if (estado.length === 0) {
                console.error(`Fila ${indice}: Estado no encontrado (${estado_nombre})`)
                continue
            }

            const fechaPrestamoISO = normalizeDateInput(fecha_prestamo)
            const fechaDevolucionISO = normalizeDateInput(fecha_devolucion)

            const prestamoExistente = await buscarPrestamoExistente(
                usuario[0].id_usuario,
                libro[0].id_libro,
                fechaPrestamoISO
            )

            if (prestamoExistente.length === 0) {
                await insertarPrestamo({
                    idUsuario: usuario[0].id_usuario,
                    idLibro: libro[0].id_libro,
                    idEstado: estado[0].id_estado,
                    fechaPrestamo: fechaPrestamoISO,
                    fechaDevolucion: fechaDevolucionISO
                })
                insertados++
            } else {
                console.error(`Fila ${indice}: Préstamo duplicado`)
            }
        }

        res.status(201).json({ mensaje: 'Proceso completado', insertados })
    } catch (error) {
        console.error('Error al insertar préstamos:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function obtenerListaPrestamos(req, res) {
    try {
        const prestamos = await obtenerPrestamos()
        res.status(200).json({
            mensaje: 'Lista de préstamos obtenida exitosamente',
            total_prestamos: prestamos.length,
            prestamos_encontrados: prestamos
        })
    } catch (error) {
        console.error('Error al consultar préstamos:', error)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
}

export async function eliminarPrestamoPorId(req, res) {
    const { id } = req.params
    if (!id) return res.status(400).json({ error: 'ID requerido' })

    try {
        const result = await eliminarPrestamo(id)
        const total = await contarPrestamos()
        if (total === 0) await resetAutoIncrement()

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' })
        }

        res.json({ mensaje: 'Préstamo eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar préstamo:', error)
        res.status(500).json({ error: 'Error del servidor' })
    }
}

export async function actualizarPrestamoPorId(req, res) {
    const { id } = req.params
    const { id_estado, fecha_devolucion } = req.body

    if (!id) return res.status(400).json({ error: 'ID requerido' })

    try {
        const result = await actualizarPrestamo(id, { id_estado, fecha_devolucion })

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Préstamo no encontrado' })
        }

        res.json({ mensaje: 'Préstamo actualizado correctamente' })
    } catch (error) {
        console.error('Error al actualizar préstamo:', error)
        res.status(500).json({ error: 'Error del servidor' })
    }
}
