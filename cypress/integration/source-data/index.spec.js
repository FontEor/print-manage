/// <reference types="cypress" />

const uuid = Cypress._.random(0, 1e6)


describe('数据源管理 模块 测试', () => {

  let cookies = [];
  before(() => {
    cy.fixture('example.json').then((config) => {
      cy.visit('http://test.ssa.jd.com/sso/login?ReturnUrl=http%3A%2F%2Ftemplate.jd.com%3A2000%2F%23%2FsystemManagement');
      cy.log(config, 'config', config.account)
      cy.get('#username').type(config.account);
      cy.get('#password').type(config.password);
      cy.get('#formsubmitButton').click();
      cy.url().should("include", "http://template.jd.com:2000/");
      cy.url().get('h1').should("contain", "物流云打印管理系统");
      cy.getCookies().then(cookie => {
        cookies = cookie;
      })
    })
  })
  beforeEach(() => {
    cookies.forEach(cookie => {
      cy.setCookie(cookie.name, cookie.value, cookie)
    })
  })

  it('打开数据源管理', () => {
    const $menu = cy.get('.el-menu-item')
      .should("contain", "数据源管理")
      .contains('数据源管理')
    $menu.click();
    $menu.should('have.class', 'is-active');
  })
  // 系统
  const systemName = "自动测试组织";
  // 编码
  const code = `testNo${uuid}`;
  // 名称
  const name = `数据源名称${uuid}`;
  // 说明
  const remark = `数据源说明:${uuid}`;

  describe("创建数据源", () => {
    it('打开数据源弹框', () => {
      cy.get('.el-button')
        .should("contain", "新建数据源")
        .contains("新建数据源").click();
      cy.get('.el-overlay:visible')
        .should("contain", "新建数据源");
      cy.get('.source-create-dialog:visible')
        .should("contain", "新建数据源")
    })
    it('选择系统', () => {
      cy.get('.source-create-dialog:visible')
        .find('.el-form-item')
        .should("contain", "系统名称")
        .contains('系统名称')
        .parent('.el-form-item')
        .find('.el-input__inner')
        .click()
        .focus();
      cy.get('.el-select__popper').find('.el-select-dropdown__item:visible')
        .should("contain", systemName)
        .contains(systemName)
        .parent('.el-select-dropdown__item')
        .click();
    })
    it('填写数据源编码', () => {
      cy.get('.source-create-dialog:visible')
        .find('.el-form-item')
        .should("contain", "数据源编码")
        .contains('数据源编码')
        .parent('.el-form-item')
        .find('.el-input__inner')
        .type(code)
    })
    it('填写数据源名称', () => {
      cy.get('.source-create-dialog:visible')
        .find('.el-form-item')
        .should("contain", "数据源名称")
        .contains('数据源名称')
        .parent('.el-form-item')
        .find('.el-input__inner')
        .type(name)
        .should('have.value', name)
    })
    it('填写数据源说明', () => {
      cy.get('.source-create-dialog:visible')
        .find('.el-form-item')
        .should("contain", "数据源说明")
        .contains('数据源说明')
        .parent('.el-form-item')
        .find('.el-textarea__inner')
        .type(remark)
        .should('have.value', remark)
    })
    it('点击保存', () => {
      cy.get('.source-create-dialog:visible')
        .find('.el-button')
        .contains("确定")
        .parents('.el-button')
        .click();
    })
    it('查看新纪录是否存在', () => {
      cy.get('.el-table__body-wrapper:visible')
        .should("contain", code)
        .should("contain", name)
    })
  })

  describe("编辑数据源", () => {
    it("打开数据源详情", () => {
      cy.get('.el-table__body-wrapper:visible')
        .contains(code)
        .parents('.el-table__row')
        .find('.el-button')
        .contains("编辑详情")
        .parent('.el-button')
        .click()
      cy.intercept('GET', '/api/orgs/**/sources/**').as('getDetail')
      cy.url().should("include", 'sourceDetail');
      cy.log('等待接口完成')
      cy.wait('@getDetail');
      cy.wait(200);
      cy.get('#pane-summary')
        .find('.el-form.detail-from')
        .find('.el-input__inner')
        .should('have.value', name);
    })
    it('启动编辑', () => {
      cy.get('#pane-summary')
        .contains('编辑')
        .click();
    })
    it('填写新名称', () => {
      cy.get('#pane-summary')
        .contains('数据源名称')
        .parents('.el-form-item')
        .find('.el-input__inner')
        .clear()
        .type(`${name}new`)
        .should('have.value', `${name}new`)
    })
    it('填写新说明', () => {
      cy.get('#pane-summary')
        .contains('数据源说明')
        .parents('.el-form-item')
        .find('.el-textarea__inner')
        .clear()
        .type(`${remark}new`)
        .should('have.value', `${remark}new`)
    })
    it('保存', () => {
      cy.get('#pane-summary')
        .contains('保存')
        .click();
    })
    it('验证保存是否成功', () => {
      cy.get('#pane-summary')
        .find('.el-input.is-disabled')
        .find('.el-input__inner')
        .should('have.value', `${name}new`)
    })
  })

  describe.skip("数据模型", () => {
    it('打开数据源管理', () => {
      const $menu = cy.get('.el-menu-item')
        .should("contain", "数据源管理")
        .contains('数据源管理')
      $menu.click();
      $menu.should('have.class', 'is-active');
    })
    it('查看新纪录是否存在', () => {
      cy.get('.el-table__body-wrapper:visible')
        .should("contain", code)
        .should("contain", name)
    })
    it("打开数据源模型", () => {
      cy.get('.el-table__body-wrapper:visible')
        .contains(code)
        .parents('.el-table__row')
        .find('.el-button')
        .contains("数据模型")
        .parent('.el-button')
        .click()
      cy.intercept('GET', '/api/orgs/**/sources/**').as('getDetail')
      cy.url().should("include", 'sourceDetail');
      cy.log('等待接口完成')
      cy.wait('@getDetail');
      cy.wait(200);
      cy.get('#pane-data')
        .should('contain', code);
    })
    it('导入JSON', () => {
      cy.get('#pane-data')
        .contains('导入JSON')
        .should('have.class', 'el-button')
        .click();
    })
    it('写入json', () => {
      cy.get('.el-overlay:visible')
        .should('contain', '导入JSON数据')
        .find('.ace_content')
        .click()
      cy.get('.el-overlay:visible')
        .find('textarea.ace_text-input')
        .type('{backspace}{backspace}', {
          force: true
        })
        .type('{"a": 1, "b": 2, "list": [{"a": 1}, {"a": 2}, {"a": 3}]}', {
          force: true,
          parseSpecialCharSequences: false
        })
        cy.get('.el-overlay:visible')
          .contains('确定')
          .should('have.class', '.el-button')
          .click();
    })
    it('数据是否导入成功', () => {
      cy.get('#pane-data')
        .find('.el-table__body-wrapper')
        .should('contain', 'list')
    })
    it('删除属性', () => {
      cy.get('#pane-data')
    })
  })

  describe("删除数据源", () => {
    it('打开数据源管理', () => {
      const $menu = cy.get('.el-menu-item')
        .should("contain", "数据源管理")
        .contains('数据源管理')
      $menu.click();
      $menu.should('have.class', 'is-active');
    })
    it('查看新纪录是否存在', () => {
      cy.get('.el-table__body-wrapper:visible')
        .should("contain", code)
        .should("contain", name)
    })
    it('点击删除按钮', () => {
      cy.get('.el-table__body-wrapper:visible')
        .contains(code)
        .parents('.el-table__row')
        .find('.el-button')
        .contains("删除")
        .parent('.el-button')
        .click()
    })
    it('点击确认删除', () => {
      cy.get('.el-overlay.is-message-box:visible')
        .should('contain', '删除提示')
        .contains('确定')
        .click()
    })
    it('是否无法找到数据', () => {
      cy.get('.el-table__body-wrapper:visible')
        .should("not.contain.text", code)
    })
  })

})
