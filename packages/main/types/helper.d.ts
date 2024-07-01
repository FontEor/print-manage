import { UnwrapRef } from 'vue';
export type ExposedToComputed<T extends object> = {
  [key in keyof T]: () => UnwrapRef<T[key]>;
};
