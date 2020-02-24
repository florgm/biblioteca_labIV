<template>
    <div class="loans-container">
        <b-row>
            <b-col v-if="user == 'L'" class="sidebar-col"><Sidebar></Sidebar></b-col>
            <b-col cols="12" v-else><UserMenu></UserMenu></b-col>

            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="loans-title">
                    <b-col>
                        <h1 class="title">Préstamos</h1>
                    </b-col>
                    <b-col v-if="user == 'U'" cols="12" class="action-btn">
                        <b-link class="btn-style" :to="{ name: 'books' }">Nuevo Préstamo</b-link>
                    </b-col>
                </b-row>

                <b-row v-if="!exists">
                    <b-col>
                        <h1>No hay préstamos registrados</h1>
                    </b-col>
                </b-row>
                
                <b-row v-else class="loans-table">
                    <b-col v-if="user == 'L'" cols="12">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Socio</th>
                                    <th>Vencimiento</th>
                                    <th>Días restantes</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(loan, index) in loans" :key="index">
                                    <td>{{ loan.title }}</td>
                                    <td>{{ loan.author }}</td>
                                    <td>{{ loan.user }}</td>
                                    <td v-if="loan.expiration_date < Date.now()" class="red-text">{{ formatDate(loan.expiration_date) }}</td>
                                    <td v-else>{{ formatDate(loan.expiration_date) }}</td>
                                    <td v-if="loan.expiration_date < Date.now()" class="red-text">0</td>
                                    <td v-else>{{ diffDays(loan.expiration_date) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>

                    <b-col v-else cols="12">
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
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

import Sidebar from '@/components/Sidebar.vue'
import UserMenu from '@/components/UserMenu.vue'

export default {
    components: {
        Sidebar,
        UserMenu
    },
    data() {
        return {
            user: this.$store.state.role,
            exists: false,
            loans: [],
            items: [
                {
                    text: 'Inicio',
                    href: '/'
                },
                {
                    text: 'Préstamos',
                    active: true
                }
            ]
        }
    },
    mounted() {
        if(this.$store.state.role == 'L') {
            axios.get('http://localhost:8080/loans')
            .then(response => {
                if(response.status == 200) {
                    this.exists = true
                    this.loans = response.data
                }
            })
            .catch(error => {
                if (error.response.status == 401) {
                    this.$store.commit('logout')
                    Swal.fire({
                        title: 'Sesión expirada',
                        text: "Inicie sesión nuevamente",
                        icon: 'error',
                        confirmButtonColor: '#3498db',
                        confirmButtonText: 'Ingresar'
                    })
                    .then(() => this.$router.push({name: "login"}))
                }
            })
        } else {
            axios.get('http://localhost:8080/loans/user/' + this.$store.state.userId)
            .then(response => {
                if(response.status == 200) {
                    this.exists = true
                    this.loans = response.data
                }
            })
            .catch(error => {
                if (error.response.status == 401) {
                    this.$store.commit('logout')
                    Swal.fire({
                        title: 'Sesión expirada',
                        text: "Inicie sesión nuevamente",
                        icon: 'error',
                        confirmButtonColor: '#3498db',
                        confirmButtonText: 'Ingresar'
                    })
                    .then(() => this.$router.push({name: "login"}))
                }
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
    padding-right: 0px;
}

.title {
    text-decoration: underline;
    padding: 10px;
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