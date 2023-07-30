import { Box, Grid, Typography } from '@mui/material';
import { ICar, useGetQueueQuery } from '../../../api/queue/QueueApi.ts';
import { useMemo } from 'react';
import { shopId } from '../../../constants/ShopData.ts';
import DashboardWrapper from '../../../components/Dashboard/DashboardWrapper.tsx';
import { CustomerStatus } from '../../../constants/StatusData.ts';
import { useSearchParams } from 'react-router-dom';

export interface IQueueItems {
  newCars: ICar[];
  processedCars: ICar[];
  readyCars: ICar[];
}

export const Dashboard = () => {
  const initialState: IQueueItems = { processedCars: [], readyCars: [], newCars: [] };
  const [searchParams] = useSearchParams();
  const queryShopId = Number(searchParams.get('shop_id')) ?? shopId;
  const { data } = useGetQueueQuery({ shop_id: queryShopId }, { pollingInterval: 3000 });

  const { processedCars, readyCars } = useMemo(() => {
    if (!data) return { ...initialState };
    return data.reduce(
      (acc, item) => {
        if (item.status === CustomerStatus.processed) {
          acc.processedCars.push(item);
        } else if (item.status === CustomerStatus.ready) {
          acc.readyCars.push(item);
        }
        return acc;
      },
      { ...initialState },
    );
  }, [data, initialState]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={8}>
        <Grid xs={6} item>
          <Typography variant={'h4'}>Приглашены</Typography>
          <Box mt={2} sx={{ height: 'calc(100dvh - 2.125rem - 16px - 64px)', overflowY: 'auto' }}>
            <DashboardWrapper status={CustomerStatus.processed} items={processedCars} />
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Typography variant={'h4'}>Машина готова</Typography>
          <Box mt={2} sx={{ height: 'calc(100dvh - 2.125rem - 16px - 64px)', overflowY: 'auto' }}>
            <DashboardWrapper status={CustomerStatus.ready} items={readyCars} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
