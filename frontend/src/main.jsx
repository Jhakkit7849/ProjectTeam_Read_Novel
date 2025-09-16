import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Library from './pages/Library'
import NovelNewOrEdit from './pages/NovelNewOrEdit'
import NovelDetail from './pages/NovelDetail'
import ChapterEditor from './pages/ChapterEditor'
import ChapterRead from './pages/ChapterRead'
import MyWorks from './pages/MyWorks'

function App(){
return (
<BrowserRouter>
<Navbar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/signin" element={<SignIn />} />
<Route path="/signup" element={<SignUp />} />
<Route path="/me" element={<Profile />} />
<Route path="/library" element={<Library />} />
<Route path="/write/new" element={<NovelNewOrEdit />} />
<Route path="/novels/:slug" element={<NovelDetail />} />
<Route path="/write/chapter" element={<ChapterEditor />} />
<Route path="/read/:id" element={<ChapterRead />} />
<Route path="/my-works" element={<MyWorks />} />
</Routes>
</BrowserRouter>
)
}


createRoot(document.getElementById('root')).render(<App />)