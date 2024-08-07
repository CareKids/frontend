import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { postQnAData } from '../api/load';

const QnAWrite: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();

    const blob = new Blob([JSON.stringify({
      title: title,
      text: content,
      secret: isPrivate
    })], {type: 'application/json'})
    formData.append('data', blob, 'data.json')

    if (attachments && attachments.length > 0) {
      attachments.forEach((file, index) => {
        formData.append(`files`, file);
      });
    }

    try {
      const response = await postQnAData(formData);
      navigate('/qna');
    } catch (error) {
      console.error('API 오류:', error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files as FileList)]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>문의하기</b></h1>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="title">제목</Label>
            <Input
              type="text"
              name="title"
              id="title"
              placeholder="제목을 입력하세요"
              className='mb-2 p-2'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
            />
            <Label check className="mb-0 ms-2 me-2">
                비공개
            </Label>
          </FormGroup>
          <FormGroup>
            <Label for="content">내용</Label>
            <Input
              type="textarea"
              name="content"
              id="content"
              placeholder="내용을 입력하세요"
              className='mb-2 p-2'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ height: '300px', resize: 'none'}}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="file-attachment">첨부파일</Label>
            <div>
              <Input
                type="file"
                id="file-attachment"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                innerRef={fileInputRef}
              />
              <Button 
                color="light" 
                className="mt-2 d-flex align-items-center" 
                style={{ border: '1px solid #ced4da' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                파일 선택
              </Button>
            </div>
            <ListGroup className="mt-2">
              {attachments.map((file, index) => (
                <ListGroupItem key={index} className="d-flex justify-content-between align-items-center">
                  {file.name}
                  <Button color="danger" size="sm" onClick={() => handleRemoveFile(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </ListGroupItem>
              ))}
            </ListGroup>
          </FormGroup>
          <div className="text-center mt-4">
            <Button type="submit" color="primary" className="me-2">
              제출
            </Button>
            <Button type="button" color="secondary" onClick={() => navigate('/qna')}>
              취소
            </Button>
          </div>
        </Form>
      </Container>
      <Footer />
    </div>
  );
};

export default QnAWrite;