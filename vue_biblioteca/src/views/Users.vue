<template>
    <div class="users-container">
        <b-row>
            <b-col class="sidebar-col"><Sidebar></Sidebar></b-col>

            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="users-title">
                    <b-col>
                        <h1 class="title">Usuarios</h1>
                    </b-col>
                </b-row>
                
                <b-row class="users-table">
                    <b-col cols="12">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in users" :key="index">
                                    <td>{{ user.name }}</td>
                                    <td>{{ user.user }}</td>
                                    <td v-if="user.role == 'L'">Biblotecario</td>
                                    <td v-else>Socio</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

import Sidebar from '@/components/Sidebar.vue'

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            users: [],
            items: [
                {
                    text: 'Inicio',
                    href: '/'
                },
                {
                    text: 'Usuarios',
                    active: true
                }
            ]
        }
    },
    mounted() {
        axios.get('http://localhost:8080/users')
        .then(response => {
            this.users = response.data    
        })
        .catch(error => {
            if (error.response.status == 401) {
                this.$store.commit('logout')
                Swal.fire({
                    title: 'Sesión expirada',
                    text: "Inicie sesión nuevamente",
                    icon: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ingresar'
                })
                .then(() => this.$router.push({name: "login"}))
            }
        })
    }
}
</script>

<style scoped>
.sidebar-col {
    max-width: 265px;
    padding-right: 0px;
}

.title {
    text-decoration: underline;
    padding: 10px;
}

.users-table table {
    margin: auto;
    width: 90%; 
}

.users-table th {
    padding: 15px 30px;
    border: 1px solid;
    font-size: 17px;
    font-weight: bold;
}

.users-table td {
    border-bottom: 1px solid white;
    padding: 10px 15px;
}
</style>