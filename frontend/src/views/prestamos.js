export function renderPrestamosPage(container) {
  container.innerHTML = `
    <section>
      <h1>Préstamos</h1>
      <button id="btn-recargar">Recargar</button>
      <div class="table-wrapper mt-3">
        <table id="tabla-prestamos" border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Identificación</th>
              <th>Libro</th>
              <th>ISBN</th>
              <th>Estado</th>
              <th>Fecha préstamo</th>
              <th>Fecha devolución</th>
              <th>Creado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="9">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `

  const tbody = container.querySelector('#tabla-prestamos tbody')
  const btnRecargar = container.querySelector('#btn-recargar')

  async function cargarPrestamos() {
    tbody.innerHTML = `<tr><td colspan="9">Cargando...</td></tr>`
    try {
      const res = await fetch('http://localhost:3000/api/prestamos')
      const prestamos = await res.json()
      if (!res.ok) throw new Error(prestamos?.error || 'Error')

      if (!Array.isArray(prestamos) || prestamos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9">Sin datos</td></tr>`
        return
      }
      tbody.innerHTML = prestamos
        .map(
          (p) => `
          <tr>
            <td>${p.id_prestamo}</td>
            <td>${p.usuario_nombre ?? ''}</td>
            <td>${p.usuario_identificacion ?? ''}</td>
            <td>${p.libro_titulo ?? ''}</td>
            <td>${p.libro_isbn ?? ''}</td>
            <td>${p.estado ?? ''}</td>
            <td>${p.fecha_prestamo ?? ''}</td>
            <td>${p.fecha_devolucion ?? ''}</td>
            <td>${p.created_at ?? ''}</td>
          </tr>`
        )
        .join('')
    } catch (e) {
      console.error('Error cargando préstamos:', e)
      tbody.innerHTML = `<tr><td colspan="9">Error cargando datos</td></tr>`
    }
  }

  btnRecargar.addEventListener('click', cargarPrestamos)
  cargarPrestamos()
}