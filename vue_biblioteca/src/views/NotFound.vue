<template>
    <div class="container">
        <b-row>
            <b-col class="error-col">
                <h1 class="error-title">404</h1>
                <p class="error-text">Elemento no encontrado</p>
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
    margin-top: 200px;
}
.error-title {
    font-size: 70px;
}

.error-text {
    font-size: 25px;
    margin-bottom: 30px;
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