import * as XLSX from 'xlsx'

function leerArchivoComoArrayBuffer(archivo) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader()
    lector.onload = (eventoLectura) => {
      resolve(new Uint8Array(eventoLectura.target.result))
    }
    lector.onerror = reject
    lector.readAsArrayBuffer(archivo)
  })
}

async function enviarDatos(url, datos) {
  const respuesta = await fetch(`http://localhost:3000${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  const contenido = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    console.error(`Error ${respuesta.status} al enviar a ${url}:`, contenido)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Fallo al enviar a ${url}: ${contenido?.error || 'Error'}`,
    })
    throw new Error(contenido?.error || `Fallo en ${url}`)
  }

  return contenido
}

export async function leerExcelYEnviar(archivo) {
  const datos = await leerArchivoComoArrayBuffer(archivo)
  const libro = XLSX.read(datos, { type: 'array' })

  const nombrePrimeraHoja = libro.SheetNames[0]
  const hoja = libro.Sheets[nombrePrimeraHoja]

  const datosJSON = XLSX.utils.sheet_to_json(hoja, { defval: '' })

  const usuarios = []
  const libros = []
  const estados = new Set()
  const prestamos = []

  datosJSON.forEach((fila) => {
    usuarios.push({
      nombre: fila['nombre del usuario'],
      identificacion: fila['identificacion del usuario'],
      correo: fila['correo'],
      telefono: fila['telefono'],
    })

    libros.push({
      titulo: fila['titulo'],
      isbn: fila['isbn'],
      año_publicacion: parseInt(fila['año de publicacion']),
      autor: fila['autor'],
    })

    estados.add(fila['estado'])

    prestamos.push({
      identificacion_usuario: fila['identificacion del usuario'],
      isbn_libro: fila['isbn'],
      estado_nombre: fila['estado'],
      fecha_prestamo: fila['fecha_prestamo'],
      fecha_devolucion: fila['fecha_devolucion'],
    })
  })

  await enviarDatos('/api/usuarios', usuarios)
  await enviarDatos('/api/libros', libros)
  await enviarDatos('/api/estados', Array.from(estados))
  const resultadoPrestamos = await enviarDatos('/api/prestamos', prestamos)

  Swal.fire({
    icon: 'success',
    title: 'Carga finalizada',
    html: `Préstamos insertados: <b>${resultadoPrestamos?.insertados ?? 0}</b><br/>` +
          (resultadoPrestamos?.errores?.length ? `Errores: <b>${resultadoPrestamos.errores.length}</b>` : 'Sin errores'),
  })

  return resultadoPrestamos
}