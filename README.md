<!--
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-07-09 00:38:32
 * @LastEditTime: 2020-12-04 18:05:49
 * @description:
-->

# numberProc.js

## javascript 数字运算, 大数/小数，数字精度

numberProc.js 是 javascript basic 运算库，解决数字运算精度和 js 能表示的最大/最小数字问题,支持浏览器或 nodejs 环境使用。

html script 直接引入使用

```javascript
<script type="text/javascript" src="./numberProc.js"></script>
```

模块化引用

```javascript
import numberProc from "./numberProc-es";
```

nodejs 引用

```javascript
const numberProc = require("./numberProc-es.js");
```

基本方法

```javascript
numberProc.add(0.1, 0.2); //加法
numberProc.sub(0.1, 0.2); //减法
numberProc.mul(0.1, 0.2); //乘法
numberProc.div(0.1, 0.2); //除法
numberProc.eval("0.1+0.2+(0.7-0.6)+12.2*3+0.3/0.1"); //混合运算
```

支持多参数运算如 numberProc.add(0.1,0.2,0.3,....);
支持字符串运算如 numberProc.add('10.20',10) or numberProc.add('10.20','10');
该方法类，使用两数相比个位独立运算，所以不存在精度丢失情况,亦最大值和最小值也能表示。

###注意!
请不要直接用结果进行原生运算,如 numberProc.add(0.1, 0.2)+1;结果为 1.3 乍一看没什么问题，但是如果换成 numberProc.add(9007199254740991,1)+1,结果为 9007199254740992,运算结果超过最大数或最小数这样计算就会出现该问题,而且方法类提供了所有基础运算，你用不着原生和方法混用,你可以用 numberProc.add(9007199254740991,1,1) or numberProc.eval('9007199254740991+1+1')来表示,如果你需要计算的数字本身就超过了 js 的安全值范围你可以用字符串的形式来运算,如 9007199254740993 这个数字本身已经超过 js 的安全值 你可以这样 numberProc.add('9007199254740993',1,1)。

### License

[MIT](https://opensource.org/licenses/MIT)
