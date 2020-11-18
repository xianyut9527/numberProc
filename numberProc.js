"use strict";
/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-16 09:50:33
 * @LastEditTime: 2020-11-18 16:07:53
 * @description:
 */
var mathCounts = /** @class */ (function () {
    function mathCounts(countLength) {
        if (countLength === void 0) { countLength = 0; }
        this.countLength = countLength;
        this.symbolArr = [];
    }
    mathCounts.prototype.maxFixed = function (numArr) {
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
    mathCounts.prototype.numToFixed = function (numArr, maxNum) {
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
    mathCounts.prototype.maxAndMinHandle = function (arrNum) {
        //安全值处理
        var arrNumStr = arrNum.join("").replace(/^0*(?=\d+)/g, "");
        var arrVal = arrNum.includes(".")
            ? arrNumStr.replace(/(\.?(0*))$/g, "")
            : arrNumStr; //去除小数点无效字符
        var numStr = this.symbolArr[0] + (Number(arrVal) ? arrVal : Number(arrVal).toString());
        var numVal = numStr.replace(/(\+|-)/g, "");
        var numStrToNum = Number(numVal);
        return numStrToNum.toString() === numVal ? Number(numStr) : numStr;
    };
    mathCounts.prototype.computed = function (numa, numb, type) {
        this.symbolArr = ["", ""];
        this.symbolArr[0] = Number(numa) < 0 ? "-" : "";
        this.symbolArr[1] = Number(numb) < 0 ? "-" : "";
        numa = numa.toString().replace(/(\+|-|\s)/g, "");
        numb = numb.toString().replace(/(\+|-|\s)/g, "");
        var arrVal = [numa, numb];
        var maxNum = this.maxFixed(arrVal); //获取最大小数位
        var arr = this.numToFixed(arrVal, maxNum); //返回处理过后位数相同的数字
        return arr;
    };
    mathCounts.prototype.add = function (numa, numb, source) {
        var arr = this.computed(numa, numb, "add"); //返回处理后的数组
        var symBollArr = Array.from(new Set(this.symbolArr));
        if (!source && symBollArr.length === 2) {
            //存在单个负数情况则相反处理
            return this.sub(numa, numb, "add");
        }
        var val = 0; //当前位置和
        var front = 0; //进一位值
        var arrNum = [];
        if (Number(arr[0]) <= Number(arr[1])) {
            //负数
            if (!source) {
                this.symbolArr[0] = "";
            }
        }
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
        return num;
    };
    mathCounts.prototype.sub = function (numa, numb, source) {
        var arr = this.computed(numa, numb, "sub"); //返回处理后的数组
        var symBollArr = Array.from(new Set(this.symbolArr));
        if (!source && symBollArr.length === 2) {
            //存在单个负数情况则相反处理
            console.log("相反操作", numa, numb, "---add---");
            return this.add(numa, numb, "sub");
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
        }
        else {
            //负数
            startNum = arr[1];
            endNum = arr[0];
            if (source) {
                this.symbolArr[0] = "";
            }
            else {
                this.symbolArr[0] = "-";
            }
        }
        for (var i = this.countLength - 1; i >= 0; i--) {
            var num_1 = Number(startNum[i]) - front - Number(endNum[i]);
            if (!isNaN(num_1)) {
                //是数字
                if (num_1 < 0) {
                    num_1 = Number(startNum[i]) - front + 10 - Number(endNum[i]);
                    front = 1;
                }
                else {
                    front = 0;
                }
                arrNum.unshift(num_1);
            }
            else {
                arrNum.unshift(".");
            }
        }
        var num = this.maxAndMinHandle(arrNum);
        return num;
    };
    mathCounts.prototype.mul = function (numa, numb) {
        var _this = this;
        var arr = this.computed(numa, numb, "mul"); //返回处理后的数组
        var front = 0;
        var arrData = [];
        var idxLen = this.countLength - 1;
        var countData = {
            numA: 0,
            numB: 0,
        };
        for (var i = idxLen; i >= 0; i--) {
            var arrDataChild = [];
            for (var c = idxLen; c >= 0; c--) {
                var num_2 = Number(arr[1][i]) * Number(arr[0][c]) + front;
                if (!isNaN(num_2)) {
                    //是数字
                    if (num_2 >= 10 && c) {
                        front = parseInt((num_2 / 10).toString());
                        num_2 = num_2 % 10;
                    }
                    else {
                        front = 0;
                    }
                    arrDataChild.unshift(num_2);
                }
            }
            if (!isNaN(Number(arr[0][i]))) {
                if (i !== idxLen) {
                    //补零
                    countData.numB++;
                    for (var f = 0; f < countData.numB; f++) {
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
            if (index === 0) {
                arrDataVal = _this.add(0, val, "mul");
            }
            else {
                arrDataVal = _this.add(arrDataVal, val, "mul");
            }
        });
        var numArr = arrDataVal.toString().split("");
        /**
         * 计算和过后 有小数点则还原小数点
         */
        var numAStr = arr[0].split(".")[1];
        var spliceIdxA = numAStr ? numArr.length - numAStr.length * 2 : 0; //初始化下标
        if (numAStr !== undefined) { //有小数点执行
            if (spliceIdxA <= 0) {
                var lastNum = numAStr ? numAStr.length * 2 : 0;
                for (var l = 0; l < lastNum; l++) { //零则补位
                    numArr.unshift("0");
                }
                var spliceIdxB = numAStr ? numArr.length - lastNum : 0; //下标
                numArr.splice(spliceIdxB, 0, ".");
            }
            else {
                numArr.splice(spliceIdxA, 0, ".");
            }
        }
        //end
        this.symbolArr[0] =
            Number(numa) < 0 && Number(numb) < 0
                ? ""
                : arrDataVal && (Number(numa) < 0 || Number(numb) < 0)
                    ? "-"
                    : ""; //有一个负数则为负两个相抵
        var num = this.maxAndMinHandle(numArr);
        return num;
    };
    mathCounts.prototype.div = function (numa, numb) {
        var arr = this.computed(numa, numb, "div"); //返回处理后的数组
        arr = this.integerNum(numa, numb, arr);
        if (!arr[0] && !arr[1])
            return NaN;
        if (!arr[1])
            return Infinity;
        var arrAstr = arr[0].toString();
        var numLen = arrAstr.length;
        var thatVal = arrAstr[0];
        var lastVal = [];
        for (var n = 0; n < numLen; n++) {
            var val = Number(thatVal) / Number(arr[1]);
            var zs = Number(val.toString().split(".")[0]);
            var ysStr = val.toString().split(".")[1];
            var ys = ysStr
                ? Number((Number("0." + ysStr) * Number(arr[1])).toFixed(10))
                : 0;
            thatVal = ys + (arrAstr[n + 1] ? arrAstr[n + 1] : "0");
            lastVal.push(zs);
            if (n === numLen - 1 && Number(ysStr)) {
                //最后一位还有余数则写入
                lastVal.push(".");
                lastVal.push(ysStr);
            }
        }
        this.symbolArr[0] =
            Number(numa) < 0 && Number(numb) < 0
                ? ""
                : Number(numa) < 0 || Number(numb) < 0
                    ? "-"
                    : ""; //有一个负数则为负两个相抵
        var num = this.maxAndMinHandle(lastVal);
        return num;
    };
    mathCounts.prototype.integerNum = function (numa, numb, arr) {
        var numaStr = numa.toString().split(".")[1];
        var numbStr = numb.toString().split(".")[1];
        var numaLen = numaStr ? numaStr.length : 0;
        var numbLen = numbStr ? numbStr.length : 0;
        var maxNum = numaLen > numbLen ? numaLen : numbLen;
        var bs = "1";
        for (var i = 0; i < maxNum; i++) {
            bs += "0";
        }
        return arr.map(function (item, index) {
            item = Number(item) * Number(bs);
            return item;
        });
    };
    return mathCounts;
}());
var mathCount = new mathCounts();
console.time();
var numa = mathCount.mul('10', '2');
console.log(numa);
console.timeEnd();
