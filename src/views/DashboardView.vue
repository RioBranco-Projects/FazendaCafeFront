<script setup>
import ChartView from '../components/ChartView.vue';
import Card from '../components/Card.vue';
import ChartViewTwo from '@/components/ChartViewTwo.vue';
</script>
<template>
    <section class="dashboard">
        <div class="boxes">
            <div class="card">
                <Card title="Vendas" img="/src/assets/IconsMenu/Sales.png" totalSales="R$ 10.000" description="Resumo de todas as vendas do ano"/>
            </div>
            <div class="card">
                <Card title="Despesas" img="/src/assets/IconsMenu/Dashboard.png" totalSales="R$ -10.000" description="Todas as despesas do Mês"/>
            </div>
            <div class="card">
                <Card title="Plantio" img="/src/assets/IconsMenu/Plantio.png" totalSales="412 plantios" description="dsasdsa"/>
            </div>
            <div class="card">
                <Card title="Funcionários" img="/src/assets/IconsMenu/funcionario.png" totalSales="55 Colab" description="dsasdsa"/>
            </div>
        </div>
        <div class="graficos">
            <div class="boxgraphics">
                <h1>Gráficos das ultimas vendas</h1>
                <div class="graphics">
                    <ChartView/>
                </div>
            </div>
            <div class="boxgraphics">
                <h1>Gráficos das ultimas despesas</h1>
                <div class="graphics">
                    <ChartViewTwo/>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.dashboard {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content:space-evenly;
    align-items: center;
}
.graficos{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
}
.boxgraphics {
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.411);
    background-color: #F5F5DC;
    border-radius: 10px;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 20px;
}
.boxes {
    display: flex;
    align-items: center;
    gap: 120px;
}
.graphics {
    display: flex;
    justify-content: center;
    gap: 20px;
}
</style>