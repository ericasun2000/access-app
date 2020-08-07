import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/basic-pages/Landing';
import About from './components/basic-pages/About';
import Register from './components/basic-pages/Register';
import Login from './components/basic-pages/Login';
import Profile from './components/basic-pages/Profile';
import New from './components/new/New';
import Result from './components/result/Result';

// import MapContainer from './components/map-container/MapContainer';
import { UserContext } from './context/UserContext';
import setAuthToken from './utils/setAuthToken';
import { LOGIN, REGISTER, LOGOUT } from './reducers/action-types';

import './App.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  token: localStorage.getItem('token'),
};

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN:
    case REGISTER:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        isAuthenticated: true,
        token: payload.token,
      };
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        token: null,
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <Router>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <UserContext.Provider value=''>
          <Switch>
            <Route exact path='/about' component={About} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/profile' component={Profile} />
            <Route exact path='/new' component={New} />
            <Route exact path='/result' component={Result} />
          </Switch>
        </UserContext.Provider>
        <Footer />
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
