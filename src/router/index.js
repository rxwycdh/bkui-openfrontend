/**
 * @file router 配置
 * @author ChenDehua <rxwychendehua@gmail.com>
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import http from '@/api'
import preload from '@/common/preload'
import auth from '@/common/auth'

Vue.use(VueRouter)

const MainEntry = () => import(/* webpackChunkName: 'entry' */'@/views')
const Login = () => import(/* webpackChunkName: 'login' */'@/views/login')
const NotFound = () => import(/* webpackChunkName: 'none' */'@/views/404')

const routes = [
    {
        path: window.PROJECT_CONFIG.SITE_URL,
        name: 'appMain',
        component: MainEntry,
        // alias: '',
        children: [

        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            verbose: '登录'
        }
    },
    // 404
    {
        path: '*',
        name: '404',
        component: NotFound
    }
]

const router = new VueRouter({
    mode: 'history',
    routes: routes
})

const cancelRequest = async () => {
    const allRequest = http.queue.get()
    const requestQueue = allRequest.filter(request => request.cancelWhenRouteChange)
    await http.cancel(requestQueue.map(request => request.requestId))
}

let preloading = true
let canceling = true
let pageMethodExecuting = true

router.beforeEach(async (to, from, next) => {
    canceling = true
    // 跳转路由之前取消掉之前的请求
    await cancelRequest()
    canceling = false
    next()
    if (to.path === '/login') {
        // 清除token
        store.commit('removeToken')
        next()
    } else {
        auth.requestCurrentUser().then(user => {}, err => {
            console.log('get user info error, redirect to login...', err)
            next('/login')
        })
    }
})

router.afterEach(async (to, from) => {
    store.commit('setMainContentLoading', true)

    preloading = true
    await preload()
    preloading = false

    const pageDataMethods = []
    const routerList = to.matched
    routerList.forEach(r => {
        Object.values(r.instances).forEach(vm => {
            if (typeof vm.fetchPageData === 'function') {
                pageDataMethods.push(vm.fetchPageData())
            }
            if (typeof vm.$options.preload === 'function') {
                pageDataMethods.push(vm.$options.preload.call(vm))
            }
        })
    })

    pageMethodExecuting = true
    await Promise.all(pageDataMethods)
    pageMethodExecuting = false

    if (!preloading && !canceling && !pageMethodExecuting) {
        store.commit('setMainContentLoading', false)
    }
})

export default router
