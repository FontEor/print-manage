import { WhiteList } from '../../types/apis/whiteList';

export default function (): WhiteList.SubmitExamine {
  // return {
  //     companyName: '上海小度技术有限公司', // 企业名称
  //     companyCode: '91310115MA1K4MF39X', // 企业社会信用代码
  //     companyMerchantCode: '010K1789070', // 商家编码
  //     companyContact: 'liyankai', // 联系人
  //     companyNumber: '18601148972', // 联系电话
  //     companyMail: 'liyankai6@jd.com', // 联系邮箱
  //
  //     platformType: 0, // 接入类型 0 JOS 1 物流开放平台
  //     appKey: '6ae52b04635e46ad998485d2ce54b7c3',
  //     sysName: '测试系统1', //系统名称
  //     waybillCode: 'JDV009600878716', // 运单号
  //
  //     hasCustomArea: 0, // 是否有自定义区域
  //     imageUrl: '', // 面单图片地址
  //     pinType: 1, // 客户类型
  //     scene: 5, // 场景枚举 TODO
  //     auditMind: undefined, // 审核意见
  //     generateTempUrl: '',
  //     status: undefined, // 状态
  // }
  return {
    companyName: '', // 企业名称
    companyCode: '', // 企业社会信用代码
    companyMerchantCode: '', // 商家编码
    companyContact: '', // 联系人
    companyNumber: '', // 联系电话
    companyMail: '', // 联系邮箱

    platformType: 0, // 接入类型 0 JOS 1 物流开放平台
    appKey: '',
    sysName: '', //系统名称
    waybillCode: '', // 运单号

    hasCustomArea: 0, // 是否有自定义区域
    imageUrl: '', // 面单图片地址
    pinType: 1, // 客户类型
    scene: 5, // 场景枚举 TODO
    auditMind: undefined, // 审核意见
    generateTempUrl: '',
    status: undefined, // 状态
  };
}
