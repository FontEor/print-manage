export const urlPrefixConcat = (url: string | undefined | null): string => {
  if (url) {
    return `${import.meta.env.VITE_APP_DOWNLOAD_PRE}${url}`;
  } else {
    return '';
  }
};
