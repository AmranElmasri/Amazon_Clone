import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../store/slices/productSlice';
import classes from '../../utils/classes';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import LoginIcon from '@mui/icons-material/Login';

const Navbra = () => {
  const { darkMode, cartItems } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('darkMode'))) {
      dispatch(setDarkMode(JSON.parse(localStorage.getItem('darkMode'))));
    }
  }, [dispatch]);

  const handleDarkeModeChange = () => {
    dispatch(setDarkMode(!darkMode));
  };

  useEffect(() => {
    setRender(true);
  }, []);

  const badgeCart = () => (
    <IconButton aria-label="cart" onClick={() => router.push('/cart')}>
      <Badge badgeContent={cartItems.length} color="secondary">
        <ShoppingCartIcon color="primary" />
      </Badge>
    </IconButton>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#203040' }}>
      <Toolbar sx={classes.toolbar}>
        <Link href="/">
          <a className="amazonLogo">
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'white' }}
            >
              amazon
            </Typography>
          </a>
        </Link>
        <Box
          sx={{
            marginRight: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            width: '15%',
          }}
        >
          {render && badgeCart()}
          <Switch checked={darkMode} onChange={handleDarkeModeChange}></Switch>
          <IconButton aria-label="login" onClick={() => router.push('/login')}>
            <LoginIcon color="primary"/>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbra;
