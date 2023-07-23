import { Box, Grid, Typography } from '@mui/material';
import { ICar, useGetQueueQuery } from '../../../api/queue/QueueApi.ts';
import { useEffect, useMemo } from 'react';
import { shopId } from '../../../constants/ShopData.ts';
import DashboardWrapper from '../../../components/Dashboard/DashboardWrapper.tsx';
import { CustomerStatus } from '../../../constants/StatusData.ts';

interface IQueueItems {
  newCars: ICar[];
  processedCars: ICar[];
  readyCars: ICar[];
}
const initialState: IQueueItems = { processedCars: [], readyCars: [], newCars: [] };

export const Dashboard = () => {
  const { data } = useGetQueueQuery({ shop_id: shopId });

  const { processedCars, readyCars, newCars } = useMemo(() => {
    if (!data) return { ...initialState };
    return data.reduce(
      (acc, item) => {
        if (item.status === CustomerStatus.processed) {
          acc.processedCars.push(item);
        } else if (item.status === CustomerStatus.ready) {
          acc.readyCars.push(item);
        } else if (item.status === CustomerStatus.new) {
          acc.newCars.push(item);
        }
        return acc;
      },
      { ...initialState },
    );
  }, [data]);

  useEffect(() => {
    console.log({ processedCars, readyCars, newCars });
  }, [processedCars, readyCars, newCars]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={8}>
        <Grid xs={6} item>
          <Typography variant={'h4'}>Приглашены</Typography>
          <Box mt={2}>
            <DashboardWrapper status={CustomerStatus.processed} items={processedCars} />
          </Box>
        </Grid>
        <Grid xs={6} item>
          <Typography variant={'h4'}>Машина готова</Typography>
          <Box mt={2}>
            <DashboardWrapper status={CustomerStatus.ready} items={readyCars} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
