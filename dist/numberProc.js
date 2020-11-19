"use strict";
/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-16 09:50:33
 * @LastEditTime: 2020-11-20 02:06:09
 * @description:
 */
var numberProcs = /** @class */ (function () {
    function numberProcs(countLength) {
        if (countLength === void 0) { countLength = 0; }
        this.countLength = countLength;
        this.symbolArr = [];
        this.firstSymbolStr = '';
        this.uninterrupted = false;
    }
    numberProcs.prototype.maxFixed = function (numArr) {
        //小数位处理
        var maxNum = 0;
        for (var l = 0; l < numArr.length; l++) {
            var fixedVal = numArr[l].toString().split(".")[1];
            maxNum = fixedVal
                ? fixedVal.length > maxNum
                    ? fixedVal.length
                    : maxNum
                : maxNum;
        }
        return maxNum;
    };
    numberProcs.prototype.numToFixed = function (numArr, maxNum) {
        //尾数补齐
        var numStrArr = [];
        numArr = numArr.map(function (item, index) {
            var fixedVal = item.split(".")[1];
            var fixedValLen = fixedVal ? fixedVal.length : 0;
            var diffeVal = maxNum - fixedValLen;
            var lastNum = ""; //尾数补齐
            if (diffeVal) {
                for (var i = 0; i < diffeVal; i++) {
                    lastNum += "0";
                }
            }
            item = item.includes(".")
                ? item + lastNum
                : item + (lastNum ? "." + lastNum : "");
            numStrArr.push(item.length);
            return item;
        });
        var setNum = Array.from(new Set(numStrArr));
        this.countLength = Math.max.apply(Math, setNum); //获取最长length;
        if (setNum.length > 1) {
            //整数&小数位数不同则处理
            var val = setNum[0] - setNum[1];
            var absVal = Math.abs(val);
            var activeVal = val < 0 ? numArr[0] : numArr[1];
            var firstSymbol = "";
            for (var i = 0; i < absVal; i++) {
                firstSymbol += "0";
            }
            activeVal = firstSymbol + activeVal;
            val < 0 ? (numArr[0] = activeVal) : (numArr[1] = activeVal);
        }
        return numArr;
    };
    numberProcs.prototype.maxAndMinHandle = function (arrNum) {
        //安全值处理
        var arrNumStr = arrNum.join("").replace(/^0*(?=\d+)/g, "");
        var arrVal = arrNum.includes(".")
            ? arrNumStr.replace(/(\.?(0*))$/g, "")
            : arrNumStr; //去除小数点无效字符
        var numStr = this.firstSymbolStr + (Number(arrVal) ? arrVal : Number(arrVal).toString());
        var numVal = numStr.replace(/(\+|-)/g, "");
        var numStrToNum = Number(numVal);
        return numStrToNum.toString() === numVal ? Number(numStr) : numStr;
    };
    numberProcs.prototype.computed = function (numa, numb) {
        this.firstSymbolStr = ''; //firstSymbol
        this.symbolArr = ["", ""];
        numa = numa.toString().replace(/(\s|\(|\))/g, ""); //过滤空白字符及括号
        numb = numb.toString().replace(/(\s|\(|\))/g, "");
        this.symbolArr[0] = Number(numa) < 0 ? "-" : "";
        this.symbolArr[1] = Number(numb) < 0 ? "-" : "";
        numa = numa.replace(/(\+|-)/g, ""); //过滤符号
        numb = numb.replace(/(\+|-)/g, "");
        var arrVal = [numa, numb];
        var maxNum = this.maxFixed(arrVal); //获取最大小数位
        var arr = this.numToFixed(arrVal, maxNum); //返回处理过后位数相同的数字
        return arr;
    };
    numberProcs.prototype.paramsHandle = function (data, num, type) {
        data.splice(0, 2);
        if (data.length) {
            if (type === 'add') {
                data = [num].concat(data);
                return this.add.apply(this, data);
            }
            else {
                data = [num].concat(data);
                return this.sub.apply(this, data);
            }
        }
        return num;
    };
    numberProcs.prototype.add = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var numa = data[0];
        var numb = data[1];
        var arr = this.computed(numa, numb); //返回处理后的数组
        var symBollArr = Array.from(new Set(this.symbolArr));
        if (!this.uninterrupted && symBollArr.length === 2) {
            //存在单个负数情况处理
            this.uninterrupted = true;
            var num_1 = this.sub(numa, numb);
            return this.paramsHandle(data, num_1, 'add');
        }
        this.firstSymbolStr = this.symbolArr[0];
        if (this.uninterrupted) {
            this.uninterrupted = false;
            this.firstSymbolStr = this.symbolArr[0];
        }
        var val = 0; //当前位置和
        var front = 0; //进一位值
        var arrNum = [];
        for (var i = this.countLength - 1; i >= 0; i--) {
            val = Number(arr[0][i]) + Number(arr[1][i]) + front;
            if (!isNaN(val)) {
                if (i) { //计算处理
                    front = parseInt((val / 10).toString());
                    val = val % 10;
                }
                arrNum.unshift(val);
            }
            else {
                arrNum.unshift(".");
            }
        }
        var num = this.maxAndMinHandle(arrNum);
        return this.paramsHandle(data, num, 'add');
    };
    numberProcs.prototype.sub = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var numa = data[0];
        var numb = data[1];
        var arr = this.computed(numa, numb); //返回处理后的数组
        var symBollArr = Array.from(new Set(this.symbolArr));
        if (!this.uninterrupted && symBollArr.length === 2) {
            //存在单个负数情况则相反处理
            this.uninterrupted = true; //连续状态
            var num_2 = this.add(numa, numb);
            return this.paramsHandle(data, num_2, 'sub');
        }
        var arrNum = [];
        var val = 0; //当前位置值
        var front = 0; //进一位值
        var startNum = "";
        var endNum = "";
        if (Number(arr[0]) >= Number(arr[1])) {
            //正数
            startNum = arr[0];
            endNum = arr[1];
            this.firstSymbolStr = this.symbolArr[0];
        }
        else {
            //负数
            startNum = arr[1];
            endNum = arr[0];
            this.firstSymbolStr = this.symbolArr[0] === '-' ? '' : '-';
        }
        if (this.uninterrupted) {
            this.uninterrupted = false;
            Number(arr[0]) >= Number(arr[1]) ? this.firstSymbolStr = this.symbolArr[0] : this.firstSymbolStr = this.symbolArr[1];
        }
        for (var i = this.countLength - 1; i >= 0; i--) {
            var num_3 = Number(startNum[i]) - front - Number(endNum[i]);
            if (!isNaN(num_3)) {
                //是数字
                if (num_3 < 0) {
                    num_3 = Number(startNum[i]) - front + 10 - Number(endNum[i]);
                    front = 1;
                }
                else {
                    front = 0;
                }
                arrNum.unshift(num_3);
            }
            else {
                arrNum.unshift(".");
            }
        }
        var num = this.maxAndMinHandle(arrNum);
        return this.paramsHandle(data, num, 'sub');
    };
    numberProcs.prototype.mul = function () {
        var _this = this;
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var numa = data[0];
        var numb = data[1];
        var arr = this.computed(numa, numb); //返回处理后的数组
        var front = 0;
        var arrData = [];
        var idxLen = this.countLength - 1;
        var countA = 0;
        for (var i = idxLen; i >= 0; i--) {
            var arrDataChild = [];
            for (var c = idxLen; c >= 0; c--) {
                var num_4 = Number(arr[1][i]) * Number(arr[0][c]) + front;
                if (!isNaN(num_4)) {
                    //是数字
                    if (num_4 >= 10 && c) {
                        front = parseInt((num_4 / 10).toString());
                        num_4 = num_4 % 10;
                    }
                    else {
                        front = 0;
                    }
                    arrDataChild.unshift(num_4);
                }
            }
            if (!isNaN(Number(arr[0][i]))) {
                if (i !== idxLen) {
                    //补零
                    countA++;
                    for (var f = 0; f < countA; f++) {
                        arrDataChild.push(0);
                    }
                }
                arrData.push(arrDataChild);
            }
        }
        //值相加则是结果
        var arrDataVal = 0;
        arrData.forEach(function (item, index) {
            var val = item.join("");
            arrDataVal = _this.add(arrDataVal, val);
        });
        var numArr = arrDataVal.toString().split("");
        /**
         * 计算和过后 有小数点则还原小数点
         */
        var numAStr = arr[0].split(".")[1];
        var spliceIdxA = numAStr ? numArr.length - numAStr.length * 2 : 0; //初始化下标
        if (numAStr !== undefined) { //有小数点执行
            if (spliceIdxA <= 0) {
                var xsNum = numAStr ? numAStr.length * 2 : 0; //小数位
                for (var l = 0; l < xsNum; l++) { //零则补位
                    numArr.unshift("0");
                }
                var spliceIdxB = numAStr ? numArr.length - xsNum : 0; //下标
                numArr.splice(spliceIdxB, 0, ".");
            }
            else {
                numArr.splice(spliceIdxA, 0, ".");
            }
        }
        //end
        this.firstSymbolStr =
            Number(numa) < 0 && Number(numb) < 0
                ? ""
                : arrDataVal && (Number(numa) < 0 || Number(numb) < 0)
                    ? "-"
                    : ""; //有一个负数则为负两个相抵
        var num = this.maxAndMinHandle(numArr);
        data.splice(0, 2);
        if (data.length) {
            data = [num].concat(data);
            return this.mul.apply(this, data);
        }
        return num;
    };
    numberProcs.prototype.div = function () {
        var data = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            data[_i] = arguments[_i];
        }
        var numa = data[0];
        var numb = data[1];
        var arr = this.integerNum(this.computed(numa, numb)); //返回处理后的数组
        if (!arr[0] && !arr[1])
            return NaN;
        if (!arr[1])
            return Infinity;
        var arrAstr = arr[0].toString();
        var numLen = arrAstr.length;
        var thatVal = arrAstr[0];
        var lastVal = [];
        var symStrStatus = numa.toString().includes('.') ? true : numb.toString().includes('.');
        for (var n = 0; n < numLen; n++) {
            var val = (Number(thatVal) / Number(arr[1])).toFixed(30);
            var zs = Number(val.split(".")[0]);
            var ysStr = val.split(".")[1];
            var ys = ysStr
                ? Number((Number("." + ysStr) * Number(arr[1])).toFixed(0))
                : 0;
            thatVal = ys + (arrAstr[n + 1] ? arrAstr[n + 1] : "0");
            lastVal.push(zs);
            if (n === numLen - 1 && Number(ysStr)) {
                //最后一位还有余数则写入
                lastVal.push(".");
                lastVal.push(ysStr.substring(0, 17));
            }
        }
        this.firstSymbolStr =
            Number(numa) < 0 && Number(numb) < 0
                ? ""
                : Number(numa) < 0 || Number(numb) < 0
                    ? "-"
                    : ""; //有一个负数则为负两个相抵
        var num = this.maxAndMinHandle(lastVal);
        data.splice(0, 2);
        if (data.length) {
            data = [num].concat(data);
            return this.div.apply(this, data);
        }
        return num;
    };
    numberProcs.prototype.integerNum = function (arr) {
        return arr.map(function (item, index) {
            item = item.toString().replace(/\./, '');
            return item;
        });
    };
    numberProcs.prototype.eval = function (numStr) {
        numStr = numStr.replace(/\s/g, ''); //过滤空字符
        var val = this.sybCompute(numStr);
        return Number(val).toString() === val ? Number(val) : val;
    };
    numberProcs.prototype.sybCompute = function (numStr) {
        var _this = this;
        var sybSplit = numStr.match(/\((-?\d+\.?\d*)((\+|-|\*|\/)(-?\d+\.?\d*))+\)/g);
        if (sybSplit) { //括号优先计算
            sybSplit.forEach(function (item, index) {
                var itemStr = item.replace(/(\(|\))/g, '');
                var fliter = item.replace(/(\(|\)|\.|\/|\*|\+)/g, '\\$1');
                var reg = new RegExp(fliter);
                numStr = numStr.replace(reg, _this.operation(itemStr));
            });
            return this.sybCompute(numStr);
        }
        else { //普通运算
            return this.operation(numStr);
        }
    };
    numberProcs.prototype.operation = function (str) {
        var val = this.mulAndDiv(str); //乘除法运算
        val = this.addAndSub(this.mulAndDiv(str)); //加减法运算
        return val;
    };
    numberProcs.prototype.mulAndDiv = function (str) {
        var symbolTag = str.match(/(\(?-?\d+\.?\d*\)?)(\*|\/)(\(?-?\d+\.?\d*\)?)/);
        if (symbolTag) { //有乘除法
            var item = symbolTag[0];
            var symBolStr = item.replace(/[^/*]/g, '');
            var arr = item.split(symBolStr);
            var fliter = item.replace(/(\.|\/|\*|\(|\))/g, '\\$1');
            var reg = new RegExp(fliter);
            var val = symBolStr === '*' ? this.mul(arr[0], arr[1]) : this.div(arr[0], arr[1]);
            str = str.replace(reg, val.toString());
            return this.mulAndDiv(str);
        }
        else { //没有则直接返回
            return str;
        }
    };
    numberProcs.prototype.addAndSub = function (str) {
        var symbolTag = str.match(/(\(?-?\d+\.?\d*\)?)(\+|-)(\(?-?\d+\.?\d*\)?)/);
        if (symbolTag) { //有加减法
            var item = symbolTag[0];
            var symBolStr = item.replace(/[^+-]/g, '');
            var arr = item.split(symBolStr);
            var fliter = item.replace(/(\.|\+|-|\(|\))/g, '\\$1');
            var reg = new RegExp(fliter);
            var val = symBolStr === '+' ? this.add(arr[0], arr[1]) : this.sub(arr[0], arr[1]);
            str = str.replace(reg, val.toString());
            return this.addAndSub(str);
        }
        else { //没有则直接返回
            return str;
        }
    };
    return numberProcs;
}());
var numberProc = new numberProcs();
