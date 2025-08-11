// routes/estados.routes.js
import express from 'express'
import { insertarEstados } from '../controllers/estados.controller.js'

const router = express.Router()

router.post('/', insertarEstados)

export default router
