<script setup>
import { ref, computed } from 'vue';

// Dados do formulário de vendas
const newSale = ref({
  date: '',
  number: '',
  client: '',
  status: '',
  total: '',
  invoice: '',
});

const sales = ref([]);

// Controle de exibição do formulário de nova venda
const showNewSaleForm = ref(false);

// Adicionar nova venda
const addSale = () => {
  if (
    newSale.value.date &&
    newSale.value.number &&
    newSale.value.client &&
    newSale.value.status &&
    newSale.value.total &&
    newSale.value.invoice
  ) {
    // Adiciona a nova venda à lista
    sales.value.push({ ...newSale.value });
    // Limpa os campos do formulário
    Object.keys(newSale.value).forEach((key) => {
      newSale.value[key] = '';
    });
    alert('Venda adicionada com sucesso!');
    showNewSaleForm.value = false; // Fecha o formulário após adicionar a venda
  } else {
    alert('Por favor, preencha todos os campos antes de adicionar uma venda.');
  }
};

// Estatísticas gerais
const totalFaturado = computed(() =>
  sales.value.reduce((sum, sale) => (sale.status === 'Faturado' ? sum + parseFloat(sale.total) : sum), 0)
);

const totalAprovado = computed(() =>
  sales.value.reduce((sum, sale) => (sale.status === 'Aprovado' ? sum + parseFloat(sale.total) : sum), 0)
);

const totalVendas = computed(() => sales.value.length);
</script>

<template>
  <div class="dashboard-container">
    <!-- Cabeçalho -->
    <header class="header">
      <h1>Vendas e Orçamentos</h1>
      <div class="header-buttons">
        <button class="btn" @click="showNewSaleForm = true">Nova Venda</button>
      </div>
    </header>

    <!-- Formulário para Adicionar Venda -->
    <div v-if="showNewSaleForm" class="add-sale-form">
      <h2>Nova Venda</h2>
      <form @submit.prevent="addSale">
        <div class="form-control">
          <label for="date">Data</label>
          <input v-model="newSale.date" id="date" type="date" />
        </div>
        <div class="form-control">
          <label for="number">Número</label>
          <input v-model="newSale.number" id="number" type="text" placeholder="Número da venda" />
        </div>
        <div class="form-control">
          <label for="client">Cliente</label>
          <input v-model="newSale.client" id="client" type="text" placeholder="Nome do cliente" />
        </div>
        <div class="form-control">
          <label for="status">Status</label>
          <select v-model="newSale.status" id="status">
            <option value="" disabled>Selecione</option>
            <option value="Faturado">Faturado</option>
            <option value="Aprovado">Aprovado</option>
          </select>
        </div>
        <div class="form-control">
          <label for="total">Valor (R$)</label>
          <input v-model="newSale.total" id="total" type="number" step="0.01" placeholder="Valor total da venda" />
        </div>
        <div class="form-control">
          <label for="invoice">Nota Fiscal</label>
          <input v-model="newSale.invoice" id="invoice" type="text" placeholder="Nota fiscal" />
        </div>
        <div class="form-buttons">
          <button type="submit" class="btn">Adicionar</button>
          <button type="button" class="btn cancel" @click="showNewSaleForm = false">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Resumo Estatístico -->
    <div class="summary">
      <div class="stat-card red">
        <h3>Faturado</h3>
        <p>R$ {{ totalFaturado.toFixed(2) }}</p>
      </div>
      <div class="stat-card yellow">
        <h3>Aprovado</h3>
        <p>R$ {{ totalAprovado.toFixed(2) }}</p>
      </div>
      <div class="stat-card green">
        <h3>Total de Vendas</h3>
        <p>{{ totalVendas }}</p>
      </div>
    </div>

    <!-- Tabela de Vendas -->
    <div class="sales-table">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Número</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Valor (R$)</th>
            <th>Nota Fiscal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in sales" :key="index">
            <td>{{ sale.date }}</td>
            <td>{{ sale.number }}</td>
            <td>{{ sale.client }}</td>
            <td>
              <span :class="'status ' + sale.status.toLowerCase()">{{ sale.status }}</span>
            </td>
            <td>{{ parseFloat(sale.total).toFixed(2) }}</td>
            <td>{{ sale.invoice }}</td>
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
  background-color: #6f4e37; /* Tom mais escuro */
}

.btn.cancel {
  background-color: #e74c3c; /* Vermelho cancelamento */
}

.btn.cancel:hover {
  background-color: #c0392b; /* Vermelho escuro */
}

/* Formulário de Adicionar Venda */
.add-sale-form {
    position: absolute;
    width: 100%;
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.add-sale-form h2 {
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
  color: #6f4e37; /* Marrom escuro */
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 20px;
  font-weight: bold;
  color: #333; /* Preto suave */
}

.red {
  border-top: 5px solid #e74c3c; /* Vermelho para Faturado */
}

.yellow {
  border-top: 5px solid #f1c40f; /* Amarelo para Aprovado */
}

.green {
  border-top: 5px solid #27ae60; /* Verde para Total de Vendas */
}

/* Tabela de Vendas */
.sales-table {
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.sales-table table {
  width: 100%;
  border-collapse: collapse;
}

.sales-table th,
.sales-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #d3cbb8; /* Bege suave */
}

.sales-table th {
  background-color: #6f4e37; /* Fundo marrom escuro */
  color: white; /* Texto branco */
  font-size: 14px;
}

.sales-table tr:hover {
  background-color: #f3ebe4; /* Fundo bege claro no hover */
}

.status {
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 12px;
}

.status.faturado {
  background-color: #2ecc71; /* Verde para Faturado */
}

.status.aprovado {
  background-color: #f1c40f; /* Amarelo para Aprovado */
}
</style>

