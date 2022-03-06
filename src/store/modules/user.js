/**
 * @file app store
 * @author ChenDehua <rxwychendehua@gmail.com>
 */

import http from '@/api'

export default {
    name: 'user',
    namespaced: true,
    state: {
    },
    mutations: {
    },
    actions: {
        /**
         * 用户登录
         */
        login ({ commit, state, dispatch }, params) {
            return http.post(`/user/v1/login`, params)
        }
    }
}
