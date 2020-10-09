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
import { Container, TextField, FormControl, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';



initDB(DBConfig);

function App() {
  const [newFeed, setNewFeed] = useState("");
  const [displayItems, setDisplayItems] = useState([])
  // const [feeds, setFeeds] = useState([]);
  const [feedItems, setFeedItems] = useState([]);
  const [unreadFeedItems, setUnreadFeedItems] = useState([]);

  let Parser = require('rss-parser');
  let parser = new Parser();
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

  const { add, getAll, update } = useIndexedDB('Rss');
  const { add: addRssItem, getAll: getAllRssItem } = useIndexedDB('Item');
  // const db = useIndexedDB('Rss');

  const addFeedDb = (async (url) => {

    let completeFeed = await getFeed(url);

    add({ url: url, feedDesc: completeFeed.description, lastBuildDate: completeFeed.lastBuildDate }).then(
      event => {
        console.log('ID Generated: ', event)
        completeFeed.items.map(item => addItem(item, event))
        setDisplayItems(displayItems.concat(completeFeed.items));
        setFeedItems(feedItems.concat(completeFeed.items));
        setUnreadFeedItems(unreadFeedItems.concat(completeFeed.items));
      },
      error => {
        console.log(error);
      }
    );
  });

  const addItem = (item, RssId) => {

    addRssItem({ RssId: RssId, title: item.title, guid: item.guid, isoDate: item.isoDate, link: item.link, contentSnippet: item.contentSnippet }).then(
      event => {
        console.log('Item ID Generated: ', event);
      },
      error => {
        console.log(error);
      }
    );

  }

  const getFeedItems = () => {
    getAllRssItem().then(feedItemsFromDB => {
      setFeedItems(feedItemsFromDB);
      setDisplayItems(feedItemsFromDB);
    });
  }


  useEffect(
    getFeedItems, []);

  const getFeed = (async (url) => {

    let feed = await parser.parseURL(CORS_PROXY + url);
    console.log(feed.title);

    return feed;

  });

  const refreshFeed = (async () => {
    getAll().then(feedsFromDB => {
      feedsFromDB.forEach(oldFeed => {
        getFeed(oldFeed.url).then(updatedFeed => {
          let oldDate = new Date(oldFeed.lastBuildDate);
          //let oldDate = new Date('Thu, 08 Oct 2020 17:53:02 +0000');

          let newItems = updatedFeed.items
            .filter(feedItem => oldDate < new Date(feedItem.isoDate))
            .map(feedItem => {
              addItem(feedItem);
              console.log(feedItem);
              return feedItem;
            });
          setUnreadFeedItems(unreadFeedItems.concat(newItems));
          oldFeed.lastBuildDate = updatedFeed.lastBuildDate;
          update(oldFeed);
        });
      });
    });
  });

  const handleChange = (e) => {
    if(e.target.value === "new") {
    setDisplayItems(unreadFeedItems);
    } else {
      setDisplayItems(feedItems);
    }
  }



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
            <Grid item><Button variant="contained" color="primary" onClick={() => refreshFeed()}>
              Uppdatera
            </Button></Grid>

            <FormControl component="fieldset">
              <RadioGroup row defaultValue="all" aria-label="feeds" name="customized-radios">
                <FormControlLabel value="all" control={<Radio color="primary" onChange={handleChange} />} label="All" />
                <FormControlLabel value="new" control={<Radio color="primary" onChange={handleChange} />} label="New" />
              </RadioGroup>
            </FormControl>


          </Grid>
        </form>
      </Container>

      <List>{displayItems.map(item =>
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
