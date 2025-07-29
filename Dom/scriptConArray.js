// script.js

// Lista de campos con su ID y la expresión regular para validarlos
// Se define un array de objetos que contiene la configuración de validación para cada campo del formulario
const camposConfig = [
  // Campo nombre: acepta solo letras (con acentos), espacios y ñ, mínimo 2 caracteres
  { id: "nombre", regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/ },   // Letras y espacios, mínimo 2
  // Campo apellido: misma validación que nombre
  { id: "apellido", regex: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,}$/ }, // Letras y espacios, mínimo 2
  // Campo correo: valida formato básico de email (algo@algo.algo)
  { id: "correo", regex: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ },     // Correo electrónico válido
  // Campo teléfono: acepta exactamente 7 dígitos numéricos
  { id: "telefono", regex: /^\d{7}$/ },                     // 7 dígitos
  // Campo celular: acepta exactamente 10 dígitos numéricos
  { id: "celular", regex: /^\d{10}$/ }                      // 10 dígitos
];

// Obtener todos los elementos del formulario
// Obtiene la referencia al formulario principal por su ID
const formulario = document.getElementById('formulario');
// Selecciona todos los elementos input dentro del formulario
const campos = formulario.querySelectorAll('input');
// Obtiene la referencia al botón de envío por su ID
const botonEnviar = document.getElementById('enviar');
// Obtiene la referencia a la barra de progreso visual por su ID
const barraProgreso = document.getElementById('barraProgreso');
// Obtiene la referencia al elemento que muestra el porcentaje de progreso
const porcentajeTexto = document.getElementById('porcentajeTexto');
// Obtiene la referencia al modal (ventana emergente) de error
const modal = document.getElementById('modalError');
// Obtiene la referencia al elemento donde se muestra el mensaje de error
const mensajeError = document.getElementById('mensajeError');
// Obtiene la referencia al botón para cerrar el modal
const cerrarModal = document.getElementById('cerrarModal');

// Estado de validación de cada campo, inicialmente todos en false
// Objeto que mantiene el estado de validación de cada campo del formulario
let validaciones = {
  // Campo nombre inicialmente no validado
  nombre: false,
  // Campo apellido inicialmente no validado
  apellido: false,
  // Campo correo inicialmente no validado
  correo: false,
  // Campo teléfono inicialmente no validado
  telefono: false,
  // Campo celular inicialmente no validado
  celular: false
};

// Deshabilitar todos los campos al inicio excepto el primero
// Bucle que recorre todos los campos del formulario
for (let i = 0; i < campos.length; i++) {
  // Deshabilita todos los campos excepto el primero (índice 0)
  campos[i].disabled = i !== 0; // Solo habilitar el primer campo
}

// Desactivar el botón de envío al inicio
// El botón permanece deshabilitado hasta que todos los campos sean válidos
botonEnviar.disabled = true;

// Validar cada campo al perder el foco (blur)
// Bucle que agrega event listeners a cada campo
for (let i = 0; i < campos.length; i++) {
  // Obtiene la referencia al campo actual en la iteración
  let campo = campos[i];

  // Agregar event listener para el evento 'blur' (cuando el campo pierde el foco)
  campo.addEventListener('blur', function(e) {
    // Elimina espacios en blanco al inicio y final del valor del campo
    e.target.value = e.target.value.trim(); // Limpiar espacios del valor
    // Verifica si el campo está vacío después de limpiar espacios
    if (e.target.value === '') {
      // Muestra mensaje de error si el campo está vacío
      mostrarError(`El campo ${e.target.id} no puede estar vacío.`);
      // Remueve la clase CSS de campo válido si existe
      campo.classList.remove('valido');
      // Agrega la clase CSS de campo inválido para styling visual
      campo.classList.add('invalido');
      // Marca el campo como no validado en el objeto de validaciones
      validaciones[campo.id] = false;
    } else {
      // Si el campo tiene valor, procede a validarlo con la regex correspondiente
      validarCampo(e); // Validar el campo si tiene valor
    }
  });

  // Validar con la tecla TAB si el campo es válido antes de permitir avanzar
  // Agregar event listener para el evento 'keydown' (cuando se presiona una tecla)
  campo.addEventListener('keydown', function(e) {
    // Verifica si la tecla presionada es TAB y no se está presionando Shift
    if (e.key === 'Tab' && !e.shiftKey) {
      // Limpia espacios en blanco del valor del campo
      campo.value = campo.value.trim(); // Limpiar espacios
      // Guarda el valor limpio en una variable
      const valor = campo.value;
      // Verifica si el campo está vacío
      if (valor === '') {
        // Previene el comportamiento por defecto del TAB (cambiar de campo)
        e.preventDefault();
        // Muestra mensaje de error
        mostrarError(`El campo ${campo.id} no puede estar vacío.`);
        // Agrega clase CSS de campo inválido
        campo.classList.add('invalido');
        // Sale de la función sin continuar
        return;
      }

      // Busca la configuración del campo actual en el array camposConfig
      const campoConfig = camposConfig.find(obj => obj.id === campo.id);
      // Verifica si existe configuración y si el valor cumple con la regex
      if (campoConfig && campoConfig.regex.test(valor)) {
        // Calcula el índice del siguiente campo
        const siguiente = i + 1;
        // Verifica si existe un campo siguiente
        if (siguiente < campos.length) {
          // Habilita el siguiente campo
          campos[siguiente].disabled = false; // Habilitar siguiente campo
          // Usa setTimeout para asegurar que el campo se enfoque correctamente
          setTimeout(() => campos[siguiente].focus(), 10);
        }
      } else {
        // Si la validación falla, previene el cambio de campo
        e.preventDefault();
        // Muestra mensaje de error específico
        mostrarError(`El campo ${campo.id} es inválido. Verifique el formato.`);
        // Agrega clase CSS de campo inválido
        campo.classList.add('invalido');
      }
    }
  });
}

// Mostrar ventana emergente de error
// Función que se encarga de mostrar mensajes de error en un modal
function mostrarError(mensaje) {
  // Establece el texto del mensaje dentro del elemento del modal
  mensajeError.textContent = mensaje; // Mostrar mensaje dentro del modal
  // Hace visible el modal cambiando su estilo CSS
  modal.style.display = 'block'; // Mostrar el modal
}

// Cerrar el modal al hacer clic en la "X"
// Agrega event listener al botón de cerrar modal
cerrarModal.addEventListener('click', function() {
  // Oculta el modal cambiando su estilo CSS
  modal.style.display = 'none';
});

// Cerrar el modal al presionar Enter
// Agrega event listener a todo el documento para detectar la tecla Enter
document.addEventListener('keydown', function(e) {
  // Verifica si la tecla presionada es Enter
  if (e.key === 'Enter') {
    // Oculta el modal
    modal.style.display = 'none';
  }
});

// Verificar si todos los campos han sido validados correctamente
// Función que verifica si todos los campos del formulario son válidos
function formularioValido() {
  // Itera sobre cada propiedad del objeto validaciones
  for (let key in validaciones) {
    // Si encuentra algún campo que no esté validado, retorna false
    if (!validaciones[key]) return false;
  }
  // Si todos los campos están validados, retorna true
  return true;
}

// Función que valida un campo individual al perder foco
// Función principal de validación que se ejecuta cuando un campo pierde el foco
function validarCampo(e) {
  // Obtiene el ID del campo que disparó el evento
  const id = e.target.id;
  // Obtiene y limpia el valor del campo
  const valor = e.target.value.trim();
  // Actualiza el valor del input con el valor limpio
  e.target.value = valor; // Actualizar valor limpio en el input

  // Verifica si el campo está vacío
  if (valor === '') {
    // Remueve clase de campo válido si existe
    e.target.classList.remove('valido');
    // Agrega clase de campo inválido
    e.target.classList.add('invalido');
    // Marca el campo como no validado
    validaciones[id] = false;
    // Muestra mensaje de error
    mostrarError(`El campo ${id} no puede estar vacío o con solo espacios.`);
    // Sale de la función
    return;
  }

  // Buscar la configuración del campo actual
  // Inicializa variable para almacenar la configuración del campo
  let campoConfig = null;
  // Bucle que busca la configuración correspondiente al campo actual
  for (let j = 0; j < camposConfig.length; j++) {
    // Compara el ID del campo con los IDs en la configuración
    if (camposConfig[j].id === id) {
      // Guarda la configuración encontrada
      campoConfig = camposConfig[j];
      // Sale del bucle cuando encuentra la configuración
      break;
    }
  }

  // Verifica si existe configuración y si el valor cumple con la regex
  if (campoConfig && campoConfig.regex.test(valor)) {
    // Remueve clase de campo inválido si existe
    e.target.classList.remove('invalido');
    // Agrega clase de campo válido para styling visual
    e.target.classList.add('valido');
    // Marca el campo como validado correctamente
    validaciones[id] = true;

    // Habilitar siguiente campo
    // Inicializa variable para encontrar el índice del siguiente campo
    let siguiente = -1;
    // Bucle que busca el índice del campo actual
    for (let i = 0; i < campos.length; i++) {
      // Compara si el campo actual es igual al que disparó el evento
      if (campos[i] === e.target) {
        // Calcula el índice del siguiente campo
        siguiente = i + 1;
        // Sale del bucle cuando encuentra el campo
        break;
      }
    }
    // Verifica si existe un campo siguiente y lo habilita
    if (siguiente < campos.length) campos[siguiente].disabled = false;

  } else {
    // Si la validación falla, remueve clase de campo válido
    e.target.classList.remove('valido');
    // Agrega clase de campo inválido
    e.target.classList.add('invalido');
    // Marca el campo como no validado
    validaciones[id] = false;
    // Muestra mensaje de error específico
    mostrarError(`El campo ${id} es inválido. Verifique el formato.`);
  }

  // Activar botón si todo es válido
  // Habilita o deshabilita el botón de envío según el estado de validación del formulario
  botonEnviar.disabled = !formularioValido();
}

// Acción del botón Enviar
// Agrega event listener al botón de envío
botonEnviar.addEventListener('click', function() {
  // Verifica si todos los campos del formulario son válidos
  if (formularioValido()) {
    // Inicializa la variable de progreso en 0
    let progreso = 0;
    // Establece el ancho inicial de la barra de progreso en 0%
    barraProgreso.style.width = '0%';
    // Establece el texto inicial del porcentaje en 0%
    porcentajeTexto.textContent = '0%';

    // Simulación de progreso
    // Crea un intervalo que se ejecuta cada 100 milisegundos
    const intervalo = setInterval(function() {
      // Incrementa el progreso en 10% en cada ejecución
      progreso += 10;
      // Actualiza el ancho visual de la barra de progreso
      barraProgreso.style.width = progreso + '%';
      // Actualiza el texto que muestra el porcentaje
      porcentajeTexto.textContent = progreso + '%';

      // Verifica si el progreso ha llegado al 100%
      if (progreso >= 100) {
        // Detiene el intervalo cuando llega al 100%
        clearInterval(intervalo);
        // Espera 500ms antes de ejecutar las acciones finales
        setTimeout(function() {
          // Muestra mensaje de confirmación al usuario
          alert('Formulario enviado correctamente.');
          // Resetea todos los campos del formulario a sus valores iniciales
          formulario.reset();

          // Reiniciar estados
          // Bucle que restaura el estado inicial de todos los campos
          for (let i = 0; i < campos.length; i++) {
            // Remueve las clases CSS de validación (válido e inválido)
            campos[i].classList.remove('valido', 'invalido');
            // Deshabilita todos los campos excepto el primero
            campos[i].disabled = i !== 0;
          }

          // Deshabilita nuevamente el botón de envío
          botonEnviar.disabled = true;
          // Resetea el ancho de la barra de progreso a 0%
          barraProgreso.style.width = '0%';
          // Resetea el texto del porcentaje a 0%
          porcentajeTexto.textContent = '0%';

          // Resetear validaciones
          // Bucle que resetea el estado de validación de todos los campos
          for (let key in validaciones) {
            // Marca cada campo como no validado
            validaciones[key] = false;
          }
        }, 500); // Espera 500 milisegundos antes de ejecutar
      }
    }, 100); // El intervalo se ejecuta cada 100 milisegundos

  } else {
    // Si el formulario no es válido, muestra mensaje de error
    mostrarError('Por favor complete todos los campos correctamente.');
  }
});