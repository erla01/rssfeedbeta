 
export const DBConfig = {
    name: 'RssFeed',
    version: 2,
    objectStoresMeta: [
      {
        store: 'Rss',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: [
          { name: 'url', keypath: 'url', options: { unique: false } },
          // { name: 'email', keypath: 'email', options: { unique: false } }
        ]
      }
    ]
  };