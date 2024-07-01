import {GrayUpgradeStrategy} from "@/types/apis/gray-upgrade-strategy";

export const formatValue = (data: GrayUpgradeStrategy.CreateData): string | number => {
  let upgradeValue: string | number = '';
  switch (data.upgradeType) {
    case 1:
      upgradeValue = data.percentage ? Number(data.percentage) : '';
      break;
    case 2:
      upgradeValue = data.appKey;
      break;
    case 3:
      upgradeValue = data.pin;
      break;
    case 4:
      upgradeValue = data.machineId;
      break;
    default:
      break;
  }
  return upgradeValue;
}
