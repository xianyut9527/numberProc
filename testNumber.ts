/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-18 15:50:39
 * @LastEditTime: 2020-12-04 21:34:05
 * @description: 
 */
import numberProc from "./numberProc-es"
//测试运算稳定性
console.time();
for (let n = 0; n < 10000; n++) {
  let arrs = [1234, -1234];
  let sjsA = parseInt((Math.random() * 2).toString());
  let sjsB = parseInt((Math.random() * 2).toString());
  let numStrA: number = Number((Math.random() * arrs[sjsA]).toFixed(2));
  let numStrB: number = Number((Math.random() * arrs[sjsB]).toFixed(2));
  let numStrC: number = Number((Math.random() * arrs[sjsA]).toFixed(2));
  let numA = Number(Number(numberProc.eval(`${numStrA}/${numStrB}/${numStrC}`)).toFixed(2));
  let numB = Number((numStrA / numStrB / numStrC).toFixed(2));
  numA === numB ? '' : console.log('------ERROR------', numStrA, numStrB,numStrC, numA, numB);
}
console.log('---done---')
console.timeEnd();

// // import fs from 'fs';
// // let dataA:string[] = [];
// // let dataB:string[] = [];
// // for(let i=100; i>=99; i-=0.1){
// //   for(let c=100; c>=99; c-=0.1){
// //     let numa = Number(i.toFixed(2));
// //     let numb = Number(c.toFixed(2));
// //     let numStr = numa + '*' + numb + '=';
// //     dataA.push( numStr + (Number((numa + numb).toFixed(10))) + '\n');
// //     dataB.push( numStr + (Number(Number(numberProc.add(numa,numb)).toFixed(10))) + '\n');
// //   }
// // }
// // console.log(JSON.stringify(dataA)===JSON.stringify(dataB)); //判断执行

// type strAndNumber = string | number;

// function strAndNum(x:strAndNumber):strAndNumber{
//   return (<string>x).length;
// }
// let sAN = strAndNum('2');
// console.log(sAN,typeof sAN);