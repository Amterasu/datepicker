基于vue2.x的手机端日期选择插件
---------------
实际需求中总会有一些轮子是需要自己造的，比如现在说的这个时间选择插件，在网上找了好多都和UI的交互需求差一点，做完后发出来分享一下吧，如果觉得不错或者帮到你了请记得star

具体是这个样子的：
---------
![图片描述][1]


[demo预览点这里][2]



**手机端扫码**
![图片描述][3]

[项目地址点这里][4]

 **如何使用**

 - npm insatll
 - (如报错相关依赖没有则安装相关依赖 npm install better-scroll --save)
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


  [1]: http://kol-statics.oss-cn-beijing.aliyuncs.com/2018-04-23/103733717aa85596889296f8ba51d32d338d20.gif
  [2]: http://47.95.9.245/amDatepicker/index.html#/
  [3]: http://kol-statics.oss-cn-beijing.aliyuncs.com/editor/103519bf5cd41f3a43875778d180072a752190.png
  [4]: https://github.com/Amterasu/datepicker
