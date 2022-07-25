import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../store/slices/productSlice';
import classes from '../../utils/classes';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import LoginIcon from '@mui/icons-material/Login';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { setUserLogout } from '../../store/slices/userSlice';

const Navbra = () => {
  const { darkMode, cartItems } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();
  const [render, setRender] = useState(false);
  const { userInfo } = useSelector((state) => state.user);

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
  const [anchorEl, setAnchorEl] = useState(null);

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      router.push(redirect);
    }
  };

  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleLogout = () => {
    dispatch(setUserLogout());
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#203040' }}>
      <Toolbar sx={classes.toolbar}>
        <NextLink href="/">
          <a className="amazonLogo">
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'white' }}
            >
              amazon
            </Typography>
          </a>
        </NextLink>
        <Box
          sx={{
            marginRight: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '20%',
          }}
        >
          {render && badgeCart()}
          <Switch checked={darkMode} onChange={handleDarkeModeChange}></Switch>
          {render && userInfo ? (
            <>
              <Button
                sx={{ textTransform: 'initial', fontSize: '15px' }}
                endIcon={<KeyboardArrowDownIcon />}
                aria-controls={Boolean(anchorEl) ? 'simple-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
                onClick={loginClickHandler}
              >
                {userInfo.name}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                onClose={loginMenuCloseHandler}
              >
                <MenuItem onClick={(e) => loginMenuCloseHandler(e, '/profile')}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button onClick={() => router.push('/login')} variant="contained">
              login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbra;
