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
      label: 'Despesas dos ultimos 3 meses',
      backgroundColor: '#e74e3c',
      data: [401, 201, 121, 391, 110]
    }
  ]
}

const chartOptions = {
    responsive: true,
}

</script>
