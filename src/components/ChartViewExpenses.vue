<template>
  <div class="custom-chart">
    <h2>Gráfico de Despesas dos Últimos 2 Meses</h2>
    <div class="chart">
      <div
        v-for="(expense, index) in expensesData"
        :key="index"
        class="bar"
        :style="{ height: `${expense.height}px` }"
      >
        <span class="bar-label">R$ {{ expense.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</span>
        <span class="bar-month">{{ expense.month }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Dados para o gráfico de despesas
const expensesData = ref([]);

// Altura máxima da barra
const maxBarHeight = 220;

// Buscar despesas do backend para os últimos dois meses
const fetchExpensesData = async () => {
  try {
    const employeeId = localStorage.getItem('employeeId'); // ID do funcionário logado
    if (!employeeId) {
      console.error('Erro: Funcionário não autenticado.');
      return;
    }

    // Endpoint que retorna despesas mensais
    const response = await axios.get(`http://localhost:5000/employees/${employeeId}/expenses/monthly`);
    const data = response.data.slice(-2); // Filtrar para os dois últimos meses

    // Normalizar os dados para o gráfico
    const maxExpenses = Math.max(...data.map((item) => item.totalExpenses));
    expensesData.value = data.map((item) => ({
      ...item,
      height: (item.totalExpenses / maxExpenses) * maxBarHeight, // Altura proporcional
    }));
  } catch (error) {
    console.error('Erro ao buscar dados de despesas mensais:', error);
  }
};

// Carregar os dados ao montar o componente
onMounted(() => {
  fetchExpensesData();
});
</script>

<style scoped>
.custom-chart {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 320px; /* Altura total do gráfico */
  border-left: 2px solid #ccc;
  border-bottom: 2px solid #ccc;
  padding: 10px;
}

.bar {
  position: relative;
  width: 60px;
  background-color: #f56c6c; /* Cor para despesas */
  border-radius: 5px;
  text-align: center;
  transition: all 0.3s ease-in-out;
}

.bar:hover {
  background-color: #d94545;
}

.bar-label {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.bar-month {
  position: absolute;
  bottom: -45px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  font-weight: bold;
  color: #555;
}
</style>
