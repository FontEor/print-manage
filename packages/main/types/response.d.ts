// 返回数据结构
export interface ResponseData<D> extends ResponseDataGeneral {
  data: D;
}

export interface ResponseDataList<D> extends ResponseDataGeneral {
  list: D;
  data?: D; // 数据转移位置
}

// 分页数据结构
interface ResponsePageData<D> {
  data: D[];
  start: number;
  total: number;
}

// 分页返回数据结构
export type ResponseDataForPage<D> = ResponsePageData<D>;

// 通用返回数据结构
export interface ResponseDataGeneral {
  code: number;
  message: string;
  start?: number;
  total?: number;
}
