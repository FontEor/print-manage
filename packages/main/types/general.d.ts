export declare namespace General {
  export interface G_S_Object {
    [prop: string]: string;
  }
  export interface G_N_Object {
    [prop: string]: number;
  }
  export interface G_A_Object {
    [prop: string]: number;
  }

  export interface Option<T> {
    label: string;
    value: T;
  }
}
