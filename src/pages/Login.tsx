import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormGroup, Input, Card, CardBody, Container } from 'reactstrap';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
  return (
    <div className='App'>
        <Header></Header>
        <Container className="container d-flex justify-content-center align-items-center mt-4">
            <Card className="w-100 bg-white p-4 rounded shadow" style={{ minHeight: '30vh', maxWidth: '500px' }}>
                <CardBody>
                    <h2 className="text-center mt-4 mb-5">로그인</h2>
                    <Form>
                        <FormGroup className="mb-3" controlId="formBasicEmail">
                            <label>이메일</label>
                            <Input type="email" className='mt-1 pt-2 pb-2'/>
                        </FormGroup>
                        <FormGroup className="mb-4" controlId="formBasicPassword">
                            <label>비밀번호</label>
                            <Input type="password" className='mt-1 pt-2 pb-2' />
                        </FormGroup>

                        <div className="text-center">
                            <Button className='btn btn-primary p-2' style={{ minWidth: '100%'}} type="submit">
                                로그인
                            </Button>
                        </div>
                        <div className="mt-3 text-end">
                            <a href="#" className="text-decoration-none small text-reset">비밀번호 재설정</a>
                        </div>

                        <div className="text-center">
                            <hr className="border-1"/>
                            <div className='mb-3'>간편 로그인</div>

                            <div className="text-center mb-3">
                                <a href="#" className="me-2" onClick={() => alert("Google 로그인")}>
                                    <img 
                                        src={process.env.PUBLIC_URL + "/assets/btn_google.png"} 
                                        alt="구글 로그인" 
                                        style={{ width: '45px', height: '45px' }}
                                    />
                                </a>
                                <a href="#" onClick={() => alert("Naver 로그인")}>
                                    <img 
                                        src={process.env.PUBLIC_URL + "/assets/btn_naver.png"} 
                                        alt="네이버 로그인" 
                                        style={{ width: '45px', height: '45px' }}
                                    />
                                </a>
                            </div>

                            <hr className="border-1 mt-5"/>
                        </div>

                        <div className="text-center mt-4 mb-3">
                            로그인 아이디가 없으신가요? <a href="/signin" className="text-reset">회원 가입</a>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Container>
        <Footer></Footer>
    </div>
  );
};

export default Login;