<template>
  <Transition name="fade-horizontal">
    <div class="login-page">
      <img src="/src/assets/CoffeeLogo.png" alt="" />
      <div class="login-container">
        <h2>
          <img src="/src/assets/CafeIcon.png" width="35px" alt="" />
          CoffeeFlow
          <img src="/src/assets/CafeIcon.png" width="35px" alt="" />
        </h2>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="cpf">CPF</label>
            <input
              type="text"
              id="cpf"
              v-model="cpf"
              placeholder="Digite seu CPF"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Senha</label>
            <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" class="login-button">Entrar</button>
        </form>
        <p class="register-link">
          <router-link to="/register">Esqueci minha senha</router-link>
        </p>
        <p class="error-message">{{ errorMessage }}</p>
        <p class="sucess-message">{{ sucessMessage }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const cpf = ref('');
const password = ref('');
const sucessMessage = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/login', {
      cpf: cpf.value,
      password: password.value,
    });
    if (response.status === 200) {
      localStorage.setItem('employeeId', response.data.employeeId);
      localStorage.setItem('loggedCpf', cpf.value);
      sucessMessage.value = 'Login realizado com sucesso!';
      setTimeout(() => {
        router.push('/home');
      }, 1100);
    }
  } catch (error) {
    errorMessage.value = error.response?.data || 'Erro ao realizar o login.';
    setTimeout(() => (errorMessage.value = ''), 1500);
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to top, #4e342e, #f2cc9b);
}

.register-link {
  a {
    text-decoration: none;
    color: #e9c495;
  }
}
.login-container {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 500px;
  background-color: #4e342e;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.689);
  text-align: center;
}

h2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 25px;
  color: #ffffff;
  font-size: 40px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 30px;
  color: #ffffff;
}

input {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  background-color: #e9c495;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  color: #000000;
  font-size: 18px;
  transition: calc(0.3s);
  cursor: pointer;
}

.login-button:hover {
  background-color: #f9af4e;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 16px;
}

.sucess-message {
  color: green;
  margin-top: 10px;
  font-size: 16px;
}
</style>
