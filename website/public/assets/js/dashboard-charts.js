var canvasChart1 = document.getElementById(`idChart1`).getContext("2d");

var colors = [
    "#0071ceee",
    "#0071eeee",
    "#0fe1feee",
    "#ccbbccee",
    "#123445ee",
    "#654321ee",
    "#666666ee"
];
var color = Math.floor(Math.random() * colors.length);
const chartData = {
    labels: [
        1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2,
        3, 4, 3, 6, 3, 6, 4, 2, 1
    ],
    datasets: [
        {
            label: "",
            data: [
                1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2,
                1, 1, 2, 3, 4, 3, 6, 3, 6, 4, 2, 1
            ],
            fill: false,
            backgroundColor: colors[color],
            borderColor: colors[color],
            // fill: true,
            tension: 0.3
        },
        {
            label: "componente",
            data: [
                10, 23, 35, 74, 93, 60, 32, 64, 47, 21, 11, 10, 23, 35, 74, 93,
                60, 32, 64, 47, 21, 11, 10, 23, 35, 74, 93, 60, 32, 64, 47, 21,
                11
            ],
            fill: false,
            backgroundColor:
                colors[(color = Math.floor(Math.random() * colors.length))],
            borderColor: colors[color],
            // fill: true,
            tension: 0.3
        },
        {
            label: "componente",
            data: [
                50, 30, 80, 80, 58, 69, 30, 60, 40, 20, 10, 50, 30, 80, 80, 58,
                69, 30, 60, 40, 20, 10, 50, 30, 80, 80, 58, 69, 30, 60, 40, 20,
                10
            ],
            fill: false,
            backgroundColor:
                colors[(color = Math.floor(Math.random() * colors.length))],
            borderColor: colors[color],
            // fill: true,
            // showLine: false,
            tension: 0.3
        }
    ]
};

const chartConfig1 = {
    type: "line",
    data: chartData,
    options: {
        maintainAspectRatio: false
    }
};
const myChart = new Chart(canvasChart1, chartConfig1);
