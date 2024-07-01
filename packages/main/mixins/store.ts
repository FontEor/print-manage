import Vue, { ComponentOptionsMixin } from 'vue';

import { StoreOptions } from 'vuex';

import storeMain from '../store';

export const registerStore = (store: StoreOptions<any>, storeName: string) => {
  if (!storeMain.hasModule(storeName)) {
    return storeMain.registerModule(storeName, store);
  }
};

export const unregisterStore = (storeName: string) => {
  storeMain.unregisterModule(storeName);
};

class storeMixin implements ComponentOptionsMixin {}

export default storeMixin;
