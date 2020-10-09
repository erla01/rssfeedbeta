import React, { useEffect, useState } from 'react';
import { initDB, useIndexedDB } from 'react-indexed-db';
import { DBConfig } from './Data/DBConfig';
import './App.css';
import FeedItemList from './FeedItemList';
import FeedForm from './FeedForm';

initDB(DBConfig);

function App() {
  const [newFeed, setNewFeed] = useState("");
  const [displayItems, setDisplayItems] = useState([])
    const [feedItems, setFeedItems] = useState([]);
  const [unreadFeedItems, setUnreadFeedItems] = useState([]);

  let Parser = require('rss-parser');
  let parser = new Parser();
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

  const { add, getAll, update } = useIndexedDB('Rss');
  const { add: addRssItem, getAll: getAllRssItem } = useIndexedDB('Item');
    const addNewFeed = () => addFeedDb(newFeed);
  
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
    <FeedForm addNewFeed={addNewFeed} refreshFeed={refreshFeed} handleChange={handleChange} setNewFeed={setNewFeed} />
    <FeedItemList displayItems={displayItems}/>
    </>
  );
}

export default App;
