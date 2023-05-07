import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from './Components/Main';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Signup from './Components/Signup';
import Login from './Components/Login';
import NewBlog from './Components/NewBlog';
import PostPage from './Components/PostPage';
import PostCatPage from './Components/PostCatPage';
import DraftBlog from './Components/DraftBlog';
import SearchBlog from './Components/SearchBlog';


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Main />}>
              <Route index element={<Home />} />
              <Route path='/newpost' element={<NewBlog/>} />
              <Route path='/post/:id' element={<PostPage />} />
              <Route path='/post-category/:cat' element={<PostCatPage />} />
              <Route path='/profile' element={<Profile/>} />
              <Route path='/draft/:id' element={<DraftBlog />} />
              <Route path='/search-blog/:search' element={<SearchBlog />} />
            </Route>

            <Route path='/signup' element={<Signup/>}></Route>
            <Route path='/login' element={<Login/>}></Route>
        </Routes> 
      </BrowserRouter>               

    
    </div>
  );
}

export default App;
