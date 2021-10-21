const mostrarGraficos = (idMaq) => {
  var cpuPerc = document.getElementById(idMaq).getContext('2d');
  var colors = ['#0071ce', '#0071ee', '#0fe1fe', '#ccbbcc', '#123445', '#654321', '#666666'];
  var color = Math.floor(Math.random() * colors.length)
  
  const data1 = {
    labels: ['18:00', '18:03', '18:06', '18:09', '18:12', '18:15', '18:18', '18:21', '18:24', '18:27'],
    datasets: [{
      label: idMaq,
      data: [65, 59, 80, 81, 56, 55, 40, 50, 65, 70],
      fill: false,
      backgroundColor: colors[color],
      borderColor: colors[color],
      tension: 0.3
    }
    ]
  };
  
  
  const config1 = {
    type: 'line',
    data: data1,
    options: {
      maintainAspectRatio: false
    }
  };
  
  var myChart1 = new Chart(cpuPerc, config1);
}
