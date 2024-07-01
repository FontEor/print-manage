# 脚本帮助

## 基本描述

1. _data 是打印数据【只读】
    1.  可以理解为数据源，或者pullData接口拉取的数据
2. _item 是模板打印元素数据 详见[文档](https://cloud.jdl.com/#/open-business-document/access-guide/157/53984)中的属性说明
3. 表格的预处理数据脚本return 为_data 而不是 _item

## 样例数据 以下所有示例皆使用此样例值作为演示数据。
```
{
    "example1": 1,
    "example2": {
        "example3": 2
    },
    "example4": 1,
    "example5": {
        "example6": {
            "example7": false
        }
    },
    "example8": [{
        "field1": 1,
        "field2": 2
    }, {
        "field1": 3,
        "field2": 4
    }, {
        "field1": 5,
        "field2": 6
    }, {
        "field1": 7,
        "field2": 8
    }],
    "example9": [
        { 'skuNo': 1, 'count': 2 },
        { 'skuNo': 1, 'count': 4 }
    ]
}
```

### 基本使用示例
##### 根据数值替换打印文字

> 假设逻辑为通过数据中的某个字段判断。值如果为1那么打印特惠送，值如果为2那么打印特快送。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data[字段名字] == 1) {
		_item.content = "特惠送"
	}
	if (_data[字段名字] == 2) {
		_item.content = "特快达"
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example1字段，那么需要修改字段名称为'example1'即可。

```
// 修改后的示例代码代码
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data['example1'] == 1) {
		_item.content = "特惠送"
	}
	if (_data['example1'] == 2) {
		_item.content = "特快达"
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example3字段，那么需要修改_data[字段名字]为_.get(_data, 'example2.example3')即可。

```
// 修改后的示例代码代码
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_.get(_data, 'example2.example3') == 1) {
		_item.content = "特惠送"
	}
	if (_.get(_data, 'example2.example3') == 2) {
		_item.content = "特快达"
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example8中第一组数据中的field1字段，那么需要修改_data[字段名字]为_.get(_data, 'example8[0].field1')即可。

```
// 修改后的示例代码代码
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_.get(_data, 'example8[0].field1') == 1) {
		_item.content = "特惠送"
	}
	if (_.get(_data, 'example8[0].field1') == 2) {
		_item.content = "特快达"
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example1字段，并且配合其他文字使用那么请看下面示例代码。

```
// 修改后的示例代码代码
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	// 文字不打印示例
	if (_data['example1'] == 1) {
		_item.content = ""
	}
	// 打印其他文字示例
	if (_data['example1'] == 2) {
		_item.content = '人民币:' + _.get(_data, 'example2.example3') + '元'
	}
	// 自动处理两位小数示例
	if (_data['example1'] == 3) {
		_item.content = '人民币:' + (
		    _.get(_data, 'example2.example3')
	    ).toFixed(2) + '元'
	}
	return _item
})(_data, _item)
```

> 表格内部文字拼接方式[注意表格中单元格数据是在_item.value中 并且需要赋值给_item.value]

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	_item.value = _item.value + '元'
	return _item;
})(_data, _item)
```

> 保留两位小数的处理方式 如果是字符串类型的数据，需要先使用 +转换数据为数字类型，再使用toFixed(位数)保留小数位

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	_item.value = (+_item.value).toFixed(2) + '元'
	return _item;
})(_data, _item)
```

##### 根据数值判断是否显示
> 假设逻辑为通过数据中的某个字段判断。值如果为1，那么打印此元素，值如果为0，那么不打印此元素。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data[字段名字] == 0) {
		_item.show = false
	}
	if (_data[字段名字] == 1) {
		_item.show = true
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example3字段，那么需要修改字段名称为'example3'即可。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data['example3'] == 0) {
		_item.show = false
	}
	if (_data['example3'] == 1) {
		_item.show = true
	}
	return _item
})(_data, _item)
```

> 如果需要获取数据中的example7字段，那么需要修改_data[字段名字]为_.get(_data, 'example5.example6.example7')即可。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_.get(_data, 'example5.example6.example7') == false) {
		_item.show = false
	}
	if (_.get(_data, 'example5.example6.example7') == true) {
		_item.show = true
	}
	return _item
})(_data, _item)
```

> 脚本可优化为

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	_item.show = _.get(_data, 'example5.example6.example7')
	return _item
})(_data, _item)
```

##### 根据数值修改文字颜色

> 假设逻辑为通过数据中的某个字段判断。值如果为1那么打印黑色文字，值如果为2那么打印白色文字。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data[字段名字] == 1) {
		_item.foreColor = "#000000"
	}
	if (_data[字段名字] == 2) {
		_item.foreColor = "#FFFFFF"
	}
	return _item
})(_data, _item)
```
> 如果需要获取数据中的example1字段，那么需要修改字段名称为'example1'即可。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data['example1'] == 1) {
		_item.foreColor = "#000000"
	}
	if (_data['example1'] == 2) {
		_item.foreColor = "#FFFFFF"
	}
	return _item
})(_data, _item)
```

##### 根据数值修改文字背景颜色

> 假设逻辑为通过数据中的某个字段判断。值如果为1那么打印黑色背景，值如果为2那么打印白色背景。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data[字段名字] == 1) {
		_item.backgroudColor = "#000000"
	}
	if (_data[字段名字] == 2) {
		_item.backgroudColor = "#FFFFFF"
	}
	return _item
})(_data, _item)
```
> 如果需要获取数据中的example1字段，那么需要修改字段名称为'example1'即可。

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
	if (_data['example1'] == 1) {
		_item.backgroudColor = "#000000"
	}
	if (_data['example1'] == 2) {
		_item.backgroudColor = "#FFFFFF"
	}
	return _item
})(_data, _item)
```

##### 表格数据求和

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
    _item.value = _.sumBy(_data['example8'], 'field1')
	return _item
})(_data, _item)
```
> 如果数据为String类型那么请将代码改为下面方式即可

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
    _item.value = _.sumBy(_data['example8'], function(i) {
        return +o.field1 || 0; 
    })
	return _item
})(_data, _item)
```

#### 表格数据预处理【重点注意return的是_data】

> 数据源中的example8字段对应的列表数据，先根据field1的数据正序排列，再根据field2的数据倒叙排列

```
(function(_data, _item) {
	// _data 是打印数据【只读】
	// _item 是模板打印元素数据
	// 模板打印元素文档地址：https://cloud.jdl.com/#/open-business-document/access-guide/157/53984
    _data.tableSource=_.orderBy(_data.example8,['field1','field2'],['asc','desc']);
	return _data;
})(_data, _item)

```

### 复杂用法[其他复杂用法请自行尝试]

#### 归并求和
```
(function (_data, _item) {
    // 通过skuNo字段将数据进行归并处理
    const obj = _.groupBy(_data.example9, 'skuNo')
    // 累加数据中的count字段
    _data.tableSource = _.map(
        _.values(obj), (array) => {
            _.set(array, '[0].count', _.sumBy(array, 'count'))
            return array[0];
        }
    )
    return _data
})(_data, _item)
// 
```

#### 其他可修改配置项详见[文档](https://cloud.jdl.com/#/open-business-document/access-guide/157/53984)中的属性说明
#### 其他内置函数详见[文档](https://lodash.com/docs/4.17.15)
