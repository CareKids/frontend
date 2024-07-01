import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Card, CardBody, CardTitle, CardText, Row, Col, Container, Popover, PopoverBody } from 'reactstrap';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faComments, faTimes } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';

interface PlayList {
  id: number;
  title: string;
  type: string;
  content: string;
}

interface Message {
  text: string;
  isUser: boolean;
  isWarning?: boolean;
}

const Play: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showChatPopup, setShowChatPopup] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "안녕하세요, 놀이 정보에 대해 궁금한 게 있다면 물어보세요. ex) 5세 아이와 실내에서 같이 할 수 있는 놀이를 추천해줘", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggleFilters = () => setShowFilters(!showFilters);
  const toggleChat = () => {
    setShowChat(!showChat);
    setPopoverOpen(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopoverOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const plays: PlayList[] = [
    {
      id: 1,
      title: '공놀이',
      type: '24개월 미만',
      content: '24개월 미만 아이와 함께하기 좋은 놀이를 소개 드리겠습니다. 실내에서 할 수 있는 활동적인 놀이로...'
    },
    {
      id: 2,
      title: '밥먹기',
      type: '5세 이상 ~ 7세 미만',
      content: '야채를 안 먹는 우리 아이한테 어떻게하면 놀이를 접목시켜서 야채에 대한 거부감을 줄여줄 수 있을...'
    },
  ];

  const handleSearch = () => {
    // 검색하기 버튼 클릭 시 실행
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const newUserMessage: Message = { text: inputMessage, isUser: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');

    // API 요청 (실제 구현 시 이 부분을 서버 요청으로 대체)
    setTimeout(() => {
      const warningMessage: Message = { text: "이 메시지는 ChatGPT가 생성한 메시지입니다", isUser: false, isWarning: true };
      const botResponse: Message = { text: "API 구현 시 이 부분에 ChatGPT의 응답이 표시됩니다.", isUser: false };
      setMessages(prevMessages => [...prevMessages, warningMessage, botResponse]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>놀이 정보</b></h1>

        {/* 검색창 */}
        <div className="bg-white rounded-4 p-3 mb-4">
          <InputGroup>
            <Input placeholder="검색어 입력" className="border-1" />
            <Button color="primary" className="me-2" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} className="me-2 rounded-4" />
              필터
            </Button>
            <Button color="primary" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} className="me-2 rounded-4" />
              검색하기
            </Button>
          </InputGroup>
        </div>

        {/* 필터 */}
        {showFilters && (
          <div className="bg-light p-3 mb-4 rounded">
            <Row>
              <Col md={6}>
                <Input type="select">
                  <option>연령대</option>
                  {/* TODO: 연령대 목록 불러오기 */}
                </Input>
              </Col>
            </Row>
          </div>
        )}

        <div className="mb-3">
          <div>검색 결과 {plays.length}건</div>
        </div>
        
        {/* 장소 목록 리스트 */}
        <Row>
          {plays.map((result, index) => (
            <Col md={4} key={index} className="mb-4">
                <Card className="h-100">
                    <Link to={`/play/${result.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <CardBody>
                            <Row>
                                <Col>
                                    <Button color="secondary" size="sm" className="mb-2" disabled>{result.type}</Button>
                                    <CardTitle tag="h5" className="mb-2"><strong>{result.title}</strong></CardTitle>
                                    <CardText>
                                        {result.content}
                                    </CardText>
                                </Col>
                            </Row>
                        </CardBody>
                    </Link>
                </Card>
            </Col>
          ))}
        </Row>
        
          {/* 채팅 버튼 및 팝업 */}
          <div className="position-fixed" style={{ bottom: '20px', right: '20px' }} ref={popoverRef}>
            <Button
              id="chatButton"
              color="primary"
              className="rounded-circle"
              style={{ width: '60px', height: '60px' }}
              onClick={toggleChat}
            >
              <FontAwesomeIcon icon={faComments} className="text-white" />
            </Button>
            <Popover
              placement="top-end"
              isOpen={popoverOpen}
              target={popoverRef}
              toggle={() => setPopoverOpen(false)}
            >
              <div className="d-flex justify-content-between m-2">
                <div><strong>챗봇과 대화하기</strong></div>
                <Button 
                  close 
                  onClick={() => setPopoverOpen(false)} 
                />
              </div>
              <PopoverBody className="p-2 pt-0">
                놀이 정보에 대해 질문하고 싶다면 클릭해주세요
              </PopoverBody>
            </Popover>
          </div>

          {/* 채팅창 */}
          {showChat && (
            <div className="position-fixed bg-white shadow" style={{ bottom: '90px', right: '20px', width: '500px', height: '600px', borderRadius: '10px', zIndex: 9999 }}>
              <div className="d-flex justify-content-between align-items-center p-2 bg-light">
                <div></div>
                <div>챗봇</div>
                <Button close onClick={() => setShowChat(false)} />
              </div>
              <div ref={chatContainerRef} className="p-2" style={{ height: 'calc(100% - 90px)', overflowY: 'auto' }}>
                {messages.map((message, index) => (<div 
                    key={index} 
                    className={`d-flex mb-2 ${message.isUser ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div
                      style={{
                        wordWrap: 'break-word'
                      }}
                      className={`p-2 rounded ${
                        message.isWarning
                          ? 'bg-secondary text-white w-100 text-center'
                          : message.isUser
                          ? 'bg-light border'
                          : 'bg-white border'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2">
                <InputGroup>
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="메시지를 입력하세요..."
                  />
                  <Button color="primary" onClick={handleSendMessage}>
                    전송
                  </Button>
                </InputGroup>
              </div>
            </div>
          )}
        </Container>
        <Footer />
      </div>    
    );
};

export default Play;