import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  config: {
    navigationBarTitleText: '到余额记录',
    enablePullDownRefresh:true,
  }
}
