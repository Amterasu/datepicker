基于vue2.x的日期选择插件
---------------
实际需求中总会有一些轮子是需要自己造的，比如现在说的这个时间选择插件，在网上找了好多都和UI的交互需求差一点，做完后发出来分享一下吧，如果觉得不错或者帮到你了请记得star




[demo点击这里](http://47.95.9.245/amDatepicker/index.html#/)

 **如何使用**

 - npm install
 - npm install better-scroll -- save
 - npm run dev
 - 访问localhost
 
 
**props**

```
    showCalendar: {
      type: Boolean, //控制显示隐藏
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
      type: Boolean,//是否双选，false的话只能选择一个时间
      default: true
    }
```
**事件**
    changeDate: 选择成功后的事件 
                
事件参数：           

 1. start：开始时间
 2. end：结束时间，如果没选结束时间，则开始时间=结束时间

**注意：**
    默认使用了better-scroll（滑动体验） 和 fast-click（去除手机端点击的300ms延迟）两个依赖，都是为了让体验更加好
