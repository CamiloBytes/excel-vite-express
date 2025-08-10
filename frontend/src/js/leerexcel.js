// Importamos la librería xlsx para poder leer archivos Excel
import * as XLSX from 'xlsx';
import axios from 'axios';
import { alertaExcelError, alertaExcelExito } from './alert';




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
      // agrego los usuarios al arreiglo usuarios
      usuarios.push({
        nombre: fila["nombre del usuario"],
        identificacion: fila["identificacion del usuario"],
        correo: fila["correo"],
        telefono: fila["telefono"]
      });
      // agrego los libros al arreiglo libros
      libros.push({
        titulo: fila["titulo"],
        isbn: fila["isbn"],
        año_publicacion: parseInt(fila["año de publicacion"]),
        autor: fila["autor"]
      });
      // Agrego los estados al Set para evitar duplicados
      estados.add(fila["estado"]);
      
      // agrego los datos al arreiglo de los prestamos
      prestamos.push({
        identificacion_usuario: fila["identificacion del usuario"],
        isbn_libro: fila["isbn"],
        estado_nombre: fila["estado"],
        fecha_prestamo: fila["fecha_prestamo"],
        fecha_devolucion: fila["fecha_devolucion"]
      });
    });
    let error = false;
    try {
       // Enviamos los datos a los endpoints del backend
      // endpoint de usuarios
      await enviarDatos('/api/usuarios', usuarios);
      // endpoint de libros
      await enviarDatos('/api/libros', libros);
      // endpoint de estados, convertimos el Set a un Array
      await enviarDatos('/api/estados', Array.from(estados));
      // endpoint de prestamos
      await enviarDatos('/api/prestamos', prestamos);
    } catch (error) {
      error = true;
    }
    // Mostramos alerta de éxito o error
    // Dependiendo de si hubo un error al enviar los datos 
    if (error) {
      alertaExcelError('Excel');
    } else {
      alertaExcelExito('Excel');
    }

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
