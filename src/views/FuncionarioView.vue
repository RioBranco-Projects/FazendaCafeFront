<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Dados do formulário
const employeeData = ref({
  name: '',
  position: '',
  salary: '',
  gender: '',
  address: '',
  cpfOrCnpj: '',
  admissionDate: '',
  password: '', // Adiciona senha para cadastro no login
});

const employees = ref([]);

// Aba ativa
const activeTab = ref('cadastro');

// Função para adicionar funcionário e login
const addEmployee = async () => {
  if (
    employeeData.value.name &&
    employeeData.value.position &&
    employeeData.value.salary &&
    employeeData.value.gender &&
    employeeData.value.address &&
    employeeData.value.cpfOrCnpj &&
    employeeData.value.admissionDate &&
    employeeData.value.password // Verifica se a senha foi preenchida
  ) {
    try {
      // Faz POST no backend para salvar o funcionário
      await axios.post('http://localhost:5000/employees', employeeData.value);

      // Atualiza a lista de funcionários
      await fetchEmployees();

      // Limpa os campos do formulário
      Object.keys(employeeData.value).forEach((key) => {
        employeeData.value[key] = '';
      });
      alert('Funcionário e login cadastrados com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      alert('Erro ao cadastrar funcionário.');
    }
  } else {
    alert('Preencha todos os campos!');
  }
};

// Função para buscar todos os funcionários
const fetchEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:5000/employees');
    employees.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    alert('Erro ao buscar funcionários.');
  }
};

// Carrega a lista de funcionários ao montar o componente
onMounted(() => {
  fetchEmployees();
});
</script>

<template>
  <section class="employee-manager">
    <!-- Abas -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'cadastro' }" @click="activeTab = 'cadastro'">Cadastro</button>
      <button :class="{ active: activeTab === 'cadastrados' }" @click="activeTab = 'cadastrados'">Funcionários Cadastrados</button>
    </div>

    <div class="tab-content">
      <transition name="fade">
        <div v-if="activeTab === 'cadastro'" key="cadastro" class="tab-pane">
          <h1>Cadastro de Funcionários</h1>
          <form @submit.prevent="addEmployee">
            <div class="form-control">
              <label for="name">Nome Completo</label>
              <input v-model="employeeData.name" id="name" type="text" placeholder="Digite o nome completo" />
            </div>
            <div class="form-control">
              <label for="position">Cargo</label>
              <input v-model="employeeData.position" id="position" type="text" placeholder="Digite o cargo" />
            </div>
            <div class="form-control">
              <label for="salary">Salário</label>
              <input v-model="employeeData.salary" id="salary" type="number" placeholder="Digite o salário" />
            </div>
            <div class="form-control">
              <label for="gender">Sexo</label>
              <select v-model="employeeData.gender" id="gender">
                <option value="" disabled>Selecione</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div class="form-control">
              <label for="address">Endereço</label>
              <input v-model="employeeData.address" id="address" type="text" placeholder="Digite o endereço" />
            </div>
            <div class="form-control">
              <label for="cpfOrCnpj">CPF ou CNPJ</label>
              <input v-model="employeeData.cpfOrCnpj" id="cpfOrCnpj" type="text" placeholder="Digite o CPF ou CNPJ" />
            </div>
            <div class="form-control">
              <label for="admissionDate">Data de Admissão</label>
              <input v-model="employeeData.admissionDate" id="admissionDate" type="date" />
            </div>
            <div class="form-control">
              <label for="password">Senha</label>
              <input v-model="employeeData.password" id="password" type="password" placeholder="Digite a senha" />
            </div>
            <button type="submit">Cadastrar Funcionário</button>
          </form>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="activeTab === 'cadastrados'" key="cadastrados" class="tab-panee">
          <h1>Funcionários Cadastrados</h1>
          <div v-if="employees.length" class="employee-list">
            <ul>
              <li v-for="(employee, index) in employees" :key="index">
                <strong>{{ employee.name }}</strong> - {{ employee.position }} - R$ {{ employee.salary }} - 
                {{ employee.gender }} - {{ employee.address }} - {{ employee.cpfOrCnpj }} - {{ employee.admissionDate.split('T')[0] }}
              </li>
            </ul>
          </div>
          <p v-else>Nenhum funcionário cadastrado.</p>
        </div>
      </transition>
    </div>
  </section>
</template>

<style scoped>
/* Estilo mantém o mesmo */
.employee-manager {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #f3ebe4;
  padding: 20px;
}

.tab-pane {
  h1 {
    margin-bottom: 20px;
  }
}
.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #8b5e3c;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  color: white;
}

.tabs button:hover {
  background-color: #6f4e37;
}

.tabs button.active {
  background-color: #6f4e37;
  color: white;
}

.tab-content {
  width: 100%;
  max-width: 600px;
  background-color: #fffaf0;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

.form-control {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  input {
    height: 40px;
    padding: 10px;
    border: 1px solid #8b5e3c;
    border-radius: 5px;
  }
}

button {
  padding: 10px;
  border: none;
  background-color: #8b5e3c;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #6f4e37;
}

.employee-list {
  li {
    margin-bottom: 10px;
    background-color: #8b5e3c;
    padding: 10px;
    color: white;
    font-size: 20px;
    border: 1px solid #8b5e3c;
    border-radius: 5px;
    list-style-type: none;
  }
  margin-top: 20px;
  background-color: #ddc492;
  border: 1px solid #8b5e3c;
  border-radius: 5px;
  padding: 10px;
}

</style>
