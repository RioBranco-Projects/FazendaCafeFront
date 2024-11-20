<template>
  <Transition name="fade-horizontal">
  <div class="login-page">
    <img src="/src/assets/CoffeeLogo.png" alt="">
    <div class="login-container">
        <h2>
            <img src="/src/assets/CafeIcon.png" width="35px" alt="">
            CoffeeFlow
            <img src="/src/assets/CafeIcon.png" width="35px" alt="">
        </h2> 

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Digite seu email"
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
        Não tem uma conta? <router-link to="/register">Registre-se aqui</router-link>
      </p>
      <p class="error-message">{{ errorMessage }}</p>
      <p class="success-message">{{ sucessMessage }}</p>
    </div>
  </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const sucessMessage = ref('');

const handleLogin = () => {
  const storedUser = JSON.parse(localStorage.getItem("userName"));
  if (storedUser && storedUser.email === email.value && storedUser.password === password.value) {
    localStorage.setItem("isAuthenticated", "true");
    sucessMessage.value = 'Login realizado com sucesso!';
    setTimeout(() => {
      router.push('/home');
    }, 1300)
  } else {
    errorMessage.value = 'Email ou senha incorretos.';
    setTimeout(() => {
      errorMessage.value = '';
    }, 1000)
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
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 20px;
    img {
      width: 250px;
    }
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

.register-link {
    color: white;
}
label {
  display: block;
  margin-bottom: 5px;
  font-size: 30px;
  color: #ffffff;
}
a {
  text-decoration: none;
  color: #E9C495;
  font-weight: bold;
  transition: calc(.3s);
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.login-button {
  margin-bottom: 30px ;
  display: flex;
  justify-content: center;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  background-color: #E9C495;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  color: #000000;
  font-size: 18px;
  transition: calc(.3s);
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
.success-message {
  color: green;
  margin-top: 10px;
  font-size: 16px;
}
.fade-horizontal-enter-active, .fade-horizontal-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-horizontal-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-horizontal-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-horizontal-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-horizontal-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>