import {
  ComponentPublicInstance,
  PropType,
  reactive,
  ref,
  Ref,
  defineProps,
  defineEmits,
} from 'vue';

export interface ComputedTableHeightParams {
  listContainer: Ref;
  form: Ref;
  pagination?: Ref;
}
