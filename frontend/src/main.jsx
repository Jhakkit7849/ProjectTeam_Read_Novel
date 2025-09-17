import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles.css'
import { AuthProvider } from './hooks/useAuth'     // 👈 เพิ่ม
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
import Writing from './pages/Writing'
import AdminUsers from './pages/AdminUsers'
import AdminNovels from './pages/AdminNovels'
import Rankings from './pages/Rankings'
import AdminRankings from './pages/AdminRankings'
import DonateSuccess from './pages/DonateSuccess'
import DonateCancel from './pages/DonateCancel'
import ChatbotWidget from './components/ChatbotWidget'
function App(){ /* ... เหมือนเดิม ... */ }

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <ChatbotWidget />
      <Navbar />
      <Routes>
        <Route path="/admin/users" element={<AdminUsers />} />
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
        <Route path="/writing" element={<Writing />} />
        <Route path="/admin/novels" element={<AdminNovels />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/admin/rankings" element={<AdminRankings />} />
        <Route path="/donate/success" element={<DonateSuccess />} />
        <Route path="/donate/cancel" element={<DonateCancel />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
