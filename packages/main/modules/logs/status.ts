import axios from 'axios';
import { requestV1 } from '@/axios/request';
import { Logs } from '../../types/apis/logs';

type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success';
interface StepStatusInstance {
  title: string;
  description: string;
  status: StepStatus;
  templateURL?: string;
}
// 初始化数据
export const initStatus = (): StepStatusInstance[] => [
  {
    title: '解析数据',
    description: '解析日志收集到的报文数据',
    status: 'wait',
  },
  {
    title: '下载标准模板',
    description: '下载标准模板内容',
    templateURL: '',
    status: 'wait',
  },
  {
    title: '下载自定义区模板',
    description: '下载自定义区内容',
    status: 'wait',
  },
  {
    title: '解析数据',
    description: '解析打印数据',
    status: 'wait',
  },
  {
    title: '发送请求',
    description: '发送预览请求',
    status: 'wait',
  },
  {
    title: '等待响应',
    description: '等待响应数据返回',
    status: 'wait',
  },
];

export const changeStatus = (status: StepStatusInstance[], step: number, state: StepStatus) => {
  try {
    status[step].status = state;
  } catch (error) {
    console.log('步骤状态设置失败', error);
  }
};

export const changeDescription = (
  status: StepStatusInstance[],
  step: number,
  description: string,
) => {
  try {
    status[step].description = description;
  } catch (error) {
    console.log('步骤描述设置失败', error);
  }
};

export const changeTemplateURL = (
  status: StepStatusInstance[],
  step: number,
  templateURL: string,
) => {
  try {
    status[step].templateURL = templateURL;
  } catch (error) {
    console.log('步骤描述设置失败', error);
  }
};

export const formatAllData = (status: StepStatusInstance[], json: string): Logs.LogsDataJson => {
  try {
    const data: Logs.LogsDataJson = JSON.parse(json);
    if (data.standardTemplateName && data.printData) {
      changeStatus(status, 0, 'success');
      return data;
    } else {
      changeStatus(status, 0, 'error');
      if (!data.standardTemplateName) {
        changeDescription(status, 0, '标准模板地址提取失败');
      }
      if (!data.printData) {
        changeDescription(status, 0, '标准模板数据提取失败');
      }
      throw new Error('JSON数据解析失败');
    }
  } catch (error) {
    console.log(error);
    changeStatus(status, 0, 'error');
    throw new Error('JSON数据解析失败');
  }
};

export const downloadTemplateContent = (
  status: StepStatusInstance[],
  url = '',
  step = 1,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!/^http/.test(url || '')) {
      // 检测url链接不通过直接转发
      console.log('检测url链接不通过直接转发');
      return resolve(url || '');
    }
    changeTemplateURL(status, step, url);
    axios({
      url: url,
      responseType: 'text',
    })
      .then((response) => {
        changeStatus(status, step, 'success');
        return resolve(response.data);
      })
      .catch(() => {
        changeStatus(status, step, 'wait');
        changeDescription(status, step, '重试中');
        return requestV1
          .logTemplateDownload({
            data: {
              link: url,
            },
          })
          .then((response) => {
            changeStatus(status, step, 'success');
            changeDescription(status, step, '重试成功');
            return resolve(response.data);
          })
          .catch((error) => {
            changeStatus(status, step, 'error');
            changeDescription(status, step, '重试失败');
            return reject(error);
          });
      });
  });
};

export const formatPrintData = (status: StepStatusInstance[], printData: string): object => {
  try {
    const data: object = JSON.parse(printData);
    changeStatus(status, 3, 'success');
    return data;
  } catch (error) {
    changeStatus(status, 3, 'error');
    throw new Error('打印数据无法解析');
  }
};

export const previewRequest = (status: StepStatusInstance[], data: Logs.PreviewData) => {
  const form = new FormData();
  form.append('simpData', JSON.stringify(data.simpData) || '');
  form.append('tempUrl', data.tempUrl || '');
  form.append('customTempContent', data.customTempContent || '');
  form.append('customTempUrl', data.customTempUrl || '');
  // form.append('templateContent', data.templateContent || '');
  form.append('clientType', data.clientType || '');
  form.append('version', data.clientVersion || '');
  return requestV1
    .logPreview({
      data: form,
    })
    .then((response) => {
      changeStatus(status, 4, 'success');
      return Promise.resolve(response);
    })
    .catch(() => {
      changeStatus(status, 4, 'error');
      throw new Error('预览接口调用失败');
    });
};
