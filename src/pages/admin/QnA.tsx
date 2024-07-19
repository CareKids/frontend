import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faReply } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getQnaAdminData, postQnaAdminData } from '../../api/admin';
import { QnaAdminInfo, QnaAnswer, QnaAdminList } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;

const QnA: React.FC = () => {
    const [qnaInfo, setQnaInfo] = useState<QnaAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [answerModal, setAnswerModal] = useState(false);
    const [currentPost, setCurrentPost] = useState<QnaAdminList | null>(null);
    const [answer, setAnswer] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchInitialQnaData();
    }, [currentPage]);

    const fetchInitialQnaData = async () => {
        setLoading(true);
        try {
            const data = await getQnaAdminData(currentPage, ITEMS_PER_PAGE);
            setQnaInfo(data);
        } catch (err) {
            setError('문의 사항 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewContent = (qna: QnaAdminList) => {
        setCurrentPost(qna);
        setModal(true);
    };

    const handleAnswer = (qna: QnaAdminList) => {
        setCurrentPost(qna);
        setAnswer('');
        setAnswerModal(true);
    };

    const formatDate = (dateArr: number[] | null): string => {
        if (!dateArr || dateArr.length < 3) return '-';
        const [year, month, day] = dateArr;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const columnHelper = createColumnHelper<QnaAdminList>();
    const columns = useMemo(() => [
        columnHelper.accessor(row => row.data.id, {
            id: 'id',
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor(row => row.data.title, {
            id: 'title',
            header: '게시글 제목',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor(row => row.data.createdAt, {
            id: 'createAt',
            header: '등록 일자',
            cell: info => formatDate(info.getValue()),
        }),
        columnHelper.display({
            id: 'actions',
            header: '답변',
            cell: (info) => (
                info.row.original.data.answer ? (
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
    ], []);

    const table = useReactTable({
        data: qnaInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const toggleModal = () => {
        setModal(!modal);
        if (modal) {
            setCurrentPost(null);
        }
    };

    const toggleAnswerModal = () => {
        setAnswerModal(!answerModal);
        if (answerModal) {
            setCurrentPost(null);
            setAnswer('');
        }
    };

    const handleSubmit = async () => {
        if (currentPost && answer) {
            try {
                const qnaAnswer: QnaAnswer = {
                    id: currentPost.data.id,
                    answer: answer
                };
                await postQnaAdminData(qnaAnswer);
                await fetchInitialQnaData();
                toggleAnswerModal();
                console.log('답변이 성공적으로 등록되었습니다.');
            } catch (error) {
                console.error('답변 등록 중 오류 발생:', error);
                setError('답변 등록에 실패했습니다: ' + (error instanceof Error ? error.message : String(error)));
            }
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!qnaInfo) return <div>No data available</div>;

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

                <Pagination
                    currentPage={currentPage}
                    totalPages={qnaInfo.pageInfo.total}
                    paginate={paginate}
                />
            </div>

            {/* 내용 보기 모달 */}
            <Modal isOpen={modal} toggle={toggleModal} size="lg">
                <ModalHeader toggle={toggleModal}>문의 내용 및 답변</ModalHeader>
                <ModalBody>
                    {currentPost && (
                        <>
                            <h5>{currentPost.data.title}</h5>
                            <p>{currentPost.data.text}</p>
                            {currentPost.files && currentPost.files.length > 0 && (
                                <div>
                                    <strong>첨부파일: </strong>
                                    {currentPost.files.map((file, index) => (
                                        <img key={index} src={file['file-path']} alt={`첨부파일 ${index + 1}`} style={{ maxWidth: '100%', marginTop: '10px' }} />
                                    ))}
                                </div>
                            )}
                            <hr />
                            <div>
                                <strong>등록 답변:</strong>
                                <p>{currentPost.data.answer}</p>
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
                    {currentPost && (
                        <Form>
                            <FormGroup>
                                <Label for="title">제목</Label>
                                <Input type="text" name="title" id="title" value={currentPost.data.title} disabled />
                            </FormGroup>
                            <FormGroup>
                                <Label for="content">내용</Label>
                                <Input type="textarea" name="content" id="content" value={currentPost.data.text} disabled />
                            </FormGroup>
                            {currentPost.files && currentPost.files.length > 0 && (
                                <FormGroup>
                                    <Label>첨부파일</Label>
                                    {currentPost.files.map((file, index) => (
                                        <img key={index} src={file['file-path']} alt={`첨부파일 ${index + 1}`} style={{ maxWidth: '100%', marginTop: '10px' }} />
                                    ))}
                                </FormGroup>
                            )}
                            <FormGroup>
                                <Label for="answer">답변</Label>
                                <Input 
                                    type="textarea" 
                                    name="answer" 
                                    id="answer" 
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    rows={5}
                                />
                            </FormGroup>
                        </Form>
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

export default QnA;