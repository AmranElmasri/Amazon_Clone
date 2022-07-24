import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, setAddToCart } from '../../store/slices/productSlice';
import { urlFor, urlForThumbnail } from '../../utils/image';
import { useSnackbar } from 'notistack';
import { Router } from '@mui/icons-material';
import { useRouter } from 'next/router';


export const getServerSideProps = (context) => {
  return {
    props: { slug: context.params.slug },
  };
};

const ProductDetails = (props) => {
  const { slug } = props;
  const { product, isLoading, error, cartItems } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const Router = useRouter();
  
  useEffect(() => {
    dispatch(getProductDetails(slug));
  }, [dispatch, slug]);

  const handleAddToCart = async () => {
    
    const existItem = cartItems.find((item) => item._id === product._id);
    const quantity = existItem ? existItem.quantity +1 : 1 ;

    const {data} = await axios.get(`/api/products/${product._id}`);

    if(data.countInStock < quantity){
      enqueueSnackbar('Sorry. Product is out of stock', { variant: 'error' });
      return;
    }

    const newData = {
      _key: product._id,
      name: product.name,
      countInStock: product.countInStock,
      slug: product.slug.current,
      price: product.price,
      image: urlForThumbnail(product.image),
      quantity

    }  

    dispatch(setAddToCart(newData));
    enqueueSnackbar(`${product.name} added to the cart`, { variant: 'success' });
    Router.push(`/cart`);
  }

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <Box>
          <Box sx={{ marginTop: 1, marginBottom: 1 }}>
            <Link href="/" passHref>
              <Button variant="contained">back to shopping</Button>
            </Link>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              {product.image && (
                <Image
                  src={urlFor(product.image)}
                  alt={product.name}
                  layout="responsive"
                  width={640}
                  height={640}
                />
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              <List>
                <ListItem>
                  <Typography component="h5" variant="h5">
                    {product.name}
                  </Typography>
                </ListItem>
                <ListItem>Category: {product.category}</ListItem>
                <ListItem>Brand: {product.brand}</ListItem>
                <ListItem>
                  <Rating value={product.rating} readOnly></Rating>
                  <Typography sx={{ fontSize: '15px', marginLeft: '10px' }}>
                    ({product.numReviews} reviews)
                  </Typography>
                </ListItem>
                <ListItem>
                  <Typography>Description: {product.description}</Typography>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <List>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Price</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>${product.price}</Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography>Status</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography>
                          {product.countInStock > 0
                            ? 'In stock'
                            : 'Unavailable'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Button fullWidth variant="contained" onClick={handleAddToCart}>
                      Add to cart
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default ProductDetails;
