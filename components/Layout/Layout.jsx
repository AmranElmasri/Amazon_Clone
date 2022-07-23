import React from 'react';
import { createTheme } from '@mui/material/styles';
import Head from 'next/head';
import { Container, CssBaseline, ThemeProvider } from '@mui/material';
import Navbra from '../Navbar/Navbra';
import Footer from '../Footer/Footer';
import { useSelector } from 'react-redux';

const Layout = ({ title, description, children }) => {
  const { darkMode } = useSelector((state) => state.product);

  const theme = createTheme({
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
