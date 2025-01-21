import { useState } from 'react'
import SignIn from './components/auth/SignIn/signIn';
import LogIn from './components/auth/LogIn/logIn';
import ChatUI from './components/main/chatUI/ChatUI';

function App() {

  return (
      <div className='flex h-screen w-screen'> 
          <ChatUI/>
      </div>
  )
}

export default App;
