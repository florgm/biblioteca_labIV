<template>
    <div v-if="!loggedIn" class="home">
        <Home msg="Bienvenido a Vueblioteca"/>
    </div>
    <div v-else-if="user == 'L'">
        <b-row class="mx-auto">
            <b-col class="sidebar-col">
                <Sidebar></Sidebar>
            </b-col>
            <b-col>
                <div>
                    <h1 class="home-title">Bienvenido {{ username }}</h1>
                    <p class="home-text">Todo lo que puedes administrar se encuentra en el menú de la izquierda</p>
                    <div class="info-cards">
                        <b-card-group deck class="mb-3 mr-5 ml-5">
                        <b-card class="info-tite" border-variant="primary" header="Títulos disponibles" header-bg-variant="primary" align="center">
                            <b-card-text class="info-text">{{ info.books }}</b-card-text>
                        </b-card>

                        <b-card class="info-title" border-variant="warning" header="Cantidad de copias" header-bg-variant="warning" align="center">
                            <b-card-text class="info-text">{{ info.copies }}</b-card-text>
                        </b-card>
                        </b-card-group>

                        <b-card-group deck class="mb-3 mr-5 ml-5">
                        <b-card class="info-title" border-variant="success" header="Socios registrados" header-bg-variant="success" align="center">
                            <b-card-text class="info-text">{{ info.users }}</b-card-text>
                        </b-card>

                        <b-card class="info-title" border-variant="info" header="Préstamos" header-bg-variant="info" align="center">
                            <b-card-text class="info-text">{{ info.loans }}</b-card-text>
                        </b-card>
                        </b-card-group>
                    </div>
                </div>
            </b-col>
        </b-row>
    </div>
    <div v-else>
        <UserMenu></UserMenu>
        <h1 class="home-title">Bienvenido {{ username }}</h1>
        <h2>Tus préstamos</h2>
        <b-row>
            <b-col class="action-btn">
                <b-link class="btn-style" :to="{ name: 'books' }">Nuevo Préstamo</b-link>
            </b-col>
        </b-row>
        <b-row v-if="!exists">
            <b-col>
                <h1>No hay préstamos registrados</h1>
            </b-col>
        </b-row>
        <b-row v-else class="loans-table">
            <b-col cols="12">
                <table>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Vencimiento</th>
                            <th>Días restantes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(loan, index) in loans" :key="index">
                            <td>{{ loan.title }}</td>
                            <td>{{ loan.author }}</td>
                            <td v-if="loan.expiration_date < Date.now()" class="red-text">{{ formatDate(loan.expiration_date) }}</td>
                            <td v-else>{{ formatDate(loan.expiration_date) }}</td>
                            <td v-if="loan.expiration_date < Date.now()" class="red-text">0</td>
                            <td v-else>{{ diffDays(loan.expiration_date) }}</td>
                            <td>
                                <b-button class="ret-loan" @click="deleteLoan(loan.loanID)">Devolver</b-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;

import Home from '@/components/Home.vue'
import Sidebar from '@/components/Sidebar.vue'
import UserMenu from '@/components/UserMenu.vue'

export default {
    name: 'home',
    components: {
        Home,
        Sidebar,
        UserMenu
    },
    data() {
        return {
            loggedIn: this.$store.state.loggedIn,
            user: this.$store.state.role,
            username: this.$store.state.name,
            exists: false,
            loans: [],
            info: []
        }
    },
    mounted() {
        if(this.$store.state.role == 'U') {
            axios.get('http://localhost:8080/loans/user/' + this.$store.state.userId)
            .then(response => {
                if(response.status == 200) {
                    this.exists = true
                    this.loans = response.data
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error',
                    text: error.response.data,
                    icon: 'error',
                })
            })
        } else if(this.$store.state.role == 'L') {
            axios.get('http://localhost:8080/info')
            .then(response => {
                this.info = response.data
            })
        }
    },
    methods: {
        formatDate(millsec) {
			function pad(s) {
				return s < 10 ? "0" + s : s;
			}
			var d = new Date(millsec);
			return [
				pad(d.getDate()),
				pad(d.getMonth() + 1),
				d.getFullYear()
			].join("/");
        },
        diffDays(date) {
			const date1 = new Date(date);
			const date2 = new Date();
			const diffTime = Math.abs(date2 - date1);
			const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
			return diffDays;
        },
        deleteLoan(loanID) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Deberás pedir el libro prestado otra vez si lo devuelves",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3498db',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Devolver',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    axios.delete('http://localhost:8080/loans/' + loanID)
                    .then(response => {
                        Swal.fire({
                            title: 'Libro devuelto exitosamente',
                            icon: 'success',
                            confirmButtonColor: '#3498db',
                            confirmButtonText: 'Ok'
                        })
                        .then(() => location.reload())
                    })
                    .catch(error => {
                        switch (error.response.status) {
                            case 401:
                                this.$store.commit('logout');
                                Swal.fire({
                                    title: 'Sesión expirada',
                                    text: "Inicie sesión nuevamente",
                                    icon: 'error',
                                    confirmButtonColor: '#3498db',
                                    confirmButtonText: 'Ingresar'
                                })
                                .then(() => this.$router.push({name: "login"}))
                                break
                            case 404:
                                this.$router.push({ name: 'notfound' })
                                break
                            case 500:
                                Swal.fire({
                                    title: 'Error',
                                    text: error.response.data,
                                    icon: 'error',
                                    confirmButtonColor: '#3498db'
                                })
                                break
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
.sidebar-col {
    max-width: 265px;
    padding: 0px;
}

.home-title {
    padding-top: 60px;
}

.home-text {
    font-size: 20px;
}

.info-cards .info-text {
    color: black;
    font-size: 25px;
    font-weight: bold;
}

.action-btn {
    padding-right: 50px;
    padding-bottom: 35px;
}

.btn-style {
    float: right;
    color: white;
    border: 1px solid;
    border-radius: 10px;
    padding: 10px 10px;
}

.btn-style:hover {
    text-decoration: none;
    background-color: white;
    color: #8e44ad;
}

.loans-table table {
    margin: auto;
    width: 90%; 
}

.loans-table th {
    padding: 15px 30px;
    border: 1px solid;
    font-size: 17px;
    font-weight: bold;
}

.loans-table td {
    border-bottom: 1px solid white;
    padding: 10px 15px;
}

.red-text {
    color: red;
    
}

.ret-loan {
    background: none;
    border: 1px solid;
    border-radius: 10px;
    padding: 10px 10px;
}

.ret-loan:hover {
    text-decoration: none;
    background-color: white;
    color: #8e44ad;
}
</style>

