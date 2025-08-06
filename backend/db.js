//  Importamos el paquete 'mysql2' para poder hablar con MySQL
import mysql from 'mysql2'

//  Creamos la conexión a la base de datos
const db = mysql.createPool({
    host: 'localhost',         //  Dirección de la base de datos (en este caso, está en tu compu)
    user: 'root',              //  Usuario de la base de datos (normalmente es 'root')
    password: 'Qwe.123*',              // Contraseña del usuario (puede estar vacía si no le pusiste)
    database: 'prestamos_biblioteca', // El nombre de la base de datos que ya creaste
    connectionLimit:10,             // el maximo numero de coneciones
    waitForConnections:true,        // si se pasa el limite genera una lista de espera
    queueLimit:0                    // numero maimo de peticiones 
})


// Verificamos si la conexión funciona correctamente
db.getConnection((error, connection) => {
    if (error) {
      console.error(' Error al conectar con la base de datos:', error.message);
    } else {
      console.log(' Conexión a la base de datos exitosa');
      connection.release(); // Muy importante: liberar la conexión después de usarla
    }
  })

//  Exportamos la conexión para poder usarla en los demás archivos
export default db;