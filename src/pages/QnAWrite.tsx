import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, FormGroup, Label, Input, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Editor } from '@tinymce/tinymce-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

const QnAWrite: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current.getContent();
    // TODO: API 호출
    console.log('제목:', title);
    console.log('내용:', content);
    navigate('/qna');
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
            <Label>내용</Label>
            <Editor
              apiKey={process.env.REACT_APP_TINY_API_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              init={{
                height: 500,
                menubar: false,
                statusbar: false,
                plugins: [
                  ''
                ],
                toolbar: 'undo redo | formatselect | ',
                content_style: 'body { font-family: Pretendard, Helvetica, Arial, sans-serif; font-size:14px }'
              }}
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