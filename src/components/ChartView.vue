<template>
  <div class="custom-chart">
    <h2>Gráfico de Vendas dos Últimos 2 Meses</h2>
    <div class="chart">
      <div
        v-for="(sale, index) in salesData"
        :key="index"
        class="bar"
        :style="{ height: `${sale.height}px` }"
      >
        <span class="bar-label">{{ sale.totalSales }}</span>
        <span class="bar-month">{{ sale.month }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Dados para o gráfico
const salesData = ref([]); // Dados do gráfico
const maxBarHeight = 200; // Altura máxima da barra em pixels

// Buscar dados do backend
const fetchSalesData = async () => {
  const employeeId = localStorage.getItem('employeeId');
  if (!employeeId) {
    console.error('Erro: Funcionário não autenticado.');
    return;
  }

  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId}/sales/monthly`);
    const data = response.data;

    // Encontrar o maior valor de vendas para normalização
    const maxSales = Math.max(...data.map((item) => item.totalSales));

    // Mapear os dados normalizados
    salesData.value = data.map((item) => ({
      month: `${item.month.split('-')[1]}/${item.month.split('-')[0]}`, // Formato MM/YYYY
      totalSales: item.totalSales,
      height: (item.totalSales / maxSales) * maxBarHeight, // Altura proporcional
    }));
  } catch (error) {
    console.error('Erro ao buscar dados de vendas mensais:', error);
  }
};

// Carregar os dados quando o componente for montado
onMounted(() => {
  fetchSalesData();
});
</script>

<style scoped>
.custom-chart {
  width: 100%;
  max-width: 1000px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px; /* Altura total do gráfico */
  border-left: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  padding: 10px;
}

.bar {
  position: relative;
  width: 60px;
  background-color: #5eaf60;
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.bar:hover {
  background-color: #3c763d;
}

.bar-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.bar-month {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: bold;
  color: #555;
}
</style>
