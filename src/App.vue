<template>
  <div id="app">
    <elm-header :seller="seller"></elm-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script>
import header from './components/header/header.vue';

export default {
   //data如果是一个对象？？？
  data() {
    return {
      seller: {}
    }
  },
  components: {
    'elm-header': header // 组件的名称不能与HTML原生标签名重复
  },
  created: function() {
    this.$http.get('/api/seller')
      .then(response => {
        let responseObj = response.body; //body属性返回一个对象
        if (responseObj.code === 0) {
          this.seller = responseObj.data;
        }
      })
      .catch(response => {
        console.log(response);
      })
      
  }
}

</script>
<style lang='less'>
@import "./common/css/mixin.less";

.tab {
  display: flex;
  height: 40px;
  line-height: 40px;
  .border-1px(rgba(7, 17, 27, 0.1));
  .tab-item {
    flex: 1; 
    text-align: center;
    a {
      display: block; 
      color: rgb(77, 85, 93);
      font-size: 14px; //text-decoration: none;
      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
}

</style>
