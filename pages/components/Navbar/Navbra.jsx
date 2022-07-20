import { AppBar, Toolbar, Typography } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const Navbra = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#203040" }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Link href="/">
          <a>
            <Typography component="h6" variant="h6" sx={{fontWeight: "bold", color: "white"}}>amazon</Typography>
          </a>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default Navbra