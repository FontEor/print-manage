export namespace Empty {
  enum pageType {
    1 = '无模板管理系统权限',
    2 = '无运维运营权限',
    3 = '无【运维运营（旧）】菜单的权限',
  }
  export type Type = keyof typeof pageType;
}
