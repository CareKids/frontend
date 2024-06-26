import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

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
    title: '밥먹기',
    type: '5세 이상 ~ 7세 미만',
    content: '야채를 안 먹는 우리 아이한테 어떻게하면 놀이를 접목시켜서 야채에 대한 거부감을 줄여줄 수 있을까요? 이 포스트를 통해 알아봅시다.',
    date: '2024-06-25',
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