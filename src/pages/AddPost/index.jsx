import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import { selectIsAuth } from "../../redux/slices/auth";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");

  const isEditing = Boolean(id);

  const inputFileRef = React.useRef(null);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const {
        data: { uploadURL },
      } = await axios.get("/s3Url");
      await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: file,
      });
      setImageUrl(uploadURL.split("?")[0]);
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };

  const onChange = React.useCallback((text) => {
    setText(text);
  }, []);

  const onSubmit = async () => {
    try {
      const fields = {
        title,
        imageUrl: imageUrl,
        tags: tags.split(",").map((item) => item.trim()),
        text,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert("Error while creating new Post");
    }
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(","));
      });
    }
    // eslint-disable-next-line
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Enter text...",
      status: false,
      autosave: {
        enabled: true,
        uniqueId: "text",
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Load image
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Delete
          </Button>
          <img
            className={styles.image}
            src={imageUrl}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Post title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        id="text"
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Save" : "Post"}
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
