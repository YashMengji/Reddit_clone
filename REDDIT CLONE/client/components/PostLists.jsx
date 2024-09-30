import React from 'react'
import {useState, useEffect} from "react"
import { getPosts } from '../services/posts'
import {Link} from "react-router-dom"
import { useAsync } from '../hooks/useAsync'

function PostLists() {
  const {loading, error, value: posts} = useAsync(getPosts)

  if(loading) return <h1>Loading</h1>
  if(error) return <h1 className='error-msg'>{error}</h1>

  return  posts.map((post) => {
            return(
              <h1 key={post._id}>
                <Link to={`/posts/${post._id}`}>
                  {post.title}
                </Link>    
              </h1>
            )
          });
    

}

export default PostLists