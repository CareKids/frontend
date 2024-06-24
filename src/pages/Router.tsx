import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './Signin'
import Login from './Login'
import Home from './Home'
import PlaceSearch from './PlaceSearch'
import PlaceMap from './PlaceMap'
import Hospital from './Hospital'
import PlaceList from './PlaceList'
import ClassList from './ClassList'
import PlayInfo from './Play'
import Policy from './Policy'
import Board from './Board'
import QnA from './QnA'
import Mypage from './Mypage'

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<PlaceSearch />} />
                <Route path="/map" element={<PlaceMap />} />
                <Route path="/hospital" element={<Hospital />} />
                <Route path="/place" element={<PlaceList />} />
                <Route path="/class" element={<ClassList />} />
                <Route path="/play" element={<PlayInfo />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/board" element={<Board />} />
                <Route path="/qna" element={<QnA />} />
                <Route path="/mypage" element={<Mypage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;