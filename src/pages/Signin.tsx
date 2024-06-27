import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState({ id: '', domain: '' });
    const [customDomain, setCustomDomain] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [timer, setTimer] = useState(180); // 3 minutes
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const [childrenAges, setChildrenAges] = useState(['']);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (showVerification && timer > 0) {
        interval = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
        }, 1000);
        }
        return () => {
        if (interval) clearInterval(interval);
        };
    }, [showVerification, timer]);

    const handleEmailVerification = () => {
        setShowVerification(true);
        setTimer(180);
    };

    const handleVerificationComplete = () => {
        // TODO: 이메일 인증 추가
        setIsEmailVerified(true);
        setShowVerification(false);
    };

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
                        <FormGroup className="mb-3">
                            <label>이메일</label>
                            <Row className="mt-1 g-2">
                            <Col xs="4">
                                <Input
                                type="text"
                                value={email.id}
                                onChange={(e) => setEmail({ ...email, id: e.target.value })}
                                disabled={isEmailVerified}
                                />
                            </Col>
                            <Col xs="1" className="text-center p-2">@</Col>
                            <Col xs="4">
                                <Input
                                type="select"
                                value={email.domain}
                                onChange={(e) => setEmail({ ...email, domain: e.target.value })}
                                disabled={isEmailVerified}
                                >
                                <option value="">선택</option>
                                <option value="naver.com">naver.com</option>
                                <option value="gmail.com">gmail.com</option>
                                <option value="custom">직접입력</option>
                                </Input>
                            </Col>
                            {email.domain === 'custom' && (
                                <Col xs="3">
                                <Input
                                    type="text"
                                    value={customDomain}
                                    onChange={(e) => setCustomDomain(e.target.value)}
                                    disabled={isEmailVerified}
                                />
                                </Col>
                            )}
                            </Row>
                        </FormGroup>

                        <div className="text-center mb-4">
                            <Button
                            color="primary"
                            className="p-2"
                            style={{ minWidth: '100%' }}
                            onClick={handleEmailVerification}
                            disabled={isEmailVerified}
                            >
                            이메일 인증
                            </Button>
                        </div>

                        {showVerification && (
                            <>
                            <FormGroup className="mb-3">
                                <label>인증번호</label>
                                <Input
                                type="text"
                                className="mt-1 pt-2 pb-2"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <small className="text-muted">
                                남은 시간: {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60}
                                </small>
                            </FormGroup>
                            <div className="text-center mb-4">
                                <Button
                                color="primary"
                                className="p-2"
                                style={{ minWidth: '100%' }}
                                onClick={handleVerificationComplete}
                                >
                                인증 완료
                                </Button>
                            </div>
                            </>
                        )}

                        <FormGroup>
                            <label>비밀번호</label>
                            <Input
                            type="password"
                            className="mt-1 pt-2 pb-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="text-muted small mt-1">
                            비밀번호는 10자 이상이어야 하며, 특수 문자를 포함하고 있어야 합니다.
                            </div>
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <label>비밀번호 확인</label>
                            <Input
                            type="password"
                            className="mt-1 pt-2 pb-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {password !== confirmPassword && confirmPassword !== '' && (
                            <div className="text-danger small mt-1">
                                비밀번호가 일치하지 않습니다.
                            </div>
                            )}
                        </FormGroup>

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

export default Signin;