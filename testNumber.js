"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dataA = [];
var dataB = [];
for (var i = 100; i >= 99; i -= 0.01) {
    for (var c = 100; c >= 99; c -= 0.01) {
        var numa_1 = Number(i.toFixed(2));
        var numb = Number(c.toFixed(2));
        var numStr = numa_1 + '+' + numb + '=';
        dataA.push(numStr + (Number((numa_1 / numb).toFixed(10))) + '\n');
        dataB.push(numStr + (Number(Number(mathCount.div(numa_1, numb)).toFixed(10))) + '\n');
    }
}
console.log(JSON.stringify(dataA) === JSON.stringify(dataB)); //判断执行
// fs.writeFile('./countA.text', dataA.join(''), (err) => {
//   if (err) throw err;
//   console.log('文件已保存');
// });
// fs.writeFile('./countB.text', dataB.join(''), (err) => {
//   if (err) throw err;
//   console.log('文件已保存');
// });
