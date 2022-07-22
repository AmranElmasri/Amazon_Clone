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
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails } from '../../store/slices/productSlice';
import { urlFor } from '../../utils/image';

export const getServerSideProps = (context) => {
  return {
    props: { slug: context.params.slug },
  };
};

const ProductDetails = (props) => {
  const { slug } = props;
  const { product, isLoading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductDetails(slug));
  }, [dispatch, slug]);

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
            <Grid xs={12} md={3}>
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
                    <Button fullWidth variant="contained">
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
