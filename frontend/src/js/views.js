import { endPointPrestamo, endPointUsuarios, endPointEstados } from "./endpoint";
import axios from "axios";
import { router } from "./router";
import { leerExcel } from "./leerexcel";
import Swal from "sweetalert2";

// Esta función renderiza la vista de inicio
export function home() {
    const home = document.getElementById('app')
    home.innerHTML = `
    <section>
    <header class = "header">
        <h1>Bienvenido a la Biblioteca</h1>
        <p>Utiliza el menú para navegar entre las diferentes secciones.</p>
       <nav>
        <ul>
            <li><button id="btn-inicio">Inicio</button></li>
            <li><button id="btn-prestamos">Préstamos</button></li>
            <li><button id="btn-usuarios">Usuarios</button></li>        
        </ul>
      </nav>
    </header>
      <main class="main">
        <h2>Leer desde Excel</h2>
       <form id="fromExcel">
            <input type="file" id="excelInput" accept=".xlsx, .xls" />
            <button id="btnFrom" >Leer Excel</button>
        </from>
      </main>
      
    </section>
`

    // Variable para guardar el archivo seleccionado por el usuario
    let archivoSeleccionado = null;
    
    const from =document.getElementById('fromExcel')
    
    from.addEventListener('submit',(e)=>{
      e.preventDefault()
    
      const inputArchivo = document.getElementById('excelInput');
      archivoSeleccionado = inputArchivo.files[0]
      
      if(!archivoSeleccionado){
        alert('Por favor selecciona un archivo Excel antes de enviarlo.')
        return
      }
      // llamo a la funcion leerExcel para procesar el archivo 
      leerExcel(archivoSeleccionado)
    })

    // Selecciono los botones del menú
    const btnInicio = document.getElementById('btn-inicio');
    const btnPrestamos = document.getElementById('btn-prestamos');
    const btnUsuarios = document.getElementById('btn-usuarios');
    // escucho los eventos para cambiar de vista
    btnInicio.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/');
        router();
    });
    btnPrestamos.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/prestamos');
        router();
    });
    btnUsuarios.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/usuarios');
        router();
    });

}
// Esta funcion es para renderisar la tabla de los usuarios
export function renderUsersPage(e) {
    e?.preventDefault(); // Evitar el comportamiento por defecto del botón si es necesario  
    const app = document.getElementById('app');
    app.innerHTML = `
    <section>
      <header class = "header">
         <h1>Usuarios</h1>
       <nav>
        <ul>
            <li><button id="btn-inicio">Inicio</button></li>
            <li><button id="btn-prestamos">Prestamos</button></li> 
            <li><button id="btn-recargar">Recargar</button></li>    
            <li><button id="btn-nuevo-usuario">Nuevo</button></li>    
        </ul>
      </nav>
    </header>
         
      <div style="overflow:auto; margin-top:12px;">
        <table id="tabla-usuarios" border="1" cellpadding="6" cellspacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Identificación</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th colspan="2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="7">Cargando...</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `
    // Selecciono los elementos del DOM
    const tbody = app.querySelector('#tabla-usuarios tbody')
    const btnRecargar = app.querySelector('#btn-recargar')
    const btnInicio = app.querySelector('#btn-inicio');
    const btnPrestamos = app.querySelector('#btn-prestamos');
    const btnNuevo = app.querySelector('#btn-nuevo-usuario');
    
    btnInicio.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/');
        router();
    });
    btnPrestamos.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/prestamos');
        router();
    });

    async function abrirFormularioUsuario(usuario = null) {
      const html = `
        <div class="swal2-html-container" style="text-align:left">
          <label>Nombre</label>
          <input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${usuario?.nombre ?? ''}">
          <label>Identificación</label>
          <input id="swal-identificacion" class="swal2-input" placeholder="Identificación" value="${usuario?.identificacion ?? ''}">
          <label>Correo</label>
          <input id="swal-correo" class="swal2-input" type="email" placeholder="correo@dominio.com" value="${usuario?.correo ?? ''}">
          <label>Teléfono</label>
          <input id="swal-telefono" class="swal2-input" placeholder="Teléfono" value="${usuario?.telefono ?? ''}">
        </div>
      `
      const { value: formValues } = await Swal.fire({
        title: usuario ? `Editar usuario #${usuario.id_usuario}` : 'Nuevo usuario',
        html,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: usuario ? 'Guardar' : 'Crear',
        preConfirm: () => {
          const nombre = document.getElementById('swal-nombre').value.trim()
          const identificacion = document.getElementById('swal-identificacion').value.trim()
          const correo = document.getElementById('swal-correo').value.trim()
          const telefono = document.getElementById('swal-telefono').value.trim()
          if (!usuario && (!nombre || !identificacion)) {
            Swal.showValidationMessage('Nombre e Identificación son obligatorios')
            return false
          }
          return { nombre, identificacion, correo, telefono }
        }
      })
      return formValues
    }

    async function cargarUsuarios(e) {
        e?.preventDefault(); // Evitar el comportamiento por defecto del botón si es necesario  
        // Limpio la tabla y muestro mensaje de carga
        tbody.innerHTML = `<tr><td colspan="7">Cargando...</td></tr>`
        try {
            const { data } = await axios.get(endPointUsuarios);
            const usuarios = data.usuarios_encontrados

            if (!Array.isArray(usuarios) || usuarios.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7">Sin datos</td></tr>`
                console.error("El backend no devolvió un array válido:", usuarios)
                return
            }
            tbody.innerHTML = ''; // Limpio tabla

            usuarios.forEach(usuario => {
                const fila = document.createElement('tr')
                fila.innerHTML = `
                <td>${usuario.id_usuario}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.identificacion}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.telefono}</td>
                <td><button class="btn-eliminar" data-id="${usuario.id_usuario}">Eliminar</button></td>
                <td><button class="btn-actualizar" data-id="${usuario.id_usuario}">Editar</button></td>
            `
                tbody.appendChild(fila);

                // Acción eliminar
                fila.querySelector('.btn-eliminar').addEventListener('click', async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const id = usuario.id_usuario
                  const { isConfirmed } = await Swal.fire({
                    title: `¿Seguro que quieres eliminar el usuario #${id}?`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                  })
                  if (!isConfirmed) return
                  try {
                    await axios.delete(`${endPointUsuarios}/${id}`)
                    Swal.fire('Eliminado', `Usuario con ID ${id} eliminado correctamente.`, 'success')
                    fila.remove()
                  } catch (error) {
                    Swal.fire('Error', 'No se pudo eliminar el usuario.', 'error')
                    console.error('Error al eliminar usuario:', error.message)
                  }
                })

                // Acción editar
                fila.querySelector('.btn-actualizar').addEventListener('click', async () => {
                  const formValues = await abrirFormularioUsuario(usuario)
                  if (!formValues) return
                  try {
                    await axios.put(`${endPointUsuarios}/${usuario.id_usuario}`, formValues)
                    Swal.fire('Actualizado', 'Usuario actualizado correctamente', 'success')
                    cargarUsuarios()
                  } catch (error) {
                    Swal.fire('Error', 'No se pudo actualizar el usuario.', 'error')
                    console.error('Error al actualizar usuario:', error.message)
                  }
                })
            })

        } catch (e) {
            console.error('Error cargando usuarios:', e)
            tbody.innerHTML = `<tr><td colspan="7">Error cargando datos</td></tr>`
        }
    }

    btnRecargar.addEventListener('click', cargarUsuarios)
    btnNuevo.addEventListener('click', async () => {
      const formValues = await abrirFormularioUsuario(null)
      if (!formValues) return
      try {
        await axios.post(endPointUsuarios, formValues)
        Swal.fire('Creado', 'Usuario creado correctamente', 'success')
        cargarUsuarios()
      } catch (error) {
        Swal.fire('Error', 'No se pudo crear el usuario.', 'error')
        console.error('Error al crear usuario:', error.message)
      }
    })
    cargarUsuarios()
}

export function renderPrestamos(e) {
    e?.preventDefault(); // Evitar el comportamiento por defecto del botón si es necesario  
    // Renderizo la vista de préstamos
    const app = document.getElementById('app');
    app.innerHTML = `
    <section>
     <header class = "header">
         <h1>Préstamos</h1>
       <nav>
        <ul>
            <li><button id="btn-inicio">Inicio</button></li>
            <li><button id="btn-usuarios">Usuarios</button></li> 
            <li><button id="btn-recargar">Recargar</button></li>    
        </ul>
      </nav>
    </header>
      <div style="overflow:auto; margin-top:12px;">
       <table id="tabla-prestamos" border="1" cellpadding="6" cellspacing="0">
    <thead>
        <tr>
        <th>ID Préstamo</th>
        <th>Nombre Usuario</th>
        <th>Identificación</th>
        <th>Correo</th>
        <th>Teléfono</th>
        <th>Título Libro</th>
        <th>ISBN</th>
        <th>Año Publicación</th>
        <th>Autor</th>
        <th>Fecha Préstamo</th>
        <th>Fecha Devolución</th>
        <th>Estado Préstamo</th>
        <th colspan="2">Acciones</th>
        </tr>
    </thead>
  <tbody>
    <tr><td colspan="15">Cargando...</td></tr>
  </tbody>
</table>
      </div>
    </section>
  `

    const tbody = app.querySelector('#tabla-prestamos tbody');
    const btnRecargar = app.querySelector('#btn-recargar');
    const btnInicio = app.querySelector('#btn-inicio');
    const btnUsuario = app.querySelector('#btn-usuarios');
    btnInicio.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/');
        router();
    });
    btnUsuario.addEventListener('click', (e) => {
        e.preventDefault();
        history.pushState({}, '', '/usuarios');
        router();
    });

    async function cargarPrestamos(e) {
        e?.preventDefault(); // Evitar el comportamiento por defecto del botón si es necesario  
        tbody.innerHTML = `<tr><td colspan="15">Cargando...</td></tr>`;
        try {

            const { data } = await axios.get(endPointPrestamo);

            const prestamos = data.prestamos_encontrados;

            if (!Array.isArray(prestamos) || prestamos.length === 0) {
                tbody.innerHTML = `<tr><td colspan="15">Sin datos</td></tr>`;
                console.error("El backend no devolvió un array válido:", prestamos);
                return;
            }

            tbody.innerHTML = ''; // Limpio tabla

            prestamos.forEach(prestamo => {
                const fila = document.createElement('tr');

                fila.innerHTML = `
                <td>${prestamo.id_del_prestamo}</td>
                <td>${prestamo.nombre_completo_usuario}</td>
                <td>${prestamo.documento_identificacion}</td>
                <td>${prestamo.email_usuario}</td>
                <td>${prestamo.telefono_contacto}</td>
                <td>${prestamo.titulo_del_libro}</td>
                <td>${prestamo.codigo_isbn}</td>
                <td>${prestamo.año_de_publicacion}</td>
                <td>${prestamo.autor_del_libro}</td>
                <td>${prestamo.fecha_de_prestamo}</td>
                <td>${prestamo.fecha_de_devolucion ?? ''}</td>
                <td>${prestamo.estado_del_prestamo}</td>
                <td><button class="btn-eliminar" data-id="${prestamo.id_del_prestamo}">Eliminar</button></td>
                <td><button class="btn-actualizar" data-id="${prestamo.id_del_prestamo}">Actualizar</button></td>
            `;

                tbody.appendChild(fila);

                // Eliminar
                fila.querySelector('.btn-eliminar').addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const id = prestamo.id_del_prestamo;
                    const { isConfirmed } = await Swal.fire({
                        title: `¿Seguro que quieres eliminar el préstamo #${id}?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar'
                    })
                    if (!isConfirmed) return
                    try {
                        await axios.delete(`${endPointPrestamo}/${id}`);
                        Swal.fire('Eliminado', `Préstamo con ID ${id} eliminado correctamente.`, 'success');
                        fila.remove();
                    } catch (error) {
                        Swal.fire('Error', 'No se pudo eliminar el préstamo.', 'error');
                        console.error('Error al eliminar préstamo:', error.message);
                    }
                });

                // Actualizar
                fila.querySelector('.btn-actualizar').addEventListener('click', async () => {
                    try {
                        const { data: estadosResp } = await axios.get(endPointEstados)
                        const estados = estadosResp?.estados_encontrados ?? []
                        const options = estados.map(e => `<option value="${e.id_estado}">${e.nombre_estado}</option>`).join('')
                        const fechaDevActual = (prestamo.fecha_de_devolucion || '').toString().slice(0, 10)

                        const html = `
                          <div class="swal2-html-container" style="text-align:left">
                            <label>Estado</label>
                            <select id="swal-estado" class="swal2-select">${options}</select>
                            <label>Fecha de devolución</label>
                            <input id="swal-fecha-dev" class="swal2-input" type="date" value="${fechaDevActual}">
                          </div>
                        `
                        const { value: formValues } = await Swal.fire({
                          title: `Actualizar préstamo #${prestamo.id_del_prestamo}`,
                          html,
                          focusConfirm: false,
                          showCancelButton: true,
                          confirmButtonText: 'Guardar',
                          didOpen: () => {
                            const select = document.getElementById('swal-estado')
                            const actual = estados.find(e => e.nombre_estado === prestamo.estado_del_prestamo)
                            if (actual) select.value = String(actual.id_estado)
                          },
                          preConfirm: () => {
                            const id_estado = parseInt(document.getElementById('swal-estado').value, 10)
                            const fecha_devolucion = document.getElementById('swal-fecha-dev').value
                            if (!Number.isInteger(id_estado)) {
                              Swal.showValidationMessage('Selecciona un estado válido')
                              return false
                            }
                            return { id_estado, fecha_devolucion }
                          }
                        })
                        if (!formValues) return
                        await axios.put(`${endPointPrestamo}/${prestamo.id_del_prestamo}`, formValues)
                        Swal.fire('Actualizado', 'Préstamo actualizado correctamente', 'success')
                        cargarPrestamos()
                    } catch (error) {
                        console.error('Error al actualizar préstamo:', error.message);
                        Swal.fire('Error', 'No se pudo actualizar el préstamo.', 'error')
                    }
                });
            });

        } catch (error) {
            console.error('Error al obtener préstamos:', error.message);
            tbody.innerHTML = `<tr><td colspan="15">Error cargando datos</td></tr>`;
        }
    }
    btnRecargar.addEventListener('click', cargarPrestamos)
    cargarPrestamos()

}