// Importamos express (el servidor web que vamos a usar para las rutas)
import express from 'express'

// Importamos cors para que el frontend (por ejemplo, Vite) pueda comunicarse con el backend sin problemas
import cors from 'cors'

// Importamos los archivos que tienen las rutas de cada tabla
import usuariosRoutes from './routes/usuarios.js'
import librosRoutes from './routes/libros.js'
import estadosRoutes from './routes/estados.js'
import prestamosRoutes from './routes/prestamos.js'

// Creamos la aplicación de Express (esto es como el servidor en sí)
const app = express()

// Usamos cors para permitir peticiones desde otros orígenes (como Vite en localhost:5173)
app.use(cors())

// Le decimos al servidor que entienda datos en formato JSON (para recibir datos del Excel en el frontend)
app.use(express.json())

// Configuramos las rutas para que cuando alguien acceda a /api/usuarios, se use el archivo correspondiente


app.use('/api/usuarios', usuariosRoutes)
app.use('/api/libros', librosRoutes)
app.use('/api/estados', estadosRoutes)
app.use('/api/prestamos', prestamosRoutes)

// Encendemos el servidor en el puerto 3000. Cuando esté listo, muestra un mensaje en la consola.
app.listen(3000, () => {
  console.log('Servidor backend encendido en http://localhost:3000')
})
