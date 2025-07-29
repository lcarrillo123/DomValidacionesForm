async function cargarCSV(){

    try{

        const respuesta = await fetch("usuarios.csv");
        const texto = await respuesta.text();
        

        const lineas = texto.trim().split("\n");
        console.log(lineas); // Muestra las líneas del CSV

    }catch (error){
      console.error("Error al cargar el CSV:", error);  
    }
    
}
