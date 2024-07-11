import React from 'react';
import { RecoilRoot } from 'recoil';

import './static/App.css'
import AppRouter from './pages/Router';
import Auth from './components/Auth';

function App() {  return (
    <RecoilRoot>
      <Auth />
      <AppRouter />
    </RecoilRoot>
  );
}

export default App;
