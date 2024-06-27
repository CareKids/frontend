import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

const SigninExternal = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const [childrenAges, setChildrenAges] = useState(['']);

    const handleNicknameCheck = () => {
        // TODO: 닉네임 중복 확인 추가
        setIsNicknameAvailable(Math.random() < 0.5);
    };

    const handleAddChildAge = () => {
        setChildrenAges([...childrenAges, '']);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: 회원가입 추가
        navigate(-1);
    };

    return (
        <div className='App'>
            <Header />
            <Container className="d-flex justify-content-center align-items-center mt-4">
                <Card className="w-100 bg-white p-4 rounded shadow" style={{ minHeight: '30vh', maxWidth: '500px' }}>
                    <CardBody>
                        <h2 className="text-center mt-4 mb-5">회원가입</h2>
                        <Form onSubmit={handleSubmit}>

                        <FormGroup className="mb-4">
                            <label>닉네임</label>
                            <Row className="mt-1 g-2">
                            <Col xs="8">
                                <Input
                                type="text"
                                className="mt-1 pt-2 pb-2"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                />
                            </Col>
                            <Col xs="4">
                                <Button color="primary" className="mt-1" onClick={handleNicknameCheck}>
                                중복 확인
                                </Button>
                            </Col>
                            </Row>
                            {isNicknameAvailable !== null && (
                            <div className={`small mt-1 ${isNicknameAvailable ? 'text-success' : 'text-danger'}`}>
                                {isNicknameAvailable ? '사용할 수 있습니다.' : '중복된 닉네임입니다.'}
                            </div>
                            )}
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <label>지역</label>
                            <Input type="select" className="mt-1 pt-2 pb-2">
                            <option>강남구</option>
                            </Input>
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <label>아이의 연령대</label>
                            {childrenAges.map((age, index) => (
                            <Row key={index} className="mt-2 g-2">
                                <Col xs="8">
                                <Input type="select" className="pt-2 pb-2" value={age} onChange={(e) => {
                                    const newAges = [...childrenAges];
                                    newAges[index] = e.target.value;
                                    setChildrenAges(newAges);
                                }}>
                                    <option>24개월 미만</option>
                                </Input>
                                </Col>
                                {index === childrenAges.length - 1 && (
                                <Col xs="4">
                                    <Button color="primary" onClick={handleAddChildAge}>
                                    추가
                                    </Button>
                                </Col>
                                )}
                            </Row>
                            ))}
                        </FormGroup>

                        <div className="text-center">
                            <Button color="primary" className="p-2" style={{ minWidth: '100%' }} type="submit">
                            회원 가입
                            </Button>
                        </div>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
            <Footer />
        </div>
    );
};

export default SigninExternal;