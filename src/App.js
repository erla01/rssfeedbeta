import React, { useState} from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './Data/DBConfig';

import './App.css';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';


initDB(DBConfig);

function App() {
  let testRss = "https://www.svt.se/nyheter/lokalt/blekinge/rss.xml";
  const [newFeed, setNewFeed] = useState("");
  // const [feeds, setFeeds] = useState([]);
  const [feedItems, setFeedItems] = useState([]);

  let Parser = require('rss-parser');
  let parser = new Parser();
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

  const { add } = useIndexedDB('Rss');
  // const { getAll } = useIndexedDB('Rss');
  // const db = useIndexedDB('Rss');

  function addToDb(url) {
    add({ url: url }).then(
      event => {
        console.log('ID Generated: ', event)
      },
      error => {
        console.log(error);
      }
    );
  };

  // const getFeeds = () => {
  //   getAll().then(feedsFromDB => {
  //     setFeeds(feedsFromDB);
  //   });
  // }



  const getFeed = (async () => {

    let feed = await parser.parseURL(CORS_PROXY + testRss);
    console.log(feed.title);

    // feed.items.forEach(item => {
    //   console.log(item.title + ':' + item.link)
    // });
    setFeedItems(feedItems.concat(feed.items));
    console.log(feed.items);
  });


  return (
    <>
      <form noValidate autoComplete="off">
        <Input placeholder="RSSFeed" onChange={(e) => setNewFeed(e.target.value)} inputProps={{ 'aria-label': 'description' }} />
        <Button variant="contained" color="primary" onClick={() => addToDb(newFeed)}>
          Lägg till
      </Button>
      </form>
      <Button variant="contained" color="primary" onClick={getFeed}>
        Lägg till
      </Button>


      <List>{feedItems.map(item =>
        <ListItem key={item.guid} alignItems="flex-start">
          <ListItemText
            primary={<a href={item.link}>{item.title}</a>}
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


      {/* {feedItems.map(item => */}
      {/* <li key={item.guid}>{item.title}</li>)} */}
      {/* <div>{feeds.map(feed => <span key={feed.id}>{feed.url}</span>)}</div> */}
    </>
  );
}


export default App;
