<template>
  <div class="star">
    <span v-for="item in starClasses" :class="item" class="star-item"></span>
  </div>
</template>
<script>
export default {
  props: {
    score: Number
  },
  data() {
    return {

    }
  },
  computed: {
    starClasses: function() {
      let result = [];
      //对score进行格式化，使得小数位数小于0.5的都为0，大于等于0.5的都为0.5
      let formatScore = Math.floor(this.score * 2) / 2;
      //取出score的整数部分
      let integer = Math.floor(formatScore);
      for (let i = 0; i < integer; i++) {
        result.push('on');
      }
      //当score中有小数0.5时
      if (formatScore % 1 !== 0) {
        result.push('half');
      }
      //当返回的数组的长度小于满分5时
      if (result.length < 5) {
        result.push('off');
      }
      return result;
    }
  }

}

</script>
<style lang='less' scoped>
@import "../../common/css/mixin.less";

.star {
  margin-top: 16px;
  padding: 2px 0;
  font-size: 0;
  text-align: center;
  .star-item {
    margin-right: 22px;
    .bg-image(20px, 20px);
    &:last-child {
      margin-right: 0;
    }
    &.on {
      .bg-dpr('star48_on');
    }
    &.off {
      .bg-dpr('star48_off');
    }
    &.half {
      .bg-dpr('star48_half');
    }
  }
}

</style>
