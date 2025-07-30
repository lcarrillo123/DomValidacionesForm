const ciudadesPorPais= {
  "México": ['Guadalajara','Monterrey','CDMX'],
  "España": ['Madrid','Barcelona','Valencia'],
  "Argentina": ['Buenos Aires','Córdoba','Rosario'],
  "Colombia": ['Bogotá','Medellín','Cali']
}


const selectPais= document.getElementById("pais-select");
const listaCiudades= document.getElementById("ciudades-lista");



selectPais.addEventListener('change', () => {
  const pais = selectPais.value;
  listaCiudades.innerHTML=''

  ciudadesPorPais[pais].forEach(ciudad => {

    const item = document.createElement("li");
    item.textContent = ciudad
    listaCiudades.appendChild(item);


  })
    
  });
  