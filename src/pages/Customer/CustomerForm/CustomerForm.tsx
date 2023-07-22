import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useCookies } from 'react-cookie';
import CustomerHeader from '../../../components/CustmerHeader/CustomerHeader.tsx';
import CustomerFooter from '../../../components/CustomerFooter/CustomerFooter.tsx';

interface IFormInput {
  name: string;
  phone: string;
  carNumber: string;
  carBrand: string;
  carModel: string;
}

const defaultValues: IFormInput = {
  name: '',
  phone: '',
  carNumber: '',
  carBrand: '',
  carModel: '',
};

const requiredMessage = 'Это поле обязательно';
const cookieName = import.meta.env.VITE_COOKIE_NAME ?? 'queueId';
const cookieMaxAge = import.meta.env.VITE_COOKIE_AGE ?? '43200';
const phoneRegex = RegExp('^((\\+7|7|8)+([0-9]){10})$');

export const CustomerForm = () => {
  const [, setCookie] = useCookies([cookieName]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    const id = uuidv4();
    setCookie(cookieName, id, { path: '/', maxAge: cookieMaxAge });
  };

  return (
    <Box
      sx={{
        textAlign: 'start',
      }}
    >
      <CustomerHeader />
      <Box mt={4}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="subtitle1">Ваши данные</Typography>
          <Controller
            name="name"
            control={control}
            rules={{
              required: requiredMessage,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Имя*"
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                sx={{ marginTop: '10px' }}
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{
              required: requiredMessage,
              pattern: {
                value: phoneRegex,
                message: 'Номер телефона должен быть в формате +7XXXXXXXXXX',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Телефон*"
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
          <Typography variant="subtitle1" mt={3}>
            Автомобиль
          </Typography>
          <Controller
            name="carNumber"
            control={control}
            render={({ field }) => (
              <TextField {...field} variant="outlined" label="Госномер" fullWidth sx={{ marginTop: '10px' }} />
            )}
          />
          <Typography variant="subtitle1">Если нет номера, пропустите поле</Typography>
          <Controller
            name="carBrand"
            control={control}
            rules={{
              required: requiredMessage,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Марка*"
                fullWidth
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                sx={{ marginTop: '10px' }}
              />
            )}
          />
          <Controller
            name="carModel"
            control={control}
            rules={{
              required: requiredMessage,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label="Модель*"
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
              />
            )}
          />
          <Box mt={2}>
            <CustomerFooter />
          </Box>
          <Box
            mt={2}
            sx={{
              textAlign: 'center',
            }}
          >
            <Button type={'submit'} variant={'contained'}>
              Встать в очередь
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CustomerForm;
