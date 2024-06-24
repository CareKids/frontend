import React from 'react';
import { RecoilRoot } from 'recoil';
import './static/App.css'
import AppRouter from './pages/Router';

function App() {
  return (
    <RecoilRoot>
      <AppRouter />
    </RecoilRoot>
  );
}

export default App;
