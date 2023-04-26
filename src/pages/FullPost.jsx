import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import axios from "../axios";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/slices/auth";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const isAuth = useSelector(selectIsAuth);

  const userData = useSelector((state) => state.auth.data);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn(err);
      });
    // eslint-disable-next-line
  }, [isLoading]);

  const onAddComment = () => {
    setIsLoading(true);
  };

  const onDeleteComment = () => {
    setIsLoading(true);
  };


  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={data.comments.length}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock
        items={data.comments}
        isLoading={false}
        isAuth={data && userData && data.user._id === userData._id}
        onDeleteComment={onDeleteComment}
      >
        {isAuth ? <Index onAddComment={onAddComment} /> : null}
      </CommentsBlock>
    </>
  );
};
