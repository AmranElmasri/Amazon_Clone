import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAddToCart } from '../../store/slices/productSlice';
import { urlForThumbnail } from '../../utils/image';

const ProductItem = ({ product }) => {
  const { cartItems } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const Router = useRouter();

  const handleAddToCart = async (product) => {
    
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
    <Card elevation={2}>
      <Link href={`/product/${product.slug.current}`} passHref>
        <CardActionArea>
          <CardMedia
            component="img"
            image={urlForThumbnail(product.image)}
            title={product.name}
            sx={{ height: '200px' }}
          ></CardMedia>
          <CardContent>
            <Typography>{product.name}</Typography>
            <Rating value={product.rating} readOnly></Rating>
          </CardContent>
        </CardActionArea>
      </Link>
      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '10px',
          }}
        >
          <Typography>${product.price}</Typography>
          <Button
            sx={{ marginLeft: '20px' }}
            size="small"
            color="primary"
            variant="outlined"
            onClick={() => handleAddToCart(product)}
          >
            Add to cart
          </Button>
        </Box>
        <Link href={`/product/${product.slug.current}`}>
          <Button sx={{ marginLeft: '20px' }} size="small" color="primary">
            show more
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
