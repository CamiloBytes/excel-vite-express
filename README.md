
# excel-vite-express

## System Description

excel-vite-express is a library management system that allows you to upload data from Excel/CSV files, view and manage users, books, loans, and states. The backend is built with Express and MySQL, and the frontend uses Vite and vanilla JavaScript.

## Folder Structure

```
excel-vite-express/
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── package.json
│   └── routes/
│       ├── usuarios.js
│       ├── libros.js
│       ├── estados.js
│       └── prestamos.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── main.js
│   │   ├── style.css
│   │   └── js/
│   │       ├── alert.js
│   │       ├── auth.js
│   │       ├── endpoint.js
│   │       ├── leerexcel.js
│   │       ├── router.js
│   │       └── views.js
```

## Technologies Used

- Node.js
- Express.js
- MySQL (Clever Cloud)
- Vite
- JavaScript (ES6)
- SweetAlert2
- Axios
- XLSX (SheetJS)

## How to Run the Project

1. Clone the repository and enter the main folder.
2. Install backend dependencies:
   ```sh
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```sh
   cd ../frontend
   npm install
   ```
4. Configure your database connection in `backend/db.js` with your Clever Cloud credentials.

### Start Backend

From the `backend` folder:
```sh
npm run server
```
Backend runs at [http://localhost:3000](http://localhost:3000)

### Start Frontend

From the `frontend` folder:
```sh
npm run dev
```
Frontend runs at [http://localhost:5173](http://localhost:5173) by default.

## Database Normalization

The database is normalized to third normal form (3NF):
- Each table has a primary key.
- Foreign keys are used to relate users, books, states, and loans.
- Redundant data is minimized and integrity is enforced with constraints and checks.

## Bulk Upload from CSV

To upload data in bulk:
1. Go to the main screen in the frontend.
2. Use the upload option to select your Excel or CSV file.
3. The system parses and sends the data to the backend, which inserts it into the database.

## Advanced Queries

The backend supports advanced queries such as:
- Listing all active loans with user and book details.
- Filtering books by author or publication year.
- Aggregating statistics (e.g., total loans per user).
- Searching users by identification or email.

## Relational Model Screenshot

See `docs/Copia de Copia de Diagrama sin título.drawio.svg` for the full relational model.

## Developer Information

- Name: camilo
- Clan: cienaga
- Email: camiloandres02222@gmail.com
