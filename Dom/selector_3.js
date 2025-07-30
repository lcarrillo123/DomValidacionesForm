// Diccionario de ciudades por país
const ciudadesPorPais = {
  "México": ["CDMX", "Guadalajara", "Monterrey"],
  "España": ["Madrid", "Barcelona", "Sevilla"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario"],
  "Colombia": ["Bogotá", "Medellín", "Cali"]
};

// Obtener todos los checkboxes de país
const checkboxes = document.querySelectorAll('#listaPaises input[type="checkbox"]');
const divCiudades = document.getElementById('ciudades');

// Añadir eventos a cada checkbox
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    // Desmarcar los demás checkboxes
    checkboxes.forEach(cb => {
      if (cb !== checkbox) {
        cb.checked = false;
      }
    });

    // Limpiar el contenedor de ciudades
    divCiudades.innerHTML = "";

    // Si el checkbox fue marcado, mostrar sus ciudades
    if (this.checked) {
      mostrarCiudades(this.value);
    }
  });
});

// Función para mostrar las ciudades del país seleccionado
function mostrarCiudades(pais) {
  const ciudades = ciudadesPorPais[pais];
  if (!ciudades) return;

  const contenedor = document.createElement("div");
  const titulo = document.createElement("h3");
  titulo.textContent = "Ciudades de " + pais;
  contenedor.appendChild(titulo);

  ciudades.forEach(ciudad => {
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.name = "ciudad";
    chk.value = ciudad;
    chk.id = pais + "-" + ciudad;

    const lbl = document.createElement("label");
    lbl.setAttribute("for", chk.id);
    lbl.textContent = " " + ciudad;

    contenedor.appendChild(chk);
    contenedor.appendChild(lbl);
    contenedor.appendChild(document.createElement("br"));
  });

  divCiudades.appendChild(contenedor);
}
