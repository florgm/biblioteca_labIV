<template>
    <div class="container">
        <b-form @submit.stop.prevent="onSubmit" class="register-form">
            <h1 class="register-title">Crear cuenta</h1>

            <div class="txtb">
                <b-form-group id="input-group-1" label="Usuario" label-for="user-input">
                    <b-form-input 
                        id="user-input" 
                        v-model="$v.form.user.$model" 
                        :state="validateState('user')"
                        aria-describedby="input-1-live-feedback"
                        placeholder="Ingresa un nombre de usuario" >
                    </b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">
                        <span v-if="!$v.form.user.required">Debes completar este campo</span>
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>
            
            <div class="txtb">
                <b-form-group id="input-group-2" label="Nombre" label-for="name-input">
                    <b-form-input 
                        id="name-input" 
                        v-model="$v.form.name.$model" 
                        :state="validateState('name')"
                        aria-describedby="input-2-live-feedback"
                        placeholder="Ingresa tu nombre" >
                    </b-form-input>

                    <b-form-invalid-feedback id="input-2-live-feedback">
                        <span v-if="!$v.form.name.required">Debes completar este campo</span>
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>

            <div class="txtb">
                <b-form-group id="input-group-3" label="Contraseña" label-for="password-input">
                    <b-form-input 
                        id="password-input" 
                        v-model="$v.form.password.$model" 
                        :state="validateState('password')"
                        aria-describedby="input-3-live-feedback"
                        type="password"
                        placeholder="Ingresa una contraseña" >
                    </b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">
                        <span v-if="!$v.form.password.required">Debes completar este campo</span>
                        <span v-if="!$v.form.password.minLength">La contraseña debe tener almenos 8 caracteres</span>
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>
            
            <div class="txtb">
                <b-form-group id="input-group-4" label="Repetir contraseña" label-for="repassword-input">
                    <b-form-input 
                        id="repassword-input" 
                        v-model="$v.form.repassword.$model" 
                        type="password"
                        :state="validateState('repassword')"
                        aria-describedby="input-4-live-feedback"
                        placeholder="Vuelve a ingresar la contraseña" >
                    </b-form-input>

                    <b-form-invalid-feedback id="input-3-live-feedback">
                        <span v-if="!$v.form.repassword.required">Debes completar este campo</span>
                        <span v-if="$v.form.repassword.required && !$v.form.password.sameAsPassword">Las contraseñas no coinciden</span>
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>

            <b-button type="submit" class="regbtn">Registrarse</b-button>

            <div class="bottom-text">
                ¿Ya tienes una cuenta? 
                <button type="button" class="btn btn-outline-light" @click="login">Ingresar</button>
            </div>
        </b-form>
    </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true
import { required, minLength, sameAs } from "vuelidate/lib/validators"

export default {
    data() {
        return {
            form: {
                user: '',
                name: '',
                password: '',
                repassword: ''
            }
        }
    },
    validations: {
        form: {
            user: { required },
            name: { required },
            password: { required, minLength: minLength(8) },
            repassword: { required, sameAsPassword: sameAs("password") }
        }
    },
    beforeCreate() {
        if(this.$store.state.loggedIn) {
            this.$router.push({ name: "home" })
        }
    },
    methods: {
        validateState(user) {
            const { $dirty, $error } = this.$v.form[user]
            return $dirty ? !$error : null
        },
        validateState(name) {
            const { $dirty, $error } = this.$v.form[name]
            return $dirty ? !$error : null
        },
        validateState(password) {
            const { $dirty, $error } = this.$v.form[password]
            return $dirty ? !$error : null
        },
        validateState(repassword) {
            const { $dirty, $error } = this.$v.form[repassword]
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.form.$touch()
            if (this.$v.form.$anyError) {
                return
            }

            axios.post('http://localhost:5555/signup',{
                    user: this.form.user,
                    name: this.form.name,
                    password: this.form.password
            })
            .then(response => {
                Swal.fire({
                    title: 'Felicitaciones!',
                    text: "Tu usuario ha sido creado con éxito",
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Ingresar'
                })
                .then(() => this.$router.push({ name: "login" }))
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El usuario ingresado ya existe'
                })
                this.form.user = ''
                this.form.name = ''
                this.form.password = ''
                this.form.repassword = ''
            })
        },
        login: function(){
            this.$router.push({ name: "login" })
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    text-decoration: none;
    box-sizing: border-box;
}

.register-form {
    width: 360px;
    background: #f1f1f1;
    height: 670px;
    padding: 40px 40px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.register-form h1 {
    text-align: center;
    font-weight: bold;
    margin-bottom: 30px;
    color: black;
}

.txtb {
    text-align: left;
    border-bottom: 2px solid #adadad;
    position: relative;
    margin: 25px 0;
    color: black;
}

.txtb input{
    font-size: 15px;
    color: #333;
    border: none;
    width: 100%;
    outline: none;
    background: none;
    padding: 0 5px;
    height: 35px;
}

.regbtn{
    display: block;
    width: 100%;
    height: 50px;
    border: none;
    background: linear-gradient(120deg,#3498db,#8e44ad,#3498db);
    background-size: 200%;
    color: #fff;
    outline: none;
    cursor: pointer;
    transition: .5s;
}

.regbtn:hover{
    background-position: right;
}

.bottom-text{
    font-weight: bold;
    margin-top: 20px;
    text-align: center;
    font-size: 15px;
    color: black;
}

.bottom-text button {
    color: #8e44ad;
    border: none;
    font-size: 15px;
}

.bottom-text button:hover {
    color: #3498db;
    background-color: transparent;
}
</style>