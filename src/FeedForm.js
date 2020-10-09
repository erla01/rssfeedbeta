import React from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Container, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

const FeedForm =(props) => {


    return (
        <Container className="form-container" maxWidth="sm">
        <form className="rss-form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item id="rssGridItem">
              <TextField id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                placeholder="RSSFeed" onChange={(e) => props.setNewFeed(e.target.value)} inputProps={{ 'aria-label': 'description' }} />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => props.addNewFeed()}>
                Lägg till
            </Button>
            </Grid>
            <Grid item><Button variant="contained" color="primary" onClick={() => props.refreshFeed()}>
              Uppdatera
            </Button></Grid>

            <FormControl component="fieldset">
              <RadioGroup row defaultValue="all" aria-label="feeds" name="customized-radios">
                <FormControlLabel value="all" control={<Radio color="primary" onChange={props.handleChange} />} label="All" />
                <FormControlLabel value="new" control={<Radio color="primary" onChange={props.handleChange} />} label="New" />
              </RadioGroup>
            </FormControl>


          </Grid>
        </form>
      </Container>
    );
}

export default FeedForm;