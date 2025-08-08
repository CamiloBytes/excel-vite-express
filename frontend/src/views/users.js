export function renderUsersPage(container) {
  container.innerHTML = `
    <section>
      <h1>Usuarios</h1>
      <button id="btn-recargar">Recargar</button>
      <div style="overflow:auto; margin-top:12px;">
        <table id="tabla-usuarios" border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Identificación</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Creado</th>
              <th>Actualizado</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="7">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `

  const tbody = container.querySelector('#tabla-usuarios tbody')
  const btnRecargar = container.querySelector('#btn-recargar')

  async function cargarUsuarios() {
    tbody.innerHTML = `<tr><td colspan="7">Cargando...</td></tr>`
    try {
      const res = await fetch('http://localhost:3000/api/usuarios')
      const usuarios = await res.json()
      if (!res.ok) throw new Error(usuarios?.error || 'Error')

      if (!Array.isArray(usuarios) || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">Sin datos</td></tr>`
        return
      }
      tbody.innerHTML = usuarios
        .map(
          (u) => `
          <tr>
            <td>${u.id_usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.identificacion}</td>
            <td>${u.correo}</td>
            <td>${u.telefono}</td>
            <td>${u.created_at ?? ''}</td>
            <td>${u.updated_at ?? ''}</td>
          </tr>`
        )
        .join('')
    } catch (e) {
      console.error('Error cargando usuarios:', e)
      tbody.innerHTML = `<tr><td colspan="7">Error cargando datos</td></tr>`
    }
  }

  btnRecargar.addEventListener('click', cargarUsuarios)
  cargarUsuarios()
}