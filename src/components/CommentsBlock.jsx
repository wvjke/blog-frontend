import React from "react";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";

export const CommentsBlock = ({
  items,
  children,
  isAuth,
  onDeleteComment,
  isHomePage,
  isLoading = true,
}) => {
  const params = useParams();
  const navigate = useNavigate();

  const handleRemoveComment = async (commentId) => {
    if (window.confirm("Do you really want to delete this comment?")) {
      await axios.delete(`/comments/${params.id}`, { data: { id: commentId } });
      onDeleteComment();
    }
  };

  const handleItemClick = async (id) => {
    const { data } = await axios.post("/postByComment", { id });
    navigate(`/posts/${data[0]._id}`);
  };

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading && items.length < 1 ? [...Array(5)] : items).map(
          (obj, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="center"
                onMouseOver={(e) =>
                  (e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar alt={obj.user.fullName} src={obj.user.avatarUrl} />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <>
                    <ListItemText
                      primary={obj.user.fullName}
                      secondary={obj.text}
                      style={{ wordWrap: "break-word", transition: "1s all" }}
                    />
                    {isAuth && !isHomePage ? (
                      <DeleteOutlinedIcon
                        onClick={() => handleRemoveComment(obj._id)}
                        tabIndex="0"
                        style={{ outline: "none" }}
                        onFocus={(e) => (e.currentTarget.style.color = "red")}
                        onBlur={(e) => (e.currentTarget.style.color = "black")}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.2)";
                          e.currentTarget.style.cursor = "pointer";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.color = "black";
                        }}
                      />
                    ) : null}
                  </>
                )}
                {isHomePage ? (
                  <div
                    onClick={isHomePage ? () => handleItemClick(obj._id) : null}
                    style={{"whiteSpace" : "nowrap"}}
                    onMouseOver={
                      isHomePage
                        ? (e) => (e.currentTarget.style.cursor = "pointer")
                        : null
                    }
                  >
                    Open Post
                  </div>
                ) : null}
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          )
        )}
      </List>
      {children}
    </SideBlock>
  );
};
