<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const userName = ref('');
const storedCpf = localStorage.getItem('loggedCpf');
const fetchUserName = async () => {
  if (storedCpf) {
    try {
      const response = await axios.get(`http://localhost:5000/employees/${storedCpf}`);
      userName.value = response.data.name; // Nome retornado do backend
    } catch (error) {
      console.error('Erro ao buscar nome do usuário:', error.response?.data || error.message);
    }
  }
};
onMounted(() => {
  fetchUserName();
});
// Pega o employeeId do localStorage
const employeeId = ref(localStorage.getItem('employeeId')); // ID do funcionário logado
const sales = ref([]); // Lista de vendas
const newSale = ref({
  date: '',
  number: '',
  client: '',
  status: '',
  total: '',
  invoice: '',
});

// Controle do formulário
const showNewSaleForm = ref(false);

// Função para buscar vendas do funcionário logado
const fetchSales = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId.value}/sales`);
    sales.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    alert('Erro ao buscar vendas.');
  }
};

// Função para adicionar nova venda
const addSale = async () => {
  try {
    const response = await axios.post(`http://localhost:5000/employees/${employeeId.value}/sales`, {
      ...newSale.value,
    });

    alert(response.data); // Mostra mensagem de sucesso
    fetchSales(); // Atualiza a lista de vendas
    Object.keys(newSale.value).forEach((key) => (newSale.value[key] = '')); // Limpa o formulário
    showNewSaleForm.value = false; // Fecha o formulário
  } catch (error) {
    console.error('Erro ao adicionar venda:', error);
    alert('Erro ao adicionar venda.');
  }
};

// Carregar vendas ao montar o componente
onMounted(() => {
  if (!employeeId.value) {
    alert('Erro: Funcionário não autenticado.');
    return;
  }
  fetchSales();
});
</script>



<template>
  <div class="sales-page">
    <header class="header">
      <h1>Vendas do {{ userName }}</h1>
      <button @click="showNewSaleForm = true" class="btn">Adicionar Venda</button>
    </header>

    <!-- Formulário para adicionar nova venda -->
    <div v-if="showNewSaleForm" class="form-container">
      <h2>Nova Venda</h2>
      <form @submit.prevent="addSale">
        <div class="form-control">
          <label for="date">Data</label>
          <input v-model="newSale.date" id="date" type="date" required />
        </div>
        <div class="form-control">
          <label for="number">Número</label>
          <input v-model="newSale.number" id="number" type="text" placeholder="Número da venda" required />
        </div>
        <div class="form-control">
          <label for="client">Cliente</label>
          <input v-model="newSale.client" id="client" type="text" placeholder="Nome do cliente" required />
        </div>
        <div class="form-control">
          <label for="status">Status</label>
          <select v-model="newSale.status" id="status" required>
            <option value="Faturado">Faturado</option>
            <option value="Aprovado">Aprovado</option>
          </select>
        </div>
        <div class="form-control">
          <label for="total">Valor Total</label>
          <input v-model="newSale.total" id="total" type="number" step="0.01" required />
        </div>
        <div class="form-control">
          <label for="invoice">Nota Fiscal</label>
          <input v-model="newSale.invoice" id="invoice" type="text" placeholder="Número da nota fiscal" required />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn">Salvar</button>
          <button type="button" class="btn cancel" @click="showNewSaleForm = false">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Lista de Vendas -->
    <div class="sales-list">
      <h2>Vendas Registradas</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Valor Total</th>
            <th>Nota Fiscal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td>{{ sale.date.substring(0, 10).split('-').reverse().join('/') }}</td>
            <td>{{ sale.number }}</td>
            <td>{{ sale.client }}</td>
            <td>{{ sale.status }}</td>
            <td>R$ {{ parseFloat(sale.total).toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') }}</td>
            <td>{{ sale.invoice }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<style scoped>
/* Layout Geral */
.sales-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  font-family: Arial, sans-serif;
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
  font-size: 24px;
  color: #6f4e37; /* Marrom escuro */
}

.header button {
  padding: 10px 20px;
  background-color: #8b5e3c; /* Marrom café */
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.header button:hover {
  background-color: #6f4e37; /* Tom mais escuro */
}

/* Formulário para Adicionar Venda */
.form-container {
  position: absolute;
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border: 1px solid #8b5e3c; /* Bordas marromRGBO */
  width: 400px;
  left: 79%;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form-container h2 {
  margin-bottom: 20px;
  color: #6f4e37; /* Marrom escuro */
}

.form-control {
  margin-bottom: 15px;
}

.form-control label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #6f4e37; /* Marrom escuro */
}

.form-control input,
.form-control select {
  width: 100%;
  padding: 8px;
  border: 1px solid #8b5e3c; /* Bordas marrom café */
  border-radius: 5px;
  background-color: #f9f4ef; /* Fundo bege claro */
  color: #6f4e37; /* Texto marrom escuro */
}

.form-control input:focus,
.form-control select:focus {
  outline: none;
  border-color: #6f4e37; /* Marrom escuro no foco */
}

.form-buttons {
  display: flex;
  gap: 10px;
}

.form-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  cursor: pointer;
}

.form-buttons .btn {
  background-color: #8b5e3c; /* Marrom café */
}

.form-buttons .btn:hover {
  background-color: #6f4e37; /* Marrom escuro */
}

.form-buttons .btn.cancel {
  background-color: #e74c3c; /* Vermelho cancelamento */
}

.form-buttons .btn.cancel:hover {
  background-color: #c0392b; /* Vermelho escuro */
}

/* Lista de Vendas */
.sales-list {
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sales-list h2 {
  margin-bottom: 20px;
  color: #6f4e37; /* Marrom escuro */
}

.sales-list table {
  width: 100%;
  border-collapse: collapse;
}

.sales-list th,
.sales-list td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #d3cbb8; /* Bege suave */
}

.sales-list th {
  background-color: #6f4e37; /* Fundo marrom escuro */
  color: white; /* Texto branco */
  font-size: 14px;
}

.sales-list tr:hover {
  background-color: #f3ebe4; /* Fundo bege claro no hover */
}

.sales-list td {
  color: #6f4e37; /* Marrom escuro */
}
</style>



