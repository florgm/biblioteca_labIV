import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        loggedIn: false,
        userId: null,
        username: null,
        name: null,
        role: null,
        bookId: null,
    },
    plugins: [createPersistedState()],
    mutations: {
        login (state,user){
            state.loggedIn = true;
            state.userId = user.userId;
            state.username = user.user;
            state.name = user.userName;
            state.role = user.userRole;
        },
        logout (state){
            state.loggedIn = false;
            state.userId = null;
            state.username = null;
            state.name = null;
            state.role = null;
        },
        newloan (state,book) {
            state.bookId = book.bookId;
        }
    }
})