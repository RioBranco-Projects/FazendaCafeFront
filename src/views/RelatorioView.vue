<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

const reportData = ref(null);

const fetchReportData = async () => {
  try {
    const response = await axios.get('http://localhost:5000/report');
    reportData.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar relatório:', error);
    alert('Erro ao carregar dados do relatório.');
  }
};

const exportToExcel = () => {
  if (!reportData.value) return;

  const worksheet = XLSX.utils.json_to_sheet([
    { Categoria: 'Vendas Totais', Valor: `R$ ${reportData.value.totalSales}` },
    { Categoria: 'Despesas Totais', Valor: `R$ ${reportData.value.totalExpenses}` },
    { Categoria: 'Lucro Final', Valor: `R$ ${reportData.value.profit}` },
    { Categoria: 'Plantios Registrados', Valor: reportData.value.totalPlantios },
    { Categoria: 'Funcionários Cadastrados', Valor: reportData.value.totalEmployees },
    { Categoria: 'Lucro por Funcionário', Valor: `R$ ${reportData.value.profitPerEmployee}` },
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Consolidado');
  XLSX.writeFile(workbook, 'relatorio_consolidado.xlsx');
};

onMounted(() => {
  fetchReportData();
});
</script>

<template>
  <section class="report-page">
    <header>
      <h1>Relatório Consolidado</h1>
      <button class="export-btn" @click="exportToExcel">Exportar para Excel</button>
    </header>

    <div v-if="reportData" class="report-container">
      <div class="summary">
        <h2>Resumo</h2>
        <p><strong>Vendas Totais:</strong> R$ {{ reportData.totalSales }}</p>
        <p><strong>Despesas Totais:</strong> R$ {{ reportData.totalExpenses }}</p>
        <p><strong>Lucro Final:</strong> R$ {{ reportData.profit }}</p>
        <p><strong>Plantios Registrados:</strong> {{ reportData.totalPlantios }}</p>
        <p><strong>Funcionários Cadastrados:</strong> {{ reportData.totalEmployees }}</p>
        <p><strong>Lucro por Funcionário:</strong> R$ {{ reportData.profitPerEmployee }}</p>
      </div>

      <div class="history">
        <h2>Histórico de Vendas</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in reportData.salesHistory" :key="sale.id">
              <td>{{ sale.date.substring(0, 10).split('-').reverse().join('/') }}</td>
              <td>{{ sale.client }}</td>
              <td>R$ {{ sale.total }}</td>
            </tr>
          </tbody>
        </table>

        <h2>Histórico de Despesas</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Categoria</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in reportData.expensesHistory" :key="expense.id">
              <td>{{ expense.date.substring(0, 10).split('-').reverse().join('/') }}</td>
              <td>{{ expense.category }}</td>
              <td>R$ {{ expense.total }}</td>
            </tr>
          </tbody>
        </table>

        <h2>Histórico de Plantios</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Previsão de Colheita</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="plantio in reportData.plantiosHistory" :key="plantio.id">
              <td>{{ plantio.date}}</td>
              <td>{{ plantio.type }}</td>
              <td>{{ plantio.harvest_estimate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f4ef;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.export-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.export-btn:hover {
  background-color: #45a049;
}
.report-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.summary {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.history {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
table {
  margin: 20px 0;
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>
