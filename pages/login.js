import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NextLink from 'next/link';
import Form from '../components/Form/Form';
import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { setUserLogin } from '../store/slices/userSlice';
import { getError } from '../utils/error';

export default function LoginScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const dispatch = useDispatch();
  const {userInfo} = useSelector((state) => state.user);

  useEffect(() => {
    if(userInfo){
      router.push('/');
    }
  },[router, userInfo])

  const submitHandler = async ({ email, password }) => {
    try {
      const {data} = await axios.post(`/api/users/login`, {email,password});
      dispatch(setUserLogin(data));
      router.push('/')
    } catch (error) {
      enqueueSnackbar(getError(error), {variant: 'error'})
    }
  };
  return (
      <form onSubmit={handleSubmit(submitHandler)} style={{maxWidth: "800px", margin:"0 auto"}}>
        <Typography component="h3" variant="h3" textAlign={"center"}>
          Login
        </Typography>
        <List>
          <ListItem>
            <Controller 
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'Password length is more than 5'
                        : 'Password is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button variant="contained" type="submit" fullWidth color="primary">
              Login
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account ?{' '}
            <NextLink href={'/register'} passHref>
              <Link sx={{marginLeft: "0.5rem"}}>Register</Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
  );
}