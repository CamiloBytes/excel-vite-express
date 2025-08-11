// routes/prestamos.routes.js
import { Router } from 'express'
import {
    registrarPrestamos,
    obtenerListaPrestamos,
    eliminarPrestamoPorId,
    actualizarPrestamoPorId
} from '../controllers/prestamos.controller.js'

const router = Router()

// Ruta para crear uno o varios préstamos
router.post('/', registrarPrestamos)

// Ruta para obtener todos los préstamos
router.get('/', obtenerListaPrestamos)

// Ruta para eliminar un préstamo por ID
router.delete('/:id', eliminarPrestamoPorId)

// Ruta para actualizar un préstamo por ID
router.put('/:id', actualizarPrestamoPorId)

export default router
