import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
        "navigationBarTitleText": "我的推广",
        navigationBarBackgroundColor:"#569340",
        usingComponents:{
            "van-button":"../../vant/button/index",
            "van-popup": "../../vant/popup/index"
        }
    }
}