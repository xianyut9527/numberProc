/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-16 09:50:33
 * @LastEditTime: 2020-11-20 02:06:09
 * @description:
 */
class numberProcs {
  countLength: number; //需要计算的位数
  symbolArr: string[]; //符号记录
  uninterrupted: boolean; //连续状态
  firstSymbolStr: string; //当前符号
  constructor(countLength = 0) {
    this.countLength = countLength;
    this.symbolArr = [];
    this.firstSymbolStr = '';
    this.uninterrupted = false;
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
      this.firstSymbolStr + (Number(arrVal) ? arrVal : Number(arrVal).toString());

    let numVal = numStr.replace(/(\+|-)/g, "");
    let numStrToNum = Number(numVal);
    return numStrToNum.toString() === numVal ? Number(numStr) : numStr;
  }
  private computed(
    numa: number | string,
    numb: number | string
  ): string[] {
    this.firstSymbolStr = ''; //firstSymbol
    this.symbolArr = ["", ""];
    numa = numa.toString().replace(/(\s|\(|\))/g,"");  //过滤空白字符及括号
    numb = numb.toString().replace(/(\s|\(|\))/g,""); 
    this.symbolArr[0] = Number(numa) < 0 ? "-" : "";
    this.symbolArr[1] = Number(numb) < 0 ? "-" : "";
    numa = numa.replace(/(\+|-)/g, "");  //过滤符号
    numb = numb.replace(/(\+|-)/g, "");
    let arrVal = [numa, numb];
    let maxNum = this.maxFixed(arrVal); //获取最大小数位
    let arr = this.numToFixed(arrVal, maxNum); //返回处理过后位数相同的数字
    return arr;
  }
  paramsHandle(data: Array<string | number>,num:string|number,type:string): number | string { //参数处理
    data.splice(0, 2);
    if (data.length) {
      if(type==='add'){
        data = [num].concat(data);
        return this.add(...data);
      }else{
        data = [num].concat(data);
        return this.sub(...data);
      }
    }
    return num;
  }
  add(...data: Array<string | number>): number | string {
    let numa = data[0];
    let numb = data[1];
    let arr: string[] = this.computed(numa, numb); //返回处理后的数组
    let symBollArr: string[] = Array.from(new Set(this.symbolArr));
    if (!this.uninterrupted && symBollArr.length === 2) {
      //存在单个负数情况处理
      this.uninterrupted = true;
      let num = this.sub(numa, numb);
      return this.paramsHandle(data,num,'add');
    }
    this.firstSymbolStr = this.symbolArr[0];
    if (this.uninterrupted) {
      this.uninterrupted = false;
      this.firstSymbolStr = this.symbolArr[0];
    }
    let val: number = 0; //当前位置和
    let front: number = 0; //进一位值
    let arrNum: Array<string | number> = [];
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

    return this.paramsHandle(data,num,'add');
  }
  sub(...data: Array<string | number>): number | string {
    let numa = data[0];
    let numb = data[1];
    let arr: string[] = this.computed(numa, numb); //返回处理后的数组
    let symBollArr: string[] = Array.from(new Set(this.symbolArr));
    if (!this.uninterrupted && symBollArr.length === 2) {
      //存在单个负数情况则相反处理
      this.uninterrupted = true; //连续状态
      let num = this.add(numa, numb);
      return this.paramsHandle(data,num,'sub');
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
      this.firstSymbolStr = this.symbolArr[0];
    } else {
      //负数
      startNum = arr[1];
      endNum = arr[0];
      this.firstSymbolStr = this.symbolArr[0] === '-' ? '' : '-';
    }
    if (this.uninterrupted) {
      this.uninterrupted = false;
      Number(arr[0]) >= Number(arr[1]) ? this.firstSymbolStr = this.symbolArr[0] : this.firstSymbolStr = this.symbolArr[1];
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

    return this.paramsHandle(data,num,'sub');
  }
  mul(...data: Array<string | number>): number | string {
    let numa = data[0];
    let numb = data[1];
    let arr: string[] = this.computed(numa, numb); //返回处理后的数组
    let front: number = 0;
    let arrData: any[] = [];
    let idxLen: number = this.countLength - 1;
    let countA: number = 0;
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
          countA++;
          for (let f = 0; f < countA; f++) {
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
      arrDataVal = this.add(arrDataVal, val);
    });
    let numArr: string[] = arrDataVal.toString().split("");
    /**
     * 计算和过后 有小数点则还原小数点
     */
    let numAStr: string = arr[0].split(".")[1];
    let spliceIdxA: number = numAStr ? numArr.length - numAStr.length * 2 : 0; //初始化下标
    if (numAStr !== undefined) { //有小数点执行
      if (spliceIdxA <= 0) {
        let xsNum: number = numAStr ? numAStr.length * 2 : 0; //小数位
        for (let l = 0; l < xsNum; l++) { //零则补位
          numArr.unshift("0")
        }
        let spliceIdxB: number = numAStr ? numArr.length - xsNum : 0; //下标
        numArr.splice(spliceIdxB, 0, ".");
      } else {
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
    let num: string | number = this.maxAndMinHandle(numArr);

    data.splice(0, 2);
    if (data.length) {
      data = [num].concat(data);
      return this.mul(...data);
    }
    return num;
  }
  div(...data: Array<string | number>): number | string {
    let numa = data[0];
    let numb = data[1];
    let arr = this.integerNum(this.computed(numa, numb)); //返回处理后的数组
    if (!arr[0] && !arr[1]) return NaN;
    if (!arr[1]) return Infinity;
    let arrAstr: string = arr[0].toString();
    let numLen: number = arrAstr.length;
    let thatVal: string = arrAstr[0];
    let lastVal: Array<string | number> = [];
    let symStrStatus = numa.toString().includes('.')?true:numb.toString().includes('.');
    for (let n = 0; n < numLen; n++) {
      let val:string = (Number(thatVal)/Number(arr[1])).toFixed(30);
      let zs = Number(val.split(".")[0]);
      let ysStr = val.split(".")[1];
      let ys = ysStr
        ? Number((Number("." + ysStr) * Number(arr[1])).toFixed(0))
        : 0;
      thatVal = ys + (arrAstr[n + 1] ? arrAstr[n + 1] : "0");
      lastVal.push(zs);
      if (n === numLen - 1 && Number(ysStr)) {
        //最后一位还有余数则写入
        lastVal.push(".");
        lastVal.push(ysStr.substring(0,17));
      }
    }
    this.firstSymbolStr =
      Number(numa) < 0 && Number(numb) < 0
        ? ""
        : Number(numa) < 0 || Number(numb) < 0
          ? "-"
          : ""; //有一个负数则为负两个相抵
    let num: string | number = this.maxAndMinHandle(lastVal);

    data.splice(0, 2);
    if (data.length) {
      data = [num].concat(data);
      return this.div(...data);
    }
    return num;
  }
  private integerNum(
    arr: Array<number | string>
  ) { //化整
    return arr.map((item, index) => {
      item = item.toString().replace(/\./, '');
      return item;
    });
  }
  eval(numStr: string) {
    numStr = numStr.replace(/\s/g, ''); //过滤空字符
    let val = this.sybCompute(numStr);
    return Number(val).toString() === val ? Number(val) : val;
  }
  private sybCompute(numStr: string): string { //运算规则
    let sybSplit: null | string[] = numStr.match(/\((-?\d+\.?\d*)((\+|-|\*|\/)(-?\d+\.?\d*))+\)/g);
    if (sybSplit) { //括号优先计算
      sybSplit.forEach((item, index) => {
        let itemStr = item.replace(/(\(|\))/g, '');
        let fliter = item.replace(/(\(|\)|\.|\/|\*|\+)/g, '\\$1');
        let reg = new RegExp(fliter);
        numStr = numStr.replace(reg, this.operation(itemStr));
      })
      return this.sybCompute(numStr);
    } else { //普通运算
      return this.operation(numStr);
    }
  }
  private operation(str: string): string {  //运算
    let val = this.mulAndDiv(str); //乘除法运算
    val = this.addAndSub(this.mulAndDiv(str)); //加减法运算
    return val
  }
  private mulAndDiv(str: string): string { //检测乘除法
    let symbolTag: null | string[] = str.match(/(\(?-?\d+\.?\d*\)?)(\*|\/)(\(?-?\d+\.?\d*\)?)/);
    if (symbolTag) { //有乘除法
      let item = symbolTag[0];
      let symBolStr = item.replace(/[^/*]/g, '');
      let arr = item.split(symBolStr);
      let fliter = item.replace(/(\.|\/|\*|\(|\))/g, '\\$1');
      let reg = new RegExp(fliter);
      let val = symBolStr === '*' ? this.mul(arr[0], arr[1]) : this.div(arr[0], arr[1]);
      str = str.replace(reg, val.toString());
      return this.mulAndDiv(str);
    } else { //没有则直接返回
      return str;
    }
  }
  private addAndSub(str: string): string { //检测加减法
    let symbolTag: null | string[] = str.match(/(\(?-?\d+\.?\d*\)?)(\+|-)(\(?-?\d+\.?\d*\)?)/);
    if (symbolTag) { //有加减法
      let item = symbolTag[0];
      let symBolStr = item.replace(/[^+-]/g, '');
      let arr = item.split(symBolStr);
      let fliter = item.replace(/(\.|\+|-|\(|\))/g, '\\$1');
      let reg = new RegExp(fliter);
      let val = symBolStr === '+' ? this.add(arr[0], arr[1]) : this.sub(arr[0], arr[1]);
      str = str.replace(reg, val.toString());
      return this.addAndSub(str);
    } else { //没有则直接返回
      return str;
    }
  }
}

const numberProc = new numberProcs();



