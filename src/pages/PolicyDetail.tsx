import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faDownload } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface Post {
  id: string;
  title: string;
  type: string;
  content: string;
  date: string;  
}

const PlayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post: Post = {
    id: id || '',
    title: '모르면 손해 보는 2024년 달라지는 육아정책 13가지',
    type: '강남구',
    content: '엄마아빠가 꼭 알아야 할 2024년 달라지는 육아 정책 13가지, 싹 다 모아봤어. 1. 다자녀 가구 지원 확대 출생 초기 양육비용 경감을 위한 첫만남이용권 바우처가 2024년 1월 1일부터 첫째아는 200만 원, 둘째아 이상 출생아는 300만 원으로 확대됐어. ',
    date: '2024-06-25'
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='App'>
        <Header></Header>
        <Container className="mt-4">
            <Button
            color="secondary"
            outline
            size="sm"
            className="mb-2 rounded-pill"
            style={{
                fontSize: '0.8rem',
                borderColor: '#6c757d',
                color: '#6c757d',
                pointerEvents: 'none' 
            }}
            >
            {post.type}
            </Button>
            <h1 className="mb-2 mt-2"><strong>{post.title}</strong></h1>
            <div>{post.date}</div>
                
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
            <div>{post.content}</div>
            <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />

            <div className="text-center mt-4">
            <Button color="primary" onClick={handleGoBack}>
                <FontAwesomeIcon icon={faList} className="me-2" />
                목록으로 돌아가기
            </Button>
            </div>
        </Container>
        <Footer></Footer>
    </div>
  );
};

export default PlayDetail;