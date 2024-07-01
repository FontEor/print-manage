import { getStyle } from 'element-plus/es/utils/dom/style';
import { VNode, ObjectDirective } from 'vue';

const mouseEnterEvent = (tooltipNode: VNode, el: any, line: number) => {
  if (tooltipNode.component) {
    tooltipNode.component.props.disabled = true;
  }
  const targetEl = el.children && el.children[0];
  const rang = document.createRange();
  rang.setStart(targetEl, 0);
  rang.setEnd(targetEl, 1);
  if (line > 1) {
    // 多行
    const rangHeight = rang.getBoundingClientRect().height;
    const paddingHeight =
      (parseInt(getStyle(targetEl, 'paddingTop'), 10) || 0) +
      (parseInt(getStyle(targetEl, 'paddingBottom'), 10) || 0);
    if (
      rangHeight + paddingHeight > targetEl.offsetHeight ||
      targetEl.scrollHeight > targetEl.offsetHeight
    ) {
      if (tooltipNode.component) {
        tooltipNode.component.props.disabled = false;
      }
    }
  } else {
    // 单行
    const rangWidth = rang.getBoundingClientRect().width;
    const paddingWidth =
      (parseInt(getStyle(targetEl, 'paddingLeft'), 10) || 0) +
      (parseInt(getStyle(targetEl, 'paddingRight'), 10) || 0);
    if (
      rangWidth + paddingWidth > targetEl.offsetWidth ||
      targetEl.scrollWidth > targetEl.offsetWidth
    ) {
      if (tooltipNode.component) {
        tooltipNode.component.props.disabled = false;
      }
    }
  }
};

export const showTip: ObjectDirective = {
  mounted(el, binding, vnode) {
    if (!el) return;
    const line = binding.value || 1;
    const tooltipNode = (vnode.children as Array<VNode>).find((childComponent) => {
      return childComponent.component?.type.name === 'ElTooltip';
    });
    if (tooltipNode) {
      el.addEventListener('mouseenter', mouseEnterEvent(tooltipNode, el, line));
    }
  },
  beforeUnmount(el, binding, vnode) {
    if (!el) return;
    const line = binding.value || 1;
    const tooltipNode = (vnode.children as Array<VNode>).find((childComponent) => {
      return childComponent.component?.type.name === 'ElTooltip';
    });
    if (tooltipNode) {
      el.removeEventListener('mouseenter', mouseEnterEvent(tooltipNode, el, line));
    }
  },
};
