<template>
    <div class="wrapper">

        <bk-container margin="0" flex="true">

            <bk-row class="content-main">
                <bk-col span="24">
                    <div class="content-form">
                        <span class="font">分布式观测平台（CI/CD）</span>
                        <bk-input class="input" :clearable="true" v-model="username"></bk-input>
                        <bk-input class="input" :clearable="true" type="password" v-model="password"></bk-input>
                        <bk-button :theme="'primary'" title="登录" @click="handleClickLogin">
                            登录
                        </bk-button>
                    </div>
                </bk-col>
            </bk-row>
        </bk-container>
    </div>
</template>

<script>
    import { bkContainer, bkCol, bkRow, bkInput } from 'bk-magic-vue'
    import { mapActions, mapMutations } from 'vuex'

    export default {
        name: 'login',
        components: [bkContainer, bkCol, bkRow, bkInput],
        data () {
            return {
                username: '',
                password: ''
            }
        },
        methods: {
            ...mapActions([
                'user/login'
            ]),
            ...mapMutations([
                'setToken'
            ]),
            async handleClickLogin () {
                this.loading = true
                // 帐号登录
                const params = {
                    username: this.username,
                    password: this.password
                }
                const res = await this['user/login'](params)
                // 将token存放在cookie
                const token = res.token
                this['setToken'](token)
                this.$router.push({ name: 'appMain' })
            }
        }
    }
</script>

<style scoped>
@import "../css/wrapper.css";

.wrapper{
  width: 100vw !important;
  height: 50vh !important;
}
.content-form{
  text-align: center;
}
.content-main{
  margin-top: 50vh;
}
.input{
  width: 20rem;
  display: block;
  margin: 1rem auto;
}
.font{
  font-size: 2.5rem;
  font-family: tencentFont-W3;
}
</style>
