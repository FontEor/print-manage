/**
 * 拷贝内容
 * @param {string} content
 */
export const copyText = (content: string) => {
  const input = document.createElement('input');
  input.setAttribute('id', 'copy_input');
  input.value = content;
  document.body.appendChild(input);
  input.select();
  const result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
};
