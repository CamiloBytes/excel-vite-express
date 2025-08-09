import { endPointPrestamo, endPointUsuarios } from "./endpoint";
import axios from "axios";

export function home (){
    const home = document.getElementById('app')

}

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
      const { data } = await axios.get(endPointUsuarios);
      const usuarios = data.usuarios_encontrados
      
      if(Array.isArray(usuarios)|| usuarios.length === 0){
        tbody.innerHTML = `<tr><td colspan="7">Sin datos</td></tr>`
        console.error("El backend no devolvió un array válido:", usuarios)
        return
      }
        const tabla = document.getElementById('tabla');
        tabla.innerHTML = ''; // Limpio tabla

        usuarios.forEach(usuarios=>{
            const fila = document.createElement('tr')
           fila.innerHTML = `
            <td>${usuarios.id_usuario}</td>
            <td>${usuarios.nombre}</td>
            <td>${usuarios.identificacion}</td>
            <td>${usuarios.correo}</td>
            <td>${usuarios.telefono}</td>
            <td>${usuarios.created_at ?? ''}</td>
            <td>${usuarios.updated_at ?? ''}</td>
          `

        tabla.appendChild(fila);
    })
        .join('')
    } catch (e) {
      console.error('Error cargando usuarios:', e)
      tbody.innerHTML = `<tr><td colspan="7">Error cargando datos</td></tr>`
    }
  }

  btnRecargar.addEventListener('click', cargarUsuarios)
  cargarUsuarios()
}

export async function traerDatos() {
    try {
        // Llamo a la API
        const { data } = await axios.get(endPointPrestamo);

        const prestamos = data.prestamos_encontrados;

        if (!Array.isArray(prestamos)) {
            console.error("El backend no devolvió un array válido:", prestamos);
            return;
        }

        console.log(prestamos); // Verificación en consola

        const tabla = document.getElementById('tabla');
        tabla.innerHTML = ''; // Limpio tabla

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
                <td>${prestamo.fecha_de_devolucion}</td>
                <td>${prestamo.estado_del_prestamo}</td>
                <td><button class="btn-eliminar" data-id="${prestamo.id_del_prestamo}">Eliminar</button></td>
                <td><button class="btn-actualizar" data-id="${prestamo.id_del_prestamo}">Actualizar</button></td>
            `;

            tabla.appendChild(fila);
        });

        // Botones Eliminar
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.dataset.id; // Tomo el ID desde data-id
                if (confirm(`¿Seguro que quieres eliminar el préstamo #${id}?`)) {
                    try {
                        await axios.delete(`${endPointPrestamo}/${id}`);
                        console.log(`Préstamo con ID ${id} eliminado`);
                        traerDatos(); // Recargar tabla
                    } catch (error) {
                        console.error('Error al eliminar préstamo:', error.message);
                    }
                }
            });
        });

        // Botones Actualizar
        document.querySelectorAll('.btn-actualizar').forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.dataset.id;
                try {
                    await axios.put(`${endPointPrestamo}/${id}`, { estado_del_prestamo: "Devuelto" });
                    console.log(`Préstamo con ID ${id} actualizado`);
                    traerDatos();
                } catch (error) {
                    console.error('Error al actualizar préstamo:', error.message);
                }
            });
        });

    } catch (error) {
        console.error('Error al obtener préstamos:', error.message);
    }
}
