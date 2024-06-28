import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faReply } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'

type QnA = {
    id: number;
    title: string;
    content: string;
    attachment: string | null;
    createdAt: string;
    answer: string | null;
    answeredAt: string | null;
};

const columnHelper = createColumnHelper<QnA>();

function QnAManagement() {
    const [data, setData] = useState<QnA[]>([
        { id: 1, title: '영업시간 문의', content: '주말 영업 시간이 어떻게 되나요?', attachment: null, createdAt: '2024-06-28', answer: null, answeredAt: null },
        { id: 2, title: '주차 가능 여부', content: '주차장이 있나요?', attachment: '/api/placeholder/50/50', createdAt: '2024-06-29', answer: '네, 주차장이 있습니다.', answeredAt: '2024-06-30' },
    ]);
    const [modal, setModal] = useState(false);
    const [answerModal, setAnswerModal] = useState(false);
    const [currentQnA, setCurrentQnA] = useState<QnA | null>(null);
    const [answer, setAnswer] = useState('');

    const handleViewContent = (qna: QnA) => {
        setCurrentQnA(qna);
        setModal(true);
    };

    const handleAnswer = (qna: QnA) => {
        setCurrentQnA(qna);
        setAnswer('');
        setAnswerModal(true);
    };

    const columns = [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: '게시글 제목',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('createdAt', {
            header: '등록 일자',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('answeredAt', {
            header: '처리 일자',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.display({
            id: 'actions',
            header: '답변',
            cell: (info) => (
                info.row.original.answer ? (
                    <Button 
                        color="secondary" 
                        onClick={() => handleViewContent(info.row.original)}
                    >
                        <FontAwesomeIcon icon={faEye} /> 답변 보기
                    </Button>
                ) : (
                    <Button 
                        color="primary" 
                        onClick={() => handleAnswer(info.row.original)}
                    >
                        <FontAwesomeIcon icon={faReply} /> 답변 등록
                    </Button>
                )
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const toggleModal = () => {
        setModal(!modal);
        if (modal) {
            setCurrentQnA(null);
        }
    };

    const toggleAnswerModal = () => {
        setAnswerModal(!answerModal);
        if (answerModal) {
            setCurrentQnA(null);
            setAnswer('');
        }
    };

    const handleSubmit = () => {
        if (currentQnA && answer) {
            const now = new Date().toISOString().split('T')[0];
            setData(data.map(qna => qna.id === currentQnA.id ? { ...qna, answer: answer, answeredAt: now } : qna));
            toggleAnswerModal();
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>문의 관리</b></h1>

                <div className="table-responsive">
                    <table className="table table-bordered">
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                <th key={header.id} className="px-4 py-2 bg-light">
                                    {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                                </th>
                                ))}
                            </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border px-4 py-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 내용 보기 모달 */}
            <Modal isOpen={modal} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>문의 내용 및 답변</ModalHeader>
                <ModalBody>
                    {currentQnA && (
                        <>
                            <h5>{currentQnA.title}</h5>
                            <p>{currentQnA.content}</p>
                            {currentQnA.attachment && (
                                <div>
                                    <strong>첨부파일: </strong>
                                    <img src={currentQnA.attachment} alt="첨부파일" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                </div>
                            )}
                            <hr />
                            <div>
                                <strong>등록 답변:</strong>
                                <p>{currentQnA.answer}</p>
                                <p><small>처리 일자: {currentQnA.answeredAt}</small></p>
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>닫기</Button>
                </ModalFooter>
            </Modal>

            {/* 답변 등록 모달 */}
            <Modal isOpen={answerModal} toggle={toggleAnswerModal} size="lg">
                <ModalHeader toggle={toggleAnswerModal}>답변 등록</ModalHeader>
                <ModalBody>
                    {currentQnA && (
                        <>
                            <h5>{currentQnA.title}</h5>
                            <p>{currentQnA.content}</p>
                            {currentQnA.attachment && (
                                <div>
                                    <strong>첨부파일: </strong>
                                    <img src={currentQnA.attachment} alt="첨부파일" style={{ maxWidth: '100%', marginTop: '10px' }} />
                                </div>
                            )}
                            <hr />
                            <div className="form-group">
                                <label htmlFor="answer"><strong>답변:</strong></label>
                                <textarea 
                                    className="form-control" 
                                    id="answer" 
                                    rows={5} 
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                ></textarea>
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={!answer}>답변 등록</Button>{' '}
                    <Button color="secondary" onClick={toggleAnswerModal}>취소</Button>
                </ModalFooter>
            </Modal>

            <Footer />
        </div>
    );
}

export default QnAManagement;