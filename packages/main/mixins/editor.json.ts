import JSONEditor, { JSONEditorOptions } from 'jsoneditor';

export class JsonEditorMixins {
  private editor: JSONEditor;
  private options: JSONEditorOptions = {
    mode: 'code',
    search: false,
    enableSort: false,
    enableTransform: false,
    language: 'zh-CN',
    onChange: () => {},
  };
  constructor($container: HTMLElement, options?: JSONEditorOptions) {
    if (options) {
      this.options = {
        ...this.options,
        ...options,
      };
    }
    this.editor = new JSONEditor($container, this.options);
  }
  setValue(value: string) {
    try {
      this.editor.set(JSON.parse(value));
    } catch (error) {
      console.log('数据无法解析, 强行编译为JSON试试');
      this.editor.set(JSON.stringify(value));
    }
  }
  getValue(): string | undefined {
    try {
      const value = this.editor.getText();
      JSON.parse(value);
      return value;
    } catch (error) {
      console.log('数据无法解析, 获取数据');
      return undefined;
    }
  }
}
