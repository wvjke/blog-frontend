import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("./posts");
  return data;
});

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchComments = createAsyncThunk("posts/fetchComments", async () => {
  const { data } = await axios.get("/comments");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/RemovePost",
  async (id) => {
    const { res } = await axios.delete(`/posts/${id}`);
    return res;
  }
);

export const getPopularPosts =
  ("posts/fetchTags",
  async () => {
    const { data } = await axios.get("/tags");
    return data;
  });

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
  comments: {
    items: [],
    status: "loading"
  }
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    popularPosts(state) {
      state.posts.items.sort((a, b) => (a.viewsCount < b.viewsCount ? 1 : -1));
    },
    newPosts(state) {
      state.posts.items.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    },
  },
  extraReducers: {
    // posts fetching
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload;
      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    // tags fetching
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;
      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    // post deleting
    [fetchRemovePost.fulfilled]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
      state.posts.status = "loaded";
    },
    // commennts fetching
    [fetchComments.pending]: (state) => {
      state.comments.items = [];
      state.comments.status = "loading";
    },
    [fetchComments.fulfilled]: (state, action) => {
      state.comments.items = action.payload;
      state.comments.status = "loaded";
    },
    [fetchComments.rejected]: (state) => {
      state.comments.items = [];
      state.comments.status = "error";
    },
  },
});

export const { popularPosts, newPosts } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;
