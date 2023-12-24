import { useState, useEffect } from 'react'

import './style.scss'

import Root from './components/root';

function App() {

  /*  
  
     console.log('rendering App');
  
    useEffect(() => {
      console.log('App mounted');
      return () => {
          console.log('App unmounted');
      };
    }, []);
  */

  return (
    <Root key='root'></Root>
  )
}

export default App
