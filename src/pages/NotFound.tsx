import React from 'react';
import { Container, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header'
import Footer from '../components/Footer'

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='App'>
      <Header></Header>
      <Container className=" mt-4">
        <h2>페이지를 찾을 수 없습니다</h2>
        <p>요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.</p>
        <Button color="primary" onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </Container>
      <Footer></Footer>
    </div>
  );
};

export default NotFound;