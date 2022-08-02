import {
  AppBar,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputBase,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, setLogout } from '../../store/slices/productSlice';
import classes from '../../utils/classes';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { setUserLogout } from '../../store/slices/userSlice';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import MenuIcon from '@mui/icons-material/Menu';
import { getError } from '../../utils/error';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

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
    dispatch(setLogout()); //To remove all data from cartItems and shippingAddress instantaneously
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    Cookies.remove('shippingAddress');
    Cookies.remove('paymentMethod');
    router.push('/');
  };

  const [sidbarVisible, setSidebarVisible] = useState(false);
  const sidebarOpenHandler = () => {
    setSidebarVisible(true);
  };
  const sidebarCloseHandler = () => {
    setSidebarVisible(false);
  };

  const { enqueueSnackbar } = useSnackbar();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        enqueueSnackbar(getError(err), { variant: 'error' });
      }
    };
    fetchCategories();
  }, [enqueueSnackbar]);

  const [query, setQuery] = useState('');

  const queryChangeHandler = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const submitHandler = () => {
    router.push(`/search?query=${query}`);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#203040' }}>
      <Toolbar sx={classes.toolbar}>
        <Box display={'flex'} alignItems={'center'}>
          <IconButton
            edge="start"
            aria-label="open drawer"
            onClick={sidebarOpenHandler}
            sx={{marginRight: "1rem"}}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>

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
        </Box>
        <Drawer
          anchor="left"
          open={sidbarVisible}
          onClose={sidebarCloseHandler}
        >
          <div style={{ width: '250px', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ paddingLeft: '0.5rem' }}>Categories</div>
              <span
                onClick={sidebarCloseHandler}
                style={{ cursor: 'pointer', paddingRight: '0.5rem' }}
              >
                <CloseIcon />
              </span>
            </div>
            <Divider light />

            {categories.map((category) => (
              <NextLink
                href={`/search?category=${category}`}
                passHref
                key={category}
              >
                <ListItem button component="a" onClick={sidebarCloseHandler}>
                  <ListItemText primary={category}></ListItemText>
                </ListItem>
              </NextLink>
            ))}
          </div>
        </Drawer>
        <Box sx={{ display: { xs: 'none', md: 'initial' } }}>
          <form onSubmit={submitHandler}>
            <Box sx={classes.searchForm}>
              <InputBase
                name="query"
                sx={classes.searchInput}
                placeholder="Search products"
                onChange={queryChangeHandler}
              />
              <IconButton
                type="submit"
                sx={{
                  backgroundColor: '#f0c139',
                  padding: '1',
                  borderRadius: '0',
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </form>
        </Box>
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
                <MenuItem
                  onClick={(e) => loginMenuCloseHandler(e, '/order-history')}
                >
                  Order History
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
