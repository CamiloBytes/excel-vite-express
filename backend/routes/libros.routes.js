// routes/libros.router.js
import express from 'express'
import { insertarLibros } from '../controllers/libros.controller.js'

const router = express.Router()

router.post('/', insertarLibros)

export default router
