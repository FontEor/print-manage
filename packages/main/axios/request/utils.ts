import { TemplateNew } from '@/types/apis/template-new';
import lodash from 'lodash';
import Qs from 'qs';
import { AdvertisingPlan } from '@/types/apis/advertising-plan';
import { stringToMillisecond } from '@/utils/time';

const formatCategory = function (params: TemplateNew.SearchData): TemplateNew.EndSearchData {
  const first: string[] = [];
  const seconed: string[] = [];
  Array.from(params.categories || []).forEach((item) => {
    first.push(item[0]);
    seconed.push(item[1]);
  });
  const query = {
    ...lodash.omit(params, ['categories']),
    templateFirstCategoryCodeList: lodash.uniq(first),
    templateSecondCategoryCodeList: lodash.uniq(seconed),
  };
  return query;
};

export const formatCategoryForField = function (categories: string[][]): string[][] {
  const first: string[] = [];
  const second: string[] = [];
  Array.from(categories || []).forEach((item) => {
    first.push(item[0]);
    second.push(item[1]);
  });
  return [lodash.uniq(first), lodash.uniq(second)];
};

export const templateListToParams = function (params: TemplateNew.SearchData): string {
  const query = formatCategory(params);
  return Qs.stringify(query, { arrayFormat: 'comma' });
};

export const templateMarketListToForm = function (params: TemplateNew.SearchData): string {
  const query = JSON.stringify(formatCategory(params));
  return query;
};

export const adCreateOrUpdateToParams = (data: AdvertisingPlan.CreateData) => {
  return JSON.stringify({
    ...lodash.omit(data, ['timeRange']),
    startTime: stringToMillisecond(data.timeRange[0]),
    endTime: stringToMillisecond(data.timeRange[1]),
    cityRange: data.cityRange.map((item) => {
      return {
        province: item[0],
        city: item[1],
      };
    }),
  });
};
