<script setup>
import { ref } from 'vue';

// Dados do formulário
const employeeData = ref({
  name: '',
  position: '',
  salary: '',
  gender: '',
  address: '',
  cpfOrCnpj: '',
  admissionDate: '',
});

const employees = ref([]);

// Aba ativa
const activeTab = ref('cadastro');

const addEmployee = () => {
  if (
    employeeData.value.name &&
    employeeData.value.position &&
    employeeData.value.salary &&
    employeeData.value.gender &&
    employeeData.value.address &&
    employeeData.value.cpfOrCnpj &&
    employeeData.value.admissionDate
  ) {
    employees.value.push({ ...employeeData.value });

    // Limpa os campos
    Object.keys(employeeData.value).forEach((key) => {
      employeeData.value[key] = '';
    });
    alert('Funcionário cadastrado com sucesso!');
  } else {
    alert('Preencha todos os campos!');
  }
};
</script>

<template>
  <section class="employee-manager">
    <!-- Abas -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'cadastro' }" @click="activeTab = 'cadastro'">Cadastro</button>
      <button :class="{ active: activeTab === 'cadastrados' }" @click="activeTab = 'cadastrados'">Funcionários Cadastrados</button>
    </div>

    <!-- Conteúdo das abas com transição -->
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
            <button type="submit">Cadastrar Funcionário</button>
          </form>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="activeTab === 'cadastrados'" key="cadastrados" class="tab-pane">
          <h1>Funcionários Cadastrados</h1>
          <div v-if="employees.length" class="employee-list">
            <ul>
              <li v-for="(employee, index) in employees" :key="index">
                <strong>{{ employee.name }}</strong> - {{ employee.position }} - R$ {{ employee.salary }} - 
                {{ employee.gender }} - {{ employee.address }} - {{ employee.cpfOrCnpj }} - {{ employee.admissionDate }}
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
/* Layout geral */
.employee-manager {
  height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background-color: #f3ebe4; /* Fundo bege claro */
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background-color: #8b5e3c; /* Marrom café */
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  color: white; /* Texto branco */
}

.tabs button:hover {
  background-color: #6f4e37; /* Tom mais escuro */
}

.tabs button.active {
  background-color: #6f4e37;
  color: white;
}

.tab-content {
  width: 100%;
  max-width: 600px;
  background-color: #fffaf0; /* Fundo bege claro */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
}

.form-control {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-control label {
  font-weight: bold;
  color: #6f4e37; /* Marrom escuro */
}

input,
select {
  padding: 10px;
  border: 1px solid #8b5e3c; /* Bordas marrom café */
  border-radius: 5px;
  background-color: #f9f4ef; /* Fundo bege suave */
  color: #6f4e37; /* Texto marrom escuro */
}

input:focus,
select:focus {
  outline: none;
  border-color: #6f4e37; /* Marrom escuro no foco */
}

button {
  padding: 10px;
  border: none;
  background-color: #8b5e3c; /* Marrom café */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button:hover {
  background-color: #6f4e37;
}

.employee-list {
  margin-top: 20px;
  background-color: #fffaf0; /* Fundo bege claro */
  border: 1px solid #8b5e3c; /* Bordas marrom café */
  border-radius: 5px;
  padding: 10px;
}

.employee-list ul {
  list-style: none;
  padding: 0;
}

.employee-list li {
  margin-bottom: 10px;
  color: #6f4e37; /* Texto marrom escuro */
}

/* Animação de fade para as abas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

