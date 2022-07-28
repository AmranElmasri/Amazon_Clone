import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';
import CheckoutWizard from '../components/CheckoutWizard';
import classes from '../utils/classes';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import jsCookie from 'js-cookie';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { setClearCart } from '../store/slices/productSlice';

function PlaceOrderScreen() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { shippingAddress } = useSelector((state) => state.product);
  const { paymentMethod } = useSelector((state) => state.product);
  const { cartItems } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.456 => 123.46
  const itemsPrice = round2(
    cartItems.reduce((a, c) => a + c.price * c.quantity, 0)
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  useEffect(() => {
    if (!paymentMethod) {
      router.push('/payment');
    }
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, paymentMethod, router]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems.map((x) => ({
            ...x,
            countInStock: undefined,
            slug: undefined,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch(setClearCart());
      jsCookie.remove('cartItems');
      jsCookie.remove('shippingAddress');
      jsCookie.remove('paymentMethod');
      setLoading(false);
      router.push(`/order/${data}`);
    } catch (err) {
      setLoading(false);
      enqueueSnackbar(getError(err), { variant: 'error' });
    }
  };
  return (
    <>
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <Typography
        component="h3"
        variant="h3"
        textAlign={'center'}
        marginTop="2rem"
      >
        Place Order
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={12} md={9}>
          <Card sx={classes.section} elevation={3}>
            <List>
              <ListItem>
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{ fontSize: '1.6rem', fontWeight: 400, margin: '1rem 0' }}
                >
                  Shipping Address
                </Typography>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
              </ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/shipping')}
                  variant="contianed"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section} elevation={3}>
            <List>
              <ListItem>
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{ fontSize: '1.6rem', fontWeight: 400, margin: '1rem 0' }}
                >
                  Payment Method
                </Typography>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                <Button
                  onClick={() => router.push('/payment')}
                  variant="contianed"
                  color="secondary"
                >
                  Edit
                </Button>
              </ListItem>
            </List>
          </Card>
          <Card sx={classes.section} elevation={3}>
            <List>
              <ListItem>
                <Typography
                  component="h4"
                  variant="h4"
                  sx={{ fontSize: '1.6rem', fontWeight: 400, margin: '1rem 0' }}
                >
                  Order Items
                </Typography>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cartItems.map((item) => (
                        <TableRow key={item._key}>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                ></Image>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell>
                            <NextLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Typography>{item.name}</Typography>
                              </Link>
                            </NextLink>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>{item.quantity}</Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography>${item.price}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={classes.section} elevation={3}>
            <List>
              <ListItem>
                <Typography component="h4" variant="h4">
                  Order Summary
                </Typography>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Items:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${itemsPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Shipping:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">${shippingPrice}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography align="right">
                      <strong>${totalPrice}</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  onClick={placeOrderHandler}
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  Place Order
                </Button>
              </ListItem>
              {loading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
export default dynamic(() => Promise.resolve(PlaceOrderScreen), { ssr: false });
