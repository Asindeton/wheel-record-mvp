import { ITimesInStatus } from '../api/queue/QueueApi.ts';

export const getTime = ({ d, h, i, s }: ITimesInStatus) => {
  let result = '';
  // if (d) result += `${d} дней `;
  // if (h) result += h === 1 ? `${h} час ` : h > 4 ? `${h} часов ` : `${h} часа `;
  // if (i) result += `${i} минут `;
  // if (s) result += `${s} секунд `;
  if (d) result += `${d} д `;
  if (h) result += `${h} ч `;
  if (i) result += `${i} м `;
  if (s) result += `${s} с `;
  return result;
};
