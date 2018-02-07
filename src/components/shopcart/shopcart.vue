<template>
  <div class="shopcart">
    <div class="cartbody" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" :class="payClass">
        {{payDesc}}
      </div>
    </div>
    <div class="ball-container">
      <div class="ball" v-for="ball in balls">
        <div class="inner"></div>
      </div>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="isShow">
        <div class="list-header">
          <h3 class="title">购物车</h3>
          <span class="clear" @click="clear">清空</span>
        </div>
        <ul class="list-content" ref="listContent">
          <li v-for="food in selectedFoods" class="food-item">
            <span class="name">{{food.name}}</span><span class="price">￥{{food.price*food.count}}</span>
            <addcart :food="food" class="addcart-list"></addcart>
          </li>
        </ul>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-mask" v-show="isShow" @click="hideList"></div>
    </transition>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import addcart from '@components/addcart/addcart';


export default {
  props: {
    selectedFoods: {
      type: Array, //当类型是Array或Object时，default就是一个函数
      default () {
        return [];
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShow: false,
      balls: [{
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }, {
        show: false
      }]
    }
  },
  components: {
    addcart
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectedFoods.forEach((food) => {
        total += food.price * food.count;
      })
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectedFoods.forEach((food) => {
        count += food.count;
      })
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        return `还差￥${this.minPrice - this.totalPrice}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    }
  },
  watch: {
    isShow: function(val) {
      if (val === true) {
        this.$nextTick(() => {
          if (!this.listContent) {
            this.listContent = new BScroll(this.$refs.listContent, {
              click: true
            });
          } else {
            this.listContent.refresh();
          }
        });
      }
    },
    totalCount: function(val) {
      if (val === 0) {
        this.isShow = false;
      }
    }
  },
  methods: {
    toggleList() {
      if (this.totalCount === 0) { //当购物车为空时，点击无效
        return;
      }
      this.isShow = !this.isShow;
    },
    clear() {
      this.selectedFoods.forEach((food) => {
        food.count = 0;
      });
    },
    hideList() {
      this.isShow = false;
    }
  }
}

</script>
<style lang='less' scoped>
@import "../../common/css/mixin.less";

.shopcart {
  // mixin
  .cart-common(@fsize) {
    font-size: @fsize;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 700;
    line-height: 24px;
  } // mixin
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 48px;
  .cartbody {
    display: flex;
    background-color: #141d27;
    .content-left {
      flex: 1;
      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        box-sizing: border-box; 
        width: 56px; 
        height: 56px;
        border-radius: 50%;
        background-color: #141d27;
        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%; 
          background-color: #2b343c;
          text-align: center;
          &.highlight {
            background-color: rgb(0, 160, 220);
          }
          .icon-shopping_cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;
            &.highlight {
              color: #fff;
            }
          }
        }
        .num {
          position: absolute;
          right: 0;
          top: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          font-size: 9px;
          color: #fff;
          font-weight: 700;
          background-color: rgb(240, 20, 20);
          border-radius: 16px;
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4)
        }
      }
      .price {
        display: inline-block;
        margin-top: 12px; 
        padding-right: 12px;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        .cart-common(16px);
        &.highlight {
          color: #fff;
        }
      }
      .desc {
        display: inline-block;
        padding: 12px 0 0 12px;
        .cart-common(10px);
      }
    }
    .content-right {
      flex: 0 0 105px;
      width: 105px;
      box-sizing: border-box;
      padding: 12px 8px 0 8px;
      text-align: center;
      .cart-common(12px);
      &.not-enough {
        background-color: #2b333b;
      }
      &.enough {
        color: #fff;
        font-size: 16px;
        background-color: #00b43c
      }
    }
  }
  .ball-container {
    .ball {
      position: fixed;
      left: 32px;
      bottom: 22px;
      z-index: 200;
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
      }
    }
  }
  .shopcart-list {
    position: absolute;
    bottom: 48px;
    left: 0;
    width: 100%;
    z-index: -1;
    &.fold-enter-active,
    &.fold-leave-active {
      transition: all 0.5s;
    }
    &.fold-enter,
    &.fold-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    .list-header {
      overflow: hidden;
      padding: 0 18px;
      height: 40px;
      line-height: 40px;
      background: #f3f5f7;
      .border-1px(rgba(7, 17, 27, 0.1));
      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .clear {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }
    .list-content {
      padding: 0 18px 12px 18px;
      background: #fff;
      max-height: 217px; 
      overflow: hidden; 
      .food-item {
        position: relative;
        padding: 12px 0; 
        box-sizing: border-box; 
        height: 48px;
        .border-1px(rgba(7, 17, 27, 0.1));
        .name {
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 24px;
        }
        .price {
          position: absolute;
          top: 12px;
          right: 96px;
          font-size: 14px;
          color: #f01414;
          font-weight: 700;
          line-height: 24px;
        }
        .addcart-list {
          position: absolute;
          top: 6px;
          right: 0;
        }
      }
    }
  }
  .list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
}

</style>
