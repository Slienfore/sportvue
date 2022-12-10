import Vue from 'vue'
// 导入主页面
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 由于 该 CSS 作用于区全局 => 所以需要添加到全局样式中
import './assets/global.css'
// 图标
import './assets/iconfont/iconfont.css'
// 导入 axios 依赖
import axios from 'axios'

// 挂载 axios
Vue.prototype.$http = axios// 由于 VueComponent 与 Vue 实例共享一个 prototype 对象, 挂载此处能够 被 VueComponent 访问
// 设置 axios 访问根路径
axios.defaults.baseURL = 'http://localhost:9090'// 为方便与后端联调, 修改端口号

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
