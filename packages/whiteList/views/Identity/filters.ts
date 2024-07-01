export const statusFilter = (status: number | undefined) => {
  switch (status) {
    case 0:
      return '认证中';
    case 1:
      return '认证失败';
    case 2:
      return '认证通过';
    default:
      return '未认证';
  }
};
// 0：待审核   1：审核未通过  2： 审核通过  3：撤回
// 'primary' | 'success' | 'warning' | 'danger' | 'info'
export const statusTypeFilter = (status: number | undefined) => {
  switch (status) {
    case 0:
      return 'warning';
    case 1:
      return 'danger';
    case 2:
      return 'success';
    default:
      return 'info';
  }
};
