import { IGetShopResponse } from '../../api/shop/ShopApi.ts';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

interface IEmployeeControlAreaProps {
  shopData?: IGetShopResponse;
  createNewRecordHandler: () => void;
}
const EmployeeControlArea = (props: IEmployeeControlAreaProps) => {
  return (
    <Grid container>
      <Grid item xs={4}>
        <Stack>
          <Typography variant={'h5'}>Живая очередь</Typography>
          <Box mt={2}>
            <Button
              color={'error'}
              variant={'contained'}
              onClick={() => {
                props.createNewRecordHandler();
              }}
            >
              Добавить
            </Button>
          </Box>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack>
          <Typography variant={'body2'}>Живая очередь</Typography>
          <Typography variant={'h6'} mt={2}>
            {props.shopData?.name}
          </Typography>
        </Stack>
      </Grid>
      {/*<Grid item xs={4} sx={{ alignItems: 'center', display: 'flex' }}>*/}
      {/*  <Button color={'error'} variant="outlined">*/}
      {/*    СЕРВИС ЗАПИСИ*/}
      {/*  </Button>*/}
      {/*</Grid>*/}
    </Grid>
  );
};

export default EmployeeControlArea;
