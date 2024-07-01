import md5 from 'blueimp-md5';

export const passwordMD5 = (password: string): string => {
  return md5(password, 'template-manage-password-md5');
};
