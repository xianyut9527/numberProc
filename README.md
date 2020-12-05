<!--
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-07-09 00:38:32
 * @LastEditTime: 2020-12-06 02:26:49
 * @description:
-->

# numberProc.js

## javascript 数字运算, 大数/小数，数字精度

numberProc.js 是 javascript basic 运算库，解决数字运算精度和 js 能表示的最大/最小数字问题,支持浏览器或 node 环境使用。

html script 直接引入使用

```javascript
<script type="text/javascript" src="./numberProc.js"></script>
```

模块化引用

```javascript
import numberProc from "./numberProc-es.js";
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

API

|    方法     |   参数类型    |         示例         |                                                                     说明                                                                      |
| :---------: | :-----------: | :------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|     add     | number/string |   add(0.1,0.2,...)   |                                                                     加法                                                                      |
|     sub     | number/string |   sub(0.1,0.2,...)   |                                                                     减法                                                                      |
|     mul     | number/string |   mul(0.1,0.2,...)   |                                                                     乘法                                                                      |
|     div     | number/string |   div(0.1,0.2,...)   |                                                                     除法                                                                      |
|    round    | number/string |   round(1.33333,2)   |                    四舍五入,参数 A 为需要四舍五入的数据。参数 B 为保留多少位小数,不填写默认保留零位小数,类似与 Math.round                     |
| compareSize |    string     | compareSize('1','2') | '1'是否大于'2'(由于 number 类型大小比较原生已具有，再者超出 js 最大或最小表示数字,number 类型也无法正常表示,所以该方法只接收字符串类型的数字) |

### 注意!

请不要直接用结果进行原生运算,如 numberProc.add(0.1, 0.2)+1,为了避让 js 安全值,方法类提供了所有基础运算方法,你用不着原生和方法混用,你可以用 numberProc.add(0.1,0.2,1)或者 numberProc.eval('0.1+0.2+1')来表示,如果你还有其他问题，可以提交 iss 或者联系我。

### 结尾

之前使用的 math.js 作为项目的计算方法库,但我只需要基本的运算处理,而且 math.js 链式操作我个人觉得比较累赘,所以写了个 mini 版且操作友好的运算方法库。
numberProc 经过超百万次运算测试,已确保稳定性,demo 含有测试脚本
详情查看[demo](https://github.com/xianyu-tian/numberProc/tree/master/dist "demo")示例；

### License

[MIT](https://opensource.org/licenses/MIT)
