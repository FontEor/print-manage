export const noTemplateMenu = {
  id: 9000000000,
  type: 1,
  code: 'template_management',
  name: '模板',
  url: '',
  parentId: 0,
  children: [
    {
      id: 9000000001,
      type: 1,
      code: 'no_template_permission',
      name: '无模板管理系统权限',
      url: 'NoTemplatePermission',
      parentId: 0,
    },
  ],
};

export const noOperationMenu = {
  id: 9000000100,
  type: 1,
  code: 'operation',
  name: '运营运维',
  url: '',
  parentId: 0,
  children: [
    {
      id: 9000000101,
      type: 1,
      code: 'no_operation_permission',
      name: '无运维运营权限',
      url: 'NoOperationPermission',
      parentId: 0,
    },
  ],
};

export const noTemplateOldMenu = {
  id: 9000000200,
  type: 1,
  code: 'template_management_old',
  name: '模板管理(旧)',
  url: '',
  parentId: 0,
  children: [
    {
      id: 9000000201,
      type: 1,
      code: 'no_template_old_permission',
      name: '无模板管理(旧)系统权限',
      url: 'NoTemplateOldPermission',
      parentId: 0,
    },
  ],
};

export const noOperationOldMenu = {
  id: 9000000300,
  type: 1,
  code: 'operation_old',
  name: '运营运维(旧)',
  url: '',
  parentId: 0,
  children: [
    {
      id: 9000000301,
      type: 1,
      code: 'no_operation_old_permission',
      name: '无【运维运营（旧）】菜单的权限',
      url: 'NoOperationOldPermission',
      parentId: 0,
    },
  ],
};

export const noSystemOldMenu = {
  id: 9000000400,
  type: 1,
  code: 'system_management_old',
  name: '系统接入(旧)',
  url: '',
  parentId: 0,
  children: [
    {
      id: 9000000401,
      type: 1,
      code: 'no_system_old_permission',
      name: '无系统管理(旧)系统权限',
      url: 'NoSystemOldPermission',
      parentId: 0,
    },
  ],
};

export default [
  noTemplateMenu,
  noOperationMenu,
  noTemplateOldMenu,
  noOperationOldMenu,
  noSystemOldMenu,
];
