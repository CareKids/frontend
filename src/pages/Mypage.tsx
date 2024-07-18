import React, { useState, useEffect } from 'react';
import { Container, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

import { getUserInfo } from '../api/load';
import { UserInfo } from '../api/types';

const Mypage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const info = await getUserInfo();
                setUserInfo(info);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                alert('사용자 정보를 불러오는데 실패했습니다.');
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div className='App'>
            <Header />
            <Container className='mt-3'>
                <h1 className="mb-4"><b>내 정보</b></h1>
                <Form className="bg-white p-4 rounded shadow">
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="email">이메일</Label>
                                <Input type="email" name="email" id="email" value={userInfo?.usersEmail} disabled />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="nickname">닉네임</Label>
                                <Input type="text" name="nickname" id="nickname" value={userInfo?.usersNickname} disabled />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="region">거주지역</Label>
                                <Input 
                                    type="text" 
                                    name="region" 
                                    id="region" 
                                    value={userInfo?.usersRegion.name} 
                                    disabled 
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>자녀의 나이</Label>
                                {userInfo?.usersAgeTagDtos.map((ageTag, index) => (
                                    <Input 
                                        key={index}
                                        type="text" 
                                        value={ageTag.name}
                                        disabled
                                        className="mb-2"
                                    />
                                ))}
                            </FormGroup>
                        </Col>
                    </Row>
                </Form>
            </Container>
            <Footer />
        </div>
    );
}

export default Mypage;