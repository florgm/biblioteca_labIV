<template>
    <div class="side-container">
        <b-row class="menu">
            <b-col>
                <li class="side-title" id='profile'>
                <span>Vueblioteca</span>
                </li>

                <li class="item" id='home'>
                    <b-link class="btn" :to="{ name: 'home' }">Inicio</b-link>
                </li>

                <li class="item" id="books">
                    <b-link class="btn" :to="{ name: 'books' }">Libros</b-link>
                </li>

                <li class="item" id="loans">
                    <b-link class="btn" :to="{ name: 'loans' }">Préstamos</b-link>
                </li>

                <li class="item" id="users">
                    <b-link class="btn" :to="{ name: 'users' }">Usuarios</b-link>
                </li>

                <li class="item">
                    <a class="btn" href="#" @click='onLogout'>Cerrar Sesión</a>
                </li>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

export default { 
    methods: {
        onLogout(e) {
            e.preventDefault()

            axios.post('http://localhost:8080/logout')
            .then(response => {
                this.$store.commit('logout')
                location.reload()
            })
            .catch(error => {
                if(error.response.status == 500) {
                    this.$router.push({ name: 'servererror' })
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: error.response.data,
                        icon: 'error',
                    })
                }
            })
        }
    }
}
</script>

<style>
.side-container {
    height: 100%;
    position: fixed;
    width: 250px;
    background: #31373d;
    list-style: none;
    text-decoration: none;
}
</style>

<style scoped>
.menu{
    padding-top: 15px; 
}

.side-title {
    padding: 15px; 
    font-size: 25px;
}

.item {
    border-top: 1px solid #2980b9;
}

.btn {
    display: block;
    padding: 16px 20px;
    color: white;
    position: relative;
    font-weight: bold;
    font-size: 18px;
}    

.btn:hover {
    color:white;
}
</style>