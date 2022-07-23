import { AppBar, Box, Switch, Toolbar, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode } from '../../store/slices/productSlice';
import classes from '../../utils/classes'


const Navbra = () => {
  const { darkMode } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('darkMode'))) {
      dispatch(setDarkMode(JSON.parse(localStorage.getItem('darkMode'))));
    }
  }, [dispatch]);

  const handleDarkeModeChange = () => {
    dispatch(setDarkMode(!darkMode));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#203040' }}>
      <Toolbar sx={classes.toolbar}>
        <Link href="/">
          <a className='amazonLogo'>
            <Typography
              component="h6"
              variant="h6"
              sx={{ fontWeight: 'bold', color: 'white' }}
            >
              amazon
            </Typography>
          </a>
        </Link>
        <Box>
          <Switch checked={darkMode} onChange={handleDarkeModeChange}></Switch>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbra;
