export namespace ENUMS {
  export interface Instance {
    label: string;
    value: string | number;
  }
  export type List = Instance[];
  export type Obj<T = string | number> = {
    [propsName: string]: T;
  };

  export interface LEVEL extends Instance {
    children?: LEVEL[];
  }
}
