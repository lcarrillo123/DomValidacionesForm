// ARCHIVO JAVASCRIPT - LÓGICA DE LA APLICACIÓN
// ESPERAMOS A QUE LA PÁGINA SE CARGUE COMPLETAMENTE
document.addEventListener('DOMContentLoaded', function() {
    
    // OBTENEMOS REFERENCIAS A LOS ELEMENTOS HTML
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    const clearBtn = document.getElementById('clearBtn');
    const tableContainer = document.getElementById('tableContainer');
    const statusMessage = document.getElementById('statusMessage');

    // REFERENCIAS PARA LOS GRÁFICOS
    const chartButtons = document.getElementById('chartButtons');
    const pieChartBtn = document.getElementById('pieChartBtn');
    const lineChartBtn = document.getElementById('lineChartBtn');
    const barChartBtn = document.getElementById('barChartBtn');
    const chartContainer = document.getElementById('chartContainer');

    // VARIABLES GLOBALES PARA ALMACENAR DATOS (MOVIDAS DENTRO DEL SCOPE)
    let currentData = [];
    let currentChart = null;

    // CONFIGURAMOS LOS EVENT LISTENERS
    fileInput.addEventListener('change', handleFileSelect);
    loadUrlBtn.addEventListener('click', handleUrlLoad);
    clearBtn.addEventListener('click', clearTable);
    
    // EVENT LISTENERS PARA LOS GRÁFICOS
    pieChartBtn.addEventListener('click', createPieChart);
    lineChartBtn.addEventListener('click', createLineChart);
    barChartBtn.addEventListener('click', createBarChart);
    
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleUrlLoad();
        }
    });

    // FUNCIONES PARA MANEJAR LOS GRÁFICOS (MOVIDAS DENTRO DEL SCOPE)
    function showChartButtons() {
        chartButtons.style.display = 'block';
    }

    function hideChartButtons() {
        chartButtons.style.display = 'none';
    }

    function showChart() {
        chartContainer.style.display = 'block';
        // Establecer tamaño fijo para el contenedor de gráficos
        chartContainer.style.width = '100%';
        chartContainer.style.height = '500px';
        chartContainer.style.maxWidth = '800px';
        chartContainer.style.margin = '20px auto';
        chartContainer.style.position = 'relative';
        
        // Asegurar que el canvas tenga el tamaño correcto
        const canvas = document.getElementById('myChart');
        if (canvas) {
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.maxHeight = '500px';
        }
    }

    function hideChart() {
        chartContainer.style.display = 'none';
        
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
        
        // Resetear el canvas para evitar problemas de tamaño
        const canvas = document.getElementById('myChart');
        if (canvas) {
            canvas.width = 400;
            canvas.height = 400;
            canvas.style.width = '';
            canvas.style.height = '';
        }
    }

    function prepareChartData() {
        if (currentData.length === 0) {
            showStatus('❌ No hay datos para crear gráficos', 'error');
            return null;
        }

        const columns = Object.keys(currentData[0]);
        let labelColumn = null;
        let valueColumn = null;

        // Buscar columnas apropiadas con mejor lógica
        for (let col of columns) {
            const firstValue = currentData[0][col];
            
            // Para etiquetas: buscar strings o números que podrían ser IDs
            if (!labelColumn && (typeof firstValue === 'string' || 
                (typeof firstValue === 'number' && firstValue < 1000))) {
                labelColumn = col;
            }
            
            // Para valores: buscar números que no sean IDs pequeños
            if (!valueColumn && typeof firstValue === 'number' && firstValue !== 0) {
                valueColumn = col;
            }
            
            if (labelColumn && valueColumn) break;
        }

        // Si no encontramos columnas apropiadas, usar las primeras
        if (!labelColumn) labelColumn = columns[0];
        if (!valueColumn) {
            // Buscar cualquier columna numérica
            for (let col of columns) {
                if (col !== labelColumn && typeof currentData[0][col] === 'number') {
                    valueColumn = col;
                    break;
                }
            }
            if (!valueColumn) valueColumn = columns[1] || columns[0];
        }

        const labels = [];
        const values = [];
        const dataSlice = currentData.slice(0, 15); // Aumentar a 15 elementos

        dataSlice.forEach((row, index) => {
            // Crear etiquetas más descriptivas
            let label = String(row[labelColumn]);
            if (label === 'undefined' || label === 'null' || label === '') {
                label = `Elemento ${index + 1}`;
            }
            labels.push(label);
            
            // Procesar valores
            let value = Number(row[valueColumn]);
            if (isNaN(value)) {
                // Si no es número, intentar convertir o usar 1
                value = 1;
            }
            values.push(value);
        });

        return {
            labels: labels,
            values: values,
            labelColumn: labelColumn,
            valueColumn: valueColumn
        };
    }

    function createPieChart() {
        hideChart();
        
        const chartData = prepareChartData();
        if (!chartData) return;

        showChart();

        const ctx = document.getElementById('myChart').getContext('2d');
        const colors = generateColors(chartData.labels.length);

        currentChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels,
                datasets: [{
                    data: chartData.values,
                    backgroundColor: colors,
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                    title: {
                        display: true,
                        text: `Distribución: ${chartData.valueColumn} por ${chartData.labelColumn}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        position: 'right',
                        labels: {
                            generateLabels: function(chart) {
                                const data = chart.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map((label, i) => {
                                        const value = data.datasets[0].data[i];
                                        const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                        const percentage = ((value / total) * 100).toFixed(1);
                                        return {
                                            text: `${label}: ${value} (${percentage}%)`,
                                            fillStyle: data.datasets[0].backgroundColor[i],
                                            strokeStyle: data.datasets[0].borderColor,
                                            lineWidth: data.datasets[0].borderWidth,
                                            index: i
                                        };
                                    });
                                }
                                return [];
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        showStatus('✅ Gráfico de torta creado exitosamente', 'success');
    }

    function createLineChart() {
        hideChart();
        
        const chartData = prepareChartData();
        if (!chartData) return;

        showChart();

        const ctx = document.getElementById('myChart').getContext('2d');

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: `${chartData.valueColumn}`,
                    data: chartData.values,
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#4CAF50',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                    title: {
                        display: true,
                        text: `Tendencia: ${chartData.valueColumn} vs ${chartData.labelColumn}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: chartData.labelColumn,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: chartData.valueColumn,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return typeof value === 'number' ? value.toLocaleString() : value;
                            }
                        }
                    }
                }
            }
        });

        showStatus('✅ Gráfico de líneas creado exitosamente', 'success');
    }

    function createBarChart() {
        hideChart();
        
        const chartData = prepareChartData();
        if (!chartData) return;

        showChart();

        const ctx = document.getElementById('myChart').getContext('2d');

        currentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: `${chartData.valueColumn}`,
                    data: chartData.values,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
                        '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56',
                        '#4BC0C0', '#9966FF', '#FF9F40'
                    ],
                    borderColor: [
                        '#FF4069', '#1E88E5', '#FFB300', '#26A69A',
                        '#7B1FA2', '#FF8F00', '#FF4069', '#9E9E9E',
                        '#26A69A', '#FF4069', '#1E88E5', '#FFB300',
                        '#26A69A', '#7B1FA2', '#FF8F00'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                    title: {
                        display: true,
                        text: `Comparación: ${chartData.valueColumn} por ${chartData.labelColumn}`,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: chartData.labelColumn,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    },
                    y: {
                        display: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: chartData.valueColumn,
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            callback: function(value) {
                                return typeof value === 'number' ? value.toLocaleString() : value;
                            }
                        }
                    }
                }
            }
        });

        showStatus('✅ Gráfico de barras creado exitosamente', 'success');
    }

    function generateColors(count) {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
        }
        return colors;
    }

    // FUNCIÓN PARA MANEJAR LA SELECCIÓN DE ARCHIVOS LOCALES
    function handleFileSelect(event) {
        console.log('Archivo seleccionado:', event.target.files);
        
        const file = event.target.files[0];
        
        if (file) {
            console.log('Detalles del archivo:', {
                name: file.name,
                size: file.size,
                type: file.type
            });
            
            const isCSV = file.type === 'text/csv' || 
                         file.type === 'application/csv' || 
                         file.name.toLowerCase().endsWith('.csv') ||
                         file.type === 'text/plain';
            
            if (isCSV) {
                showStatus('🔄 Cargando archivo...', 'info');
                console.log('Iniciando procesamiento del archivo...');
                parseCSVFile(file);
            } else {
                console.log('Archivo rechazado - tipo no válido:', file.type);
                showStatus('❌ Por favor selecciona un archivo CSV válido', 'error');
            }
        } else {
            console.log('No se seleccionó ningún archivo');
            showStatus('❌ No se seleccionó ningún archivo', 'error');
        }
    }

    // FUNCIÓN PARA MANEJAR LA CARGA DESDE URL
    function handleUrlLoad() {
        const url = urlInput.value.trim();
        
        if (url) {
            if (isValidUrl(url)) {
                showStatus('🔄 Cargando archivo desde URL...', 'info');
                parseCSVFromUrl(url);
            } else {
                showStatus('❌ Por favor ingresa una URL válida', 'error');
            }
        } else {
            showStatus('❌ Por favor ingresa una URL', 'error');
        }
    }

    // FUNCIÓN PARA PROCESAR ARCHIVO CSV LOCAL
    function parseCSVFile(file) {
        showStatus('🔄 Procesando archivo... Por favor espera', 'info');
        
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            
            complete: function(results) {
                console.log('Archivo procesado:', results);
                handleParseResults(results, file.name);
            },
            
            error: function(error) {
                console.error('Error al procesar:', error);
                showStatus('❌ Error al procesar el archivo: ' + error.message, 'error');
            }
        });
    }

    // FUNCIÓN PARA PROCESAR CSV DESDE URL
    function parseCSVFromUrl(url) {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            
            complete: function(results) {
                handleParseResults(results, url);
            },
            
            error: function(error) {
                showStatus('❌ Error al cargar desde URL: ' + error.message, 'error');
            }
        });
    }

    // FUNCIÓN PARA MANEJAR LOS RESULTADOS DEL PROCESAMIENTO
    function handleParseResults(results, source) {
        console.log('Manejando resultados:', results);
        
        if (results.errors && results.errors.length > 0) {
            console.warn('Advertencias durante el parsing:', results.errors);
            
            const criticalErrors = results.errors.filter(error => error.type === 'Delimiter');
            if (criticalErrors.length > 0) {
                showStatus('❌ Error: El archivo no parece ser un CSV válido', 'error');
                return;
            }
        }

        console.log('Datos recibidos:', results.data);

        if (results.data && results.data.length > 0) {
            console.log('Total de filas antes del filtro:', results.data.length);
            
            const validData = results.data.filter(row => {
                const hasValidData = Object.values(row).some(value => 
                    value !== null && value !== undefined && value !== '' && value !== 'null'
                );
                return hasValidData;
            });

            console.log('Filas válidas después del filtro:', validData.length);

            if (validData.length > 0) {
                currentData = validData;
                console.log('Datos guardados en currentData:', currentData);
                
                createTable(validData, source);
                showChartButtons();
                showStatus(`✅ Archivo cargado exitosamente: ${validData.length} filas encontradas`, 'success');
            } else {
                console.log('No se encontraron datos válidos después del filtro');
                showStatus('❌ El archivo no contiene datos válidos', 'error');
            }
        } else {
            console.log('No hay datos en results.data o está vacío');
            showStatus('❌ El archivo está vacío o no se pudo procesar', 'error');
        }
    }

    // FUNCIÓN PARA CREAR LA TABLA HTML
    function createTable(data, source) {
        const columns = Object.keys(data[0]);
        const table = document.createElement('table');
        table.className = 'csv-table';
        
        // CREAR EL ENCABEZADO DE LA TABLA
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // CREAR EL CUERPO DE LA TABLA
        const tbody = document.createElement('tbody');
        
        data.forEach((row, index) => {
            const tr = document.createElement('tr');
            
            columns.forEach(column => {
                const td = document.createElement('td');
                const value = row[column];
                
                if (value === null || value === undefined) {
                    td.textContent = '';
                    td.style.fontStyle = 'italic';
                    td.style.color = '#999';
                } else {
                    td.textContent = value;
                }
                
                tr.appendChild(td);
            });
            
            tbody.appendChild(tr);
        });
        
        table.appendChild(tbody);
        
        // LIMPIAR EL CONTENEDOR Y AÑADIR LA NUEVA TABLA
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        
        // AÑADIR INFORMACIÓN SOBRE EL ARCHIVO
        const info = document.createElement('p');
        info.style.marginTop = '20px';
        info.style.color = '#666';
        info.style.fontSize = '14px';
        info.innerHTML = `📄 <strong>Fuente:</strong> ${source} | <strong>Filas:</strong> ${data.length} | <strong>Columnas:</strong> ${columns.length}`;
        tableContainer.appendChild(info);
    }

    // FUNCIÓN PARA LIMPIAR LA TABLA
    function clearTable() {
        tableContainer.innerHTML = '';
        fileInput.value = '';
        urlInput.value = '';
        currentData = [];
        hideChartButtons();
        hideChart();
        showStatus('👆 Selecciona un archivo CSV o ingresa una URL para comenzar', 'info');
    }

    // FUNCIÓN PARA MOSTRAR MENSAJES AL USUARIO
    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';
        
        if (type === 'error') {
            statusMessage.classList.add('error');
        } else if (type === 'success') {
            statusMessage.classList.add('success');
        }
    }

    // FUNCIÓN PARA VALIDAR URLs
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

// FIN DEL EVENT LISTENER DOMContentLoaded
});