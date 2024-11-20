<script setup>
import { RouterView } from 'vue-router';
import MenuLateral from '../components/MenuLateral.vue';
</script>

<template>
    <section class="home">
        <MenuLateral />
        <div class="sla">
            <RouterView />
        </div>
    </section>
</template>

<style scoped>
.home {
    height: auto;
    display: flex;
    justify-content: center;
}

.sla {
    background-image: url('/src/assets/CoffeeLogo.png');
    background-repeat: no-repeat;
    background-position: center;
    overflow: hidden;
    width: 100%;
    background-color: #fff;
}
</style>