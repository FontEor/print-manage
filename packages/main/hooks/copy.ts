import { ElMessage } from 'element-plus';
import copy from 'copy-text-to-clipboard';

interface CopyOptions {
  emptyMessage?: string;
  prefix?: string;
}

/**
 * 复制内容
 * @param {string} text 被复制的内容
 * @param {object} options 选项数据
 * @param {string} text 被复制的内容
 * @param {string} options.emptyMessage 复制错误时的提示
 * @param {string} options.prefix 复制内容前缀
 * @returns {undefined}
 */
export const copyFn = (text: string, options: CopyOptions = {}): void => {
  try {
    if (!text) {
      ElMessage.error(options.emptyMessage || '复制内容不能为空');
      return;
    }
    let result: boolean;
    if (options.prefix) {
      result = copy(options.prefix + text);
    } else {
      result = copy(text);
    }
    if (result) {
      ElMessage({
        message: '复制成功',
        type: 'success',
      });
    } else {
      ElMessage.error('复制失败');
    }
  } catch (err) {
    ElMessage({
      message: '复制失败',
      type: 'error',
    });
    console.error('复制失败', err);
  }
};
