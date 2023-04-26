import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import {
  fetchPosts,
  fetchTags,
  popularPosts,
  newPosts,
  fetchComments,
} from "../redux/slices/posts";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { useDispatch, useSelector } from "react-redux";
export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags, comments } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const [activeTab, setActiveTab] = React.useState(0);

  let newComments = [];

  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts()).then(() => {
      dispatch(newPosts());
    });
    dispatch(fetchTags());
    dispatch(fetchComments());
    // eslint-disable-next-line
  }, []);

  const handlePopularPosts = () => {
    setActiveTab(1);
    dispatch(popularPosts());
  };

  const handleNewPosts = () => {
    setActiveTab(0);
    dispatch(newPosts());
  };

  if (comments.items.length > 0) {
    newComments = [...comments.items.flat()];
    newComments.sort((a, b) => new Date(b.created) - new Date(a.created));
  }

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={activeTab}
        aria-label="basic tabs example"
      >
        <Tab label="Recent" onClick={handleNewPosts} />
        <Tab label="Most popular" onClick={handlePopularPosts} />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl}
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items.flat()} isLoading={isTagsLoading} />
          <CommentsBlock items={newComments.slice(0,5)} isLoading={false} isHomePage={true} />
        </Grid>
      </Grid>
    </>
  );
};
