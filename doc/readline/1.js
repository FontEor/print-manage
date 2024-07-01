const fs = require('fs');
const path = require('path');
const readline = require('readline');
const filePath = path.resolve(__dirname, '1.txt');
const outFilePath = path.resolve(__dirname, '1.json');

const json = {}
const regexpCN = /[^\x00-\xff]/;
// [^\x00-\xff]

try {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: process.stdout,
    terminal: false
  });
  rl.on('line', (line) => {
    const [str1, str2] = line.split(" ");
    if(regexpCN.test(str1)) {
      json[str2] = str1
    } else {
      json[str1] = str2
    }
  });

  rl.on('close', () => {
    fs.writeFileSync(outFilePath, JSON.stringify(json));
    console.log('####### 写入文件完成');
  })

} catch (err) {
  console.error(err);
}