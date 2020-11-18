/*
 * @Author: jackTian
 * @Email: jacktian9527@163.com
 * @Date: 2020-11-18 15:50:39
 * @LastEditTime: 2020-11-18 15:51:54
 * @description: 
 */
import fs from 'fs';
let dataA:string[] = [];
let dataB:string[] = [];
for(let i=100; i>=99; i-=0.01){
  for(let c=100; c>=99; c-=0.01){
    let numa = Number(i.toFixed(2));
    let numb = Number(c.toFixed(2));
    let numStr = numa + '+' + numb + '=';
    dataA.push( numStr + (Number((numa / numb).toFixed(10))) + '\n');
    dataB.push( numStr + (Number(Number(mathCount.div(numa,numb)).toFixed(10))) + '\n');
  }
}
console.log(JSON.stringify(dataA)===JSON.stringify(dataB)); //判断执行
// fs.writeFile('./countA.text', dataA.join(''), (err) => {
//   if (err) throw err;
//   console.log('文件已保存');
// });
// fs.writeFile('./countB.text', dataB.join(''), (err) => {
//   if (err) throw err;
//   console.log('文件已保存');
// });
