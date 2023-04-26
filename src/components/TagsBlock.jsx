import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { nanoid } from 'nanoid'
import { SideBlock } from "./SideBlock";
import { Link } from "react-router-dom";

export const TagsBlock = ({ items, isLoading = true }) => {

  let filteredTags = [];

  if (items.length > 0) {
    filteredTags = Array.from(new Set([...items])).slice(0,5);
  }

  return (
    <SideBlock title="Тэги">
      <List>
        {(isLoading ? [...Array(5)] : filteredTags).map((name, i) => (
          <Link
            key={nanoid()}
            style={{ textDecoration: "none", color: "black" }}
            to={`/tag/${name}`}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name} />
                )}
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </SideBlock>
  );
};
