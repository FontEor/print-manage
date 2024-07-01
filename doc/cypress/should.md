# 断言库
- [chai](http://github.com/chaijs/chai)
- [sinon-chai](http://github.com/domenic/sinon-chai)
- [chaijs-jquery](http://github.com/chaijs/chaijs-jquery)
- [官方文档](https://www.chaijs.com/api/assert)
## should
|命令|描述|
|---|---|
|should('not.exist')|不存在|
|should('have.length', 1)|元素数量|
|should('not.have.text', 'text')|没有文字|
|should('not.contain', 'text')|不包含|
|should('be.visible')|显示|
|should('not.exist')|不存在|
|should('be.checked')|选中|
|should('have.css', 'text-align', 'line-height')|有样式|

#### 代码演示
```
.should($element => {
  expect($element[0].className).to.match(/regexp/);
})
```



