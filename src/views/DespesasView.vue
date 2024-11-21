<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from '@/components/Card.vue';
import ChartViewExpenses from '@/components/ChartViewExpenses.vue';

// Nome do usuário logado
const userName = ref('');
const storedCpf = localStorage.getItem('loggedCpf');
const fetchUserName = async () => {
  if (storedCpf) {
    try {
      const response = await axios.get(`http://localhost:5000/employees/${storedCpf}`);
      userName.value = response.data.name;
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error.response?.data || error.message);
    }
  }
};
onMounted(() => {
  fetchUserName();
});

// Despesas
const employeeId = ref(localStorage.getItem('employeeId'));
const expenses = ref([]);
const newExpense = ref({
  date: '',
  category: '',
  description: '',
  amount: '',
});
const showNewExpenseForm = ref(false);

const fetchExpenses = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId.value}/expenses`);
    expenses.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar despesas:', error);
    alert('Erro ao buscar despesas.');
  }
};

const addExpense = async () => {
  try {
    const response = await axios.post(`http://localhost:5000/employees/${employeeId.value}/expenses`, {
      ...newExpense.value,
    });
    alert(response.data);
    fetchExpenses();
    Object.keys(newExpense.value).forEach((key) => (newExpense.value[key] = ''));
    showNewExpenseForm.value = false;
  } catch (error) {
    console.error('Erro ao adicionar despesa:', error);
    alert('Erro ao adicionar despesa.');
  }
};

// Total de despesas
const totalExpenses = ref(0);
const fetchDashboardData = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId.value}/expenses/total`);
    totalExpenses.value = response.data.total;
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    alert('Erro ao carregar dados do dashboard.');
  }
};

onMounted(() => {
  fetchDashboardData();
  fetchExpenses();
});
</script>

<template>
  <div class="expenses-page">
    <header class="header">
      <h1>Despesas do {{ userName }}</h1>
      <button @click="showNewExpenseForm = true" class="btn">Adicionar Despesa</button>
    </header>

    <!-- Formulário para adicionar nova despesa -->
    <div v-if="showNewExpenseForm" class="form-container">
      <h2>Nova Despesa</h2>
      <form @submit.prevent="addExpense">
        <div class="form-control">
          <label for="date">Data</label>
          <input v-model="newExpense.date" id="date" type="date" required />
        </div>
        <div class="form-control">
          <label for="category">Categoria</label>
          <input v-model="newExpense.category" id="category" type="text" placeholder="Categoria da despesa" required />
        </div>
        <div class="form-control">
          <label for="description">Descrição</label>
          <textarea v-model="newExpense.description" id="description" placeholder="Descrição da despesa" required></textarea>
        </div>
        <div class="form-control">
          <label for="amount">Valor</label>
          <input v-model="newExpense.amount" id="amount" type="number" step="0.01" required />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn">Salvar</button>
          <button type="button" class="btn cancel" @click="showNewExpenseForm = false">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Lista de despesas -->
    <div class="expenses-list">
      <h2>Despesas Registradas</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expense in expenses" :key="expense.id">
            <td>{{ expense.date.substring(0, 10).split('-').reverse().join('/') }}</td>
            <td>{{ expense.category }}</td>
            <td>{{ expense.description }}</td>
            <td>R$ {{ parseFloat(expense.amount).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card e Gráfico -->
    <div class="card">
      <Card
        title="Despesas (Usuário)"
        img="/src/assets/IconsMenu/Despesas.png"
        :totalSales="`R$ ${totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 }).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`"
        description="Total de despesas realizadas pelo funcionário logado"
      />
      <ChartViewExpenses/>
    </div>
  </div>
</template>

<style scoped>
.expenses-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f3ebe4;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 24px;
  color: #6f4e37;
}

.header button {
  padding: 10px 20px;
  background-color: #8b5e3c;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.header button:hover {
  background-color: #6f4e37;
}

.form-container {
  position: absolute;
  background-color: #fffaf0;
  border: 1px solid #8b5e3c;
  width: 400px;
  z-index: 11;
  left: 79%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  padding: 20px;
}

.form-container h2 {
  margin-bottom: 20px;
  color: #6f4e37;
}

.form-control {
  margin-bottom: 15px;
}

.form-control label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #6f4e37;
}

.form-control input,
.form-control textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #8b5e3c;
  border-radius: 5px;
  background-color: #f9f4ef;
  color: #6f4e37;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.form-buttons .btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  background-color: #8b5e3c;
  cursor: pointer;
}

.form-buttons .btn.cancel {
  background-color: #e74c3c;
}

.expenses-list {
  background-color: #fffaf0;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expenses-list h2 {
  margin-bottom: 20px;
  color: #6f4e37;
}

.expenses-list table {
  width: 100%;
  border-collapse: collapse;
}

.expenses-list th,
.expenses-list td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #d3cbb8;
}

.expenses-list th {
  background-color: #6f4e37;
  color: white;
  font-size: 14px;
}

.expenses-list tr:hover {
  background-color: #f3ebe4;
}

.card {
  justify-content: space-around;
  margin-top: 20px;
  width: 100%;
  display: flex;
  gap: 50px;
}
</style>
