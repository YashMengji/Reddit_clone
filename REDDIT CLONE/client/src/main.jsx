import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App.jsx'
import './index.css'
import PostLists from '../components/PostLists.jsx'
import Post from '../components/Post.jsx'
import PostContext from '../contexts/PostContext.jsx'

const createRouter = createBrowserRouter(
  [
    {
      path: "/",
      element: <App/>,
      children: [ 
        {
          path: "/posts",
          element: <PostLists/>
        }, 
        {
          path: "/posts/:id",
          element: <PostContext>
            <Post />  {/* This is one type of passing component as props/child. We can access this <B/> in params of function definition of <A> as "<A> <B/> <A/>" */}
          </PostContext>
        },
      ]
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={createRouter}/>
  </StrictMode>,
)
