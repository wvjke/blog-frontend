import React from "react";
import Grid from "@mui/material/Grid";
import { Post } from "../../components";
import { useParams } from "react-router-dom";
import { fetchPosts } from "../../redux/slices/posts";
import { useDispatch, useSelector } from "react-redux";

export const Tag = () => {

  const params = useParams();

  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);

  const isPostsLoading = posts.status === "loading";
  let filteredPosts = []

  React.useEffect(() => {
    dispatch(fetchPosts());
    // eslint-disable-next-line
  }, []);



  if (posts.items.length > 0) {
    filteredPosts = posts.items.filter(obj => obj.tags.indexOf(params.value) !== -1);
  } else {
    return <h1>No posts found</h1>
  }

  console.log(posts.items);
  console.log(filteredPosts);

  return (
    <>
      <h1>{`#${params.value}`}</h1>
      <Grid container spacing={2} columns={12}>
        {(isPostsLoading ? [...Array(4)] : filteredPosts).map((obj, index) =>
          isPostsLoading ? (
            <Grid xs={6} item key={index}>
              <Post isLoading={true} />
            </Grid>
          ) : (
            <Grid xs={6} item key={index}>
              <Post
                key={index}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl
                    ? obj.imageUrl
                    : `${process.env.REACT_APP_API_URL}uploads/noImage.png`
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={obj.comments.length}
                tags={obj.tags}
                isEditable={userData?._id === obj.user._id}
              />
            </Grid>
          )
        )}
      </Grid>
    </>
  );
};
