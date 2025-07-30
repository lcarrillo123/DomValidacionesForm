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
  
  listaCiudades.innerHTML='<option value="">---Selecciona una ciudad---</option>'
  ciudadesPorPais[pais].forEach(ciudad => {

    const option = document.createElement("option");
    option.value = ciudad;
    option.textContent= ciudad;
    listaCiudades.appendChild(option)
  })
    
  });
