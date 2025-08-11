// controllers/estados.controller.js
import { estadoExiste, insertarEstado } from '../models/estadosModel.js'

export const insertarEstados = async (req, res) => {
    try {
        const estados = req.body

        for (const estado of estados) {
            const existe = await estadoExiste(estado)

            if (!existe) {
                await insertarEstado(estado)
            } else {
                console.log(`Estado duplicado: ${estado}`)
            }
        }

        res.status(200).json({ mensaje: 'Estados insertados correctamente' })
    } catch (error) {
        console.error('Error insertando estados:', error.message)
        res.status(500).json({ error: 'Error al insertar estados' })
    }
}
