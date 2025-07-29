// ARCHIVO JAVASCRIPT - LÓGICA DE LA APLICACIÓN
// Los comentarios en JavaScript van después de // para una línea
// o entre /* */ para múltiples líneas

// ESPERAMOS A QUE LA PÁGINA SE CARGUE COMPLETAMENTE
document.addEventListener('DOMContentLoaded', function() {
    // DOMContentLoaded es un evento que se dispara cuando el HTML está listo
    // addEventListener significa "escuchar por este evento"
    // function() { } es una función anónima que se ejecuta cuando ocurre el evento
    
    // OBTENEMOS REFERENCIAS A LOS ELEMENTOS HTML
    // document.getElementById busca un elemento por su ID
    const fileInput = document.getElementById('fileInput');
    // const significa "constante" - una variable que no cambia
    // fileInput ahora "apunta" al elemento <input type="file" id="fileInput">
    
    const urlInput = document.getElementById('urlInput');
    // urlInput apunta al <input type="text" id="urlInput">
    
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    // loadUrlBtn apunta al <button id="loadUrlBtn">
    
    const clearBtn = document.getElementById('clearBtn');
    // clearBtn apunta al <button id="clearBtn">
    
    const tableContainer = document.getElementById('tableContainer');
    // tableContainer apunta al <div id="tableContainer">
    
    const statusMessage = document.getElementById('statusMessage');
    // statusMessage apunta al <div id="statusMessage">

    // CONFIGURAMOS LOS EVENT LISTENERS (ESCUCHADORES DE EVENTOS)
    // Un event listener "escucha" cuando algo sucede (click, cambio, etc.)
    
    fileInput.addEventListener('change', handleFileSelect);
    // Cuando el usuario selecciona un archivo, ejecuta la función handleFileSelect
    // 'change' es el evento que se dispara cuando cambia la selección de archivo
    
    loadUrlBtn.addEventListener('click', handleUrlLoad);
    // Cuando hacen clic en el botón, ejecuta handleUrlLoad
    // 'click' es el evento de hacer clic
    
    clearBtn.addEventListener('click', clearTable);
    // Cuando hacen clic en "Limpiar", ejecuta clearTable
    
    urlInput.addEventListener('keypress', function(e) {
        // Escucha cuando se presiona una tecla en el input de URL
        // e (event) contiene información sobre qué tecla se presionó
        if (e.key === 'Enter') {
            // Si la tecla presionada es Enter
            handleUrlLoad();
            // Ejecuta la función para cargar desde URL
        }
    });

    // FUNCIÓN PARA MANEJAR LA SELECCIÓN DE ARCHIVOS LOCALES
    function handleFileSelect(event) {
        // function declara una función llamada handleFileSelect
        // event es un parámetro que contiene información sobre lo que pasó
        
        const file = event.target.files[0];
        // event.target es el elemento que disparó el evento (el input file)
        // .files es un array con los archivos seleccionados
        // [0] toma el primer archivo (índice 0)
        
        if (file) {
            // if verifica si existe un archivo (si file no es null/undefined)
            
            if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
                // Verifica si el archivo es CSV
                // file.type es el tipo MIME del archivo
                // file.name.endsWith() verifica si el nombre termina en '.csv'
                // || significa "OR" - si cualquiera de las dos condiciones es verdadera
                
                showStatus('🔄 Cargando archivo...', 'info');
                // Llama a la función showStatus para mostrar un mensaje
                // Primer parámetro: el mensaje
                // Segundo parámetro: el tipo de mensaje
                
                parseCSVFile(file);
                // Llama a la función que procesará el archivo CSV
                
            } else {
                // else se ejecuta si la condición del if es falsa
                showStatus('❌ Por favor selecciona un archivo CSV válido', 'error');
                // Muestra mensaje de error
            }
        } else {
            // Se ejecuta si no hay archivo seleccionado
            showStatus('❌ No se seleccionó ningún archivo', 'error');
        }
    }

    // FUNCIÓN PARA MANEJAR LA CARGA DESDE URL
    function handleUrlLoad() {
        // Función sin parámetros
        
        const url = urlInput.value.trim();
        // urlInput.value obtiene el texto escrito en el input
        // .trim() quita espacios al inicio y final
        
        if (url) {
            // Verifica si hay texto en la URL (no está vacío)
            
            if (isValidUrl(url)) {
                // Llama a la función isValidUrl para verificar si la URL es válida
                
                showStatus('🔄 Cargando archivo desde URL...', 'info');
                parseCSVFromUrl(url);
                // Llama a la función que cargará el CSV desde la URL
                
            } else {
                showStatus('❌ Por favor ingresa una URL válida', 'error');
            }
        } else {
            showStatus('❌ Por favor ingresa una URL', 'error');
        }
    }

    // FUNCIÓN PARA PROCESAR ARCHIVO CSV LOCAL
    function parseCSVFile(file) {
        // Recibe como parámetro el archivo seleccionado
        
        Papa.parse(file, {
            // Papa.parse es una función de la librería Papa Parse
            // Primer parámetro: el archivo a procesar
            // Segundo parámetro: objeto con opciones de configuración
            
            header: true,           // Usa la primera fila como nombres de columnas
            skipEmptyLines: true,   // Ignora líneas completamente vacías
            dynamicTyping: true,    // Convierte automáticamente números y booleanos
            
            complete: function(results) {
                // complete es una función que se ejecuta cuando termina el procesamiento
                // results contiene los datos procesados
                
                handleParseResults(results, file.name);
                // Llama a la función que maneja los resultados
                // file.name es el nombre del archivo
            },
            
            error: function(error) {
                // error es una función que se ejecuta si hay un error
                // error contiene información sobre qué salió mal
                
                showStatus('❌ Error al procesar el archivo: ' + error.message, 'error');
                // + concatena (une) strings
                // error.message es el mensaje de error específico
            }
        });
    }

    // FUNCIÓN PARA PROCESAR CSV DESDE URL
    function parseCSVFromUrl(url) {
        // Similar a parseCSVFile pero para URLs
        
        Papa.parse(url, {
            download: true,         // Le dice a Papa Parse que descargue el archivo de la URL
            header: true,           // Mismas opciones que antes
            skipEmptyLines: true,
            dynamicTyping: true,
            
            complete: function(results) {
                handleParseResults(results, url);
                // Pasa la URL como nombre de fuente
            },
            
            error: function(error) {
                showStatus('❌ Error al cargar desde URL: ' + error.message, 'error');
            }
        });
    }

    // FUNCIÓN PARA MANEJAR LOS RESULTADOS DEL PROCESAMIENTO
    function handleParseResults(results, source) {
        // results: los datos procesados por Papa Parse
        // source: nombre del archivo o URL (para mostrar al usuario)
        
        if (results.errors && results.errors.length > 0) {
            // Verifica si hay errores en el procesamiento
            // && significa "AND" - ambas condiciones deben ser verdaderas
            // results.errors.length > 0 verifica si hay al menos un error
            
            console.warn('Advertencias durante el parsing:', results.errors);
            // console.warn muestra un mensaje de advertencia en la consola del navegador
            // La consola se abre con F12 en la mayoría de navegadores
        }

        if (results.data && results.data.length > 0) {
            // Verifica si hay datos y si hay al menos una fila
            
            const validData = results.data.filter(row => {
                // .filter() crea un nuevo array con elementos que cumplen una condición
                // row representa cada fila de datos
                
                return Object.values(row).some(value => 
                    // Object.values(row) obtiene todos los valores de la fila
                    // .some() verifica si AL MENOS UN elemento cumple la condición
                    
                    value !== null && value !== undefined && value !== ''
                    // !== significa "no es igual a"
                    // Verifica que el valor no sea null, undefined o string vacío
                );
            });

            if (validData.length > 0) {
                // Si hay datos válidos después del filtrado
                
                createTable(validData, source);
                // Crea la tabla HTML con los datos
                
                showStatus(`✅ Archivo cargado exitosamente: ${validData.length} filas encontradas`, 'success');
                // `` (backticks) permiten usar ${} para insertar variables en strings
                // Esto se llama "template literals"
                
            } else {
                showStatus('❌ El archivo no contiene datos válidos', 'error');
            }
        } else {
            showStatus('❌ El archivo está vacío o no se pudo procesar', 'error');
        }
    }

    // FUNCIÓN PARA CREAR LA TABLA HTML
    function createTable(data, source) {
        // data: array de objetos con los datos del CSV
        // source: fuente de los datos (para mostrar información)
        
        const columns = Object.keys(data[0]);
        // Object.keys() obtiene los nombres de las propiedades del primer objeto
        // Esto nos da los nombres de las columnas
        // data[0] es el primer elemento del array
        
        const table = document.createElement('table');
        // createElement crea un nuevo elemento HTML
        // En este caso, crea <table></table>
        
        table.className = 'csv-table';
        // Asigna la clase CSS 'csv-table' para aplicar estilos
        
        // CREAR EL ENCABEZADO DE LA TABLA
        const thead = document.createElement('thead');
        // thead es la sección de encabezados de la tabla
        
        const headerRow = document.createElement('tr');
        // tr es una fila de tabla
        
        columns.forEach(column => {
            // forEach ejecuta una función para cada elemento del array
            // column es cada nombre de columna
            
            const th = document.createElement('th');
            // th es una celda de encabezado
            
            th.textContent = column;
            // textContent pone texto dentro del elemento
            
            headerRow.appendChild(th);
            // appendChild añade el th como hijo del tr
        });
        
        thead.appendChild(headerRow);
        // Añade la fila de encabezados al thead
        
        table.appendChild(thead);
        // Añade el thead a la tabla
        
        // CREAR EL CUERPO DE LA TABLA
        const tbody = document.createElement('tbody');
        // tbody es la sección de datos de la tabla
        
        data.forEach((row, index) => {
            // forEach para cada fila de datos
            // row es el objeto con datos de la fila
            // index es la posición (0, 1, 2, etc.)
            
            const tr = document.createElement('tr');
            // Crea una nueva fila
            
            columns.forEach(column => {
                // Para cada columna en la fila
                
                const td = document.createElement('td');
                // td es una celda de datos
                
                const value = row[column];
                // Obtiene el valor de esa columna en esa fila
                
                if (value === null || value === undefined) {
                    // Si no hay valor
                    
                    td.textContent = '';
                    // Deja la celda vacía
                    
                    td.style.fontStyle = 'italic';
                    // Pone el texto en cursiva
                    
                    td.style.color = '#999';
                    // Cambia el color del texto a gris claro
                    
                } else {
                    // Si hay valor
                    
                    td.textContent = value;
                    // Pone el valor en la celda
                }
                
                tr.appendChild(td);
                // Añade la celda a la fila
            });
            
            tbody.appendChild(tr);
            // Añade la fila completa al cuerpo de la tabla
        });
        
        table.appendChild(tbody);
        // Añade el cuerpo de la tabla a la tabla completa
        
        // LIMPIAR EL CONTENEDOR Y AÑADIR LA NUEVA TABLA
        tableContainer.innerHTML = '';
        // innerHTML = '' borra todo el contenido del contenedor
        
        tableContainer.appendChild(table);
        // Añade la tabla al contenedor
        
        // AÑADIR INFORMACIÓN SOBRE EL ARCHIVO
        const info = document.createElement('p');
        // Crea un párrafo para mostrar información
        
        info.style.marginTop = '20px';
        // Añade margen superior de 20px
        
        info.style.color = '#666';
        // Color gris para el texto
        
        info.style.fontSize = '14px';
        // Tamaño de fuente más pequeño
        
        info.innerHTML = `📄 <strong>Fuente:</strong> ${source} | <strong>Filas:</strong> ${data.length} | <strong>Columnas:</strong> ${columns.length}`;
        // innerHTML permite insertar HTML (como <strong> para negrita)
        // Muestra información sobre el archivo cargado
        
        tableContainer.appendChild(info);
        // Añade el párrafo informativo al contenedor
    }

    // FUNCIÓN PARA LIMPIAR LA TABLA
    function clearTable() {
        // Función para resetear todo a su estado inicial
        
        tableContainer.innerHTML = '';
        // Borra el contenido del contenedor de la tabla
        
        fileInput.value = '';
        // Limpia la selección de archivo
        
        urlInput.value = '';
        // Limpia el texto de la URL
        
        showStatus('👆 Selecciona un archivo CSV o ingresa una URL para comenzar', 'info');
        // Muestra el mensaje inicial
    }

    // FUNCIÓN PARA MOSTRAR MENSAJES AL USUARIO
    function showStatus(message, type = 'info') {
        // message: el texto del mensaje
        // type: tipo de mensaje ('info', 'success', 'error')
        // = 'info' es un valor por defecto (si no se especifica, usa 'info')
        
        statusMessage.textContent = message;
        // Pone el mensaje en el elemento de estado
        
        statusMessage.className = 'status-message';
        // Resetea las clases CSS a la clase base
        
        if (type === 'error') {
            // Si el tipo es error
            
            statusMessage.classList.add('error');
            // classList.add() añade una clase CSS adicional
            // Esto aplicará los estilos de error (texto rojo, fondo rojo claro)
            
        } else if (type === 'success') {
            // Si el tipo es success
            
            statusMessage.classList.add('success');
            // Añade la clase de éxito (texto verde, fondo verde claro)
        }
        // Si type es 'info', no añade clases adicionales (mantiene el estilo base)
    }

    // FUNCIÓN PARA VALIDAR URLs
    function isValidUrl(string) {
        // Verifica si una cadena de texto es una URL válida
        // string: la cadena a verificar
        
        try {
            // try intenta ejecutar código que podría fallar
            
            new URL(string);
            // URL() es una función nativa de JavaScript
            // Si la cadena no es una URL válida, lanzará un error
            
            return true;
            // Si no hay error, retorna true (URL válida)
            
        } catch (_) {
            // catch captura cualquier error que ocurra en try
            // _ es un nombre de variable que indica que no usamos el error
            
            return false;
            // Si hay error, retorna false (URL inválida)
        }
    }

    // FIN DEL EVENT LISTENER DOMContentLoaded
});

// EXPLICACIÓN DE CONCEPTOS IMPORTANTES:

/*
VARIABLES:
- const: variable que no cambia (constante)
- let: variable que puede cambiar
- var: forma antigua de declarar variables (mejor usar let o const)

FUNCIONES:
- function nombreFuncion() { }: declara una función
- () => { }: función flecha (forma más moderna)
- function(parametro) { }: función que recibe parámetros

EVENTOS:
- addEventListener: escucha eventos (click, change, keypress, etc.)
- Los eventos permiten que el código reaccione a acciones del usuario

DOM (Document Object Model):
- document: representa toda la página HTML
- getElementById: busca un elemento por su ID
- createElement: crea nuevos elementos HTML
- appendChild: añade un elemento como hijo de otro
- innerHTML: cambia el contenido HTML de un elemento
- textContent: cambia solo el texto de un elemento

CONDICIONALES:
- if (condición) { }: ejecuta código si la condición es verdadera
- else { }: ejecuta código si la condición es falsa
- === : compara si dos valores son exactamente iguales
- !== : compara si dos valores NO son iguales
- && : operador AND (ambas condiciones deben ser verdaderas)
- || : operador OR (al menos una condición debe ser verdadera)

ARRAYS Y OBJETOS:
- []: array (lista de elementos)
- {}: objeto (colección de propiedades clave-valor)
- .forEach(): ejecuta una función para cada elemento de un array
- .filter(): crea un nuevo array con elementos que cumplen una condición
- .some(): verifica si al menos un elemento cumple una condición

STRINGS:
- '': comillas simples para strings
- "": comillas dobles para strings
- ``: backticks para template literals (permiten ${variable})
- .trim(): quita espacios al inicio y final
- .endsWith(): verifica si termina con cierto texto
*/