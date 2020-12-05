"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-18 15:50:39
 * @LastEditTime: 2020-12-06 01:18:05
 * @description:
 */
var numberProc_es_1 = __importDefault(require("./numberProc-es"));
//测试运算稳定性
//加法测试
console.log('---加法测试 start---');
console.time();
for (var n = 0; n < 100000; n++) {
    var arrs = [123456789, -123456789];
    var sjsA = parseInt((Math.random() * 2).toString());
    var sjsB = parseInt((Math.random() * 2).toString());
    var numStrA = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numStrB = Number((Math.random() * arrs[sjsB]).toFixed(2));
    var numStrC = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numA = numberProc_es_1.default.round(numberProc_es_1.default.add(numStrA, numStrB, numStrC), 2);
    var numB = (numStrA + numStrB + numStrC).toFixed(2);
    numA === numB ? '' : console.log('------ERROR------', numStrA, numStrB, numStrC, numA, numB);
}
console.timeEnd();
console.log('---加法测试 done---');
//减法测试
console.log('\n---减法测试 start---');
console.time();
for (var n = 0; n < 100000; n++) {
    var arrs = [123456789, -123456789];
    var sjsA = parseInt((Math.random() * 2).toString());
    var sjsB = parseInt((Math.random() * 2).toString());
    var numStrA = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numStrB = Number((Math.random() * arrs[sjsB]).toFixed(2));
    var numStrC = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numA = numberProc_es_1.default.round(numberProc_es_1.default.sub(numStrA, numStrB, numStrC), 2);
    var numB = (numStrA - numStrB - numStrC).toFixed(2);
    numA === numB ? '' : console.log('------ERROR------', numStrA, numStrB, numStrC, numA, numB);
}
console.timeEnd();
console.log('---减法测试 done---');
//乘法测试
console.log('\n---乘法测试 start---');
console.time();
for (var n = 0; n < 20000; n++) {
    var arrs = [123456, -123456];
    var sjsA = parseInt((Math.random() * 2).toString());
    var sjsB = parseInt((Math.random() * 2).toString());
    var numStrA = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numStrB = Number((Math.random() * arrs[sjsB]).toFixed(2));
    var numStrC = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numA = numberProc_es_1.default.round(numberProc_es_1.default.mul(numStrA, numStrB, numStrC), 0);
    var numB = (numStrA * numStrB * numStrC).toFixed(0);
    Math.abs(Number(numA) - Number(numB)) <= 1 ? '' : console.log('------ERROR------', numStrA, numStrB, numStrC, numA, numB);
}
console.timeEnd();
console.log('---乘法测试 done---');
//除法测试
console.log('\n---除法测试 start---');
console.time();
for (var n = 0; n < 1000; n++) {
    var arrs = [123456789, -123456789];
    var sjsA = parseInt((Math.random() * 2).toString());
    var sjsB = parseInt((Math.random() * 2).toString());
    var numStrA = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numStrB = Number((Math.random() * arrs[sjsB]).toFixed(2));
    var numStrC = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numA = numberProc_es_1.default.round(numberProc_es_1.default.div(numStrA, numStrB, numStrC), 2);
    var numB = (numStrA / numStrB / numStrC).toFixed(2);
    numA === numB ? '' : console.log('------ERROR------', numStrA, numStrB, numStrC, numA, numB);
}
console.timeEnd();
console.log('---除法测试 done---');
//混合运算测试
console.log('\n---混合测试 start---');
console.time();
for (var n = 0; n < 1000; n++) {
    var arrs = [123456789, -123456789];
    var sjsA = parseInt((Math.random() * 2).toString());
    var sjsB = parseInt((Math.random() * 2).toString());
    var numStrA = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numStrB = Number((Math.random() * arrs[sjsB]).toFixed(2));
    var numStrC = Number((Math.random() * arrs[sjsA]).toFixed(2));
    var numA = numberProc_es_1.default.round(numberProc_es_1.default.eval(numStrA + "+" + numStrB + "-" + numStrC + "*" + numStrB + "/(" + numStrC + "+" + numStrA + ")"), 2);
    var numB = (numStrA + numStrB - numStrC * numStrB / (numStrC + numStrA)).toFixed(2);
    numA === numB ? '' : console.log('------ERROR------', numStrA, numStrB, numStrC, numA, numB);
}
console.timeEnd();
console.log('---混合测试 done---');
