import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//创建store对象
export default new Vuex.Store({
    state: {
        
        //如果本地浏览器有登录信息就直接获取
        user: {
        	//默认是空
            account: "",
        },
        
    },
    
    //方法
    mutations: {
        //成功登录才会进来这里
        loginSucess (state, account) {
            //先把登录信息放进store.state的状态变量中方便后面调用
            state.user.account = account
            //把登录信息放进localStorage，让vue放进浏览器cookie中
            window.localStorage.setItem('account',account)
        },
        //用来改变account的值的方法
        //外界只能通过该方法更改account的值
        initAccount(state, account){
			state.user.account = account
		}
    }
    
})