import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Alert, Box, Button, Snackbar, TextField, Typography } from '@mui/material';
import ServiceData from '../../../components/ServiceData/ServiceData.tsx';
import { ErrorMessage } from '../../../constants/ErrorMessage.ts';
import { VALIDATION_REGEX } from '../../../constants/ValidationRegExp.ts';
import { useLoginMutation } from '../../../api/auth/EmployeeAuthApi.ts';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../store/hooks.ts';
import { setCredentials } from './authSlice.ts';

export interface LoginData {
  email: string;
  password: string;
}

const defaultValues: LoginData = {
  email: '',
  password: '',
};
export const EmployeeAuth = () => {
  const dispatch = useAppDispatch();
  const [isOpenErrorSnackBar, setIsOpenErrorSnackBar] = useState<boolean>(false);
  const [login, { isError }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    defaultValues: {
      ...defaultValues,
    },
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await login(data).unwrap();
      dispatch(setCredentials(response));
    } catch (e) {
      console.log(e);
    }
  };

  const closeErrorSnackBar = () => {
    setIsOpenErrorSnackBar(false);
  };

  useEffect(() => {
    if (isError) {
      setIsOpenErrorSnackBar(true);
    }
  }, [isError]);

  return (
    <Box sx={{ maxWidth: 600, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'start' }}>
        <ServiceData />
      </Box>

      <Box mt={2}>
        <Typography variant={'h5'}>Войти в систему</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: ErrorMessage.required,
              pattern: {
                value: VALIDATION_REGEX.email,
                message: ErrorMessage.email,
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                type={'email'}
                label={'Почта'}
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name] || isError}
                helperText={errors[field.name]?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: ErrorMessage.required,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                label={'Пароль'}
                type={'password'}
                fullWidth
                sx={{ marginTop: '10px' }}
                error={!!errors[field.name] || isError}
                helperText={errors[field.name]?.message}
              />
            )}
          />
          <Box mt={2}>
            <Button type={'submit'} variant={'contained'}>
              Войти
            </Button>
          </Box>
        </form>
      </Box>
      <Snackbar open={isOpenErrorSnackBar} autoHideDuration={6000} onClose={closeErrorSnackBar}>
        <Alert onClose={closeErrorSnackBar} severity="error" sx={{ width: '100%' }}>
          Неверный логин или пароль
        </Alert>
      </Snackbar>
    </Box>
  );
};
