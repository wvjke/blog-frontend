import React from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import axios from "../../axios";
import { useParams } from "react-router-dom";

export const Index = ({ onAddComment }) => {
  const userData = useSelector((state) => state.auth.data);

  const params = useParams();

  const [commentText, setCommentText] = React.useState("");

  const handleAddComment = async () => {
    try {
      const fields = {
        id: params.id,
        text: commentText,
      };
      await axios.post("/comments", fields);
      onAddComment();
      setCommentText("");
    } catch (err) {
      console.warn(err);
      alert("Error while adding new comment");
    }
  };

  const onTextEnter = (event) => {
    if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
      handleAddComment();
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src={userData.avatarUrl} />
        <div className={styles.form}>
          <TextField
            label="Write comment here"
            value={commentText}
            onKeyDown={onTextEnter}
            onChange={(e) => setCommentText(e.target.value)}
            inputProps={{ maxLength: 280 }}
            multiline
            fullWidth
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={handleAddComment} variant="contained">
              Send
            </Button>
            <span>{`${commentText.length} / 280`}</span>
          </div>
        </div>
      </div>
    </>
  );
};
