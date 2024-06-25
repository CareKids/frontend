import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, CardHeader, Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
}

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post: Post = {
    id: id || '',
    title: '게시글 제목입니다',
    content: '공지사항입니다.',
    author: '작성자',
    date: '2024-06-25 10:00',
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='App'>
      <Header></Header>
      <Container className="mt-4">
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

export default BoardDetail;