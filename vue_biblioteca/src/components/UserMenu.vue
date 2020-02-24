<template>
  <div class="userMenu">
    <b-navbar class="navegacion" type="light" variant="light">
        <b-navbar-brand to="/userhome">
            <img src="@/assets/boo-vue.png" class="img-logo d-inline-block align-top">
            Vueblioteca</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-nav-item :to="{ name: 'home' }">Home</b-nav-item>
            <b-nav-item :to="{ name: 'books' }">Libros</b-nav-item>
            <b-nav-item :to="{ name: 'loans' }">Préstamos</b-nav-item>
            <b-nav-item href="#" @click='onLogout'>Logout</b-nav-item>
        </b-navbar-nav>
    </b-navbar>
        
    <router-view></router-view>
        
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;

export default {
    methods:{
        onLogout(e) {
            e.preventDefault()

            axios.post('http://localhost:5555/logout')
            .then(response => {
                this.$store.commit('logout')
                location.reload()
            })
            .catch(() => {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data,
                    confirmButtonColor: '#3498db',
                    icon: 'error',
                })
            })
        }
    }
}
</script>

<style scoped>
.navegacion {
    height: 80px;
}

.img-logo {
    width: 35px;
}

ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
}
</style>
