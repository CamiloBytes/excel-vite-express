// routes/usuarios.routes.js
import { Router } from 'express'
import {
  registrarUsuarios,
  listarUsuarios,
  eliminarUsuario
} from '../controllers/usuarios.controller.js'

const router = Router()

router.post('/', registrarUsuarios)
router.get('/', listarUsuarios)
router.delete('/:id', eliminarUsuario)

export default router
