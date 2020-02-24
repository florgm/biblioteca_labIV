<template>
    <div class="home">
        <img class="imagen" alt="Vue logo" src="@/assets/boo-vue.png">
        <h1>{{ msg }}</h1>
        <p>
        Proyecto creado para la materia Laboratorio IV de la carrera Ingeniería Informática en la Universidad Blas Pascal
        </p>
        <ul>
            <li><button type="button" class="btn btn-outline-light" @click="login">Ingresar</button></li>
            <li><button type="button" class="btn btn-outline-light" @click="register">Registrarse</button></li>
        </ul>
    </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;

export default {
    props: {
        msg: String
    },
    methods:{
        login: function(){
            this.$router.push({ name: "login" })
        },
        register: function(){
            this.$router.push({ name: "register" })
        }
    }
}
</script>

<style scoped>
.home {
    padding: 10%;
}

.imagen {
    width: 230px;
}

p {
    font-size: 20px;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}
</style>
