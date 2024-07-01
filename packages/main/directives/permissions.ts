import { Store } from 'Vuex';
import type { Directive, App } from 'vue';
import store from '../store';
/**
 * @doc 自定义指令文档位置
 * @see {@link https://staging-cn.vuejs.org/guide/reusability/custom-directives.html}
 */

/**
 * 是否有按钮权限
 * @param store
 * @param id
 * @returns
 */
const hasButton = (id: string): boolean => {
  return !!store.state.buttons[id];
};

const permission: Directive = {
  // 在绑定元素的 attribute 前
  // 或事件监听器应用前调用
  created(element, { arg, value }, vnode, prevVnode) {},
  // 在元素被插入到 DOM 前调用
  beforeMount(element, { arg, value }, vnode, prevVnode) {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都挂载完成后调用
  mounted(element, { arg }) {
    if (arg && !hasButton(arg)) {
      element.parentNode.removeChild(element);
    }
  },
  // 绑定元素的父组件更新前调用
  beforeUpdate() {},
  // 在绑定元素的父组件
  // 及他自己的所有子节点都更新后调用
  updated(element, { arg }) {
    if (arg && !hasButton(arg)) {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }
  },
  // 绑定元素的父组件卸载前调用
  beforeUnmount() {},
  // 绑定元素的父组件卸载后调用
  unmounted() {},
};

/**
 * @doc 使用方式 v-permission:bofkkZTKX [bofkkZTKX 为按钮ID]
 * @param app
 */
export default function (app: App) {
  app.directive('permission', permission);
}
