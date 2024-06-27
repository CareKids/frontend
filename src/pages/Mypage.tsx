import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Button, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Mypage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [region, setRegion] = useState('');
    const [childrenAges, setChildrenAges] = useState<string[]>(['']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    useEffect(() => {
        // TODO: 유저 데이터 불러오기
        setEmail('user@example.com');
        setNickname('유저');
        setRegion('관악구');
        setChildrenAges(['5세', '3세']);
    }, []);

    useEffect(() => {
        setPasswordsMatch(password === confirmPassword);
    }, [password, confirmPassword]);

    const handleAddChildAge = () => {
        setChildrenAges([...childrenAges, '']);
    };

    const handleChildAgeChange = (index: number, value: string) => {
        const newAges = [...childrenAges];
        newAges[index] = value;
        setChildrenAges(newAges);
    };

    const handleRemoveChildAge = (index: number) => {
        const newAges = childrenAges.filter((_, i) => i !== index);
        setChildrenAges(newAges);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && !passwordsMatch) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // TODO: 회원 정보 변경 API 연동
        console.log('Submitting:', { region, childrenAges, password });
    };

    return (
        <div className='App'>
            <Header />
            <Container className='mt-3'>
                <h1 className="mb-4"><b>내 정보</b></h1>
                <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="email">이메일</Label>
                                <Input type="email" name="email" id="email" value={email} disabled />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nickname">닉네임</Label>
                                <Input type="text" name="nickname" id="nickname" value={nickname} disabled />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="region">거주지역</Label>
                                <Input type="select" name="region" id="region" value={region} onChange={(e) => setRegion(e.target.value)}>
                                    <option>강남구</option>
                                    <option>관악구</option>
                                    <option>서초구</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <FormGroup>
                        <Label>자녀의 나이</Label>
                        {childrenAges.map((age, index) => (
                            <Row key={index} className="mb-2 g-2">
                                <Col xs="3">
                                    <Input 
                                        type="select" 
                                        value={age} 
                                        onChange={(e) => handleChildAgeChange(index, e.target.value)}
                                    >
                                        <option value="">선택</option>
                                        <option>24개월 미만</option>
                                        <option>3세</option>
                                        <option>5세</option>
                                    </Input>
                                </Col>
                                <Col xs="5" className="d-flex">
                                    {childrenAges.length > 1 && (
                                        <Button color="danger" className="me-2" onClick={() => handleRemoveChildAge(index)}>삭제</Button>
                                    )}
                                    {index === childrenAges.length - 1 ? (
                                        <Button color="primary" onClick={handleAddChildAge} className="me-2">추가</Button>
                                    ) : null}
                                </Col>
                            </Row>
                        ))}
                    </FormGroup>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="password">비밀번호</Label>
                                <Input 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="confirmPassword">비밀번호 변경 확인</Label>
                                <Input 
                                    type="password" 
                                    name="confirmPassword" 
                                    id="confirmPassword" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {!passwordsMatch && <small className="text-danger">비밀번호가 일치하지 않습니다.</small>}
                            </FormGroup>
                        </Col>
                    </Row>
                    <Button color="primary" type="submit">저장</Button>
                </Form>
            </Container>
            <Footer />
        </div>
    );
}

export default Mypage;