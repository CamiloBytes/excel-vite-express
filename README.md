# excel-vite-express

Este proyecto es una aplicación de gestión de biblioteca que permite cargar datos desde archivos Excel, visualizar y administrar usuarios, libros, préstamos y estados. Utiliza Express para el backend y Vite para el frontend.

## Estructura de carpetas

```
excel-vite-express/
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── package.json
│   └── routes/
│       ├── usuarios.js
│       ├── libros.js
│       ├── estados.js
│       └── prestamos.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── main.js
│   │   ├── style.css
│   │   └── js/
│   │       ├── alert.js
│   │       ├── auth.js
│   │       ├── endpoint.js
│   │       ├── leerexcel.js
│   │       ├── router.js
│   │       └── views.js
```

## Requisitos

- Node.js
- npm

## Instalación

1. Clona el repositorio y entra en la carpeta principal.
2. Instala las dependencias del backend:
   ```sh
   cd backend
   npm install
   ```
3. Instala las dependencias del frontend:
   ```sh
   cd ../frontend
   npm install
   ```

## Ejecución

### Backend

Desde la carpeta `backend`:
```sh
npm run server
```
El backend se ejecuta en [http://localhost:3000](http://localhost:3000)

### Frontend

Desde la carpeta `frontend`:
```sh
npm run dev
```
El frontend se ejecuta en [http://localhost:5173](http://localhost:5173) por defecto.

## Notas

- Configura la conexión a la base de datos en `backend/db.js` según tus credenciales.
- Para cargar datos desde Excel, usa la opción en la pantalla principal del frontend.
