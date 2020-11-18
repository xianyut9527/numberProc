/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-16 09:50:33
 * @LastEditTime: 2020-11-18 16:07:53
 * @description:
 */
class mathCounts {
  countLength: number; //需要计算的位数
  symbolArr: string[]; //符号记录
  constructor(countLength = 0) {
    this.countLength = countLength;
    this.symbolArr = [];
  }
  private maxFixed(numArr: string[]) {
    //小数位处理
    let maxNum = 0;
    for (let l = 0; l < numArr.length; l++) {
      let fixedVal = numArr[l].toString().split(".")[1];
      maxNum = fixedVal
        ? fixedVal.length > maxNum
          ? fixedVal.length
          : maxNum
        : maxNum;
    }
    return maxNum;
  }
  private numToFixed(numArr: string[], maxNum: number) {
    //尾数补齐
    let numStrArr: number[] = [];
    numArr = numArr.map((item, index) => {
      let fixedVal = item.split(".")[1];
      let fixedValLen = fixedVal ? fixedVal.length : 0;
      let diffeVal = maxNum - fixedValLen;
      let lastNum = ""; //尾数补齐
      if (diffeVal) {
        for (let i = 0; i < diffeVal; i++) {
          lastNum += "0";
        }
      }
      item = item.includes(".")
        ? item + lastNum
        : item + (lastNum ? "." + lastNum : "");
      numStrArr.push(item.length);
      return item;
    });
    let setNum = Array.from(new Set(numStrArr));
    this.countLength = Math.max(...setNum); //获取最长length;
    if (setNum.length > 1) {
      //整数&小数位数不同则处理
      let val: number = setNum[0] - setNum[1];
      let absVal: number = Math.abs(val);
      let activeVal: string =
        val < 0 ? numArr[0] : numArr[1];
      let firstSymbol: string = "";
      for (let i = 0; i < absVal; i++) {
        firstSymbol += "0";
      }
      activeVal = firstSymbol + activeVal;
      val < 0 ? (numArr[0] = activeVal) : (numArr[1] = activeVal);
    }
    return numArr;
  }

  private maxAndMinHandle(arrNum: Array<string | number>) {
    //安全值处理
    let arrNumStr = arrNum.join("").replace(/^0*(?=\d+)/g, "");
    let arrVal: string = arrNum.includes(".")
      ? arrNumStr.replace(/(\.?(0*))$/g, "")
      : arrNumStr; //去除小数点无效字符
    let numStr: string =
      this.symbolArr[0] + (Number(arrVal) ? arrVal : Number(arrVal).toString());

    let numVal = numStr.replace(/(\+|-)/g, "");
    let numStrToNum = Number(numVal);
    return numStrToNum.toString() === numVal ? Number(numStr) : numStr;
  }
  private computed(
    numa: number | string,
    numb: number | string,
    type: string
  ): string[] {
    this.symbolArr = ["", ""];
    this.symbolArr[0] = Number(numa) < 0 ? "-" : "";
    this.symbolArr[1] = Number(numb) < 0 ? "-" : "";
    numa = numa.toString().replace(/(\+|-|\s)/g, "");
    numb = numb.toString().replace(/(\+|-|\s)/g, "");
    let arrVal = [numa, numb];
    let maxNum = this.maxFixed(arrVal); //获取最大小数位
    let arr = this.numToFixed(arrVal, maxNum); //返回处理过后位数相同的数字
    return arr;
  }
  add(
    numa: number | string,
    numb: number | string,
    source?: string
  ): number | string {
    let arr: string[] = this.computed(numa, numb, "add"); //返回处理后的数组
    let symBollArr: string[] = Array.from(new Set(this.symbolArr));
    if (!source && symBollArr.length === 2) {
      //存在单个负数情况则相反处理
      return this.sub(numa, numb, "add");
    }
    let val: number = 0; //当前位置和
    let front: number = 0; //进一位值
    let arrNum: Array<string | number> = [];
    if (Number(arr[0]) <= Number(arr[1])) {
      //负数
      if (!source) {
        this.symbolArr[0] = "";
      }
    }
    for (let i = this.countLength - 1; i >= 0; i--) {
      val = Number(arr[0][i]) + Number(arr[1][i]) + front;
      if (!isNaN(val)) {
        if (i) { //计算处理
          front = parseInt((val / 10).toString());
          val = val % 10;
        }
        arrNum.unshift(val);
      } else {
        arrNum.unshift(".");
      }
    }
    let num: string | number = this.maxAndMinHandle(arrNum);
    return num;
  }
  sub(
    numa: number | string,
    numb: number | string,
    source?: string
  ): number | string {
    let arr: string[] = this.computed(numa, numb, "sub"); //返回处理后的数组
    let symBollArr: string[] = Array.from(new Set(this.symbolArr));
    if (!source && symBollArr.length === 2) {
      //存在单个负数情况则相反处理
      console.log("相反操作", numa, numb, "---add---");
      return this.add(numa, numb, "sub");
    }
    let arrNum: Array<string | number> = [];
    let val: number = 0; //当前位置值
    let front: number = 0; //进一位值
    let startNum: string = "";
    let endNum: string = "";
    if (Number(arr[0]) >= Number(arr[1])) {
      //正数
      startNum = arr[0];
      endNum = arr[1];
    } else {
      //负数
      startNum = arr[1];
      endNum = arr[0];
      if (source) {
        this.symbolArr[0] = "";
      } else {
        this.symbolArr[0] = "-";
      }
    }
    for (let i = this.countLength - 1; i >= 0; i--) {
      let num = Number(startNum[i]) - front - Number(endNum[i]);
      if (!isNaN(num)) {
        //是数字
        if (num < 0) {
          num = Number(startNum[i]) - front + 10 - Number(endNum[i]);
          front = 1;
        } else {
          front = 0;
        }
        arrNum.unshift(num);
      } else {
        arrNum.unshift(".");
      }
    }
    let num: string | number = this.maxAndMinHandle(arrNum);
    return num;
  }
  mul(numa: number|string, numb: number|string): number | string {
    let arr: string[] = this.computed(numa, numb, "mul"); //返回处理后的数组
    let front: number = 0;
    let arrData: any[] = [];
    let idxLen: number = this.countLength - 1;
    let countData = {
      numA: 0,
      numB: 0,
    };
    for (let i = idxLen; i >= 0; i--) {
      let arrDataChild: Array<number | string> = [];
      for (let c = idxLen; c >= 0; c--) {
        let num: number | string =
          Number(arr[1][i]) * Number(arr[0][c]) + front;
        if (!isNaN(num)) {
          //是数字
          if (num >= 10 && c) {
            front = parseInt((num / 10).toString());
            num = num % 10;
          } else {
            front = 0;
          }
          arrDataChild.unshift(num);
        }
      }
      if (!isNaN(Number(arr[0][i]))) {
        if (i !== idxLen) {
          //补零
          countData.numB++;
          for (let f = 0; f < countData.numB; f++) {
            arrDataChild.push(0);
          }
        }
        arrData.push(arrDataChild);
      }
    }
    //值相加则是结果
    let arrDataVal: number | string = 0;
    arrData.forEach((item, index) => {
      let val: string = item.join("");
      if (index === 0) {
        arrDataVal = this.add(0, val, "mul");
      } else {
        arrDataVal = this.add(arrDataVal, val, "mul");
      }
    });
    let numArr: string[] = arrDataVal.toString().split("");
    /**
     * 计算和过后 有小数点则还原小数点
     */
    let numAStr: string = arr[0].split(".")[1];
    let spliceIdxA: number = numAStr ? numArr.length - numAStr.length * 2 : 0; //初始化下标
    if(numAStr!==undefined){ //有小数点执行
      if (spliceIdxA <= 0) {
        let lastNum = numAStr?numAStr.length * 2:0;
        for (let l = 0; l < lastNum; l++) { //零则补位
          numArr.unshift("0")
        }
        let spliceIdxB = numAStr ? numArr.length - lastNum : 0; //下标
        numArr.splice(spliceIdxB, 0, ".")
      } else {
        numArr.splice(spliceIdxA, 0, ".")
      }
    }
    //end

    this.symbolArr[0] =
      Number(numa) < 0 && Number(numb) < 0
        ? ""
        : arrDataVal && (Number(numa) < 0 || Number(numb) < 0)
          ? "-"
          : ""; //有一个负数则为负两个相抵
    let num: string | number = this.maxAndMinHandle(numArr);
    return num;
  }
  div(numa: number|string, numb: number|string): number | string {
    let arr: Array<string | number> = this.computed(numa, numb, "div"); //返回处理后的数组
    arr = this.integerNum(numa, numb, arr);
    if(!arr[0]&&!arr[1]) return NaN;
    if(!arr[1]) return Infinity;
    let arrAstr = arr[0].toString();
    let numLen: number = arrAstr.length;
    let thatVal: string = arrAstr[0];
    let lastVal: Array<string | number> = [];
    for (let n = 0; n < numLen; n++) {
      let val: number = Number(thatVal) / Number(arr[1]);
      let zs = Number(val.toString().split(".")[0]);
      let ysStr = val.toString().split(".")[1];
      let ys = ysStr
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
    let num: string | number = this.maxAndMinHandle(lastVal);
    return num;
  }
  private integerNum(
    numa: string | number,
    numb: string | number,
    arr: Array<number | string>
  ) {
    let numaStr: string = numa.toString().split(".")[1];
    let numbStr: string = numb.toString().split(".")[1];
    let numaLen: number = numaStr ? numaStr.length : 0;
    let numbLen: number = numbStr ? numbStr.length : 0;
    let maxNum: number = numaLen > numbLen ? numaLen : numbLen;
    let bs: string | number = "1";
    for (let i = 0; i < maxNum; i++) {
      bs += "0";
    }
    return arr.map((item, index) => {
      item = Number(item) * Number(bs);
      return item;
    });
  }
}
const mathCount = new mathCounts();
console.time();
let numa = mathCount.mul('10', '2');
console.log(numa);
console.timeEnd();


