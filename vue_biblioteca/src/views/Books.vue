<template>
    <div class="books-container">
        <b-row class="container-row">
            <b-col v-if="user == 'L'" class="sidebar-col"><Sidebar></Sidebar></b-col>
            <b-col cols="12" v-else><UserMenu></UserMenu></b-col>

            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="books-title">
                    <b-col>
                        <h1 class="title">Libros</h1>
                    </b-col>
                    <b-col v-if="user == 'L'" cols="12" class="action-btn">
                        <b-link class="btn-style" :to="{ name: 'newbook'}">Agregar libro</b-link>
                    </b-col>
                </b-row>

                <b-row v-if="!exists">
                    <b-col>
                        <h1>No hay libros cargados</h1>
                    </b-col>
                </b-row>
                
                <b-row v-else class="book-table">
                    <b-col v-if="user == 'L'">
                        <table>
                            <thead>
                                <tr>
                                    <th>Título</th>
                                    <th>Autor</th>
                                    <th>Prestados</th>
                                    <th>Disponibles</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(book, index) in books" :key="index">
                                    <td>{{ book.title }}</td>
                                    <td>{{ book.author }}</td>
                                    <td>{{ book.quantity - book.availables }}</td>                                    
                                    <td>{{ book.availables }}</td>
                                    <td>{{ book.quantity }}</td>
                                    <td>
                                        <b-dropdown id="dropdown-action" right text="Acciones" class="m-md-2 dropdown-action" variant="light">
                                            <b-dropdown-item class="modify-btn"><b-link :to="{ name: 'book', params: { bookId: book.bookID } }">Modificar</b-link></b-dropdown-item>
                                            <b-dropdown-item class="delete-btn" @click="deleteBook(book.bookID)">Eliminar</b-dropdown-item>
                                        </b-dropdown>
                                    </td>
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
                                    <th>Disponibles</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(book, index) in availableBooks" :key="index">
                                    <td>{{ book.title }}</td>
                                    <td>{{ book.author }}</td>
                                    <td>{{ book.availables }}</td>
                                    <td>
                                        <b-button class="new-loan" @click="newLoan(book.bookID)">Pedir</b-button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </b-col>
                </b-row>
            </b-col>

            <b-col cols="12">
                <div class="empty-space"></div>
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
            books: [],
            items: [
                {
                    text: 'Inicio',
                    href: '/'
                },
                {
                    text: 'Libros',
                    active: true
                }
            ]
        }
    },
    mounted() {
        axios.get('http://localhost:5555/books')
        .then(response => {
            if(response.status == 200) {
                this.exists = true
                this.books = response.data
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
    },
    computed: {
        availableBooks() {
            return this.books.filter(b => b.availables > 0)
        }
    },
    methods: {
        deleteBook(bookID) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás recuperar un libro eliminado",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3498db',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {
                    axios.delete('http://localhost:5555/books/' + bookID)
                    .then(response => {
                        Swal.fire({
                            title: 'Libro eliminado exitosamente',
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
                            case 400:
                                Swal.fire({
                                    title: 'Error',
                                    text: error.response.data,
                                    confirmButtonColor: '#3498db',
                                    icon: 'error',
                                })
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
        },
        newLoan(bookID){
            this.$store.commit('newloan', {bookId: bookID})
            this.$router.push({ name: "newloan" })
        }
    }
}
</script>

<style scoped>
.sidebar-col {
    max-width: 265px;
    padding: 0px;
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

.new-loan {
    background: none;
    border: 1px solid;
    border-radius: 10px;
    padding: 10px 10px;
}

.new-loan:hover {
    text-decoration: none;
    background-color: white;
    color: #8e44ad;
}

.book-table table {
    margin: auto;
    width: 90%; 
}

.book-table th {
    padding: 15px 30px;
    border: 1px solid;
    font-size: 17px;
    font-weight: bold;
}

.book-table td {
    border-bottom: 1px solid;
    padding: 5px 15px;
}

.dropdown-action >>> .dropdown-menu {
    padding-top: 0px;
    padding-bottom: 0px;
    width: 100px;
}

.dropdown-action >>> .dropdown-menu .dropdown-item {
    text-align: center;
    color: black;
}

.dropdown-action >>> .dropdown-menu .modify-btn a {
    color: black;
}

.dropdown-action >>> .dropdown-menu .modify-btn a:hover {
    text-decoration: none;
}

.dropdown-action >>> .dropdown-menu .delete-btn {
    background-color: red;
}

.dropdown-action >>> .dropdown-menu .delete-btn a:hover {
    background-color: red;
    color: white;
}

.empty-space {
    margin: 40px;
}
</style>