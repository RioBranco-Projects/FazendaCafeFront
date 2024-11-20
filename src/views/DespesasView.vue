<script setup>
import { ref, computed } from 'vue';

// Dados do formulário de despesas
const newExpense = ref({
  date: '',
  category: '',
  description: '',
  amount: '',
  paymentMethod: '',
});

const expenses = ref([]);

// Controle de exibição do formulário de nova despesa
const showNewExpenseForm = ref(false);

// Adicionar nova despesa
const addExpense = () => {
  if (
    newExpense.value.date &&
    newExpense.value.category &&
    newExpense.value.description &&
    newExpense.value.amount &&
    newExpense.value.paymentMethod
  ) {
    // Adiciona a nova despesa à lista
    expenses.value.push({ ...newExpense.value });
    // Limpa os campos do formulário
    Object.keys(newExpense.value).forEach((key) => {
      newExpense.value[key] = '';
    });
    alert('Despesa adicionada com sucesso!');
    showNewExpenseForm.value = false; // Fecha o formulário após adicionar a despesa
  } else {
    alert('Por favor, preencha todos os campos antes de adicionar uma despesa.');
  }
};

// Estatísticas gerais
const totalDespesas = computed(() =>
  expenses.value.reduce((sum, expense) => sum + parseFloat(expense.amount), 0)
);
</script>

<template>
  <div class="dashboard-container">
    <!-- Cabeçalho -->
    <header class="header">
      <h1>Despesas</h1>
      <div class="header-buttons">
        <button class="btn" @click="showNewExpenseForm = true">Nova Despesa</button>
      </div>
    </header>

    <!-- Formulário para Adicionar Despesa -->
    <div v-if="showNewExpenseForm" class="add-expense-form">
      <h2>Nova Despesa</h2>
      <form @submit.prevent="addExpense">
        <div class="form-control">
          <label for="date">Data</label>
          <input v-model="newExpense.date" id="date" type="date" />
        </div>
        <div class="form-control">
          <label for="category">Categoria</label>
          <select v-model="newExpense.category" id="category">
            <option value="" disabled>Selecione</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Combustível">Combustível</option>
            <option value="Maquinário">Maquinário</option>
            <option value="Agrotóxicos">Agrotóxicos</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div class="form-control">
          <label for="description">Descrição</label>
          <input v-model="newExpense.description" id="description" type="text" placeholder="Descrição da despesa" />
        </div>
        <div class="form-control">
          <label for="amount">Valor (R$)</label>
          <input v-model="newExpense.amount" id="amount" type="number" step="0.01" placeholder="Valor da despesa" />
        </div>
        <div class="form-control">
          <label for="paymentMethod">Forma de Pagamento</label>
          <select v-model="newExpense.paymentMethod" id="paymentMethod">
            <option value="" disabled>Selecione</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Cartão">Cartão</option>
            <option value="Transferência">Transferência</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn">Adicionar</button>
          <button type="button" class="btn cancel" @click="showNewExpenseForm = false">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Resumo Estatístico -->
    <div class="summary">
      <div class="stat-card red">
        <h3>Total de Despesas</h3>
        <p>R$ {{ totalDespesas.toFixed(2) }}</p>
      </div>
    </div>

    <!-- Tabela de Despesas -->
    <div class="expenses-table">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Categoria</th>
            <th>Descrição</th>
            <th>Valor (R$)</th>
            <th>Forma de Pagamento</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(expense, index) in expenses" :key="index">
            <td>{{ expense.date }}</td>
            <td>{{ expense.category }}</td>
            <td>{{ expense.description }}</td>
            <td>{{ parseFloat(expense.amount).toFixed(2) }}</td>
            <td>{{ expense.paymentMethod }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Layout Geral */
.dashboard-container {
  height: 100vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 20px;
  font-family: 'Georgia', serif;
  background-color: #f3ebe4; /* Fundo bege claro */
}

/* Cabeçalho */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 28px;
  color: #6f4e37; /* Marrom escuro */
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  background-color: #8b5e3c; /* Marrom café */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.btn:hover {
  background-color: #6f4e37;
}

.btn.cancel {
  background-color: #e74c3c;
}

.btn.cancel:hover {
  background-color: #c0392b;
}

/* Formulário de Adicionar Despesa */
.add-expense-form {
    position: absolute;
    left: 82%;
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.add-expense-form h2 {
  margin-bottom: 20px;
  color: #6f4e37;
}

.form-control {
  margin-bottom: 15px;
}

.form-control label {
  margin-bottom: 5px;
  color: #6f4e37;
}

input,
select {
  padding: 10px;
  border: 1px solid #8b5e3c;
  border-radius: 5px;
  background-color: #f9f4ef;
  color: #6f4e37;
}

input:focus,
select:focus {
  outline: none;
  border-color: #6f4e37;
}

/* Botões do Formulário */
.form-buttons {
  display: flex;
  gap: 10px;
}

/* Resumo Estatístico */
.summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background-color: #f9f4ef; /* Fundo bege claro */
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 18px;
  color: #6f4e37;
}

.stat-card p {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

/* Tabela de Despesas */
.expenses-table {
  background-color: #fffaf0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.expenses-table table {
  width: 100%;
  border-collapse: collapse;
}

.expenses-table th,
.expenses-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #d3cbb8;
}

.expenses-table th {
  background-color: #6f4e37;
  color: white;
  font-size: 14px;
}

.expenses-table tr:hover {
  background-color: #f3ebe4;
}
</style>
