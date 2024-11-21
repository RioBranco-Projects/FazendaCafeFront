<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from '../components/Card.vue';

// ID do funcionário logado (exemplo)
const employeeId = ref(localStorage.getItem('employeeId'));

// Variáveis para os totais individuais do funcionário
const totalSales = ref(0);
const totalExpenses = ref(0);
const profit = ref(0);

// Variáveis para os totais gerais
const totalSalesGeneral = ref(0);
const totalExpensesGeneral = ref(0);
const profitGeneral = ref(0);

// Variável para total de funcionários
const totalUsers = ref(0);

// Função para buscar os dados do dashboard
const fetchDashboardData = async () => {
  try {
    // Total de vendas do funcionário
    const salesResponse = await axios.get(`http://localhost:5000/employees/${employeeId.value}/sales/total`);
    totalSales.value = salesResponse.data.total;

    // Total de despesas do funcionário
    const expensesResponse = await axios.get(`http://localhost:5000/employees/${employeeId.value}/expenses/total`);
    totalExpenses.value = expensesResponse.data.total;

    // Calcula o lucro do funcionário
    profit.value = totalSales.value - totalExpenses.value;

    // Total geral de vendas
    const salesGeneralResponse = await axios.get('http://localhost:5000/sales/total');
    totalSalesGeneral.value = salesGeneralResponse.data.total;

    // Total geral de despesas
    const expensesGeneralResponse = await axios.get('http://localhost:5000/expenses/total');
    totalExpensesGeneral.value = expensesGeneralResponse.data.total;

    // Calcula o lucro geral
    profitGeneral.value = totalSalesGeneral.value - totalExpensesGeneral.value;

    // Total de funcionários cadastrados
    const usersResponse = await axios.get('http://localhost:5000/employees');
    totalUsers.value = usersResponse.data.length;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    alert('Erro ao carregar dados do dashboard.');
  }
};

// Carregar os dados ao montar o componente
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
            title="Funcionários"
            img="/src/assets/IconsMenu/funcionario.png"
            :totalSales="`${totalUsers} Colaboradores`"
            description="Número total de funcionários cadastrados"
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
  color: #6f4e37; /* Marrom escuro */
  margin-bottom: 20px;
}
.card {
  border-radius: 10px;
  padding: 20px;
}
</style>
