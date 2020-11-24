# numberProc.js

## javascript 数字运算, 大数/小数，数字精度

numberProc.js是javascript basic运算库，解决数字运算精度和js能表示的最大/最小数字问题,支持浏览器或nodejs环境使用。

html script直接引入使用
```javascript
<script type="text/javascript" src="./numberProc.js"></script>
```
模块化引用
```javascript
import numberProc from "./numberProc-es"
```
nodejs引用
```javascript
const numberProc = require('./numberProc-es.js')
```


基本方法
```javascript
 numberProc.add(0.1,0.2); //加法
 numberProc.sub(0.1,0.2); //减法
 numberProc.mul(0.1,0.2); //乘法
 numberProc.div(0.1,0.2); //除法
 numberProc.eval('0.1+0.2+(0.7-0.6)+12.2*3+0.3/0.1'); //混合运算
 
```

支持多参数运算如 numberProc.add(0.1,0.2,0.3,....);
支持字符串运算如 numberProc.add('10.20',10) or numberProc.add('10.20','10');
该方法类，使用两数相比个位独立运算，所以不存在精度丢失情况,亦最大值和最小值也能表示。



### License

[MIT](https://opensource.org/licenses/MIT)
