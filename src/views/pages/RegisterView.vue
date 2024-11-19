<template>
  <Transition name="fade-horizontal">
  <div class="register-page">
    <div class="register-container">
      <h2>Registre-se</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nome</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Digite seu nome"
            required
          />
        </div>
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
        <button type="submit" class="register-button">Registrar</button>
      </form>
      <p class="login-link">
        Já tem uma conta? <router-link to="/">Faça login aqui</router-link>
      </p>
    </div>
    <img src="/src/assets/Coffee Logo.png" alt="">
  </div>
</Transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const handleRegister = () => {
  if (name.value && email.value && password.value) {
    const user = {
      name: name.value,
      email: email.value,
      password: password.value,
    };
    localStorage.setItem("userName", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");
    router.push('/'); 
  } else {
    errorMessage.value = 'Por favor, preencha todos os campos.';
  }
};
</script>
<style scoped>
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to top, #4e342e, #f2cc9b);
  @media (max-width: 768px) {
    padding: 20px;
    flex-direction: column-reverse;
    height: auto;
    img {
      width: 250px;
    }
  }
}

.register-container {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 500px;
  background-color: #4e342e;  
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #ffffff;
  font-size: 40px;
}
a {
  text-decoration: none;
  color: #E9C496;
}
.login-link {
  color: white;
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

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-button {
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  background-color: #E9C496;
  border: none;
  border-radius: 10px;
  color: #000000;
  font-size: 16px;
  cursor: pointer;
  transition: calc(.3s);
}
.register-button:hover {
  background-color: #fbb765;
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