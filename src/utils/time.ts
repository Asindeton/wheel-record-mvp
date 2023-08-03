import { ITimesInStatus } from '../api/queue/QueueApi.ts';

export const getTime = ({ d, h, i, s }: ITimesInStatus) => {
  let result = '';
  if (d) result += `${d} д `;
  if (h) result += `${h} ч `;
  if (i) result += `${i} м `;
  if (s) result += `${s} с `;
  if (result === '') result = '0';
  return result;
};
