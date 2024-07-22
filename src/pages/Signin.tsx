import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { sendVerificationEmail, verifyEmailCode, checkNicknameAvailability, signUp } from '../api/login'
import { getRegions, getAgeTags } from '../api/load';
import { Region, AgeTag, SignUpData } from '../api/types';

const Signin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState({ id: '', domain: '' });
    const [customDomain, setCustomDomain] = useState('');
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationError, setVerificationError] = useState<string | null>(null);
    const [timer, setTimer] = useState(180); // 3분
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);    
    const [regions, setRegions] = useState<Region[]>([]);
    const [ageTags, setAgeTags] = useState<AgeTag[]>([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [childrenAges, setChildrenAges] = useState(['']);    
    const [privacyPolicyAgreed, setPrivacyPolicyAgreed] = useState(false);
    const [privacyPolicyText, setPrivacyPolicyText] = useState('');

    useEffect(() => {
        const fetchPrivacyPolicy = async () => {
            try {
                const response = await fetch('/assets/privacy.txt');
                const text = await response.text();
                setPrivacyPolicyText(text);
            } catch (error) {
                console.error('Failed to load privacy policy:', error);
                setPrivacyPolicyText('Failed to load privacy policy. Please try again later.');
            }
        };

        fetchPrivacyPolicy();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [regionsData, ageTagsData] = await Promise.all([getRegions(), getAgeTags()]);
                setRegions(regionsData);
                setAgeTags(ageTagsData);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('데이터를 불러오는 데 실패했습니다. 페이지를 새로고침 해주세요.');
            }
        };

        fetchData();
    }, []);

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

    const handleNicknameCheck = async () => {
        try {
            const isAvailable = await checkNicknameAvailability(nickname);
            setIsNicknameAvailable(isAvailable);
            if (isAvailable) {
                alert('사용 가능한 닉네임입니다.');
            } else {
                alert('이미 사용 중인 닉네임입니다. 다른 닉네임을 선택해주세요.');
            }
        } catch (error) {
            console.error('Error checking nickname:', error);
            setIsNicknameAvailable(false);
            alert('닉네임 중복 확인 중 오류가 발생했습니다.');
        }
    };

    const handleAddChildAge = () => {
        setChildrenAges([...childrenAges, '']);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEmailVerified !== true) {
            alert('이메일 인증을 해주세요.');
            return;
        }
        if (isNicknameAvailable !== true) {
            alert('닉네임 중복 확인을 해주세요.');
            return;
        }
        if (!selectedRegion) {
            alert('지역을 선택해주세요.');
            return;
        }
        if (childrenAges.some(age => !age)) {
            alert('모든 자녀의 나이를 선택해주세요.');
            return;
        }
        
        const fullEmail = `${email.id}@${email.domain}`;
        const signUpData: SignUpData = {
            email: fullEmail,
            password,
            nickname,
            socialType: '',
            region: regions.find(r => r.id.toString() === selectedRegion) || { id: 0, name: "" },
            ageTags: childrenAges.map(ageId => ageTags.find(tag => tag.id.toString() === ageId) || { id: 0, name: "" })
        };

        try {
            const result = await signUp(signUpData);
            console.log('회원가입 성공:', result);
            alert('회원가입이 완료되었습니다.');
            navigate(-1);
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
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
                                <label>개인정보 처리방침</label>
                                <Input
                                    type="textarea"
                                    value={privacyPolicyText}
                                    readOnly
                                    style={{ height: '200px', resize: 'none' }}
                                />
                            </FormGroup>
                            <FormGroup check className="mb-3">
                                <Input
                                    type="checkbox"
                                    id="privacyPolicyAgreement"
                                    checked={privacyPolicyAgreed}
                                    onChange={(e) => setPrivacyPolicyAgreed(e.target.checked)}
                                />
                                <label htmlFor="privacyPolicyAgreement">
                                    개인정보 처리방침에 동의합니다.
                                </label>
                            </FormGroup>
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
                                    disabled={!privacyPolicyAgreed || isEmailVerified}
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
                            <Input 
                                type="select" 
                                className="mt-1 pt-2 pb-2"
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                            >
                                <option value="">선택하세요</option>
                                {regions.map((region) => (
                                    <option key={region.id} value={region.id.toString()}>
                                        {region.name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>

                        <FormGroup className="mb-4">
                                <label>아이의 연령대</label>
                                {childrenAges.map((age, index) => (
                                    <Row key={index} className="mt-2 g-2">
                                        <Col xs="8">
                                            <Input 
                                                type="select" 
                                                className="pt-2 pb-2" 
                                                value={age} 
                                                onChange={(e) => {
                                                    const newAges = [...childrenAges];
                                                    newAges[index] = e.target.value;
                                                    setChildrenAges(newAges);
                                                }}
                                            >
                                                <option value="">선택하세요</option>
                                                {ageTags.map((tag) => (
                                                    <option key={tag.id} value={tag.id.toString()}>
                                                        {tag.name}
                                                    </option>
                                                ))}
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