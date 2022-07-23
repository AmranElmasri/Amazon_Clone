import React from 'react';
import {
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Link,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import NextLink from 'next/link';
import axios from 'axios';
import { setAddToCart, setRemoveCartItem } from '../store/slices/productSlice';
import { useSnackbar } from 'notistack';
import dynamic from 'next/dynamic';

const CartScreen = () => {
  const { cartItems } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpdateQuantity = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._key}`);

    if (data.countInStock < quantity) {
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }

    const newData = {
      _key: item._key,
      name: item.name,
      countInStock: item.countInStock,
      slug: item.slug,
      price: item.price,
      image: item.image,
      quantity,
    };

    dispatch(setAddToCart(newData));
    enqueueSnackbar(`${item.name}  updated in the cart`, {
      variant: 'success',
    });
  };

  const handleRemoveCartItem = (slug) => {
    dispatch(setRemoveCartItem(slug));
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h2"
        textAlign={'center'}
        marginBottom="2rem"
      >
        Shopping Cart
      </Typography>
      {cartItems.length > 0 ? (
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item._key}>
                      <TableCell>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <a>
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={50}
                              height={50}
                            />
                          </a>
                        </NextLink>
                      </TableCell>
                      <TableCell sx={{ cursor: 'pointer' }}>
                        <NextLink href={`/product/${item.slug}`} passHref>
                          <a>
                            {' '}
                            <Typography>{item.name}</Typography>
                          </a>
                        </NextLink>
                      </TableCell>
                      <TableCell align="right">
                        <Select
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateQuantity(item, e.target.value)
                          }
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">
                        <Typography>${item.price}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveCartItem(item.slug)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={3} sx={{ marginTop: '2rem' }}>
            <Card>
              <List>
                <ListItem>
                  <Typography>
                    total: {cartItems.reduce((a, c) => a + c.quantity, 0)} items
                    : ${' '}
                    {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button fullWidth color="primary" variant="contained">
                    Checkout
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box>
          <Typography variant="h6" textAlign={'center'}>
            Cart is empty.{' '}
            <NextLink href="/" passHref>
              <a style={{ color: '#f0c000' }}> Go shopping</a>
            </NextLink>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
