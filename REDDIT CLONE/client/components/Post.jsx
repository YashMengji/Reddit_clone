import {useState} from "react"
import CommentList from "./CommentList";
import {usePost} from "../contexts/PostContext"
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/comments";

function Post() {
  
  const {post, rootComments, createLocalComment} = usePost();
  const {loading, error, execute: createCommentFn} = useAsyncFn(createComment);

  function onCommentCreate(message) {
    return createCommentFn({postId: post.id, message}).then( createLocalComment )
  }

  return(
    <>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <h3 className="comments-title">Comments</h3>
      <div>
        <CommentForm 
          loading = {loading} 
          error = {error} 
          onSubmit = {onCommentCreate} 
        />
        {rootComments != null && rootComments.length && (
          <div className="mt-4">
            <CommentList comments={rootComments}/>
          </div>
        )}
      </div>
     
    </>
  );
}

export default Post;