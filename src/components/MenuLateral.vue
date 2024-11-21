<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="menu-lateral">
        <RouterLink to="/home">
            <div class="label">
                <img src="../assets/IconsMenu/Dashboard.png" alt="">
                <p>Dashboard</p>
            </div>
        </RouterLink>

        <RouterLink to="/vendas">
            <div class="label">
                <img src="../assets/IconsMenu/Sales.png" alt="">
                <p>Vendas</p>
            </div>
        </RouterLink>
        <RouterLink to="/despesas">
            <div class="label">
                <img src="../assets/IconsMenu/Despesas.png" alt="">
                <p>Despesas</p>
            </div>
        </RouterLink>
        <RouterLink to="/funcionario">
            <div class="label">
                <img src="../assets/IconsMenu/funcionario.png" alt="">
                <p>Funcionários</p>
            </div>
        </RouterLink>
        <RouterLink to="/relatorio">
            <div class="label">
                <img src="../assets/IconsMenu/Plantio.png" alt="">
                <p>Plantio</p>
            </div>
        </RouterLink>
        <RouterLink to="/relatorio">
            <div class="label">
                <img src="../assets/IconsMenu/Relatorio.png" alt="">
                <p>Relatório</p>
            </div>
        </RouterLink>

    </div>
</template>
<style scoped>
.menu-lateral {
    z-index: 1;
    display: flex;
    justify-content: center;
    height: 100vh;
    flex-direction: column;
    width: auto;
    background-color: #4e342e;
    transition: calc(.3s);
}

a {
    text-decoration: none;
    color: #ffffff;
    font-weight: bolder;
    transition: calc(.3s);
}

.label {
    padding: 20px;
    margin: 15px 0;
    height: 80px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    transition: calc(.3s);
}

.label img {
    width: 40px;
    height: 40px;
}

.label p {
    font-size: 20px;
    margin: 0;
}

.label:hover {
    background: #F5F5DC;
}

.label:hover p {
    color: rgb(0, 0, 0);
}
</style>