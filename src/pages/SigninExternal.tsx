import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container, Row, Col, Alert } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { getSigninData } from '../api/load';
import { checkNicknameAvailability, signUp } from '../api/login';
import { Region, AgeTag, SignUpData } from '../api/types';

const SigninExternal = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [nickname, setNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);
    const [email, setEmail] = useState('');
    const [socialType, setSocialType] = useState('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [ageTags, setAgeTags] = useState<AgeTag[]>([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [childrenAges, setChildrenAges] = useState<string[]>(['']);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email') || '';
        const socialTypeParam = params.get('social-type') || '';
        setEmail(emailParam);
        setSocialType(socialTypeParam);

        const fetchSigninData = async () => {
            try {
                setIsLoading(true);
                const data = await getSigninData(emailParam, socialTypeParam);
                setRegions(data['region'])
                setAgeTags(data['age-tag'])
            } catch (err) {
                setError('Failed to fetch sign in info');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchSigninData();
    }, [location]);

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

    const handleRemoveChildAge = (index: number) => {
        const newAges = childrenAges.filter((_, i) => i !== index);
        setChildrenAges(newAges);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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

        const signUpData: SignUpData = {
            email,
            password: "",
            nickname,
            socialType: socialType as 'GOOGLE' | 'NAVER',
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

    if (isLoading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>에러: {error}</div>;
    }

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
                                <Input 
                                    type="select" 
                                    className="mt-1 pt-2 pb-2"
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    <option value="">지역을 선택하세요</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.id.toString()}>
                                            {region.name}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>

                            <FormGroup className="mb-4">
                                <label>아이의 연령대</label>
                                {childrenAges.map((childrenAge, index) => (
                                    <Row key={index} className="mt-2 g-2">
                                        <Col xs="8">
                                            <Input 
                                                type="select" 
                                                className="pt-2 pb-2" 
                                                value={childrenAge}
                                                onChange={(e) => {
                                                    const newAges = [...childrenAges];
                                                    newAges[index] = e.target.value;
                                                    setChildrenAges(newAges);
                                                }}
                                            >
                                                <option value="">연령대를 선택하세요</option>
                                                {ageTags.map((ageTag) => (
                                                    <option key={ageTag.id} value={ageTag.id.toString()}>
                                                        {ageTag.name}
                                                    </option>
                                                ))}
                                            </Input>
                                        </Col>
                                        <Col xs="4" className="d-flex">
                                            {childrenAges.length > 1 && (
                                                <Button color="danger" className="me-2" onClick={() => handleRemoveChildAge(index)}>
                                                    삭제
                                                </Button>
                                            )}                                            
                                            {index === childrenAges.length - 1 && (
                                                <Button color="primary" onClick={handleAddChildAge}>
                                                    추가
                                                </Button>
                                            )}
                                        </Col>
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