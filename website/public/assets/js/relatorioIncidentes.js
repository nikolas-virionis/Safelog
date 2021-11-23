const data = {
    labels: [
        'Críticas',
        'Risco',
        'Normal'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [46, 100, 200],
        backgroundColor: [
            '#ff0000',
            '#ff8000',
            '#0071ce'
        ],
        hoverOffset: 4
    }]
};

const config = {
    type: 'doughnut',
    data: data,
};

const myChart = new Chart(
    document.getElementById('chartDoughnut'),
    config
);