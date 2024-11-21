<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from '../components/Card.vue';
const employeeId = ref(localStorage.getItem('employeeId'));
const totalSales = ref(0);
const totalExpenses = ref(0);
const profit = ref(0);
const totalPlantios = ref(0);
const totalSalesGeneral = ref(0);
const totalExpensesGeneral = ref(0);
const profitGeneral = ref(0);
const totalPlantiosGeneral = ref(0);
const totalUsers = ref(0);
const fetchDashboardData = async () => {
  try {
    const salesResponse = await axios.get(`http://localhost:5000/employees/${employeeId.value}/sales/total`);
    totalSales.value = salesResponse.data.total;
    const expensesResponse = await axios.get(`http://localhost:5000/employees/${employeeId.value}/expenses/total`);
    totalExpenses.value = expensesResponse.data.total;
    profit.value = totalSales.value - totalExpenses.value;
    const salesGeneralResponse = await axios.get('http://localhost:5000/sales/total');
    totalSalesGeneral.value = salesGeneralResponse.data.total;
    const expensesGeneralResponse = await axios.get('http://localhost:5000/expenses/total');
    totalExpensesGeneral.value = expensesGeneralResponse.data.total;
    profitGeneral.value = totalSalesGeneral.value - totalExpensesGeneral.value;
    const usersResponse = await axios.get('http://localhost:5000/employees');
    totalUsers.value = usersResponse.data.length;
    const plantiosResponse = await axios.get(`http://localhost:5000/employees/${employeeId.value}/plantios/total`);
    totalPlantios.value = plantiosResponse.data.total;
    const plantiosGeneralResponse = await axios.get('http://localhost:5000/plantios/total');
    totalPlantiosGeneral.value = plantiosGeneralResponse.data.total;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    alert('Erro ao carregar dados do dashboard.');
  }
};
onMounted(() => {
  fetchDashboardData();
});
</script>

<template>
  <section class="dashboard">
    <!-- Cards para os totais individuais -->
    <div class="boxes">
      <div class="card">
        <Card
          title="Vendas (Usuário)"
          img="/src/assets/IconsMenu/Sales.png"
          :totalSales="`R$ ${totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`"
          description="Total de vendas realizadas pelo funcionário logado"
        />
      </div>
      <div class="card">
        <Card
          title="Despesas (Usuário)"
          img="/src/assets/IconsMenu/Dashboard.png"
          :totalSales="`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`"
          description="Total de despesas realizadas pelo funcionário logado"
        />
      </div>
      <div class="card">
        <Card
          title="Lucro (Usuário)"
          img="/src/assets/IconsMenu/lucro.png"
          :totalSales="`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`"
          description="Lucro calculado (vendas - despesas) do funcionário logado"
        />
      </div>
      <div class="card">
        <Card
          title="Plantios (Usuário)"
          img="/src/assets/IconsMenu/Plantio.png"
          :totalSales="`${totalPlantios} Plantios`"
          description="Total de plantios registrados pelo funcionário logado"
        />
      </div>
    </div>

    <!-- Totais gerais -->
    <div class="general-totals">
      <h2>Totais Gerais</h2>
      <div class="general-boxes">
        <div class="card">
          <Card
            title="Vendas (Geral)"
            img="/src/assets/IconsMenu/Sales.png"
            :totalSales="`R$ ${totalSalesGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`"
            description="Total de vendas realizadas no sistema"
          />
        </div>
        <div class="card">
          <Card
            title="Despesas (Geral)"
            img="/src/assets/IconsMenu/Dashboard.png"
            :totalSales="`R$ ${totalExpensesGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`"
            description="Total de despesas registradas no sistema"
          />
        </div>
        <div class="card">
          <Card
            title="Lucro (Geral)"
            img="/src/assets/IconsMenu/lucro.png"
            :totalSales="`R$ ${profitGeneral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`"
            description="Lucro geral calculado (vendas - despesas)"
          />
        </div>
        <div class="card">
          <Card
            title="Plantios (Geral)"
            img="/src/assets/IconsMenu/Plantio.png"
            :totalSales="`${totalPlantiosGeneral} Plantios`"
            description="Total de plantios registrados no sistema"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}
.boxes,
.general-boxes {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.general-totals {
  width: 100%;
  padding: 20px;
  border-radius: 10px;
}

.general-totals h2 {
  text-align: center;
  color: #6f4e37; 
  margin-bottom: 20px;
}
.card {
  border-radius: 10px;
  padding: 20px;
}
</style>
