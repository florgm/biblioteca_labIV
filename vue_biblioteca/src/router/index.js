import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index';

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/Register.vue')
    },
    {
        path: '/books',
        name: 'books',
        component: () => import('../views/Books.vue'),
        meta: { authorize: [] }
    },
    {
        path: '/books/newbook',
        name: 'newbook',
        component: () => import('../views/NewBook.vue'),
        meta: { authorize: ['librarian'] }
    },
    {
        path: '/book/:bookId',
        name: 'book',
        component: () => import('../views/Book.vue'),
        meta: { authorize: ['librarian'] }
    },
    {
        path: '/loans',
        name: 'loans',
        component: () => import('../views/Loans.vue'),
        meta: { authorize: [] }
    },
    {
        path: '/loans/newloan',
        name: 'newloan',
        component: () => import('../views/NewLoan.vue'),
        meta: { authorize: ['user'] }
    },
    {
        path: '/users',
        name: 'users',
        component: () => import('../views/Users.vue'),
        meta: { authorize: ['librarian'] }
    },
    {
        path: '/404',
        name: 'notfound',
        component: () => import('../views/NotFound.vue')
    },
    {
        path: '/500',
        name: 'servererror',
        component: () => import('../views/ServerError.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
    const { authorize } = to.meta;

    console.log(authorize);

    if (authorize) {
        if (!store.state.loggedIn) {
            // not logged in so redirect to login page with the return url
            return next({ path: '/login', query: { returnUrl: to.path } });
        }

        if(store.state.role == 'L') {
            var currentUser = 'librarian';
        } else {
            var currentUser = 'user';
        }

        // check if route is restricted by role
        if (authorize.length && !authorize.includes(currentUser)) {
            // role not authorised so redirect to home page
            return next({ path: '/' });
        }
    }

    next();
});

export default router
