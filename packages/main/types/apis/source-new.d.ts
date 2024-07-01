import { SourceData } from '@/types/apis/sourceData';
import { ResponseDataForPage } from '@/types/response';
export namespace SourceNew {
  export interface Instance extends SourceData.Instance {
    commander?: string;
  }
  export interface IdParams {
    id?: number;
  }
  export interface DetailQuery extends IdParams {
    sourceId: string;
  }
  /**
   * @description:修改新数据源
   * */
  export interface ChangeData {
    name: string;
    commander: string;
    remark: string;
  }
  export interface ChangeDataAxios {
    data: ChangeData;
    replacements: DetailQuery;
  }

  /**
   * @description:创建新数据源
   * */
  export interface CreateData extends ChangeData {
    code: string;
  }

  export type CreateAxios = {
    data: CreateData;
    replacements: IdParams;
  };
  export type ResourceData = {
    id: number;
    sourceId: number;
  };
}

export namespace SourcePropertyNew {
  export interface ChangeData {
    id: number;
    remark: string;
    sourceId: number;
    simpData: string;
    dataType: number;
    parentId: number;
    commander?: string;
    propertyCode: string;
    propertyName: string;
    enumItemId?: number;
  }
  export interface ChangeDataAxios {
    data: ChangeData;
    replacements: SourceNew.DetailQuery;
  }
  export interface AddProperty {
    parentId?: number;
    sourceId?: number;
  }
}

export namespace EnmusProperty {
  /**
   * @description: 自定义key
   */
  export interface EnumValue {
    [key: string]: {
      [key: string]: string; // 自定义可以value
    };
  }

  /**
   * @description: 枚举列表参数
   */
  export interface Instance {
    id: number;
    ts: string; // 时间戳
    orgId: number; // 系统ID
    version: number; // 版本号
    isDelete: number; // 是否删除 0|1
    enumCode: string; // 枚举编码
    enumName: string; // 枚举名称
    createUser: string; // 创建人
    updateUser: string; // 更新人
    createTime: string; // 创建时间
    updateTime: string; // 更新时间
    enumValue: EnumValue; // 自定义枚举值
  }

  export type ListResponse = ResponseDataForPage<Instance>; // 重写数据列表 -> enumManage.d.ts
}
