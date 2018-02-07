<template>
  <div class="goods">
    <!-- 左侧菜单 -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <!-- better-scroll父容器的第一个子元素滚动，所以ul的外层要套一个div -->
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index,$event)" ref="menuList">
          <!-- ref被用于给元素或子组件注册引用信息，引用指向的是DOM 元素或者组件实例 -->
          <!-- this.$refs.变量来访问引用 -->
          <span class="text">
            <span class="icon" :class="classMap[item.type]" v-if="item.type>=0"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <!-- 右侧食物列表 -->
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" ref="goodList">
          <!-- 当ref和v-for一起使用时，获取到的引用是一个数组 -->
          <h1 class="title">{{item.name}}</h1>
          <ul class="food-ul">
            <li v-for="food in item.foods" class="food-li">
              <img :src="food.icon" width="57px" height="57px" class="icon">
              <div class="content">
                <h2 class="food-name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="stat">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span>￥{{food.price}}</span>
                  <span v-if="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <addcart class="addcart-goods" :food="food"></addcart>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :selectedFoods="selectedFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import shopcart from '@components/shopcart/shopcart.vue';
import addcart from '@components/addcart/addcart.vue';

export default {
  props: {
    seller: Object
  },
  data() {
    return {
      goods: [],
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      listHeight: [], //用于存放good高度的累加值
      scrollY: 0
    }
  },
  components: {
    shopcart,
    addcart
  },
  created: function() {
    this.$http.get('/api/goods')
      .then(response => {
        let responseObj = response.body; //body属性返回一个对象
        if (responseObj.code === 0) {
          this.goods = responseObj.data;
          //vue更新dom是异步的。也就是说，当你更改了一个响应式数据时，dom并不会立即重新渲染。数据更改触发dom更新的流程是：数据更改-->执行完其它同步命令-->dom更新。因此，在数据更改后试图立即操作更新后的DOM会失败。
          //使用this.$nextTick(callback)，在数据更改后立刻执行其中的回调函数，保证将要获取的dom已经被渲染。
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      })
      .catch(response => {
        console.log(response);
      })
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let top = this.listHeight[i];
        let bottom = this.listHeight[i + 1];
        if (!bottom || (this.scrollY >= top && this.scrollY < bottom)) {
          this._followScroll(i);
          return i;
        }
      }
      return 0;
    },
    selectedFoods() { //当goods发生变化（点击引起food.count变化）时，计算属性selectFoods会重新计算一遍
      let foodsArr = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foodsArr.push(food);
          }
        })
      })
      return foodsArr;
    }
  },
  methods: {
    //初始化滚动条
    _initScroll() {
      //better-scroll对外暴露了一个BScroll的类，初始化只需要new一个实例
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true //better-scroll默认派发一个点击事件，会带来一个问题：PC端会派发两个点击事件，多了dom原生的点击事件
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true, //用于cartcontrol点击加号可以增加food.count数量
        probeType: 3 //相当于一个探针，当scroll滚动时，实施探测滚动的位置
      });
      // 绑定scroll监听
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y)); //四舍五入，取绝对值
      })
    },
    _calculateHeight() {
      let goodList = this.$refs.goodList;
      let height = 0;
      this.listHeight.push(height);
      for (let item of goodList) {
        height += item.clientHeight; //客户区大小clientHeight = content + padding
        this.listHeight.push(height);
      }
    },
    _followScroll(index) {
      let menuList = this.$refs.menuList;
      let el = menuList[index];
      this.menuScroll.scrollToElement(el, 300, 0, -100); //scrollToElement(el, time, offsetX, offsetY, easing),offsetX,offsetY定义偏移，因此滚动到一个元素的时候加上这个偏移量。
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        //better-scroll派发的点击事件具有属性_constructed:true，原生点击事件没有这个属性
        return;
      }
      let goodList = this.$refs.goodList;
      let el = goodList[index];
      this.foodsScroll.scrollToElement(el, 300);
      console.log(index, this.currentIndex);
    }
  }
}

</script>
<style lang='less' scoped>
@import "../../common/css/mixin.less";

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 48px;
  width: 100%;
  overflow: hidden;
  .menu-wrapper {
    flex: 0 0 80px;
    background: #f3f5f7;
    .menu-item {
      display: table; //垂直居中设置块级元素li
      padding: 0 12px;
      height: 54px;
      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px; //margin负值
        background: #fff;
        .text {
          .border-none();
        }
      }
      .text {
        display: table-cell; //垂直居中设置span为表格单元显示
        vertical-align: middle; //在table中垂直居中，并不支持IE6、7
        width: 56px;
        .border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
        line-height: 14px;
        .icon {
          margin-right: 2px;
          position: relative;
          top: 2px;
          .bg-image(12px, 12px);
          .supports-icon(3);
        }
      }
    }
  }
  .foods-wrapper {
    flex: 1;
    .title {
      padding-left: 12px;
      text-align: left;
      height: 26px;
      line-height: 26px;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
      border-left: 3px solid #d9dde1;
    }
    .food-ul {
      padding: 0 18px;
      .food-li {
        display: flex;
        padding: 18px;
        box-sizing: border-box; //margin: 18px;
        //padding-bottom: 18px; //解决margin重叠
        font-size: 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          //margin-bottom: 0; //解决margin重叠
          .border-none();
        }
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          display: inline-block;
          flex: 1;
          .food-name {
            margin: 2px 0 8px 0;
            font-size: 14px;
            color: rgb(7, 17, 27);
            line-height: 14px;
          }
          .desc,
          .stat {
            margin-bottom: 8px;
            font-size: 10px;
            color: rgb(147, 153, 159);
            line-height: 10px;
          }
          .count {
            margin-right: 12px;
          }
          .price {
            font-size: 14px;
            color: rgb(240, 20, 20);
            font-weight: 700;
            line-height: 24px;
            .old {
              font-size: 10px;
              margin-left: 8px;
              color: rgb(147, 153, 159);
              text-decoration: line-through; //给文本添加中划线
            }
          }
          .addcart-goods {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
}

</style>
