import React from 'react'
import 'rsuite/dist/styles/rsuite-default.css';
import "./styles/main.scss"
import {Switch}  from 'react-router'
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';
import SignIn from './pages/SignIn';
import { ProfileProvider } from './context/profile.context';


function App() {
  return (
    <div className="App">
      <ProfileProvider>
          <Switch>
            <PublicRoute path="/signin">
              <SignIn/>
            </PublicRoute>
            <PrivateRoute path="/">
              <Home/>
            </PrivateRoute>
          </Switch>
      </ProfileProvider>
    </div>
  );
}

export default App;
