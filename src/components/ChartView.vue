<template>
  <Bar
  style="width: 700px; height: 300px;"
    class="chart"
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = {
  labels: ['Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
  datasets: [
    {
      label: 'Vendas dos ultimos 3 meses',
      backgroundColor: '#5eaf60',
      data: [421, 910, 592, 639, 180]
    }
  ]
}

const chartOptions = {
    responsive: true,
}

</script>
