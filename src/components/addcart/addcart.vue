<template>
  <div class="addcart">
    <transition name="move">
      <div class="cart-decrease icon-remove_circle" v-show="food.count>0" @click="deCart">
      </div>
    </transition>
    <span class="cart-count" v-show="food.count>0">{{food.count}}</span>
    <div class="cart-add icon-add_circle" @click="addCart"></div>
  </div>
</template>
<script>
export default {
  props: {
    food: Object
  },
  data() {
    return {}
  },
  methods: {
    addCart() {
      if (!this.food.count) {
        //当给一个对象添加一个不存在的属性时，Vue并不会实时更新到dom
        this.$set(this.food, 'count', 1); //this.food.count = 1;
      } else {
        this.food.count++;
      }
    },
    deCart() {      
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
}

</script>
<style lang='less' scoped>
.addcart {
  font-size: 0;
  .cart-decrease {
    display: inline-block;
    padding: 6px; //通过设置外层div的padding值来扩大点击区域
    font-size: 24px;
    color: rgb(0, 160, 220);
    line-height: 24px; //定义一个动画：用0.4s以linear曲线形式在X轴方向位移24px，这个过程伴随着180度的旋转
    &.move-enter-active,
    &.move-leave-active {
      //过度的状态：在一段距离上发生
      transition: all 0.3s linear; //本质上就是enter和 enter active 两个类会在第一帧同时存在于动画元素上，而后通过移除 enter 类执行动画。
      //v-enter 和 v-enter-active 同时生效的，前者在下一帧移除，后者在动画完成后移除。所以 v-enter-active 要写在前面。
    }
    &.move-enter,
    &.move-leave-to {
      //开始和结束：一帧动画，发生在一瞬间
      opacity: 0;
      transform: translate3d(24px, 0, 0) rotate(180deg); //translate3d(x,y,z)定义3D转换，用来指定元素在三维空间中的位移
    }
  }
  .cart-count {
    display: inline-block;
    vertical-align: top; //顶对齐--->垂直居中
    margin-top: 6px; //计算margin值垂直居中
    width: 12px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
    line-height: 24px;
  }
  .cart-add {
    display: inline-block;
    padding: 6px;//border:6px solid transparent;
    font-size: 24px;
    color: rgb(0, 160, 220);
    line-height: 24px;
  }
}

</style>
