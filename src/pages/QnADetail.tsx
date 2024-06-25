import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faFileAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { StringLiteral } from 'typescript';

interface Attachment {
  name: string;
  url: string;
}

interface Answer {
  content: string;
  author: string;
  date: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  progress: string;
  attachments?: Attachment[];
  answer?: Answer;
}

const QnADetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post: Post = {
    id: id || '',
    title: '문의사항입니다',
    content: '질문내용입니다.',
    author: '작성자',
    date: '2024-06-25 10:00',
    progress: '처리완료',
    attachments: [
      { name: '첨부파일1.pdf', url: '/path/to/file1.pdf' },
      { name: '첨부파일2.jpg', url: '/path/to/file2.jpg' },
    ],
    answer: {
      content: '답변 내용입니다. 문의하신 내용에 대해 다음과 같이 답변 드립니다.',
      author: '관리자',
      date: '2024-06-26 14:00',
    },
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        {/* 처리 상태 */}
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
        {post.progress}
        </Button>

        {/* 게시글 제목, 작성자, 작성일 */}
        <h1 className="mb-2 mt-2"><strong>{post.title}</strong></h1>
        <div>{post.author} · {post.date}</div>
            
        <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />
        {/* 게시글 내용 */}
        <div>{post.content}</div>
        
        {/* 첨부파일 */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3">
            {post.attachments.map((file, index) => (
              <div key={index} className="mb-2">
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                <a href={file.url} download>{file.name}</a>
              </div>
            ))}
          </div>
        )}

        <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />

        {/* 답변 등록 시 표시 */}
        {post.answer && (
          <Card className="mt-4 mb-4">
            <CardBody>
              <div>{post.answer.content}</div>
              <div className="mt-3 text-muted">
                {post.answer.author} · {post.answer.date}
              </div>
            </CardBody>
          </Card>
        )}

        <div className="text-center mt-4">
          <Button color="primary" onClick={handleGoBack}>
            <FontAwesomeIcon icon={faList} className="me-2" />
            목록으로 돌아가기
          </Button>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default QnADetail;