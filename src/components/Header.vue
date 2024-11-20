<template>
    <header v-if="!isLogin && !isRegister" class="header">
        <div class="container">
            <div class="dropdown" @mouseover="toggleDropdown" @mouseleave="toggleDropdown">
                <button class="dropdown-btn">
                    <span> Olá {{ captalizeFistLetter(userName) }}</span>
                </button>
                <div class="dropdown-content" v-if="dropdownVisible">
                    <a href="#">My Account</a>
                    <a class="logout" @click="logout">Logout</a>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const dropdownVisible = ref(true);
const isLogin = ref(false);
const isRegister = ref(false);
const userData = JSON.parse(localStorage.getItem('userName') || '{}');
const userName = ref(userData.name || 'Visitante');


function captalizeFistLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

watch(route, (newRoute) => {
    isLogin.value = newRoute.path === '/';
    isRegister.value = newRoute.path === '/register';
});
function logout() {

    window.location.replace('/');
}

function toggleDropdown() {
    dropdownVisible.value = dropdownVisible.value;
}
</script>

<style scoped>
span {
    margin-left: 20px;
}

.header {
    position: fixed;
    width: 100%;
    z-index: 2;
    height: auto;
    box-sizing: inherit;
    background-color: #f5f5dc;
}

.container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1920px;
}

.logo {
    margin-left: 1000px;
    display: flex;
    align-items: center;
    height: 20px;
    transition: calc(.3s);

    img {
        height: 200px;
        width: 200px;
    }
}

.dropdown {
    position: relative;
}

.dropdown-btn {
    display: flex;
    align-items: center;
    padding: 10px;
    background: none;
    border: none;
    font-size: 25px;
    font-weight: bolder;
    color: #000;
    transition: calc(.2s);
    cursor: pointer;

    img {
        width: 60px;
    }
}

.dropdown-btn:hover {
    color: #3389CE;
}

.dropdown-content {
    transition: 400ms;
    display: none;
    width: 120px;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    border: 1px solid #dee2e6;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.logout {
    cursor: pointer;
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    display: block;
    padding: 10px;
    font-weight: bolder;
    text-decoration: none;
    color: #000;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}
</style>