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
  content: string;
  author: string;
  date: string;
  attachments: Attachment[];
}

interface Attachment {
    name: string;
    url: string;
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
    attachments: [
        { name: '첨부파일1', url: 'sample.png'},
        { name: '첨부파일2', url: 'sample.png'}
    ]
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
        {post.attachments && post.attachments.length > 0 && (
                <Card className="mt-4 mb-4">
                    <CardBody>
                    <h5 className="mb-3">첨부파일</h5>
                    {post.attachments.map((attachment, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                        <span>{attachment.name}</span>
                        <Button size="sm" href={attachment.url} target="_blank" download>
                            <FontAwesomeIcon icon={faDownload} className="me-2" />
                            다운로드
                        </Button>
                        </div>
                    ))}
                    </CardBody>
                </Card>
            )}
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