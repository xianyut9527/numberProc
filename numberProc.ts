; (function (GLOBAL: any) {
/*
 * @numberProc.js v0.1.2
 * @licence MIT Licensed
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-21 16:19:05
 * @LastEditTime: 2020-12-06 01:38:59
 * @description: 
*/
  type numAndStr = number | string;
  class numberProcs {
    numSymbol: string[] = ['', '']; //当前运算数字存在的符号
    filterStatus: boolean = true; //过滤字符
    testNumber: RegExp = /(NaN|Infinity)/; //特殊数字
    /**
     * @method 字符转长度
     * @param stra 需要转长度的字符
     */
    private strToNum(stra: string | undefined): number {
      return stra ? stra.toString().length : 0;
    }
    /**
     * @method 数字大小比较
     * @param numa 当前数字
     * @param numb 需要比较的数字
     */
    private numberMax(numa: number, numb: number): number {
      numb > numa ? numa = numb : '';
      return numa;
    }
    /**
     * @method 字符数字处理
     * @param imte 需要处理的字符/数字 
     * @param index 当前下标 
     */
    strNumHandle(item: numAndStr, index: number): string { //字符数字处理
      let itemTostr = item.toString();
      if (itemTostr.includes('-') || Object.is(-0, Number(item))) this.numSymbol[index] = '-';
      item = itemTostr.replace(/(\+|-|\s)/g, ''); //去除负数符号及空格
      return item;
    }
    /**
     * @method 空位补零
     * @param data 需要补零的数据 
     */
    private pushZero(...data: [numAndStr, numAndStr]): string[] { //补位
      let integerLen: number = 0, decimalsLen: number = 0; //整数,小数长度
      this.numSymbol = ['', '']; //符号初始化
      data.forEach((item, index) => { //找出数组中小数和整数最长的length
        item = this.strNumHandle(item, index);
        let spltArr: string[] = item.split('.'); //当前数字用小数点切分转数组
        integerLen = this.numberMax(integerLen, this.strToNum(spltArr[0]));
        decimalsLen = this.numberMax(decimalsLen, this.strToNum(spltArr[1]));
      })
      return data.map((item, index): string => { //补位
        item = this.strNumHandle(item, index);
        let spltArr: string[] = item.split('.'); //当前数字用小数点切分转数组
        let neddNumA = integerLen - this.strToNum(spltArr[0]); //需要补位的整数
        let neddNumB = decimalsLen - this.strToNum(spltArr[1]); //需要补位的小数
        for (let f = 0; f < neddNumA; f++) item = '0' + item;
        for (let f = 0; f < neddNumB; f++) item += f === 0 && !item.includes('.') ? '.0' : '0';
        return (<string>item);
      })
    }
    /**
     * @method js安全值检测
     * @param sumNum 检测的数字 
     */
    maxNum(sumNum: numAndStr[]): numAndStr {
      if (this.filterStatus) {
        let numStr = sumNum.join('').replace(/(^0+(?=\d+)|\.0+$|0+(?<=\.\d+)$|(?<=-)0+(?=\d+))/g, ''); //数组转字符并且去除无效字符
        return Number(numStr).toString() === numStr ? Number(numStr) : numStr;
      } else {
        return sumNum.join('');
      }
    }
    /**
     * 
     * @param num 需要处理四舍五入的数据
     * @param digit //保留多少位小数
     */
    round(num: number | string, digit: number = 0): string {
      let numStr: string = num.toString(); //数字字符串同意处理
      if (/(NaN|Infinity)/.test(numStr)) return 'NaN'; //统一返回NaN
      let decimalsIdx: number = numStr.indexOf("."); //小数点下标
      let numStrArr: string[] = numStr.split('');
      let fixedNum: number = decimalsIdx !== -1 ? numStr.substr(decimalsIdx + 1).length : 0; //小数点后长度
      if (digit === fixedNum) return numStr; //小数位相同时直接返回
      if (decimalsIdx !== -1 && digit < fixedNum) { //需要截取   
        let countNum: number = decimalsIdx + digit + 1; //当前截取截止下标
        let numIdx: number = digit ? countNum : countNum - 1; //下标小数点避让 
        let nextNum: number = Number(numStr.substr(countNum, 1)); //判断是否舍入的数字
        if (nextNum >= 5) { //五入
          let former: number = 1;
          while (countNum && countNum--) {
            let thatNum: number = Number(numStr.substr(countNum, 1));
            if (!isNaN(thatNum)) {
              numStrArr[countNum] = countNum && numStrArr[countNum - 1] !== '-' ? ((thatNum + former) % 10).toString() : (thatNum + former).toString();
              former = parseInt(((thatNum + former) / 10).toString());
            }
          }
        }
        numStr = numStrArr.slice(0, numIdx).join('');
      } else { //需要补零
        let excNum = digit - fixedNum; //保留小数减去小数长度  
        numStr += excNum === digit ? '.' : '';
        for (let d = 0; d < excNum; d++) numStr += '0';
      }
      return numStr;
    }
    /**
     * @method 比较数字大小
     * @param numa  数字A
     * @param numb  数字B
     */
    compareSize(numa: string, numb: string): boolean {
      let sizeBol: boolean = false, numLen = numa.length - 1;
      for (let n = numLen; n >= 0; n--) numa[n] > numb[n] ? sizeBol = true : numa[n] < numb[n] ? sizeBol = false : '';
      return sizeBol
    }
    /**
     * @method 加法
     * @param data 需要做加法的数据
     */
    add(...data: numAndStr[]): numAndStr { //加法
      if (data.length === 1) return data[0];
      if (this.testNumber.test(Number(data[0]).toString()) || this.testNumber.test(Number(data[1]).toString())) return 'NaN'; //统一返回NaN
      let computeNum: string[] = this.pushZero(data[0], data[1]);
      let thatSym: string[] = JSON.parse(JSON.stringify(this.numSymbol));
      let [numA, numB]: string[] = computeNum; //计算数字A/B
      let numLength: number = numA.length - 1; //数组已经补位,数组里每一位数字长度都是一致
      let symbolStr: string[] = Array.from(new Set(thatSym));
      if (symbolStr.length > 1 && !data.includes('abs')) { //负数相反计算
        return this.sub(...data, 'abs');
      }
      /** 加法计算 start **/
      let sumNum: numAndStr[] = [], tallyNum: number = 0; //记账数字
      for (let n = numLength; n >= 0; n--) {
        if (!isNaN(Number(numA[n]))) { //数字执行
          let sum: number = Number(numA[n]) + Number(numB[n]) + tallyNum;
          let val: number = n ? sum % 10 : sum;
          tallyNum = parseInt((sum / 10).toString());
          sumNum.unshift(val);
          continue;
        }
        sumNum.unshift(numA[n]);
      }
      /** 加法计算 end **/

      data.splice(0, 2); //前2位计算完成后删除
      if (data.includes('abs')) { //相反执行
        thatSym[0] ? sumNum.unshift('-') : ''; //如果负数开头则还是负数，负数结尾则负负为正
        if (data[0] === 'abs') return this.maxNum(sumNum); //没有可计算的值时则返回结果
        data = data.filter((item, index) => { //过滤
          return item !== 'abs';
        })
        return this.sub(this.maxNum(sumNum), ...data);  //有可计算的值时继续计算
      } else { //纯加法
        symbolStr[0] ? sumNum.unshift('-') : '';
        if (data.length) return this.add(this.maxNum(sumNum), ...data); //还有没有计算的 继续计算反之返回结果
        return this.maxNum(sumNum);
      }
    }
    /**
     * @method 减法
     * @param data 需要做减法的数据
     */
    sub(...data: numAndStr[]): numAndStr { //减法
      if (data.length === 1) return data[0];
      if (this.testNumber.test(Number(data[0]).toString()) || this.testNumber.test(Number(data[1]).toString())) return 'NaN'; //统一返回NaN
      let computeNum: string[] = this.pushZero(data[0], data[1]);
      let thatSym: string[] = JSON.parse(JSON.stringify(this.numSymbol)); //当前符号记录
      let [numA, numB]: string[] = computeNum; //计算数字A/B
      let numLength: number = numA.length - 1; //数组已经补位,数组里每一位数字长度都是一致
      let symbolStr: string[] = Array.from(new Set(thatSym));
      if (symbolStr.length > 1 && !data.includes('abs')) { //负数相反计算
        return this.add(...data, 'abs');
      }
      /** 减法计算 start **/
      let sumNum: numAndStr[] = [], tallyNum: number = 0, posNum: boolean = true; //tallyNum记账数字 posNum正数
      if (this.compareSize(numB, numA)) posNum = false;
      let symlStr: string = '';
      for (let n = numLength; n >= 0; n--) {
        let numberA: number = posNum ? Number(numA[n]) : Number(numB[n]);
        let numberB: number = posNum ? Number(numB[n]) : Number(numA[n]);
        if (!isNaN(numberA)) { //数字执行
          if (tallyNum) tallyNum = 0, numberA -= 1; //借1过后需要减去上一位1
          numberA < numberB ? tallyNum = 10 : ''; //如果数字不够减则借1
          let sum: number = tallyNum + numberA - numberB;
          sumNum.unshift(sum);
          !n && !posNum ? symlStr = '-' : '';
          continue
        }
        sumNum.unshift(numA[n]);
      }
      /** 减法计算 end **/
      data.splice(0, 2); //前2位计算完成后删除
      //添加运算结果的符号
      if (data.includes('abs')) { //相反执行
        if (symlStr) { //内部B大于A
          if (thatSym[1]) sumNum.unshift('-'); //B小于A
        } else {  //内部A大于B
          if (thatSym[0]) sumNum.unshift('-'); //A小于B
        }
        if (data[0] === 'abs') return this.maxNum(sumNum); //没有可计算的值时则返回结果
        data = data.filter((item, index) => { //过滤
          return item !== 'abs';
        })
        return this.add(this.maxNum(sumNum), ...data);  //有可计算的值时继续计算
      } else { //纯减法
        if (!thatSym[0]) { //2个数字皆为正数
          symlStr ? sumNum.unshift('-') : ''; //B大于A则返回负数
        } else { //2个数字皆为负数
          !symlStr ? sumNum.unshift('-') : ''; //A大于B则返回负数
        }
        if (data.length) { //还有值则继续计算
          return this.sub(this.maxNum(sumNum), ...data);
        }
        return this.maxNum(sumNum);
      }

    }
    /**
     * @method 乘法
     * @param data 需要做乘法的数据
     */
    mul(...data: numAndStr[]): numAndStr { //乘法
      if (data.length === 1) return data[0];
      if (this.testNumber.test(Number(data[0]).toString()) || this.testNumber.test(Number(data[1]).toString())) return 'NaN'; //统一返回NaN
      let computeNum: string[] = this.pushZero(data[0], data[1]);
      let thatSym: string[] = JSON.parse(JSON.stringify(this.numSymbol)); //当前符号
      let [numA, numB]: string[] = computeNum; //计算数字A/B
      let numLength: number = numA.length - 1; //数组已经补位,数组里每一位数字长度都是一致
      /** 乘法计算 start **/
      let sumNum: numAndStr[] = [], fixedNum: number = 0, mulSum: string[] = [], lastZero: string = ''; //fixedNum小数点几位,mulSum,lastZero补零
      for (let n = numLength; n >= 0; n--) {
        let tallyNum: number = 0; //tallyNum记账数字
        let itemArr: numAndStr[] = [];
        for (let c = numLength; c >= 0; c--) {
          if (!isNaN(Number(numA[c]))) { //数字执行
            let sum: number = Number(numA[c]) * Number(numB[n]) + tallyNum;
            let val: number = c ? sum % 10 : sum;
            tallyNum = parseInt((sum / 10).toString());
            let lastVal: string = val + (c === numLength ? lastZero : '');
            !isNaN(Number(numB[n])) ? itemArr.unshift(lastVal) : '';
            continue;
          } else {
            fixedNum = (numLength - c) * computeNum.length; //记录小数点位数
          }
        }
        if (!isNaN(Number(numB[n]))) { //数字执行
          mulSum.push(itemArr.join('')); //存入个位乘法结果 
          lastZero += '0';
        }

      }
      /** 乘法计算 end **/

      data.splice(0, 2); //前2位计算完成后删除
      let symbolStr = Array.from(new Set(thatSym));
      this.filterStatus = false; //不过滤字符
      let mulSumNumArr: string[] = this.add(...mulSum).toString().split('');
      this.filterStatus = true; //还原
      if (fixedNum) {
        let lastLength = mulSumNumArr.length;
        mulSumNumArr.splice(-fixedNum, 0, '.'); //小数情况
        if (fixedNum >= lastLength) mulSumNumArr.unshift('0'); //如果位移超过数字则首位补零
      }
      if (symbolStr.length > 1) mulSumNumArr.unshift('-'); //存在单个负数则写入负数符号
      if (data.length) return this.mul(this.maxNum(mulSumNumArr), ...data); //还有没计算的继续计算反之返回结果
      return this.maxNum(mulSumNumArr);
    }
    /**
    * @method 除法
    * @param data 需要做除法的数据
    */
    div(...data: numAndStr[]): numAndStr { //除法
      if (data.length === 1) return data[0];
      if (this.testNumber.test(Number(data[0]).toString()) || this.testNumber.test(Number(data[1]).toString())) return 'NaN'; //统一返回NaN
      let computeNum: string[] = this.integerNum(this.pushZero(data[0], data[1]));
      let thatSym: string[] = JSON.parse(JSON.stringify(this.numSymbol)); //当前符号
      let [numA, numB]: string[] = computeNum; //计算数字A/B
      let numLength: number = numA.length - 1; //数组已经补位,数组里每一位数字长度都是一致

      /** 除法计算 start **/
      let sumNum: numAndStr[] = [], tallyNum: numAndStr = numA[0]; //sumNum和,tallyNum记账数字
      for (let n = 0; n <= numLength; n++) {
        let val: string = (Number(tallyNum) / Number(numB)).toFixed(30); //  --await---
        let integerNum = Number(val.split(".")[0]);
        let remainderStr = val.split(".")[1];
        let remainder = remainderStr
          ? this.round(this.mul(("0." + remainderStr), numB))
          : 0;
        tallyNum = remainder + (numA[n + 1] ? numA[n + 1] : "0");
        sumNum.push(integerNum);
        if (n === numLength && Number(remainderStr)) {
          //最后一位还有余数则写入
          sumNum.push(".");
          sumNum.push(remainderStr.substring(0, 17));
        }
      }
      /** 除法计算 end **/

      data.splice(0, 2); //前2位计算完成后删除
      let symbolStr = Array.from(new Set(thatSym));
      if (symbolStr.length > 1) sumNum.unshift('-'); //存在单个负数则写入负数符号
      if (data.length) return this.div(this.maxNum(sumNum), ...data); //还有没计算的继续计算反之返回结果
      return this.maxNum(sumNum);
    }
    /**
     * @method 化整
     * @param arr 需要化整的数组 
     */
    private integerNum(
      arr: numAndStr[]
    ) { //化整
      return arr.map((item, index) => {
        item = item.toString().replace(/\./, '');
        return item;
      });
    }
    /**
     * @method 混合运算
     * @param numStr 需要运算的字符串 
     */
    eval(numStr: string): numAndStr {
      numStr = numStr.replace(/\s/g, ''); //过滤空字符
      let val = this.sybCompute(numStr);
      return Number(val).toString() === val ? Number(val) : val;
    }
    /**
     * @method 运算字符规则拆分
     * @param numStr 需要拆分运算的字符
     */
    private sybCompute(numStr: string): string {
      numStr = numStr.replace(/\((\d+\.?\d*)\)/g, '$1'); //过滤无效包装
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
    /**
     * @method 运算流程
     * @param str 运算数据
     */
    private operation(str: string): string {
      if (/(NaN|Infinity)/.test(str)) return 'NaN'; //统一返回NaN
      let val = this.mulAndDiv(str); //乘除法运算
      val = this.addAndSub(val); //加减法运算
      return val
    }
    /**
     * @method 乘除法运算
     * @param str 运算数据
     */
    private mulAndDiv(str: string): string {
      let symbolTag: null | string[] = str.match(/((?<=(-|\+|^))-?\d+\.?\d*)(\*|\/)(-?\d+\.?\d*)/);
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
    /**
     * @method 加减法运算
     * @param str 运算数据
     */
    private addAndSub(str: string): string {
      let symbolTag: null | string[] = str.match(/((?<=(-|\+|^))-?\d+\.?\d*)(\+|-)((-)?\d+\.?\d*)/);
      if (symbolTag) { //有加减法
        let item = symbolTag[0],
          symBolStr = '',
          transStr = item.replace(/(-?\d+\.?\d*)(\+|-)(-?\d+\.?\d*)/g, (data, one, two, three): string => {
            symBolStr = two;
            return one + 's' + three; //处理正负数
          });
        let arr = transStr.split('s');
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
  GLOBAL.numberProc = new numberProcs(); //暴露方法
})(this);