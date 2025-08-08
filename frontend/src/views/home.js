export function renderHomePage(container) {
  container.innerHTML = `
    <section>
      <h1>Biblioteca - Home</h1>
      <p>Bienvenido. Puedes cargar un archivo Excel para registrar usuarios, libros, estados y préstamos.</p>
      <p>
        <a href="#/upload">Ir a Cargar Archivo</a>
      </p>
    </section>
  `
}