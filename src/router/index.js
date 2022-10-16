import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入 Login 组件
import Login from '@/components/Login'
// 导入 Home 组件
import Home from '@/components/Home'
// 导入 Welcome 组件
import Welcome from "@/components/Welcome"
// 导入 UserList 组件
import UserList from "@/components/admin/UserList"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        // 重定向到登录页面
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',// router-view 显示的子组件
        // 子路由
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/user',
                component: UserList
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

// 路由导航守卫
router.beforeEach(
    /**
     * 路由导航回调函数
     * @param to 将要访问
     * @param from 从哪里访问
     * @param next 重定向 URL => 为空时将会访问 to
     */
    (to, from, next) => {
        // 如果进行登录 => 放行
        if (to.path === '/login') return next()

        // 如果尚未登录 => 进行登录
        if (!window.sessionStorage.getItem('user')) return next('/login')

        // 放行
        next()
    })

export default router
