import { Alert, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductItem from '../components/ProductItem/ProductItem';
import { fetchProducts } from '../store/slices/productSlice';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { products, isLoading, error } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductItem product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
