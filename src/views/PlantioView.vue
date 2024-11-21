<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const variety = ref('');
const plantingDate = ref('');
const plantings = ref([]);
const successMessage = ref('');
const errorMessage = ref('');
const employeeId = localStorage.getItem('employeeId');
const handlePlantingSubmit = async () => {
  try {
    const response = await axios.post(`http://localhost:5000/employees/${employeeId}/plantios`, {
      variety: variety.value,
      plantingDate: plantingDate.value,
    });
    successMessage.value = response.data;
    fetchPlantings(); 
    variety.value = '';
    plantingDate.value = '';
  } catch (error) {
    errorMessage.value = error.response?.data || 'Erro ao cadastrar o plantio.';
  }
};

const fetchPlantings = async () => {
  try {
    const response = await axios.get(`http://localhost:5000/employees/${employeeId}/plantios`);
    console.log('Dados recebidos:', response.data); // Verifique se os dados estão corretos
    plantings.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar plantios:', error);
    errorMessage.value = 'Erro ao buscar plantios.';
  }
};

onMounted(() => {
  fetchPlantings();
});
</script>

<template>
  <div class="planting-page">
    <div class="form-container">
      <h2>Cadastrar Plantio</h2>
      <form @submit.prevent="handlePlantingSubmit">
        <div class="form-group">
          <label for="variety">Variedade</label>
          <input v-model="variety" id="variety" type="text" placeholder="Digite a variedade do café" required />
        </div>
        <div class="form-group">
          <label for="plantingDate">Data de Plantio</label>
          <input v-model="plantingDate" id="plantingDate" type="date" required />
        </div>
        <button type="submit">Cadastrar Plantio</button>
      </form>
      <p class="success-message">{{ successMessage }}</p>
      <p class="error-message">{{ errorMessage }}</p>
    </div>

    <div class="plantings-list">
      <h2>Plantios Registrados</h2>
      <table>
        <thead>
          <tr>
            <th>Variedade</th>
            <th>Data de Plantio</th>
            <th>Data Estimada de Colheita</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="planting in plantings" :key="planting.id">
            <td>{{ planting.variety }}</td>
            <td>{{ new Date(planting.plantingDate).toLocaleDateString() }}</td>
            <td>{{ new Date(planting.estimatedHarvestDate).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.planting-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  background-color: #fffaf0;
  min-height: 100vh;
}

.form-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #4e342e;
  border-radius: 10px;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #6f4e37;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #4e342e;
}

.plantings-list {
  background-color: #f9f4ef;
  padding: 20px;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
}

th {
  background-color: #6f4e37;
  color: white;
}
</style>
