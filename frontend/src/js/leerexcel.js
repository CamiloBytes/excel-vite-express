// Importamos la librería xlsx para poder leer archivos Excel
import * as XLSX from 'xlsx';
import axios from 'axios';




// Función para leer el contenido del archivo Excel
export function leerExcel(archivo) {
  const lector = new FileReader();

  // Cuando se termina de leer el archivo
  lector.onload = async function (eventoLectura) {
    const datos = new Uint8Array(eventoLectura.target.result);
    const libro = XLSX.read(datos, { type: 'array' });

    // Tomamos la primera hoja del archivo
    const nombrePrimeraHoja = libro.SheetNames[0];
    const hoja = libro.Sheets[nombrePrimeraHoja];

    // Convertimos la hoja a un arreglo de objetos JSON
    const datosJSON = XLSX.utils.sheet_to_json(hoja, { defval: "" });

    // Declaramos arreglos para separar los datos por tabla
    const usuarios = [];
    const libros = [];
    const estados = new Set(); // Usamos Set para evitar estados duplicados
    const prestamos = [];

    // Recorremos cada fila del Excel
    datosJSON.forEach(fila => {
      usuarios.push({
        nombre: fila["nombre del usuario"],
        identificacion: fila["identificacion del usuario"],
        correo: fila["correo"],
        telefono: fila["telefono"]
      });

      libros.push({
        titulo: fila["titulo"],
        isbn: fila["isbn"],
        año_publicacion: parseInt(fila["año de publicacion"]),
        autor: fila["autor"]
      });

      estados.add(fila["estado"]);
      
      prestamos.push({
        identificacion_usuario: fila["identificacion del usuario"],
        isbn_libro: fila["isbn"],
        estado_nombre: fila["estado"],
        fecha_prestamo: fila["fecha_prestamo"],
        fecha_devolucion: fila["fecha_devolucion"]
      });
    });

    // Enviamos los datos a los endpoints del backend
    await enviarDatos('/api/usuarios', usuarios);
    await enviarDatos('/api/libros', libros);
    await enviarDatos('/api/estados', Array.from(estados));
    await enviarDatos('/api/prestamos', prestamos);

  };

  // Iniciamos la lectura del archivo como ArrayBuffer
  lector.readAsArrayBuffer(archivo);
}

// Función para enviar datos al servidor mediante fetch
async function enviarDatos(url, datos) {
  try {
    const dataSend = await axios.post(`http://localhost:3000${url}`, datos)

    console.log(`${url} enviado correctamente:`, dataSend);
  } catch (error) {
    console.error(`Error al enviar datos a ${url}:`, error);
  }
}
// Función para cargar usuarios al hacer clic en el botón
