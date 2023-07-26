import { Box, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface IModalContent {
  title?: string | ReactNode;
  text: () => JSX.Element | string | ReactNode;
  customTextContainer?: boolean;
  actions: () => JSX.Element | null | ReactNode;
}

export type IModal = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  callbackClose?: () => void;
  classNames?: string;
  children?: ReactNode;
} & IModalContent;

const Modal = (props: IModal) => {
  const handleClose = () => {
    props.setIsOpen(false);
    props.callbackClose && props.callbackClose();
  };

  return (
    <Dialog open={props.isOpen} onClose={handleClose} sx={{ minWidth: '320px' }}>
      <DialogContent>
        <DialogTitle component={'h4'} textAlign={'center'}>
          {props.title}
        </DialogTitle>
        {props.text()}
        {props.actions() && (
          <Box mt={5}>
            <DialogActions>{props.actions()}</DialogActions>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: 0, position: 'absolute', right: '24px', top: '24px' }}>
        <IconButton aria-label="close" onClick={handleClose} disableRipple={true}>
          <CloseRoundedIcon sx={{ fontSize: 32, color: '#575757' }} />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
