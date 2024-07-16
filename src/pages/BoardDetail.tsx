import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardBody, Button, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { getBoardDetailData } from '../api/load';
import { BoardDetail as BoardDetailResponse } from '../api/types';

const BoardDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BoardDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoardDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getBoardDetailData(id);
        setPost(data);
        setError(null);
      } catch (err) {
        setError('게시글을 불러오는데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBoardDetail();
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) return <div className="text-center mt-5"><Spinner color="primary" /></div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!post) return <div className="text-center mt-5">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-2 mt-2"><strong>{post.title}</strong></h1>
        <div>{new Date(post.createdAt[0], post.createdAt[1] - 1, post.createdAt[2]).toLocaleString()}</div>
        
        {post.img && (
          <div className="mt-4">
            <img src={post.img} alt="게시글 이미지" className="img-fluid" />
          </div>
        )}

        <div className='mt-4'>{post.description}</div>
        
        <hr style={{ border: 'none', height: '2px', backgroundColor: '#dddddd' }} />

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

export default BoardDetail;