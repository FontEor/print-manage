|参数|描述||
|---|---|---|
|click()|||
|click({ force: true })|强制一个|一般用于被遮盖元素|
|click({ multiple: true })|点击所有||
|click('topRight')|||
|click('topLeft')|||
|click('top')|||
|click('left')|||
|click('center')|||
|click('right')|||
|click('bottomLeft')|||
|click('bottom')|||
|click('bottomRight')|||

```
// 长按shift按键
cy.get('body').type('{shift}', { release: false })
cy.get('button').click()
```

- dblclick()
- rightclick()