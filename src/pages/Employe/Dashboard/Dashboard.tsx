import { Box, Typography } from '@mui/material';
import { ICar, useGetQueueQuery } from '../../../api/queue/QueueApi.ts';
import { useEffect, useMemo } from 'react';
import { shopId } from '../../../constants/ShopData.ts';

interface IQueueItems {
  invitedCars: ICar[];
  readyCars: ICar[];
}
const initialState: IQueueItems = { invitedCars: [], readyCars: [] };
export const Dashboard = () => {
  const { data } = useGetQueueQuery({ shop_id: shopId });

  const { invitedCars, readyCars } = useMemo(() => {
    if (!data) return { ...initialState };
    return data.reduce(
      (acc, item) => {
        if (item.status === 'invited') {
          acc.invitedCars.push(item);
        } else if (item.status === 'ready') {
          acc.readyCars.push(item);
        }
        return acc;
      },
      { ...initialState },
    );
  }, [data]);

  useEffect(() => {
    console.log(invitedCars, readyCars);
  }, [invitedCars, readyCars]);

  return (
    <Box>
      <Box>
        <Typography>Приглашены</Typography>
      </Box>
      <Box>
        <Typography>Машина готова</Typography>
      </Box>
    </Box>
  );
};
