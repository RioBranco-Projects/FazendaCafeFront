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
    overflow: hidden;
    width: 100%;
    background-color: #fff;
}
</style>