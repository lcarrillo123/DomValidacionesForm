const ciudadesPorPais= {
 'México': ['CDMX','Guadalajara','Monterrey'],
 'España': ['Madrid','Barcelona','Valencia'],
 'Argentina': ['Buenos Aires','Córdoba','Rosario'],
 'Colombia': ['Bogotá','Medellín','Cali']
}



const paises= document.querySelectorAll('input[type="checkbox"]')
const ciudadesContenedor= document.getElementById("Ciudades")


paises.forEach(checkbox => {
    checkbox.addEventListener("change", ()=>{
    ciudadesContenedor.innerHTML=''
    paises.forEach(checkbox=>{
     if(checkbox.checked){
        const pais= checkbox.value;
        const ciudades=ciudadesPorPais[pais]
        const titulo= document.createElement("h3")
        titulo.textContent=pais;
        const lista= document.createElement("ul")
        ciudades.forEach(ciudad =>{
          const item=document.createElement("li")
          item.textContent= ciudad
          lista.appendChild(item)
        })
        ciudadesContenedor.appendChild(titulo)
        ciudadesContenedor.appendChild(lista)
    }



     })
    })

})
