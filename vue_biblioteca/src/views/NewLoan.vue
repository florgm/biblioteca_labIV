<template>
    <div class="new-loan-container">
        <b-row>
            <b-col cols="12" class="usermenu-col">
                <UserMenu></UserMenu>
            </b-col>
            <b-col>
                <b-breadcrumb :items="items"></b-breadcrumb>
                <b-row class="loans-title">
                    <b-col>
                        <h1 class="title">Nuevo Préstamo</h1>
                    </b-col>
                    <b-col cols="12" class="action-btn">
                        <b-link class="btn-style" :to="{ name: 'books' }">Volver</b-link>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-form @submit.stop.prevent="onSubmit" class="new-loan-form">
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
                                <b-form-group id="input-group-3" label="Cantidad de días" label-for="days-input">
                                    <b-form-input
                                        id="days-input"
                                        v-model="$v.days.$model"
                                        :state="validateState('days')"
                                        aria-describedby="input-1-live-feedback"
                                        placeholder="Cantidad de días del préstamo"
                                    ></b-form-input>

                                    <b-form-invalid-feedback id="input-1-live-feedback">
                                        <span v-if="!$v.days.required">Debes completar este campo</span>
                                        <span v-if="!$v.days.minValue">La cantidad de días debe ser >= 1 </span>
                                    </b-form-invalid-feedback>
                                </b-form-group>
                            </div>

                            <b-button type="submit" class="new-btn">Pedir</b-button>
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

import UserMenu from '@/components/UserMenu.vue'

export default {
    components: {
        UserMenu
    },
    data() {
        return {
            title: '',
            author: '',
            days: '',
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
                    text: 'Nuevo Préstamo',
                    active: true
                }
            ]
        }
    },
    validations: {
        days: { required, minValue: minValue(1) }
    },
    mounted() {
        axios.get('http://localhost:8080/books/' + this.$store.state.bookId)
        .then(response => {
            this.title = response.data[0].title
            this.author = response.data[0].author
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
        validateState(days) {
            const { $dirty, $error } = this.$v[days]
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.$touch()
            if (this.$v.$anyError) {
                return
            }

            axios.post('http://localhost:8080/loans', {
                bookID: this.$store.state.bookId,
                days: parseInt(this.days,10)
            })
            .then(response => {
                Swal.fire({
                    title: 'Préstamo creado exitosamente',
                    icon: 'success',
                    confirmButtonColor: '#3498db',
                    confirmButtonText: 'Ok'
                })
                .then(() => this.$router.push({name: "loans"}))
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
                        confirmButtonColor: '#3498db',
                        icon: 'error',
                    })
                    this.days = ''
                } else if (error.response.status == 404) {
                    this.$router.push({ name: 'notfound' })
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

.new-loan-form {
    width: 400px;
    background: #f1f1f1;
    margin-top: 10px;
    height: 400px;
    padding: 20px 40px;
    border-radius: 10px;
    position: absolute;
    left: 37%;
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

.new-btn {
    border: none;
    font-size: 18px;
    background: linear-gradient(120deg,#3498db,#8e44ad,#3498db);
    background-size: 200%;
    color: #fff;
    transition: .5s;
}

.new-btn:hover{
    background-position: right;
}
</style>