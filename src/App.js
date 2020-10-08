import React, { useEffect, useState } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './Data/DBConfig';

import './App.css';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import Grid from '@material-ui/core/Grid';
import { Container, TextField } from '@material-ui/core';


initDB(DBConfig);

function App() {
  const [newFeed, setNewFeed] = useState("");
  // const [feeds, setFeeds] = useState([]);
  const [feedItems, setFeedItems] = useState([]);

  let Parser = require('rss-parser');
  let parser = new Parser();
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

  const { add } = useIndexedDB('Rss');
  const { add: addRssItem, getAll: getAllRssItem } = useIndexedDB('Item');
  // const db = useIndexedDB('Rss');

  const addFeedDb = (async (url) => {

    let completeFeed = await getFeed(url);

    add({ url: url, feedDesc: completeFeed.description }).then(
      event => {
        console.log('ID Generated: ', event)
        completeFeed.items.map(item => addItem(item, event))
      },
      error => {
        console.log(error);
      }
    );
  });

  const addItem = (item, RssId) => {

    addRssItem({ RssId: RssId, title: item.title, guid: item.guid, isoDate: item.isoDate, link: item.link, contentSnippet: item.contentSnippet }).then(
      event => {
        console.log('Item ID Generated: ', event)
      },
      error => {
        console.log(error);
      }
    );

  }

  const getFeedItems = () => {
    getAllRssItem().then(feedItemsFromDB => {
      setFeedItems(feedItemsFromDB);
    });
  }

  useEffect(
    getFeedItems, []);

  const getFeed = (async (url) => {

    let feed = await parser.parseURL(CORS_PROXY + url);
    console.log(feed.title);

    return feed;

  });


  return (
    <>
      <Container className="form-container" maxWidth="sm">
        <form className="rss-form" noValidate autoComplete="off">
          <Grid container spacing={2}>
            <Grid item id="rssGridItem">
              <TextField id="standard-full-width"
                style={{ margin: 8 }}
                fullWidth
                margin="normal"
                placeholder="RSSFeed" onChange={(e) => setNewFeed(e.target.value)} inputProps={{ 'aria-label': 'description' }} />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={() => addFeedDb(newFeed)}>
                Lägg till
            </Button>
            </Grid>
          </Grid>
        </form>
      </Container>

      <List>{feedItems.map(item =>
        <ListItem key={item.guid} alignItems="flex-start">
          <ListItemText
            primary={<Link href={item.link}>{item.title}</Link>}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                >

                </Typography>
                <span>{item.contentSnippet}</span>
              </>
            }
          />
        </ListItem>)}
      </List>
    </>
  );
}


export default App;
