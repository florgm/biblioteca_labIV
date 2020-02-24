<template>
    <div class="container">
        <b-form @submit.stop.prevent="onSubmit" class="login-form">
            <h1 class="login-title">Iniciar sesión</h1>

            <div class="txtb">
                <b-form-group id="input-group-1" label="Usuario" label-for="user-input">
                    <b-form-input 
                        id="user-input" 
                        v-model="$v.form.user.$model" 
                        :state="validateState('user')"
                        aria-describedby="input-1-live-feedback"
                        placeholder="Ingresa tu usuario"
                        autofocus >
                    </b-form-input>

                    <b-form-invalid-feedback id="input-1-live-feedback">
                        Debes completar este campo
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>

            <div class="txtb">
                <b-form-group id="input-group-2" label="Contraseña" label-for="password-input">
                    <b-form-input 
                        id="password-input" 
                        v-model="$v.form.password.$model" 
                        :state="validateState('password')"
                        aria-describedby="input-2-live-feedback"
                        type="password" 
                        placeholder="Ingresa tu contraseña">
                    </b-form-input>    

                    <b-form-invalid-feedback id="input-2-live-feedback">
                        Debes completar este campo
                    </b-form-invalid-feedback>
                </b-form-group>
            </div>

            <b-button type="submit" class="logbtn">Ingresar</b-button>

            <div class="bottom-text">
                ¿No tienes una cuenta? 
                <button type="button" class="btn btn-outline-light" @click="register">Registrate</button>
            </div>
        </b-form>
    </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true
import { required, minLength } from "vuelidate/lib/validators"

export default {
    data() {
        return{
            form: {
                user: '',
                password: ''
            }
        }
    },
    validations: {
        form: {
            user: { required },
            password: { required }
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
        validateState(password) {
            const { $dirty, $error } = this.$v.form[password]
            return $dirty ? !$error : null
        },
        onSubmit() {
            this.$v.form.$touch()
            if (this.$v.form.$anyError) {
                return
            }

            axios.post('http://localhost:5555/login', {
                username: this.form.user,
                password: this.form.password
            })
            .then(response => {
                const user = response.data.username
                const id = response.data.userID
                const role = response.data.role
                const name = response.data.name
                
                this.$store.commit('login', {
                    userId: id,
                    user: user,
                    userRole: role,
                    userName: name
                })
                
                this.$router.push({ name: "home" })
            })
            .catch(() => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Usuario o contraseña incorrectos',
                    confirmButtonColor: '#3498db'
                })
                this.form.user = ''
                this.form.password = ''
            })
        },
        register: function(){
            this.$router.push({ name: "register" })
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

.login-form {
    width: 360px;
    background: #f1f1f1;
    height: 530px;
    padding: 65px 40px;
    border-radius: 10px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}

.login-form h1 {
    text-align: center;
    font-weight: bold;
    margin-bottom: 40px;
    color: black;
}

.txtb {
    text-align: left;
    border-bottom: 2px solid #adadad;
    position: relative;
    margin: 30px 0;
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
    height: 40px;
}

.logbtn{
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

.logbtn:hover{
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