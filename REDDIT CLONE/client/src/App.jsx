import { useEffect, useState } from 'react'
import PostLists from '../components/PostLists.jsx'
import { Outlet, useNavigate } from 'react-router-dom'

function App() {

  const navigate = useNavigate();

  useEffect(() => {
    if(location.pathname == "/"){
      navigate("/posts")
    }
  }, [])
  return (
    <>
      <Outlet/>
    </>
  )
}

export default App
