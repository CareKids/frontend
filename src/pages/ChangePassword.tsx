import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';
import { sendVerificationEmail, verifyEmailCode, changePassword } from '../api/login'

const ChangePassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState({ id: '', domain: '' });
    const [customDomain, setCustomDomain] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [timer, setTimer] = useState(180); // 3 minutes
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

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

    const handleSendVerification = async () => {
        try {
            await sendVerificationEmail(email.id, email.domain);
            setShowVerification(true);
            setTimer(180);
            setVerificationError(null);
            alert('인증번호가 발송되었습니다. 이메일을 확인해주세요.');
        } catch (error) {
            setVerificationError('인증 이메일 발송에 실패했습니다. 다시 시도해주세요.');
            alert('인증 이메일 발송에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleVerificationComplete = async () => {
        try {
            const isVerified = await verifyEmailCode(email.id, email.domain, verificationCode);
            if (isVerified) {
                setIsEmailVerified(true);
                setShowVerification(false);
                setVerificationError(null);
                alert('이메일 인증이 완료되었습니다.');
            } else {
                setVerificationError('잘못된 인증번호입니다. 다시 시도해주세요.');
                alert('잘못된 인증번호입니다. 다시 시도해주세요.');
            }
        } catch (error) {
            setVerificationError('이메일 인증에 실패했습니다. 다시 시도해주세요.');
            alert('이메일 인증에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const validatePassword = (value: string) => {
        if (value.length < 10 || value.length > 20) {
            setPasswordError('비밀번호는 10 ~ 20자여야 합니다.');
            return false;
        }
        setPasswordError(null);
        return true;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        if (newConfirmPassword !== password && newConfirmPassword !== '') {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmPasswordError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEmailVerified !== true) {
            alert('이메일 인증을 해주세요.');
            return;
        }
        
        const fullEmail = `${email.id}@${email.domain}`;
        
        try {
            const result = await changePassword(fullEmail, password);
            console.log('비밀번호 변경 성공:', result);
            alert('비밀번호 변경이 완료되었습니다.');
            navigate(-1);
        } catch (error) {
            console.error('비밀번호 변경 실패:', error);
            alert('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
    };

    return (
        <div className='App'>
            <Header />
            <Container className="d-flex justify-content-center align-items-center mt-4">
                <Card className="w-100 bg-white p-4 rounded shadow" style={{ minHeight: '30vh', maxWidth: '500px' }}>
                    <CardBody>
                        <h2 className="text-center mt-4 mb-5">비밀번호 재설정</h2>
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
                                            <option value="hanmail.net">hanmail.net</option>
                                            <option value="daum.net">daum.net</option>
                                            <option value="nate.com">nate.com</option>
                                            <option value="gmail.com">gmail.com</option>
                                            <option value="hotmail.com">hotmail.com</option>
                                            <option value="lycos.co.kr">lycos.co.kr</option>
                                            <option value="empal.com">empal.com</option>
                                            <option value="cyworld.com">cyworld.com</option>
                                            <option value="yahoo.com">yahoo.com</option>
                                            <option value="paran.com">paran.com</option>
                                            <option value="dreamwiz.com">dreamwiz.com</option>
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
                                    onClick={handleSendVerification}
                                    disabled={isEmailVerified}
                                >
                                    이메일 인증
                                </Button>
                            </div>

                            {showVerification && !isEmailVerified && (
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
                                onChange={handlePasswordChange}
                            />
                            {passwordError && (
                                <div className="text-danger small mt-1">
                                    {passwordError}
                                </div>
                            )}
                        </FormGroup>

                        <FormGroup className="mb-4">
                            <label>비밀번호 확인</label>
                            <Input
                                type="password"
                                className="mt-1 pt-2 pb-2"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                            />
                            {confirmPasswordError && (
                                <div className="text-danger small mt-1">
                                    {confirmPasswordError}
                                </div>
                            )}
                        </FormGroup>


                        <div className="text-center">
                            <Button color="primary" className="p-2" style={{ minWidth: '100%' }} type="submit">
                            비밀번호 변경
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

export default ChangePassword;