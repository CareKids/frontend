import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 관리자페이지
import Admin from './admin/Admin'
import AdminPlace from './admin/Place'
import AdminQnA from './admin/QnA'
import AdminClass from './admin/Class'
import AdminHospital from './admin/Hospital'
import AdminPlay from './admin/Play'
import AdminBoard from './admin/Board'
import AdminPolicy from './admin/Policy'

// 일반 페이지
import Signin from './Signin'
import SigninExternal from './SigninExternal'
import Login from './Login'
import ChangePassword from './ChangePassword';
import Home from './Home'
import PlaceSearch from './PlaceSearch'
import PlaceMap from './PlaceMap'
import Hospital from './Hospital'
import PlaceList from './PlaceList'
import PlaceDetail from './PlaceDetail'
import ClassList from './ClassList'
import PlayInfo from './Play'
import PlayDetail from './PlayDetail';
import Policy from './Policy'
import PolicyDetail from './PolicyDetail';
import Board from './Board'
import BoardDetail from './BoardDetail'
import QnA from './QnA'
import QnADetail from './QnADetail'
import QnAWrite from './QnAWrite';
import Mypage from './Mypage'
import NotFound from './NotFound';

import Auth from '../hocs/Auth';
const AuthenticatedAdminPage = Auth(Admin, 'admin');
const AuthenticatedAdminPlacePage = Auth(AdminPlace, 'admin');
const AuthenticatedAdminQnAPage = Auth(AdminQnA, 'admin');
const AuthenticatedAdminClassPage = Auth(AdminClass, 'admin');
const AuthenticatedAdminHospitalPage = Auth(AdminHospital, 'admin');
const AuthenticatedAdminPlayPage = Auth(AdminPlay, 'admin');
const AuthenticatedAdminBoardPage = Auth(AdminBoard, 'admin');
const AuthenticatedAdminPolicyPage = Auth(AdminPolicy, 'admin');

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                {/* 관리자페이지 */}
                <Route path="/admin" element={<AuthenticatedAdminPage />} />
                <Route path="/admin/place" element={<AuthenticatedAdminPlacePage />} />
                <Route path="/admin/hospital" element={<AuthenticatedAdminHospitalPage />} />
                <Route path="/admin/class" element={<AuthenticatedAdminClassPage />} />
                <Route path="/admin/play" element={<AuthenticatedAdminPlayPage />} />
                <Route path="/admin/policy" element={<AuthenticatedAdminPolicyPage />} />
                <Route path="/admin/board" element={<AuthenticatedAdminBoardPage />} />
                <Route path="/admin/qna" element={<AuthenticatedAdminQnAPage />} />

                {/* 일반페이지 */}
                <Route path="/login" element={<Login />} />
                <Route path="/password" element={<ChangePassword />} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signin/info" element={<SigninExternal />} />
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<PlaceSearch />} />
                <Route path="/map" element={<PlaceMap />} />
                <Route path="/hospital" element={<Hospital />} />
                <Route path="/place" element={<PlaceList />} />
                <Route path="/place/:id" element={<PlaceDetail />} />
                <Route path="/class" element={<ClassList />} />
                <Route path="/play" element={<PlayInfo />} />
                <Route path="/play/:id" element={<PlayDetail />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/policy/:id" element={<PolicyDetail />} />
                <Route path="/board" element={<Board />} />
                <Route path="/board/:id" element={<BoardDetail />} />
                <Route path="/qna" element={<QnA />} />
                <Route path="/qna/:id" element={<QnADetail />} />
                <Route path="/qna/write" element={<QnAWrite />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;