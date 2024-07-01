import qs from 'qs';

const domain = import.meta.env.VITE_APP_CONTENT_DOMAIN;

const formatPath = (url: URL): string => {
  return `${domain}/template-oss?templateVersion=-1&version=3.4.0.0&path=${encodeURIComponent(
    `${url.pathname}${url.search}`,
  )}`;
};

const formatTypeId = (url: URL): string => {
  return `${domain}/template-oss?templateVersion=-1&version=3.4.0.0&path=${encodeURIComponent(
    `${url.pathname}${url.search}`,
  )}`;
};

export const formatCode = (code: string): string => {
  return `${domain}/template-code?templateVersion=-1&version=3.4.0.0&tempCode=${code}`;
};

const formatOuter = (url: URL): string => {
  return `${domain}/template-oss?templateVersion=-1&version=3.4.0.0&path=${encodeURIComponent(
    url.href,
  )}`;
};

export const formatURL = (url: string): string => {
  const instance = new URL('url');
  let result = '';
  if (~instance.host.indexOf('storage.360buyimg.com')) {
    result = formatPath(instance);
  } else if (~instance.host.indexOf('storage.jd.com')) {
    result = formatPath(instance);
  } else if (~url.indexOf('template-content.jd.com/template-content')) {
    result = formatTypeId(instance);
  } else {
    result = formatOuter(instance);
  }
  return result;
};

export const replaceProtocol = (url: string, isHttp = true) => {
  if (isHttp) {
    return url.replace('https:', 'http:');
  } else {
    return url.replace('http:', 'https:');
  }
};
