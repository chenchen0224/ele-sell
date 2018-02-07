<template>
  <div class="header">
    <div class="content-wrapper">
      <img :src="seller.avatar" width="64px" height="64px">
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
        <div class="support_count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="image"></span><span class="text">{{seller.bulletin}}</span>
      <i class="icon-arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <div class="detail-wrapper" v-show="isShow">
      <div class="detail-main">
        <div class="footer-add">
          <h1 class="name">{{seller.name}}</h1>
          <star :score="seller.score"></star>
          <div class="detail-title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul class="detail-supports" v-if="seller.supports">
            <li v-for="item in seller.supports" class="supports-item">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
          <div class="detail-title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="close">
        <i class="icon-close" @click="closeDetail"></i>
      </div>
    </div>
  </div>
</template>
<script>
import star from '@components/star/star.vue';

export default {
  props: ['seller'],
  data() {
    return {
      classMap: ["decrease", "discount", "special", "invoice", "guarantee"],
      isShow: false
    }
  },
  components: {
    star
  },
  methods: {
    showDetail: function() {
      this.isShow = true;
    },
    closeDetail: function() {
      this.isShow = false;
    }
  }
}

</script>
<style lang='less' scoped>
@import "../../common/css/mixin.less";

.header {
  position: relative;
  color: #fff;
  background-color: rgba(7, 17, 27, 0.5); //0.5能将底部的图片显示出来
  overflow: hidden;
  .content-wrapper {
    position: relative;
    padding: 24px 12px 18px 24px;
    font-size: 0; 
    img {
      vertical-align: top;
      border-radius: 2px;
    }
    .content {
      display: inline-block;
      margin-left: 16px;
      .title {
        margin: 2px 0 8px 0;
        .brand {
          .bg-image(30px, 18px);
          .bg-dpr('brand');
        }
        .name {
          margin-left: 6px;
          .seller-name(18px);
        }
      }
      .description {
        margin-bottom: 10px;
        font-size: 12px;
      }
      .supports {
        margin-bottom: 2px;
        .icon {
          margin-right: 4px;
          .bg-image(12px, 12px);
          .supports-icon(1);
        }
        .text {
          font-size: 10px;
          line-height: 12px;
        }
      }
      .support_count {
        position: absolute;
        right: 12px;
        bottom: 14px;
        padding: 0 8px;
        height: 24px;
        line-height: 24px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 14px;
        .count {
          margin-right: 2px;
          font-size: 10px;
        }
        .icon-arrow_right {
          font-size: 10px;
        }
      }
    }
  }
  .bulletin-wrapper {
    position: relative;
    padding: 0 22px 0 12px;
    height: 28px;
    line-height: 28px;
    background-color: rgba(7, 17, 27, 0.2); //溢出文本显示省略号的效果
    //三个样式缺一不可：不换行，超出隐藏，省略号
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; 
    .image {
      margin-top: 8px;
      .bg-image(22px, 12px);
      .bg-dpr('bulletin');
    }
    .text {
      vertical-align: top; 
      margin-left: 4px;
      font-size: 10px;
    }
    .icon-arrow_right {
      position: absolute;
      right: 12px;
      top: 8px;
      font-size: 10px;
    }
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    filter: blur(10px); //使用滤镜filter函数给图像img设置高斯模糊，可作用于子元素
  }
  .detail-wrapper {
    position: fixed; //弹窗口使用固定定位
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, 0.8);
    overflow: auto; 
    backdrop-filter: blur(10px); //仅作用于当前元素
    .detail-main {
      min-height: 100%;
      .footer-add {
        padding-bottom: 64px;
        .name {
          padding-top: 64px;
          text-align: center;
          .seller-name(16px);
        }
        .detail-supports {
          width: 80%;
          margin: 0 auto;
          .supports-item {
            padding: 0 12px;
            margin-bottom: 12px;
            font-size: 0;
            text-align: left;
            &:last-child {//选择器（:last-child）
              margin-bottom: 0;
            }
            .icon {
              margin-right: 6px;
              .bg-image(16px, 16px);
              .supports-icon(1);
            }
            .text {
              font-size: 12px;
              line-height: 16px;
            }
          }
        }
        .detail-title {
          display: flex;
          width: 80%;
          margin: 28px auto 24px auto;
          .line {
            flex: 1;
            position: relative;
            top: -6px;
            .border-1px(rgba(255, 255, 255, 0.2));
          }
          .text {
            padding: 0 12px;
            font-size: 14px;
            font-weight: bold;
            line-height: 14px;
          }
        }
        .bulletin {
          width: 80%;
          margin: 0 auto;
          .content {
            padding: 0 12px;
            font-size: 12px;
            line-height: 24px;
          }
        }
      }
    }
    .close {
      margin-top: -64px;
      text-align: center;
      font-size: 32px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
}

</style>
