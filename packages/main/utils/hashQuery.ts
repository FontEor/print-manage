import Qs from 'qs';
export const deleteQuery = () => {
  const hash = window.location.hash;
  const query = getQuery(hash);
  const path = hash.split('?')[0];

  delete query.orgId;
  delete query.orgName;
  let hashPath = '';
  Qs.stringify(query) ? (hashPath = path + '?' + Qs.stringify(query)) : (hashPath = path);
  location.hash = hashPath;
  return hashPath;
};

export const assignQuery = (fullPath: string, query: any) => {
  const hash = fullPath;
  const path = hash.split('?')[0];
  const pathQuery = getQuery(fullPath);
  const result = Object.assign(pathQuery, query);
  let hashPath = '';
  Qs.stringify(result) ? (hashPath = path + '?' + Qs.stringify(result)) : (hashPath = path);
  return hashPath;
};

export const getQuery = (fullPath: string) => {
  const hash = fullPath;
  const query: { [key: string]: string } = {};

  const queryString = hash.split('?')[1];
  if (hash.includes('?')) {
    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      query[key] = value;
    });
  }
  return query;
};
