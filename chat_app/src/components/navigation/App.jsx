import { useState } from 'react'
import SignIn from '../auth/SignIn/signIn';
import LogIn from '../auth/LogIn/logIn';
import ChatUI from '../main/chatUI/ChatUI';
import { Routes,Route } from 'react-router-dom';

function App() {

  return (
      <div className='flex h-screen w-screen'> 
      <Routes>
        <Route path="/ChatUI" element={<ChatUI/>}/>
        <Route path="/" element={<LogIn/>}/>
        <Route path="/SignUp" element={<SignIn/>}/>
      </Routes>  
      </div>
  )
}

export default App;
