import { endPointPrestamo } from "./endpoint";
import axios from "axios";

export async function traerDatos() {
    try {
        // Llamo a la api
        const { data } = await axios.get(endPointPrestamo);

        // Obtengo los arrays del backend
        const prestamos = data.prestamos_encontrados;

        // Verifico que realmente sea un array
        if (!Array.isArray(prestamos)) {
            console.error("El backend no devolvió un array válido:", prestamos);
            return;
        }

        console.log(prestamos); // Compruebo em consola

        // Seleccionamos el tbody de la tabla
        const tabla = document.getElementById('tabla-prestamos');

        // Limpiamos cualquier dato previo
        tabla.innerHTML = '';

        // Recorro e inserto cada préstamo en la tabla
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
                <td>${prestamo.fecha_creacion_registro}</td>
                <td>${prestamo.fecha_ultima_actualizacion}</td>
            `;

            tabla.appendChild(fila);
        });

    } catch (error) {
        console.error('Error al obtener préstamos:', error.message);
    }
}
