[基础语法1](https://juejin.cn/post/6966502107230765070)
[基础语法2](https://juejin.cn/post/6982577605870845960)
[基础语法3](https://juejin.cn/post/6844904162799386632)
[基础语法4](https://juejin.cn/post/6996996742612779021)
[生命周期](https://juejin.cn/post/6912632681813508109)

[Vite](https://cn.vitejs.dev/guide/features.html#css-pre-processors)

[Vue3](https://vue3js.cn/docs/zh/guide/composition-api-setup.html#%E7%BB%93%E5%90%88%E6%A8%A1%E6%9D%BF%E4%BD%BF%E7%94%A8)

[Vue-Router](https://next.router.vuejs.org/zh/guide/#javascript)

[Element-Plus](https://element-plus.gitee.io/#/zh-CN/component/form)

```
defineEmits
defineExpose
const slots = useSlots()
const attrs = useAttrs()
```

```
Props 默认值
import { defineProps, withDefaults } from "vue"

interface Props {
  msg?: string, 
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: "Hello", 
  labels: () => ["one", "two"]
})

Props解构
import { toRefs } from 'vue'
const { title } = toRefs(props)

```