<template>
    <div class="container">
        <b-row>
            <b-col class="error-col">
                <h1 class="error-title">Error de servidor</h1>
                <p class="error-text">Ha ocurrido un error en nuestros servidores y la operación que deseabas no pudo realizarse, intentalo nuevamente más tarde</p>
                <b-link class="return-btn" :to="{ name: 'home' }">Volver al inicio</b-link>
            </b-col>
        </b-row>
    </div>
</template>

<script>
export default {
}
</script>

<style>
.error-col {
    margin-top: 150px;
}
.error-title {
    font-size: 70px;
}

.error-text {
    font-size: 25px;
}

.return-btn{
    border: 1px solid;
    border-radius: 10px;
    padding: 10px 10px;
    color: #fff;
    
}

.return-btn:hover{
    text-decoration: none;
    background-color: white;
    color: #8e44ad;
}
</style>