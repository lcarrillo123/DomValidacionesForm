// Creamos un objeto donde las claves son países y los valores son listas (arrays) de ciudades
const ciudadesPorPais = {
  "México": ["CDMX", "Guadalajara", "Monterrey"],
  "España": ["Madrid", "Barcelona", "Sevilla"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario"],
  "Colombia": ["Bogotá", "Medellín", "Cali"]
};

// Seleccionamos todos los checkboxes dentro del contenedor de ID "listaPaises"
// Esto nos da una lista de todos los checkboxes de país
const checkboxes = document.querySelectorAll('#listaPaises input[type="checkbox"]');

// Obtenemos el contenedor donde vamos a mostrar las ciudades
const divCiudades = document.getElementById('ciudades');

// Recorremos cada checkbox de país
checkboxes.forEach(checkbox => {
  // Le añadimos un "listener" (escuchador de eventos) que detecta cuando el checkbox cambia (se marca o se desmarca)
  checkbox.addEventListener('change', function () {
    // Obtenemos el valor del checkbox actual, es decir, el nombre del país (Ej: "México")
    const pais = this.value;

    // Si el checkbox fue marcado (checked), mostramos las ciudades de ese país
    if (this.checked) {
      mostrarCiudades(pais);
    } else {
      // Si el checkbox fue desmarcado, eliminamos sus ciudades del HTML
      quitarCiudades(pais);
    }
  });
});

// ------------------------------
// Función para mostrar las ciudades de un país
function mostrarCiudades(pais) {
  // Buscamos la lista de ciudades correspondiente al país
  const ciudades = ciudadesPorPais[pais];

  // Si no hay ciudades (por seguridad), salimos de la función
  if (!ciudades) return;

  // Creamos un nuevo div para contener las ciudades de este país
  const contenedor = document.createElement("div");

  // Le damos un ID único al contenedor (ejemplo: "ciudades-México")
  contenedor.id = "ciudades-" + pais;

  // Creamos un título (h3) que dice "Ciudades de [país]"
  const titulo = document.createElement("h3");
  titulo.textContent = "Ciudades de " + pais;

  // Agregamos el título al contenedor
  contenedor.appendChild(titulo);

  // Recorremos la lista de ciudades del país
  ciudades.forEach(ciudad => {
    // Creamos un checkbox para la ciudad
    const chk = document.createElement("input");
    chk.type = "checkbox";             // Tipo checkbox
    chk.name = "ciudad";               // Nombre (opcional si vas a enviar datos)
    chk.value = ciudad;                // Valor (nombre de la ciudad)
    chk.id = pais + "-" + ciudad;      // ID único para ese checkbox

    // Creamos una etiqueta <label> para mostrar el nombre de la ciudad
    const lbl = document.createElement("label");
    lbl.setAttribute("for", chk.id);   // Asociamos el label con el checkbox por ID
    lbl.textContent = " " + ciudad;    // Texto visible de la etiqueta

    // Agregamos el checkbox y su etiqueta al contenedor
    contenedor.appendChild(chk);
    contenedor.appendChild(lbl);

    // Agregamos un salto de línea para separar visualmente las ciudades
    contenedor.appendChild(document.createElement("br"));
  });

  // Finalmente, agregamos el contenedor completo de ciudades al div principal
  divCiudades.appendChild(contenedor);
}

// ------------------------------
// Función para quitar las ciudades cuando se desmarca un país
function quitarCiudades(pais) {
  // Buscamos el contenedor que tiene las ciudades de ese país
  const contenedor = document.getElementById("ciudades-" + pais);

  // Si existe el contenedor, lo eliminamos del HTML
  if (contenedor) {
    contenedor.remove();
  }
}
