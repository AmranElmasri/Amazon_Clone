import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

const Footer = () => {
  return (
    <Box component="footer" sx={{marginTop: 2, height: "4rem",display: "flex" ,alignItems: "center", justifyContent: "center"}}>
      <Typography>All rights reserved Amazon &copy;</Typography>
    </Box>
  )
}

export default Footer