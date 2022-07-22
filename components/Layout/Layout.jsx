import React from 'react';
import { createTheme } from '@mui/material/styles';
import Head from 'next/head';
import {
  AppBar,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import Navbra from '../Navbar/Navbra';
import Footer from '../Footer/Footer';
import { useSelector } from 'react-redux';

const Layout = ({ title, description, children }) => {
  const { darkMode } = useSelector((state) => state.product);


  const theme = createTheme({
    // typography: {
    //   h1: {
    //     fontSize: '1.6rem',
    //     fontWeight: 400,
    //     margin: '1rem 0',
    //   },
    //   h2: {
    //     fontSize: '1.4rem',
    //     fontWeight: 400,
    //     margin: '1rem 0',
    //   },
    // },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });

  return (
    <>
      <Head>
        <title>{title ? `${title} Amazon clone ` : `Amazon clone`}</title>
        {description && <meta name="description" content={description}></meta>}
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Navbra />
        <Container
          component="main"
          sx={{ minHeight: '80vh', marginTop: '2rem' }}
        >
          {children}
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  );
};

export default Layout;
