import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, InputGroup, Row, Col, Container,  Popover, PopoverBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faComments } from '@fortawesome/free-solid-svg-icons';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';

import { getPlayData, filterPlayData, getAgeTags } from '../api/load';
import { PlayBoardInfo, PlayItem, AgeTag } from '../api/types';

interface Message {
  text: string;
  isUser: boolean;
  isWarning?: boolean;
}

const ITEMS_PER_PAGE = 12;
const Play: React.FC = () => {
  const [playInfo, setPlayInfo] = useState<PlayBoardInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState<AgeTag | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ages, setAges] = useState<AgeTag[]>([]);
  const [showChatPopup, setShowChatPopup] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "안녕하세요, 놀이 정보에 대해 궁금한 게 있다면 물어보세요.\n ex) 5세 아이와 실내에서 같이 할 수 있는 놀이를 추천해줘", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    fetchAges();
    fetchInitialPlayData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPopoverOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    searchAndFilter();
  }, [selectedAge]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchAges = async () => {
    try {
      const ageData = await getAgeTags();
      setAges(ageData);
    } catch (err) {
      console.error('Failed to fetch ages:', err);
      setError('나이 정보를 불러오는 데 실패했습니다.');
    }
  };
  
  const fetchInitialPlayData = async () => {
    setLoading(true);
    try {
      const data = await getPlayData(currentPage, ITEMS_PER_PAGE);
      setPlayInfo(data);

      if (!selectedAge && data['age-tag']) {
        setSelectedAge(data['age-tag'])
      }
    } catch (err) {
      setError('놀이 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const searchAndFilter = async (page: number = currentPage) => {
    if (!searchTerm && !selectedAge) {
      return fetchInitialPlayData();
    }

    setLoading(true);
    try {
      const data = await filterPlayData(
        { 
          query: searchTerm || null, 
          "age-tag": selectedAge || {}
        }, 
        page
      );
      setPlayInfo(data);
      setCurrentPage(page);
    } catch (err) {
      setError('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchAndFilter = () => {
    searchAndFilter(1);
  };

  const toggleFilters = () => setShowFilters(!showFilters);

  const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const ageId = Number(event.target.value);
    const selectedAge = ages.find(age => age.id === ageId) || null;
    setSelectedAge(selectedAge);
  };

  const paginate = (pageNumber: number) => {
    searchAndFilter(pageNumber);
  };  
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!playInfo) return <div>No data available</div>;

  const totalPages = playInfo.pageInfo.total;

  const toggleChat = () => {
    setShowChat(!showChat);
    setPopoverOpen(false);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;
  
    const newUserMessage: Message = { text: inputMessage, isUser: true };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
  
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputMessage }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const chatbot_response = await response.json();
  
      const warningMessage: Message = { text: "이 메시지는 ChatGPT가 생성한 메시지입니다", isUser: false, isWarning: true };
      const botResponse: Message = { text: convertText(chatbot_response.chatbot_response), isUser: false };
      
      setMessages(prevMessages => [...prevMessages, warningMessage, botResponse]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { text: "죄송합니다. 응답을 받아오는 데 문제가 발생했습니다.", isUser: false, isWarning: true };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const convertText = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '$1');
  }

  return (
    <div className='App'>
      <Header />
      <Container className="mt-4">
        <h1 className="mb-4"><b>놀이 정보</b></h1>

        <div className="bg-white rounded-4 p-3 mb-4">
          <InputGroup>
            <Input 
              placeholder="검색어 입력" 
              className="border-1" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button color="primary" className="me-2" onClick={toggleFilters}>
              <FontAwesomeIcon icon={faFilter} className="me-2 rounded-4" />
              필터
            </Button>
            <Button color="primary" onClick={handleSearchAndFilter}>
              <FontAwesomeIcon icon={faSearch} className="me-2 rounded-4" />
              검색하기
            </Button>
          </InputGroup>
        </div>

        {showFilters && (
          <div className="bg-light p-3 mb-4 rounded">
            <Row>
              <Col md={6}>
                <Input 
                  type="select" 
                  value={selectedAge?.id || ''} 
                  onChange={handleAgeChange}
                >
                  {ages.map((age) => (
                    <option key={age.id} value={age.id}>{age.name}</option>
                  ))}
                </Input>
              </Col>
            </Row>
          </div>
        )}
        
        <Row>
          {playInfo.pageList.map((item: PlayItem) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card" style={{ borderRadius: '10px', backgroundColor: '#ffffff' }}>
                <Link to={`/play/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="card-body">
                      <h4 className="card-title"
                          style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                          }}>{item.title}</h4>
                      <div className="card-text mb-2" 
                          style={{
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 5,
                              WebkitBoxOrient: 'vertical',
                              minHeight: '100px',
                              maxHeight: '100px',
                              fontSize: '14px'
                          }}>
                          {item.description}
                      </div>
                    </div>
                </Link>
              </div>
          </div>
          ))}
        </Row>
        
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
                      contentEditable="true"
                      style={{ whiteSpace: 'pre-wrap' }}
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
        
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
          />
        </Container>
        <Footer />
      </div>    
    );
};

export default Play;