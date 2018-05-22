import Vue from 'vue'
import App from './App'
import store from './store'
// import Mint from 'mint-ui';
// import 'mint-ui/lib/style.css'
// Vue.use(Mint);
import '@/utils/scss/global.scss';

Vue.config.productionTip = false
App.mpType = 'app'

Vue.prototype.$store = store; 

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['pages/index/main','pages/fenxiao/main', '^pages/me/main','pages/address/main','pages/pay/main','pages/loginFenxiao/main','pages/detail/main','pages/order/main','pages/selectAdd/main','pages/chongzhi/main','pages/chongzhiDetail/main','pages/tixian/main','pages/tixianlc/main','pages/tixianDetail/main','pages/orderList/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor:"#cb2620",
      navigationBarTitleText:"华泽健康",
      navigationBarTextStyle: 'white',
      backgroundColor:'#eeeeee'
    },
    tabBar: {
      color:'#3a3a3a',
      selectedColor:'#E05b65',
      borderStyle:'white',
      backgroundColor:'#ffffff',
      list: [{
        pagePath: "pages/index/main",
        iconPath:'static/images/index.png',
        selectedIconPath:'static/images/selected-index.png',
        text: "首页"
      }, {
        pagePath: "pages/fenxiao/main",
        iconPath:'static/images/fx.png',
        selectedIconPath:'static/images/selected-fx.png',
        text: "分销"
      }, {
        pagePath: "pages/me/main",
        iconPath:'static/images/me.png',
        selectedIconPath:'static/images/selected-me.png',
        text: "我的"
      }]
    },
  },
}
