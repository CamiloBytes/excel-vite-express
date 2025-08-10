//  Importamos el paquete 'mysql2' para poder hablar con MySQL
import mysql from 'mysql2'

//  Creamos la conexión a la base de datos Clever Cloud
const db = mysql.createPool({
    host: 'ba5rgjivhubweomt5cwb-mysql.services.clever-cloud.com',
    user: 'uzxp16mr7s5cizkx',
    password: 'pRKtFIkcXSbGbJww3zSf',
    database: 'ba5rgjivhubweomt5cwb',
    port: 3306,
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false }
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