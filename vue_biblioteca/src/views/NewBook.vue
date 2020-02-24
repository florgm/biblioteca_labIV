<template>
    <div class="book-container">
        <b-row>
            <b-col class="sidebar-col">
                <Sidebar></Sidebar>
            </b-col>
            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="books-title">
                    <b-col>
                        <h1 class="title">Nuevo Libro</h1>
                    </b-col>
                    <b-col cols="12" class="action-btn">
                        <b-link class="btn-style" :to="{ name: 'books' }">Volver</b-link>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form @submit.stop.prevent="onSubmit" class="new-book-form">
                            <div class="txtb">
                                <b-form-group id="input-group-1" label="Título" label-for="title-input">
                                    <b-form-input 
                                        id="title-input"
                                        v-model="$v.form.title.$model"
                                        :state="validateState('title')"
                                        aria-describedby="input-1-live-feedback"
                                        placeholder="Título del libro"
                                    ></b-form-input>

                                    <b-form-invalid-feedback id="input-1-live-feedback">
                                        <span v-if="!$v.form.title.required">Debes completar este campo</span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </div>

                            <div class="txtb">
                                <b-form-group id="input-group-2" label="Autor" label-for="author-input">
                                    <b-form-input
                                        id="author-input"
                                        v-model="$v.form.author.$model"
                                        :state="validateState('author')"
                                        aria-describedby="input-2-live-feedback"
                                        placeholder="Autor del libro"
                                    ></b-form-input>

                                    <b-form-invalid-feedback id="input-2-live-feedback">
                                        <span v-if="!$v.form.author.required">Debes completar este campo</span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </div>

                            <div class="txtb">
                                <b-form-group id="input-group-3" label="Cantidad" label-for="quantity-input">
                                    <b-form-input
                                        id="quantity-input"
                                        v-model="$v.form.quantity.$model"
                                        :state="validateState('quantity')"
                                        type="number"
                                        aria-describedby="input-3-live-feedback"
                                        placeholder="Cantidad de ejemplares"
                                    ></b-form-input>

                                    <b-form-invalid-feedback id="input-3-live-feedback">
                                        <span v-if="!$v.form.quantity.required">Debes completar este campo</span>
                                        <span v-if="!$v.form.quantity.minValue">La cantidad debe ser un número >= 1 </span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </div>

                            <b-button type="submit" class="add-btn">Agregar</b-button>
                        </b-form>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </div>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import { required, minValue } from "vuelidate/lib/validators";

import Sidebar from '@/components/Sidebar.vue'

export default {
    components: {
        Sidebar
    },
    data() {
        return {
            form: {
                title: '',
                author: '',
                quantity: ''
            },
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
                    text: 'Nuevo Libro',
                    active: true
                }
            ]
        }
    },
    validations: {
        form: {
            title: { required },
            author: { required },
            quantity: { required, minValue: minValue(1)}
        }
    },
    methods: {
        validateState(title) {
            const { $dirty, $error } = this.$v.form[title]
            return $dirty ? !$error : null
        },
        validateState(author) {
            const { $dirty, $error } = this.$v.form[author]
            return $dirty ? !$error : null
        },
        validateState(quantity) {
            const { $dirty, $error } = this.$v.form[quantity]
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.form.$touch()
            if (this.$v.form.$anyError) {
                return
            }

            axios.post('http://localhost:8080/books', {
                title: this.form.title,
                author: this.form.author,
                quantity: parseInt(this.form.quantity,10)
            })
            .then(response => {
                Swal.fire({
                    title: 'Libro creado exitosamente',
                    icon: 'success',
                    confirmButtonColor: '#3498db',
                    confirmButtonText: 'Ok'
                })
                .then(() => this.$router.push({name: "books"}))
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
                } else if (error.response.status == 400) {
                    Swal.fire({
                        title: 'Error',
                        text: error.response.data,
                        icon: 'error',
                    })
                    this.form.title = ''
                    this.form.author = ''
                    this.form.quantity = ''
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

.new-book-form {
    width: 400px;
    background: #f1f1f1;
    margin-top: 10px;
    height: 440px;
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

.txtb input{
    height: 35px;
}

.add-btn {
    border: none;
    background: linear-gradient(120deg,#3498db,#8e44ad,#3498db);
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.add-btn:hover{
    background-position: right;
}
</style>