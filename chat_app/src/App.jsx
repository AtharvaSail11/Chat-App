import { useState } from 'react'
import SignIn from './components/auth/SignIn/signIn';
import LogIn from './components/auth/LogIn/logIn';

function App() {

  return (
      <div className='flex h-screen w-screen'> 
          <LogIn/>
      </div>
  )
}

export default App;
