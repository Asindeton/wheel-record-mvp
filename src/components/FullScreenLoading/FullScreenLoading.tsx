import { Backdrop, BackdropProps, CircularProgress } from '@mui/material';
import { FC } from 'react';

interface IAppFullScreenLoadingProps extends BackdropProps {
  handleClose?: () => void;
}
const FullScreenLoading: FC<IAppFullScreenLoadingProps> = (props) => {
  const { open, handleClose } = props;
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open} onClick={handleClose}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default FullScreenLoading;
