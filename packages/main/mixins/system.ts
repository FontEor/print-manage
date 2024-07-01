import { requestV1 } from '@/axios/request';

import type { System } from '../types/apis/system';

interface State {
  systems: System.Instance[];
  [propName: string]: any;
}

export const getSystem = (state: State) => {
  requestV1
    .systemNoPageList({
      params: {
        isPage: 0,
      },
    })
    .then((response) => {
      state.systems = response.data;
    });
};
