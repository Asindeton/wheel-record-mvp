import { Button, Grid } from '@mui/material';

interface IModalItemAction {
  acceptHandler: () => void;
  cancelHandler: () => void;
}
const ModalItemAction = ({ acceptHandler, cancelHandler }: IModalItemAction) => {
  return (
    <Grid container columnSpacing={{ xs: 1, sm: 3, md: 4 }}>
      <Grid item xs={6}>
        <Button onClick={cancelHandler} color={'error'} fullWidth>
          Нет
        </Button>
      </Grid>
      <Grid item xs={6}>
        <Button onClick={acceptHandler} color={'error'} variant={'contained'} fullWidth>
          Да
        </Button>
      </Grid>
    </Grid>
  );
};

export default ModalItemAction;
