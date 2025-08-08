import * as XLSX from 'xlsx'

export function renderUploadPage(container) {
  container.innerHTML = `
    <section>
      <h1>Cargar archivo</h1>
      <form action="" id="fromExel">
        <input type="file" id="excelInput" accept=".xlsx, .xls" />
        <button id="btnFrom">Enviar Datos</button>
      </form>
    </section>
  `

  const form = container.querySelector('#fromExel')
  const inputArchivo = container.querySelector('#excelInput')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const archivoSeleccionado = inputArchivo.files?.[0]
    if (!archivoSeleccionado) {
      alert('Por favor selecciona un archivo Excel antes de enviarlo.')
      return
    }
    leerExcel(archivoSeleccionado)
  })

  function leerExcel(archivo) {
    const lector = new FileReader()

    lector.onload = async function (eventoLectura) {
      const datos = new Uint8Array(eventoLectura.target.result)
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

      try {
        await enviarDatos('/api/usuarios', usuarios)
        await enviarDatos('/api/libros', libros)
        await enviarDatos('/api/estados', Array.from(estados))
        const resultadoPrestamos = await enviarDatos('/api/prestamos', prestamos)
        console.log('Resumen préstamos:', resultadoPrestamos)
        alert('Carga finalizada')
      } catch (err) {
        // Ya se loguea y hace alert en enviarDatos
      }
    }

    lector.readAsArrayBuffer(archivo)
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
      alert(`Fallo al enviar a ${url}: ${contenido?.error || 'Error'}`)
      throw new Error(contenido?.error || `Fallo en ${url}`)
    }

    if (url === '/api/prestamos') {
      console.log(`${url} OK:`, contenido)
    } else {
      console.log(`${url} enviado correctamente:`, contenido)
    }

    return contenido
  }
}