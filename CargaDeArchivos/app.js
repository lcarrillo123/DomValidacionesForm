document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const urlInput = document.getElementById('urlInput');
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusMessage = document.getElementById('statusMessage');
    const dataTable = document.getElementById('dataTable');
    const chartButtons = document.getElementById('chartButtons');
    const chartContainer = document.getElementById('chartContainer');
    const lineChartBtn = document.getElementById('lineChartBtn');
    const pieChartBtn = document.getElementById('pieChartBtn');
    const barChartBtn = document.getElementById('barChartBtn');

    let currentData = [];

    fileInput.addEventListener('change', handleFileSelect);
    loadUrlBtn.addEventListener('click', handleUrlLoad);
    clearBtn.addEventListener('click', clearTable);
    lineChartBtn.addEventListener('click', () => createChart('line'));
    pieChartBtn.addEventListener('click', () => createChart('pie'));
    barChartBtn.addEventListener('click', () => createChart('bar'));

    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function (results) {
                currentData = results.data;
                createTable(currentData);
                showChartButtons();
                showStatus('Data loaded successfully');
            },
            error: function (error) {
                showStatus('Error loading file: ' + error.message, 'error');
            }
        });
    }

    function handleUrlLoad() {
        const url = urlInput.value.trim();
        if (!url) {
            showStatus('Please enter a valid URL', 'error');
            return;
        }

        Papa.parse(url, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            download: true,
            complete: function (results) {
                currentData = results.data;
                createTable(currentData);
                showChartButtons();
                showStatus('Data loaded successfully from URL');
            },
            error: function (error) {
                showStatus('Error loading data from URL: ' + error.message, 'error');
            }
        });
    }

    function createTable(data) {
        const table = dataTable.cloneNode();
        table.innerHTML = '';
        const columns = Object.keys(data[0]);
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        data.forEach((row, index) => {
            const tr = tbody.insertRow();
            columns.forEach(column => {
                const td = document.createElement('td');
                td.textContent = row[column];
                tr.appendChild(td);
            });
        });

        dataTable.parentNode.replaceChild(table, dataTable);
    }

    function clearTable() {
        fileInput.value = '';
        urlInput.value = '';
        currentData = [];
        dataTable.innerHTML = '';
        chartContainer.innerHTML = '';
        chartButtons.style.display = 'none';
        showStatus('Table cleared');
    }

    function showStatus(message, type = 'info') {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message';

        if (type === 'error') {
            statusMessage.classList.add('error');
        } else if (type === 'success') {
            statusMessage.classList.add('success');
        }
    }

    function showChartButtons() {
        chartButtons.style.display = 'block';
    }

    function createChart(type) {
        if (currentData.length === 0) {
            showStatus('No data to display', 'error');
            return;
        }

        const ctx = document.createElement('canvas').getContext('2d');
        chartContainer.appendChild(ctx.canvas);

        const labels = currentData.map(row => row.Product);
        const data = currentData.map(row => row.Sales);

        const myChart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sales Data',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});