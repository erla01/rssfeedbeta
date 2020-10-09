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
                <Link key={item.guid} 
                    href={item.link} 
                    underline='none'
                    color="textPrimary"
                    target='_blank'>
                    <ListItem button alignItems="flex-start">
                        <ListItemText
                            primary={item.title}
                            secondary={
                                <>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                    >

                                    </Typography>
                                    <span>{item.contentSnippet}</span>
                                </>
                            }
                        />
                    </ListItem>
                </Link>)}
        </List>
    );
}

export default FeedItemList;