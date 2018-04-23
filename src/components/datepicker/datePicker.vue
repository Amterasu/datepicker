
<template>
  <!-- 时间选择组件
amterasu
2018-3-13 -->
  <div class="am-calendar">
    <transition name="am-calendar-mask">
      <div class="am-calendar-backdrop" @click="successCallback" v-show="showCalendar"></div>
    </transition>
    <transition name="am-calendar-content">
      <div class="am-calendar-content am-calendar-content-transition" v-show="showCalendar" ref="amCalendar">
        <div class="am-calendar-title">
          <span class="close" @click="closeCalendar">
            <span class="iconfont icon-xdn-data-close-big">关闭</span>
          </span>
          <span class="title">选择日期</span>
          <span class="button" @click="successCallback">确认</span>
        </div>
        <div class="am-calendar-week-bar">
          <span class="weekend">日</span>
          <span>一</span>
          <span>二</span>
          <span>三</span>
          <span>四</span>
          <span>五</span>
          <span class="weekend">六</span>
        </div>
        <div class="month-bar-fixed" id="fixedBarEle" ref="fixedBar" :style="{'opacity': fixedBarOpacity}">{{ fixedMonthbar }}</div>
        <div class="scroll-panel-wrapper" id="scroll-panel-wrapper" ref="scroll">
          <div class="scroll-date-wrapper" id="scroll-panel">
            <div class="month-panel" v-for="(item, index) of date" :key="index" :data-index="index" ref="months">
              <div class="month-bar">{{ item.month }}</div>
              <ul class="month-list-item">
                <li @click.stop="selectedFunc" v-for="(day, index) of item.days" :key="index" :data-sec="new Date(day).getTime() || ''" :data-date-format="day | convertDateFormatValue" :class="{
                    'selected-start': isStartDate == new Date(day).getTime(),
                    'selected-end': isEndDate == new Date(day).getTime(),
                    'selected-line': isStartDate < new Date(day).getTime() && new Date(day).getTime() < isEndDate,
                    'disabled': disabled(new Date(day).getTime())
                  }">
                  <span>{{ day | convertDateFormatDay }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import util from "./util";
import BScroll from "better-scroll";
export default {
  props: {
    showCalendar: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default() {
        return {
          start: "", // 开始日期
          end: "", // 结束日期
          maxDate: "12m", // 月份跨度
          startDate: "", // 默认选中的开始日期,
          endDate: "" // 默认选中的结束日期
        };
      }
    },
    isDoubleCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      date: util.getAllPanelData(this.options),
      todaySec: util.getTodaySec(),
      isStartDate: util.dateConvertSec(this.options.startDate),
      isEndDate: util.dateConvertSec(this.options.endDate),
      fixedBarOpacity: 1,
      fixedMonthbar: ""
    };
  },
  created() {
    if (this.isStartDate === this.isEndDate) {
      this.isEndDate = 0;
    }
  },
  methods: {
    closeCalendar() {
      this.$emit("update:showCalendar", false);
    },
    selectedFunc(event) {
      const currentTarget = event.currentTarget;
      if (currentTarget.classList.contains("disabled")) return;
      let sec = Number(currentTarget.dataset.sec);
      if (this.options.isDoubleCheck) {
        if (this.isStartDate) {
          if (this.isEndDate) {
            this.isStartDate = sec;
            this.isEndDate = "";
          } else {
            if (this.isStartDate === sec) {
              this.isStartDate = sec;
              return;
            }
            if (sec < this.isStartDate) {
              [this.isStartDate, this.isEndDate] = [sec, this.isStartDate];
            } else {
              this.isEndDate = sec;
            }
          }
        } else {
          this.isStartDate = sec;
        }
      } else {
        this.isStartDate = sec;
      }
    },
    successCallback() {
      let start = this.isStartDate
        ? util.dateFormat("yyyy-MM-dd", new Date(this.isStartDate))
        : undefined;
      let end = this.isEndDate
        ? util.dateFormat("yyyy-MM-dd", new Date(this.isEndDate))
        : start;
      this.$emit("changeDate", start, end);
      this.$emit("update:showCalendar", false);
    },
    disabled(val) {
      if (this.options.start && this.options.end) {
        return (
          val < util.dateConvertSec(this.options.start) ||
          val > util.dateConvertSec(this.options.end)
        );
      }
      if (this.options.start && this.options.maxDate && !this.options.end) {
        return val < util.dateConvertSec(this.options.start);
      }
      return val < this.todaySec;
    }
  },
  mounted() {
    this.$watch("showCalendar", val => {
      if (val) {
        this.$nextTick(() => {
          this.$refs.amCalendar.addEventListener(
            "touchmove",
            function(ev) {
              ev.preventDefault();
            },
            false
          );
          let months = this.$refs.months;
          let panelHeightArr = [];
          this.fixedMonthbar = this.date[0].month;
          for (let i = 0; i < months.length; i++) {
            panelHeightArr.push(months[i].clientHeight);
          }
          let panelAbsPosi = [];
          let tmpArr = [];
          for (let i = 0; i < panelHeightArr.length; i++) {
            tmpArr.push(panelHeightArr[i]);
            panelAbsPosi[i] = tmpArr.reduce((a, b) => {
              return a + b;
            });
          }
          this.scroll = new BScroll(this.$refs.scroll, {
            probeType: 3,
            preventDefault: false
          });
          if (this.options.scrollEnd) {
            this.fixedMonthbar = this.date[this.date.length - 1].month;
            this.scroll.scrollTo(0, -panelAbsPosi[panelHeightArr.length - 2]);
          }
          this.scroll.on("scroll", pos => {
            fixedBar(this, panelAbsPosi, pos);
          });
        });
      } else {
        this.scroll.destroy();
      }
    });

    function fixedBar(scope, panelAbsPosi, pos) {
      if (pos.y > 0) {
        scope.fixedBarOpacity = 0;
      } else {
        scope.fixedBarOpacity = 1;
        scope.$refs.fixedBar.style.transform = "translate(0, 0)";
      }
      let y = Math.abs(pos.y || 0);
      if (y === 0) {
        scope.$refs.fixedBar.style.WebkitTransform = "translate(0, 0)";
        scope.$refs.fixedBar.style.transform = "translate(0, 0)";
      }
      let fixedBarHeight = scope.$refs.fixedBar.clientHeight;
      for (let i = 0; i < panelAbsPosi.length; i++) {
        if (
          y > panelAbsPosi[i] - fixedBarHeight &&
          y < panelAbsPosi[i + 1] - fixedBarHeight
        ) {
          let heightDiffer = panelAbsPosi[i] - fixedBarHeight;
          if (y >= heightDiffer && y - heightDiffer <= fixedBarHeight) {
            scope.$refs.fixedBar.style.WebkitTransform =
              "translate(0," + (heightDiffer - y) + "px)";
            scope.$refs.fixedBar.style.transform =
              "translate(0," + (heightDiffer - y) + "px)";
            scope.panelState = i;
          } else if (y - heightDiffer > fixedBarHeight) {
            scope.$refs.fixedBar.style.WebkitTransform = "translate(0, 0)";
            scope.$refs.fixedBar.style.transform = "translate(0, 0)";
            scope.panelState = i + 1;
          }
        }
      }
      if (y < panelAbsPosi[0] - fixedBarHeight) {
        scope.panelState = 0;
      }
      scope.fixedMonthbar = scope.date[scope.panelState].month;
    }
  },
  filters: {
    convertDateFormatDay(val) {
      if (val !== "") {
        return new Date(val).getDate();
      } else {
        return "";
      }
    },
    convertDateFormatValue(date) {
      if (date !== "") {
        return util.dateFormat("yyyy-MM-dd", date);
      } else {
        return "";
      }
    }
  }
};
</script>

<style  scoped>
.am-calendar-mask-enter,
.am-calendar-mask-leave-to {
  opacity: 0;
}
.am-calendar-enter-active,
.am-calendar-leave-active {
  transition: opacity 0.4s ease;
}
.am-calendar-content-enter-active {
  animation: bounce-in 0.4s;
}
.am-calendar-content-leave-active {
  animation: bounce-out 0.4s;
}
@keyframes bounce-in {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
@keyframes bounce-out {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
}
.am-calendar-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.am-calendar-content {
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  overflow: hidden;
  z-index: 1000;
  color: #333;
  user-select: none;
  transform: translateY(0);
}

.am-calendar-title {
  background-color: #fafafa;
  position: relative;
  line-height: 120px;
  text-align: center;
  z-index: 1001;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  max-height: 48px;
  font-size: 16px;
}
.am-calendar-title .button {
  color: #7e57c2;
  font-size: 16px;
  margin-right: 15px;
}
.am-calendar-title .close {
  color: #7e57c2;
  font-size: 16px;
  margin-left: 15px;
}
.am-calendar-week-bar {
  background-color: #fafafa;
  position: relative;
  height: 46.75px;
  line-height: 46.75px;
  display: flex;
  z-index: 1001;
  border-bottom: 1px solid #d9d9d9;
}
.am-calendar-week-bar > span {
  flex: 1;
  text-align: center;
  color: #9aaec1;
  font-size: 12px;
}
.month-bar-fixed {
  overflow: visible;
  text-align: center;
  height: 52px;
  line-height: 54px;
  width: 100%;
  position: fixed;
  top: 94px;
  background-color: #fff;
  z-index: 1000;
  border-bottom: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
}
.scroll-panel-wrapper {
  position: relative;
  overflow: hidden;
  height: calc(100% - 96px);
}
.scroll-date-wrapper {
  transform: translateZ(0);
}
.month-bar {
  text-align: center;
  height: 50.67px;
  line-height: 50.67px;
  width: 100%;
  position: relative;
  background: #fff;
  border-bottom: 1px solid #d9d9d9;
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  font-weight: 500;
}
.month-list-item {
  overflow: hidden;
  padding: 0;
  margin: 0;
  list-style: none;
  margin: 5px;
}
.month-list-item li {
  float: left;
  width: 14.286%;
  text-align: center;
  position: relative;
  color: #333;
  list-style: none;
  position: relative;
}
.month-list-item li.disabled {
  color: #a2a2a2;
}
.month-list-item li span {
  display: block;
  height: 33.11px;
  line-height: 33.11px;
  box-sizing: border-box;
  width: 100%;
  font-size: 12px;
  font-weight: 400;
  position: relative;
  z-index: 2;
}
.month-list-item li.selected-start span,
.month-list-item li.selected-end span {
  color: #fff;
  background-color: #7e57c2;
  border-radius: 2px;
}
.month-list-item li.selected-line {
  background-color: #f3f3f3;
}
</style>