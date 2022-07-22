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
import Link from 'next/link';
import React from 'react';
import { urlForThumbnail } from '../../utils/image';

const ProductItem = ({ product }) => {
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
