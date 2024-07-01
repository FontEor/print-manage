# cy方法
|参数|描述||
|---|---|---|
|go('back')|go(-1)|
|go('forward'))|go(1)|

# 元素方法
```
cy.get('span').then($span => {
  span.text();
})
```

|参数|描述||
|---|---|---|
|text()|获取文本|
|clear()|清除内容|
|type()|输入内容|
|check()|radio选中|
|uncheck()|radio取消选中|
|select()|select选中|

# range拖动
```
cy.get('element')
  .invoke('val', 25)
  .trigger('change')
  .get('input[type=range]')
  .siblings('p')
  .should('have.text', 25);
```

# 滚动
```
// 滚动到元素
cy.get('element').scrollIntoView().should('be.visible');
```

# 遍历
```
// 等同于jquey.each
cy.get('element').each()
```