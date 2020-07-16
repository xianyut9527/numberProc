/*
 * @Author: jacktian
 * @Date:   2020-07-08 15:01:55
 * @Last Modified by:   jacktian
 * @Last Modified time: 2020-07-16 18:02:05
 */
class numberProcess {
    constructor() {
        this.numberVal = ''; //计算字符串
    }
    add(a, b) { //加法
        let integerBase = this.baseNum(a, b);
        let numa = Number(a) * integerBase;
        let numb = Number(b) * integerBase;
        let val = (numa + numb) / integerBase;
        return this.bigConduct(val)
    }
    sub(a, b) { //减法
        let integerBase = this.baseNum(a, b);
        let numa = Number(a) * integerBase;
        let numb = Number(b) * integerBase;
        let val = (numa - numb) / integerBase;
        return this.bigConduct(val);
    }
    dsub(a, b) { //除法
        let integerBase = this.baseNum(a, b);
        let numa = Number(a) * integerBase;
        let numb = Number(b) * integerBase;
        let val = numa / numb;
        return this.bigConduct(val);
    }
    madd(a, b) { //乘法
        let integerBase = this.baseNum(a, b);
        let integerBaseb = integerBase + (integerBase.toString().replace(/1/, ''));
        let numa = Number(a) * integerBase;
        let numb = Number(b) * integerBase;
        let val = numa * numb / integerBaseb;
        return this.bigConduct(val);
    }
    baseNum(a, b) { //基数
        let na = a.toString().split('.');
        let nb = b.toString().split('.');
        let lengtha = na[1] ? na[1].length : 0;
        let lengthb = nb[1] ? nb[1].length : 0;
        let maxNum = lengtha < lengthb ? lengthb : lengtha;
        let bs = '1';
        for (let i = 0; i < maxNum; i++) {
            bs += 0;
        }
        return Number(bs);
    }
    bigConduct(val) { //超过10位小数截取(粗糙解决js大数问题)
        let valArr = val.toString().split('.');
        return valArr[1] && valArr[1].length > 10 ? Number(val.toFixed(10)) : val;
    }    
    eval(numStr) {
        this.numberVal = numStr?numStr.replace(/\s/g,''):''; //去除空字符串
        return this.numberVal?this.sybCompute():0;
    }
    sybCompute() { //优先计算符
        let sybSplit = this.numberVal.match(/(\(\d*\.?\d*((\+|\-|\*|\/)\d*\.?\d*)+\))+/g);
        let lastNum = 0;
        if (sybSplit) {
            sybSplit.forEach((item, index) => {
                let str = item.replace(/[()]/g, '');
                let num = this.operation(str);
                let strReg = new RegExp(item.replace(/(\+|\-|\*|\/|\.|\(|\))/g, '\\$1'));
                let val = this.numberVal.replace(strReg, num);
                if (val.includes('(')) { //有优先计算符循环计算
                    //console.log('---go on ---');
                    lastNum = this.eval(val);
                } else {
                    let sybStr = val.replace(/\d*\.?\d*/g, '')
                    if (sybStr) { //有运算符继续执行
                        //console.log(val,'---operation go on---');
                        lastNum = this.operation(val);
                        //console.log(lastNum,'---lastNum1----');
                    } else {
                        lastNum = Number(val);
                        //console.log(lastNum,'---back data---');
                    }
                }
            })
        } else { //普通运算
            lastNum = this.operation(this.numberVal);
            //console.log(lastNum,'---lastNum2----');
        }
        return lastNum;
    }
    operation(str) { //乘除加减运算
        let checkStr = str.search(/[^\d\.\+\-\*\/\(\)]/);
        let numLength = str.match(/\d+\.?\d*/g).length; //数字长度
        let sybLength = str.match(/[^\d\.]/g).length; //符号长度
        if(checkStr!==-1){
           return '语法错误';
        }else if(numLength!==sybLength+1){
           return '格式错误';
        }
        let syba = str.match(/\d*\.?\d*(\*|\/)\d*\.?\d*/);
        let sybb = str.match(/\d*\.?\d*(\+|\-)\d*\.?\d*/);
        let strLength = str.replace(/\d*\.?\d*/g, '').split('').length;
        if (syba) {
            let arrSplit = syba[0].split(/\*|\//);
            let backNuma = syba[0].includes('*') ? this.madd(arrSplit[0], arrSplit[1]) : this.dsub(arrSplit[0], arrSplit[1]);
            if (strLength > 1) {
                let sybbReg = syba[0].replace(/(\+|\-|\*|\/|\.)/g, '\\$1');
                let strReg = new RegExp(sybbReg);
                let strData = str.replace(strReg, backNuma);
                return this.operation(strData);
            } else {
                //console.log(backNuma,'---last1---');
                return backNuma;
            }
        } else {
            let arrSplit = sybb[0].split(/\+|\-/);
            let backNumb = sybb[0].includes('+') ? this.add(arrSplit[0], arrSplit[1]) : this.sub(arrSplit[0], arrSplit[1]);
            if (strLength > 1) {
                let sybbReg = sybb[0].replace(/(\+|\-|\*|\/|\.)/g, '\\$1');
                let strReg = new RegExp(sybbReg);
                let strData = str.replace(strReg, backNumb);
                return this.operation(strData);
            } else {
                //console.log(backNumb,'---last2---');
                return backNumb;
            }
        }
    }
}

let numberProc = new numberProcess();