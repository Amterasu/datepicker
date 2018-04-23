<template>
  <div>
    <div class="mu-text-field">
      <div class="mu-text-field-content">
        <input class="mu-text-field-input" placeholder="只选择一个" @click="showdateSingle = true" v-model="showSingle" readonly="readonly">
        <div><hr class="mu-text-field-line"> <hr class="mu-text-field-focus-line"></div>
      </div>
    </div>

    <div class="mu-text-field">
      <div class="mu-text-field-content">
        <input class="mu-text-field-input" placeholder="选择开始和结束" @click="showdateDouble = true" v-model="showDouble" readonly="readonly">
        <div><hr class="mu-text-field-line"> <hr class="mu-text-field-focus-line"></div>
      </div>
    </div>
    <date :showCalendar.sync='showdateSingle' maxDate="12m" :options="dateOptionsSingle" @changeDate="changeDateSingle"></date>
    <date :showCalendar.sync='showdateDouble' maxDate="12m" :options="dateOptionsDouble" @changeDate="changeDateDouble"></date>
  </div>

</template>

<script>
import date from "./datepicker/datePicker";
import FastClick from 'fastclick'
FastClick.attach(document.body);
export default {
  data() {
    return {
      showdateSingle: false,
      showdateDouble: false,
      single: "",
      double: "",
      startSingle: "",
      startDouble: "",
      endDouble: "",
      dateOptionsDouble: {
        // scrollEnd: true, // 滚到最后
        start: "2018-01-01",
        maxDate: "24m", // 月份跨度
        isDoubleCheck: true,
        // startDate: this.formatDate(new Date().getTime())
      },
      dateOptionsSingle: {
        // scrollEnd: true, // 滚到最后
        start: "2018-01-01",
        maxDate: "24m", // 月份跨度
        isDoubleCheck: false,
        // startDate: this.formatDate(new Date().getTime())
      }
    };
  },
  computed: {
    showSingle() {
      return this.startSingle;
    },
    showDouble() {
      if(this.startDouble && this.endDouble){
        return this.startDouble + "至" + this.endDouble;
      }else if (this.startDouble && !this.endDouble){
        return this.startDouble
      }
      else{
        return ''
      }
    }
  },
  components: {
    date
  },
  methods: {
    changeDateSingle(start, end) {
      this.startSingle = start;
    },
    changeDateDouble(start, end) {
      this.startDouble = start;
      this.endDouble = end;
    },
    formatDate(timestamp, formats) {
      formats = formats || "Y-M-D";
      var myDate = timestamp ? new Date(timestamp) : new Date();
      var year = myDate.getFullYear();
      var month = formatDigit(myDate.getMonth() + 1);
      var day = formatDigit(myDate.getDate());
      var hour = formatDigit(myDate.getHours());
      var minute = formatDigit(myDate.getMinutes());
      var second = formatDigit(myDate.getSeconds());
      return formats.replace(/Y|M|D|h|m|s/g, function(matches) {
        return {
          Y: year,
          M: month,
          D: day,
          h: hour,
          m: minute,
          s: second
        }[matches];
      });
      // 小于10补0
      function formatDigit(n) {
        return n.toString().replace(/^(\d)$/, "0$1");
      }
    }
  }
};
</script>

<style scoped>
.mu-text-field {
  font-size: 16px;
  width: 256px;
  min-height: 48px;
  display: inline-block;
  position: relative;
  color: rgba(0, 0, 0, 0.54);
  margin-bottom: 8px;
}

.mu-text-field.full-width {
  width: 100%;
}

.mu-text-field.has-icon {
  padding-left: 56px;
}

.mu-text-field.focus-state {
  color: #7e57c2;
}

.mu-text-field.focus-state.error {
  color: #f44336;
}

.mu-text-field.has-label {
  min-height: 72px;
}

.mu-text-field-icon {
  position: absolute;
  left: 16px;
  top: 12px;
}

.mu-text-field.has-label .mu-text-field-icon {
  top: 36px;
}

.mu-text-field-content {
  display: block;
  height: 100%;
  padding-bottom: 12px;
  padding-top: 4px;
}

.mu-text-field.disabled .mu-text-field-content {
  color: rgba(0, 0, 0, 0.38);
  cursor: not-allowed;
}

.mu-text-field.has-label .mu-text-field-content {
  padding-top: 28px;
  padding-bottom: 12px;
}

.mu-text-field-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  border: none;
  background: none;
  border-radius: 0 0 0 0;
  box-shadow: none;
  display: block;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 32px;
  font-style: inherit;
  font-variant: inherit;
  font-weight: inherit;
  font-stretch: inherit;
  font-size: inherit;
  color: rgba(0, 0, 0, 0.87);
  font-family: inherit;
  position: relative;
}

.mu-text-field-help {
  position: absolute;
  margin-top: 6px;
  font-size: 12px;
  line-height: 12px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  -ms-flex-pack: justify;
  justify-content: space-between;
  left: 0;
  right: 0;
}

.mu-text-field.has-icon .mu-text-field-help {
  left: 56px;
}

.mu-text-field.error .mu-text-field-help {
  color: #f44336;
}

.mu-text-field.disabled .mu-text-field-help {
  color: inherit;
}

.mu-text-field-line {
  margin: 0;
  height: 1px;
  border: none;
  background-color: rgba(0, 0, 0, 0.12);
  left: 0;
  right: 0;
  position: absolute;
}

.mu-text-field.has-icon .mu-text-field-line {
  left: 56px;
}

.mu-text-field-line.disabled {
  height: auto;
  background-color: transparent;
  border-bottom: 2px dotted rgba(0, 0, 0, 0.38);
}

.mu-text-field-focus-line {
  margin: 0;
  height: 2px;
  border: none;
  background-color: #7e57c2;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: -1px;
  -webkit-transform: scaleX(0);
  -ms-transform: scaleX(0);
  transform: scaleX(0);
  -webkit-transition: -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  transition: -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  transition: transform 0.45s cubic-bezier(0.23, 1, 0.32, 1),
    -webkit-transform 0.45s cubic-bezier(0.23, 1, 0.32, 1);
}

.mu-text-field.has-icon .mu-text-field-focus-line {
  left: 56px;
}

.mu-text-field-focus-line.error,
.mu-text-field-focus-line.focus {
  -webkit-transform: scaleX(1);
  -ms-transform: scaleX(1);
  transform: scaleX(1);
}

.mu-text-field-focus-line.error {
  background-color: #f44336;
}

.mu-text-field-textarea {
  resize: vertical;
  line-height: 1.5;
  position: relative;
  height: 100%;
  resize: none;
}

.mu-text-field-multiline {
  width: 100%;
  position: relative;
}

.mu-text-field-textarea-hide {
  width: 100%;
  height: auto;
  resize: none;
  position: absolute;
  padding: 0;
  overflow: auto;
  visibility: hidden;
}

.mu-text-field-label {
  line-height: 20px;
  -webkit-transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1;
  cursor: text;
  -webkit-transform: translateZ(0) scale(0.75);
  transform: translateZ(0) scale(0.75);
  -webkit-transform-origin: left top;
  -ms-transform-origin: left top;
  transform-origin: left top;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.mu-text-field.has-label .mu-text-field-label {
  top: 8px;
  position: absolute;
}

.mu-text-field.has-label .mu-text-field-label.float {
  -webkit-transform: translate3d(0, 28px, 0) scale(1);
  transform: translate3d(0, 28px, 0) scale(1);
  color: rgba(0, 0, 0, 0.38);
}

.mu-text-field-hint {
  position: absolute;
  opacity: 0;
  -webkit-transition: opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  transition: opacity 0.45s cubic-bezier(0.23, 1, 0.32, 1);
  color: rgba(0, 0, 0, 0.38);
  line-height: 34px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: text;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}

.mu-text-field-hint.show {
  opacity: 1;
}

.mu-text-field.multi-line .mu-text-field-hint {
  line-height: 1.5;
}

.mu-select-field .mu-dropDown-menu {
  display: block;
  width: 100%;
  height: 32px;
}

.mu-select-field .mu-dropDown-menu-text {
  line-height: 32px;
  height: 32px;
  padding-left: 0;
  padding-right: 24px;
  word-wrap: break-word;
  overflow: hidden;
}

.mu-select-field .mu-dropDown-menu-line {
  display: none;
}

.mu-select-field .mu-dropDown-menu-icon {
  right: 0;
  top: 6px;
}
</style>
