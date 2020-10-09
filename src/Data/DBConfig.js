
export const DBConfig = {
  name: 'RssFeed',
  version: 3,
  objectStoresMeta: [
    {
      store: 'Rss',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'url', keypath: 'url', options: { unique: true } },
        { name: 'feedDesc', keypath: 'feedDesc', options: { unique: false } },
        { name: 'lastBuildDate', keypath: 'lastBuildDate', options: {unique: false} }
      ]
    },
    {
      store: 'Item',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [ 
        {name: 'RssId', keyPath: 'RssId', options: {unique: false  }},
        {name: 'title', keyPath: 'title', options: {unique: false  }},
        {name: 'isoDate', keyPath: 'isoDate', options: {unique: false  }},
        {name: 'guid', keyPath: 'guid', options: {unique: true  }},
        {name: 'contentSnippet', keyPath: 'contentSnippet', options: {unique: false  }},
        {name: 'link', keyPath: 'link', options: {unique: false  }},
      ]

    }
  ]
};