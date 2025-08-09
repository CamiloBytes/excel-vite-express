import { leerExcelYEnviar } from '../leecturaExcel.js'

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

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const archivoSeleccionado = inputArchivo.files?.[0]
    if (!archivoSeleccionado) {
      Swal.fire({ icon: 'warning', title: 'Selecciona un archivo', text: 'Por favor selecciona un archivo Excel antes de enviarlo.' })
      return
    }
    try {
      const resumen = await leerExcelYEnviar(archivoSeleccionado)
      console.log('Resumen préstamos:', resumen)
    } catch (err) {
      // Los errores ya se informan desde la utilidad
    }
  })
}