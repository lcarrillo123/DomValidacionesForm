// script.js

//  Obtenemos el formulario completo a partir de su ID
// Busca en el DOM el elemento con ID 'formulario' y lo almacena en una constante
const formulario = document.getElementById('formulario');

//  Obtenemos todos los campos tipo <input> dentro del formulario
// Selecciona todos los elementos input que estén dentro del formulario y los guarda en una NodeList
const campos = formulario.querySelectorAll('input');

// Obtenemos el botón que usaremos para enviar el formulario
// Busca en el DOM el elemento con ID 'enviar' (el botón de envío) y lo almacena
const botonEnviar = document.getElementById('enviar');

//  Obtenemos el contenedor visual de la barra de progreso
// Busca el elemento con ID 'barraProgreso' que representa la barra visual de progreso
const barraProgreso = document.getElementById('barraProgreso');

//  Obtenemos el texto que muestra el porcentaje sobre la barra
// Busca el elemento con ID 'porcentajeTexto' donde se mostrará el % de progreso
const porcentajeTexto = document.getElementById('porcentajeTexto');

//  Obtenemos el modal (ventana emergente) de error
// Busca el elemento con ID 'modalError' que es la ventana emergente para mostrar errores
const modal = document.getElementById('modalError');

//  Obtenemos el lugar donde irá el texto del error en el modal
// Busca el elemento con ID 'mensajeError' donde se insertará el texto del mensaje de error
const mensajeError = document.getElementById('mensajeError');

//  Obtenemos el botón o elemento que cierra el modal
// Busca el elemento con ID 'cerrarModal' que permite cerrar la ventana emergente de error
const cerrarModal = document.getElementById('cerrarModal');

//  Iniciamos la declaración del objeto que contiene las expresiones regulares
//  Creamos las expresiones regulares que definen si el valor ingresado en cada campo es válido
const expresiones = {
  //  Regex para nombre: acepta letras (incluye acentos), espacios y ñ, mínimo 2 caracteres
  nombre: /^[A-Za-zÁéíóúñÑ\s]{2,}$/, // Solo letras y espacios, mínimo 2 caracteres
  //  Regex para apellido: misma validación que nombre
  apellido: /^[A-Za-zÁéíóúñÑ\s]{2,}$/, // Igual al nombre
  //  Regex para correo: formato básico de email (algo@algo.algo)
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Formato de correo válido
  //  Regex para teléfono: exactamente 7 dígitos numéricos
  telefono: /^\d{7}$/, // Solo 7 dígitos (teléfono fijo)
  //  Regex para celular: exactamente 10 dígitos numéricos
  celular: /^\d{10}$/ // Solo 10 dígitos (celular)
};

//  Iniciamos la declaración del objeto que controla el estado de validación
//  Objeto para guardar si cada campo ha sido validado correctamente (true/false)
let validaciones = {
  //  Estado inicial del campo nombre (no validado)
  nombre: false,
  //  Estado inicial del campo apellido (no validado)
  apellido: false,
  //  Estado inicial del campo correo (no validado)
  correo: false,
  //  Estado inicial del campo teléfono (no validado)
  telefono: false,
  //  Estado inicial del campo celular (no validado)
  celular: false
};

//  Iniciamos un bucle for para configurar el estado inicial de los campos
//  Desactivamos todos los campos excepto el primero (nombre)
for (let i = 0; i < campos.length; i++) {
  //  Deshabilita todos los campos excepto el de índice 0 (el primero)
  campos[i].disabled = i !== 0; // Solo el primero queda activo
}

//  También desactivamos el botón de enviar al inicio
// El botón permanece deshabilitado hasta que todos los campos sean válidos
botonEnviar.disabled = true;

//  Iniciamos un ciclo para agregar eventos a cada campo
// Bucle que itera sobre todos los campos para agregarles event listeners
for (let i = 0; i < campos.length; i++) {
  //  Obtenemos el campo actual del ciclo y lo guardamos en una variable
  let campo = campos[i]; // Obtenemos el campo actual del ciclo

  //  Evento que ocurre cuando el usuario sale del campo (evento blur)
  // Agregamos un event listener que se activa cuando el campo pierde el foco
  campo.addEventListener('blur', (e) => {
    //  Quitamos espacios al inicio y final del valor ingresado
    e.target.value = e.target.value.trim(); // Quitamos espacios al inicio y final

    //  Verificamos si el campo quedó vacío luego de quitar espacios:
    if (e.target.value === '') {
      //  Llamamos a la función que muestra el modal de error con mensaje específico
      mostrarError(`El campo ${e.target.id} no puede estar vacío.`);
      //  Removemos la clase CSS 'valido' si existía
      campo.classList.remove('valido'); // Quitamos clase de éxito
      //  Agregamos la clase CSS 'invalido' para styling visual de error
      campo.classList.add('invalido');  // Marcamos como inválido
      //  Actualizamos el estado de validación del campo a false
      validaciones[campo.id] = false;   // Indicamos que este campo no está válido
    } else {
      //  Si el campo no está vacío, procedemos a validar su formato
      validarCampo(e); // Si no está vacío, llamamos a la función que valida el formato
    }
  });

  //  Evento que ocurre cuando presionamos una tecla dentro del campo
  // Agregamos event listener para detectar cuando se presiona una tecla
  campo.addEventListener('keydown', (e) => {
    //  Si la tecla presionada es TAB (y no Shift+Tab para retroceder)
    if (e.key === 'Tab' && !e.shiftKey) {
      //  Limpiamos espacios en blanco del valor del campo
      campo.value = campo.value.trim(); // Quitamos espacios

      //  Guardamos el valor limpio en una variable constante
      const valor = campo.value;

      //  Si el campo está vacío, evitamos avanzar
      if (valor === '') {
        //  Prevenimos el comportamiento por defecto del TAB (cambiar de campo)
        e.preventDefault(); // Evita que se mueva al siguiente campo
        //  Mostramos mensaje de error específico
        mostrarError(`El campo ${campo.id} no puede estar vacío.`);
        //  Agregamos clase CSS de campo inválido
        campo.classList.add('invalido');
        //  Salimos de la función sin continuar
        return;
      }

      // Si el valor ingresado es válido según la expresión regular
      // Verificamos si el valor del campo cumple con su respectiva regex
      if (expresiones[campo.id].test(valor)) {
        // Calculamos el índice del siguiente campo
        const siguiente = i + 1; // Calculamos el índice del siguiente campo

        // Verificamos si existe un campo siguiente en el formulario
        if (siguiente < campos.length) {
          // Habilitamos el siguiente campo para que pueda ser editado
          campos[siguiente].disabled = false; // Habilitamos el siguiente campo
          // Enfocamos automáticamente el siguiente campo con un pequeño delay
          setTimeout(() => campos[siguiente].focus(), 10); // Lo enfocamos automáticamente
        }
      } else {
        // Si el formato es inválido, evitamos continuar al siguiente campo
        e.preventDefault(); // Si es inválido, evitamos seguir
        // Mostramos mensaje de error específico sobre formato inválido
        mostrarError(`El campo ${campo.id} es inválido. Verifique el formato.`);
        // Agregamos clase CSS de campo inválido
        campo.classList.add('invalido');
      }
    }
  });
}

// Función que muestra el modal con el mensaje de error
// Definimos una función que se encarga de mostrar errores en el modal
function mostrarError(mensaje) {
  // Insertamos el mensaje de error en el elemento correspondiente del modal
  mensajeError.textContent = mensaje; // Insertamos el mensaje en el modal
  // Hacemos visible el modal cambiando su propiedad CSS display
  modal.style.display = 'block';      // Hacemos visible el modal
}

// Línea 83: Evento que cierra el modal al hacer clic en la "X"
// Agregamos event listener al botón de cerrar modal
cerrarModal.addEventListener('click', () => {
  // Ocultamos el modal cambiando su propiedad CSS display
  modal.style.display = 'none'; // Ocultamos el modal
});

// Evento que cierra el modal si el usuario presiona la tecla Enter
// Agregamos event listener al documento completo para detectar la tecla Enter
document.addEventListener('keydown', (e) => {
  // Verificamos si la tecla presionada es Enter
  if (e.key === 'Enter') {
    // Ocultamos el modal si se presiona Enter
    modal.style.display = 'none'; // Ocultamos el modal
  }
});

// Función que revisa si todos los campos están validados correctamente
// Definimos función que verifica el estado general de validación del formulario
function formularioValido() {
  // Obtenemos todos los valores del objeto validaciones y verificamos que todos sean true
  return Object.values(validaciones).every(function(v) { return v; });
  // Comentario explicativo de la línea anterior
  // Revisa que todos los valores del objeto "validaciones" sean true
}

// Función que valida cada campo individualmente
// Definimos la función principal de validación que se ejecuta campo por campo
function validarCampo(e) {
  // Obtenemos el ID del campo que disparó el evento
  const id = e.target.id;              // ID del campo (por ejemplo "correo")
  // Obtenemos el valor del campo y removemos espacios en blanco
  const valor = e.target.value.trim(); // Valor ingresado sin espacios
  // Actualizamos el valor del input con el valor limpio
  e.target.value = valor;              // Actualizamos el valor del input limpio

  // Si el valor está vacío después de limpiar espacios:
  if (valor === '') {
    // Removemos la clase CSS 'valido' si existía
    e.target.classList.remove('valido');
    // Agregamos la clase CSS 'invalido' para styling visual
    e.target.classList.add('invalido');
    // Marcamos el campo como no validado en el objeto de estado
    validaciones[id] = false;
    // Mostramos mensaje de error específico
    mostrarError(`El campo ${id} no puede estar vacío o con solo espacios.`);
    // Salimos de la función sin continuar
    return;
  }

  // Si el formato del valor es válido según su expresión regular:
  if (expresiones[id].test(valor)) {
    // Removemos la clase CSS 'invalido' si existía
    e.target.classList.remove('invalido');
    // Agregamos la clase CSS 'valido' para styling visual de éxito
    e.target.classList.add('valido');
    // Marcamos el campo como validado correctamente
    validaciones[id] = true;

    // Comentario explicativo sobre habilitar el siguiente campo
    // Habilitamos el siguiente campo
    // Inicializamos variable para encontrar el índice del siguiente campo
    let siguiente = -1;
    // Iniciamos bucle para buscar el índice del campo actual
    for (let i = 0; i < campos.length; i++) {
      // Comparamos si el campo actual es igual al que disparó el evento
      if (campos[i] === e.target) {
        // Calculamos el índice del siguiente campo
        siguiente = i + 1;
        // Salimos del bucle cuando encontramos el campo
        break;
      }
    }
    // Verificamos si existe un campo siguiente y lo habilitamos
    if (siguiente < campos.length) campos[siguiente].disabled = false;
  } else {
    // Si el formato NO es válido
    // Removemos la clase CSS 'valido' si existía
    e.target.classList.remove('valido');
    // Agregamos la clase CSS 'invalido' para styling visual de error
    e.target.classList.add('invalido');
    // Marcamos el campo como no validado
    validaciones[id] = false;
    // Mostramos mensaje de error específico sobre formato inválido
    mostrarError(`El campo ${id} es inválido. Verifique el formato.`);
  }

  // Activar o desactivar el botón de enviar según validación general
  // Habilitamos o deshabilitamos el botón según el estado general del formulario
  botonEnviar.disabled = !formularioValido();
}

// Acción cuando el usuario hace clic en el botón enviar
// Agregamos event listener al botón de envío del formulario
botonEnviar.addEventListener('click', () => {
  // Verificamos si todos los campos del formulario son válidos
  if (formularioValido()) {
    // Inicializamos la variable de progreso en 0
    let progreso = 0;
    // Establecemos el ancho inicial de la barra de progreso en 0%
    barraProgreso.style.width = '0%';
    // Establecemos el texto inicial del porcentaje en 0%
    porcentajeTexto.textContent = '0%';

    // Comentario explicativo sobre la simulación de progreso
    // Creamos un intervalo que simula el avance de la barra
    // Creamos un intervalo que se ejecuta cada 100ms para simular progreso
    const intervalo = setInterval(() => {
      // Incrementamos el progreso en 10% en cada ejecución
      progreso += 10;
      // Actualizamos el ancho visual de la barra de progreso
      barraProgreso.style.width = progreso + '%';
      // Actualizamos el texto que muestra el porcentaje
      porcentajeTexto.textContent = progreso + '%';

      // Comentario sobre la condición de finalización
      // Si llega al 100% (envío completo)
      // Verificamos si el progreso ha llegado al 100%
      if (progreso >= 100) {
        // Detenemos el intervalo cuando llega al 100%
        clearInterval(intervalo); // Detenemos el intervalo

        // Creamos un timeout para ejecutar acciones finales después de 500ms
        setTimeout(() => {
          // Mostramos mensaje de confirmación al usuario
          alert('Formulario enviado correctamente.');
          // Resetea todos los campos del formulario a sus valores iniciales
          formulario.reset(); // Limpiamos todos los campos

          // Comentario sobre reiniciar estilos y estados
          // Reiniciamos estilos y estados
          // Iniciamos bucle para restaurar estado inicial de todos los campos
          for (let i = 0; i < campos.length; i++) {
            // Removemos las clases CSS de validación (válido e inválido)
            campos[i].classList.remove('valido', 'invalido');
            // Deshabilitamos todos los campos excepto el primero
            campos[i].disabled = i !== 0; // Solo el primero habilitado
          }

          // Deshabilitamos nuevamente el botón de envío
          botonEnviar.disabled = true; // Botón desactivado nuevamente
          // Reseteamos el ancho de la barra de progreso a 0%
          barraProgreso.style.width = '0%';
          // Reseteamos el texto del porcentaje a 0%
          porcentajeTexto.textContent = '0%';

          // Comentario sobre reiniciar validaciones
          // Reiniciamos todas las validaciones
          // Bucle que resetea el estado de validación de todos los campos
          for (let key in validaciones) validaciones[key] = false;
        }, 500); // Esperamos medio segundo antes de limpiar todo
      }
    }, 100); // Cada 100 milisegundos actualiza la barra

  } else {
    // Si algún campo está mal, mostramos mensaje de error
    // Mostramos mensaje de error si el formulario no es completamente válido
    mostrarError('Por favor complete todos los campos correctamente.');
  }
});