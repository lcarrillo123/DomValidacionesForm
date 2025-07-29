// script.js

// === Referencias del formulario y elementos visuales ===
//  Comentario que explica la sección de obtención de elementos del DOM
// Accede a los elementos por su ID desde el HTML
//  Busca en el DOM el elemento con ID "enviar" y lo almacena en una constante
const btnEnviar = document.getElementById("enviar");         // Botón para enviar el formulario
//  Busca en el DOM el elemento con ID "modalError" (ventana emergente de errores)
const modal = document.getElementById("modalError");         // Ventana emergente (modal) de error
//  Busca en el DOM el elemento con ID "mensajeError" donde se mostrará el texto del error
const mensajeError = document.getElementById("mensajeError"); // Texto del mensaje de error
//  Busca en el DOM el elemento con ID "cerrarModal" (botón X para cerrar el modal)
const cerrarModal = document.getElementById("cerrarModal");   // Botón para cerrar el modal
//  Busca en el DOM el elemento con ID "barraProgreso" (barra visual de carga)
const barraProgreso = document.getElementById("barraProgreso"); // Barra de carga animada
//  Busca en el DOM el elemento con ID "porcentajeTexto" (texto que muestra el %)
const porcentajeTexto = document.getElementById("porcentajeTexto"); // Texto del porcentaje

// === Al cargar la página, solo se activa el primer campo ===
//  Comentario explicativo de la sección de inicialización
//  Asigna una función al evento onload del objeto window (cuando la página termina de cargar)
window.onload = () => {
  //  Busca el campo con ID "nombre" y lo habilita estableciendo disabled a false
  document.getElementById("nombre").disabled = false; // Habilitar el campo "nombre"
}; //  Cierre de la función arrow asignada a window.onload

// === Muestra una ventana emergente con el mensaje de error ===
//  Comentario explicativo de la función mostrarError
//  Declaración de función que recibe un parámetro 'mensaje' de tipo string
function mostrarError(mensaje) {
  //  Asigna el texto del mensaje al contenido del elemento mensajeError
  mensajeError.textContent = mensaje;   // Coloca el texto de error en el modal
  //  Cambia la propiedad CSS display del modal a "block" para hacerlo visible
  modal.style.display = "block";        // Muestra el modal (se hace visible)
} //  Cierre de la función mostrarError

// === Cierra el modal al hacer clic en la "X" o presionar Enter ===
//  Comentario explicativo de la sección de cierre del modal
//  Asigna una función arrow al evento onclick del botón cerrarModal
cerrarModal.onclick = () => modal.style.display = "none";

//  Agrega un event listener al documento completo para detectar teclas presionadas
document.addEventListener("keydown", function(event) {
  //  Verifica si la tecla presionada es "Enter" Y si el modal está visible
  if (event.key === "Enter" && modal.style.display === "block") {
    //  Si ambas condiciones se cumplen, oculta el modal
    modal.style.display = "none"; // Oculta el modal si está abierto y se presiona Enter
  } //  Cierre del condicional if
}); //  Cierre de la función y del addEventListener

// === Función general para validar un campo del formulario ===
//  Comentario explicativo de la función de validación general
//  Declaración de función que recibe 3 parámetros: ID del campo, regex y ID del siguiente campo
function validarCampo(idCampo, regex, siguienteCampoId) {
  //  Busca en el DOM el elemento input con el ID especificado
  const campo = document.getElementById(idCampo); // Accede al input por su ID

  //  Comentario explicativo del event listener blur
  // Cuando el campo pierde el foco (blur), se valida
  //  Agrega un event listener al campo para el evento "blur" (perder foco)
  campo.addEventListener("blur", function () {
    //  Obtiene el valor del campo y elimina espacios en blanco al inicio y final
    const valor = this.value.trim(); // Quita espacios en blanco del inicio y final

    //  Comentario explicativo de la validación con regex
    // Verifica si el valor coincide con la expresión regular (regex)
    //  Ejecuta el test de la expresión regular sobre el valor obtenido
    if (regex.test(valor)) {
      //  Si la validación es exitosa, remueve la clase CSS "error" si existía
      this.classList.remove("error"); // Quita el estilo de error si lo tenía
      //  Agrega la clase CSS "valido" para aplicar estilos de campo válido
      this.classList.add("valido");   // Aplica estilo de campo válido

      // Línea 45: Verifica si existe un campo siguiente (parámetro no es null/undefined)
      if (siguienteCampoId) {
        //  Comentario explicativo sobre activar el siguiente campo
        // Si hay un siguiente campo, lo activa y da el foco
        //  Busca el siguiente campo por su ID
        const siguiente = document.getElementById(siguienteCampoId);
        //  Habilita el siguiente campo estableciendo disabled a false
        siguiente.disabled = false;
        //  Establece el foco en el siguiente campo
        siguiente.focus();
      } else {
        //  Comentario explicativo cuando es el último campo
        // Si ya es el último campo, activa el botón enviar
        //  Habilita el botón de envío estableciendo disabled a false
        btnEnviar.disabled = false;
      } //  Cierre del else
    } else {
      //  Comentario explicativo cuando la validación falla
      // Si el valor NO es válido:
      //  Remueve la clase CSS "valido" si existía
      this.classList.remove("valido"); // Quita el estilo de campo válido si lo tenía
      //  Agrega la clase CSS "error" para aplicar estilos de error
      this.classList.add("error");     // Aplica estilo de error
      //  Llama a la función mostrarError con un mensaje personalizado
      mostrarError(`El campo ${idCampo} no es válido.`); // Muestra mensaje en modal
      //  Vuelve a establecer el foco en el campo con error
      this.focus(); // Vuelve a enfocar el campo con error
    } //  Cierre del else principal
  }); //  Cierre de la función del addEventListener y del addEventListener mismo
} //  Cierre de la función validarCampo

// === Aplicamos la validación a cada campo del formulario ===
//  Comentario explicativo de la sección de aplicación de validaciones
// Cada campo solo se activa si el anterior es válido
//  Aplica validación al campo "nombre" con regex de letras/espacios, siguiente campo "apellido"
validarCampo("nombre", /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/, "apellido");
//  Aplica validación al campo "apellido" con regex de letras/espacios, siguiente campo "correo"
validarCampo("apellido", /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/, "correo");
//  Aplica validación al campo "correo" con regex de email, siguiente campo "telefono"
validarCampo("correo", /^[^@\s]+@[^@\s]+\.[^@\s]+$/, "telefono");
//  Aplica validación al campo "telefono" con regex de 7 dígitos, siguiente campo "celular"
validarCampo("telefono", /^\d{7}$/, "celular");
//  Aplica validación al campo "celular" con regex de 10 dígitos, sin campo siguiente
validarCampo("celular", /^\d{10}$/); // Último campo, no tiene campo siguiente

// === Evento al hacer clic en el botón enviar ===
//  Comentario explicativo de la sección del evento del botón enviar
//  Agrega un event listener al botón enviar para el evento "click"
btnEnviar.addEventListener("click", function () {
  //  Inicializa la variable progreso en 0 para controlar la barra de carga
  let progreso = 0; // Valor inicial del progreso
  //  Establece el ancho inicial de la barra de progreso en 0%
  barraProgreso.style.width = "0%";           // Inicializa barra vacía
  //  Establece el texto inicial del porcentaje en "0%"
  porcentajeTexto.textContent = "0%";         // Muestra texto 0%
  //  Deshabilita el botón de envío para prevenir múltiples envíos
  btnEnviar.disabled = true;                  // Desactiva botón para evitar doble envío

  //  Comentario explicativo de la animación de la barra
  // Animación de la barra de carga
  //  Crea un intervalo que se ejecuta cada 200ms para animar la barra
  const intervalo = setInterval(() => {
    //  Incrementa la variable progreso en 10 unidades (10%)
    progreso += 10;                           // Aumenta el progreso en 10%
    //  Actualiza el ancho visual de la barra de progreso
    barraProgreso.style.width = progreso + "%";  // Ancho visual de la barra
    //  Actualiza el texto visible del porcentaje
    porcentajeTexto.textContent = progreso + "%"; // Actualiza el texto visible

    //  Verifica si el progreso ha llegado al 100% o más
    if (progreso >= 100) {
      //  Detiene el intervalo cuando se alcanza el 100%
      clearInterval(intervalo);              // Detiene el intervalo al llegar al 100%
      //  Muestra un mensaje de alerta confirmando el envío exitoso
      alert("Formulario enviado exitosamente"); // Mensaje de éxito
      //  Llama a la función que limpia y reinicia el formulario
      limpiarFormulario();                   // Limpia todos los campos después del envío
    } //  Cierre del condicional if
  }, 200); //  Especifica que el intervalo se ejecute cada 200 milisegundos
}); //  Cierre de la función del addEventListener y del addEventListener mismo

// === Función para reiniciar todos los campos del formulario ===
//  Comentario explicativo de la función de limpieza
//  Declaración de la función limpiarFormulario sin parámetros
function limpiarFormulario() {
  //  Crea un array con los IDs de todos los campos del formulario
  const campos = ["nombre", "apellido", "correo", "telefono", "celular"];

  //  Utiliza forEach para iterar sobre cada elemento del array campos
  campos.forEach((id, index) => {
    //  Busca el elemento del DOM correspondiente al ID actual
    const campo = document.getElementById(id);
    //  Limpia el contenido del input estableciendo value como string vacío
    campo.value = "";                          // Borra el contenido del input
    //  Remueve las clases CSS "valido" y "error" del campo
    campo.classList.remove("valido", "error"); // Elimina estilos previos
    //  Deshabilita todos los campos excepto el primero (índice 0)
    campo.disabled = index !== 0;              // Solo deja habilitado el primer campo
  }); //  Cierre de la función arrow del forEach

  //  Restablece el ancho de la barra de progreso a 0%
  barraProgreso.style.width = "0%";            // Reinicia la barra a 0%
  //  Restablece el texto del porcentaje a "0%"
  porcentajeTexto.textContent = "0%";          // Reinicia el texto de porcentaje
  //  Deshabilita nuevamente el botón de envío
  btnEnviar.disabled = true;                   // Desactiva nuevamente el botón enviar
  //  Establece el foco en el primer campo (nombre) para reiniciar el flujo
  document.getElementById("nombre").focus();   // Pone el foco en el primer campo
} //  Cierre de la función limpiarFormulario