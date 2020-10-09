import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const FeedItemList = (props) => {


    return (
        <List>{props.displayItems.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
            .map(item =>
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
    );
}

export default FeedItemList;