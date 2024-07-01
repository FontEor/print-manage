import { RouteRecordRaw } from 'vue-router';
declare namespace CustomRoute {
  export interface Meta {
    id?: number;
  }

  export interface RouteMap {
    [prop: string]: RouteRecordRaw;
  }
}
