<template>
    <div class="book-container">
        <b-row class="container-row">
            <b-col class="sidebar-col"><Sidebar></Sidebar></b-col>

            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="book-title">
                    <b-col>
                        <h1 class="title">Modificar cantidad de ejemplares</h1>
                    </b-col>
                    <b-col cols="12" class="action-btn">
                        <b-link class="btn-style" :to="{ name: 'books' }">Volver</b-link>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form @submit.stop.prevent="onSubmit" class="update-book-form">
                            <div class="txtb">
                                <b-form-group id="input-group-1" label="Título" label-for="title-input">
                                    <b-form-input 
                                        id="title-input"
                                        plaintext
                                        :value="title"
                                        class="plain-info"
                                    ></b-form-input>
                                </b-form-group>
                            </div>

                            <div class="txtb">
                                <b-form-group id="input-group-2" label="Autor" label-for="author-input">
                                    <b-form-input
                                        id="author-input"
                                        plaintext
                                        :value="author"
                                        class="plain-info"
                                    ></b-form-input>
                                </b-form-group>
                            </div>

                            <div class="txtb">
                                <b-form-group id="input-group-3" label="Cantidad actual" label-for="quantity-input">
                                    <b-form-input
                                        id="quantity-input"
                                        plaintext
                                        :value="quantity"
                                        class="plain-info"
                                    ></b-form-input>
                                </b-form-group>
                            </div>

                            <div class="txtb">
                                <b-form-group id="input-group-4" label="Nueva cantidad" label-for="new-quantity-input">
                                    <b-form-input
                                        id="new-quantity-input"
                                        v-model="$v.newQuantity.$model"
                                        :state="validateState('newQuantity')"
                                        type="number"
                                        aria-describedby="input-1-live-feedback"
                                        placeholder="Nueva cantidad de ejemplares"
                                    ></b-form-input>

                                    <b-form-invalid-feedback id="input-1-live-feedback">
                                        <span v-if="!$v.newQuantity.required">Debes completar este campo</span>
                                        <span v-if="!$v.newQuantity.minValue">La cantidad debe ser un número >= 1 </span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </div>

                            <b-button type="submit" class="mod-btn">Actualizar</b-button>
                        </b-form>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true
import { required, minValue } from "vuelidate/lib/validators"

import Sidebar from '@/components/Sidebar.vue'

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            title: '',
            author: '',
            quantity: '',
            newQuantity: '',
            items: [
                {
                    text: 'Inicio',
                    href: '/'
                },
                {
                    text: 'Libros',
                    href: '/books'
                },
                {
                    text: 'Modificar libro',
                    active: true
                }
            ]
        }
    },
    validations: {
        newQuantity: { required, minValue: minValue(1) }
    },
    mounted() {
        axios.get('http://localhost:8080/books/' + this.$route.params.bookId)
        .then(response => {
            this.title = response.data[0].title
            this.author = response.data[0].author
            this.quantity = response.data[0].quantity
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
            } else if (error.response.status == 404) {
                this.$router.push({ name: 'notfound' })
            }
        })
    },
    methods: {
        validateState(newQuantity) {
            const { $dirty, $error } = this.$v.newQuantity
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.$touch()
            if (this.$v.$anyError) {
                return
            }

            axios.put('http://localhost:8080/books/' + this.$route.params.bookId, {
                quantity: parseInt(this.newQuantity,10)
            })
            .then(response => {
                Swal.fire({
                    title: 'Libro actualizado exitosamente',
                    icon: 'success',
                    confirmButtonColor: '#3498db',
                    confirmButtonText: 'Ok'
                })
                .then(() => this.$router.push({name: "books"}))
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
                        break
                    case 400:
                        Swal.fire({
                            title: 'Error',
                            text: error.response.data,
                            icon: 'error',
                        })
                        this.newQuantity = ''
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
    }
}
</script>

<style>
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
    padding-bottom: 10px;
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

.update-book-form {
    width: 400px;
    background: #f1f1f1;
    margin-top: 10px;
    height: 480px;
    padding: 20px 40px;
    border-radius: 10px;
    position: absolute;
    left: 33%;
}

.txtb {
    text-align: center;
    position: relative;
    margin: 20px 0;
    color: black;
    font-size: 18px;
    font-weight: bold;
}

.txtb .plain-info {
    text-align: center;
    border: 1px solid #b7bbbf;
}

.txtb input{
    height: 35px;
}

.mod-btn {
    border: none;
    background: linear-gradient(120deg,#3498db,#8e44ad,#3498db);
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.mod-btn:hover{
    background-position: right;
}

</style>