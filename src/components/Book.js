// Contributor(s): Taika Tulonen
//
// Taika Tulonen:
// Implementation of styling texts on book card
//
// Description: Component for showing information on a book card

import React from 'react';
import { Typography } from "@material-ui/core";
//import Grid from "@material-ui/core/Grid";

const Book = (props) => {
  return (
    <div>
      
      <Typography variant="subtitle2">{props.title} </Typography>
      
      <Typography variant="body2">{props.authors}</Typography>
    
    </div>

  )
}

export default Book