import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getPlayAdminData, postPlayAdminData, deletePlayAdminData, getDevDomains } from '../../api/admin';
import { getAgeTags } from '../../api/load';
import { PlayAdminInfo } from '../../api/adminTypes';
import { AgeTag, DetailPlayItem, DevDomain } from '../../api/types';

const ITEMS_PER_PAGE = 12;
const Play: React.FC = () => {
    const [playInfo, setPlayInfo] = useState<PlayAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [ages, setAges] = useState<AgeTag[]>([]);
    const [devDomains, setDevDomains] = useState<DevDomain[]>([]);
    const [selectedDevDomains, setSelectedDevDomains] = useState<DevDomain[]>([]);
    const [currentPost, setCurrentPost] = useState<Partial<DetailPlayItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        fetchAges();
        fetchDomains();
        fetchInitialPlayData();
    }, []);
    
    useEffect(() => {
        fetchInitialPlayData();
    }, [currentPage]);

    useEffect(() => {
        if (isEditing && currentPost) {
            setSelectedDevDomains(currentPost['dev-domains'] || []);
        } else {
            setSelectedDevDomains([]);
        }
    }, [isEditing, currentPost]);


    const fetchInitialPlayData = async () => {
        setLoading(true);
        try {
            const data = await getPlayAdminData(currentPage, ITEMS_PER_PAGE);
            console.log(data)
            setPlayInfo(data);
        } catch (err) {
            setError('놀이 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAges = async () => {
        try {
            const ageData = await getAgeTags();
            setAges(ageData);
        } catch (err) {
            console.error('Failed to fetch regions:', err);
            setError('연령대 정보를 불러오는 데 실패했습니다.');
        }
    };

    const fetchDomains = async () => {
        try {
            const domainData = await getDevDomains();
            setDevDomains(domainData);
        } catch (err) {
            console.error('Failed to fetch regions:', err);
            setError('발달 영역 정보를 불러오는 데 실패했습니다.');
        }
    };

    const handleEdit = (post: DetailPlayItem) => {
        setCurrentPost(post);
        setSelectedDevDomains(post['dev-domains'] || []);
        setIsEditing(true);
        setModal(true);
    };

    const handleDelete = async (id: number) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                await deletePlayAdminData(deleteId);
                fetchInitialPlayData();
                setDeleteModal(false);
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        }
    };

    const ActionCell = useCallback(({ row }: { row: any }) => (
        <div>
            <Button color="link" className="mr-3" onClick={() => handleEdit(row.original)}>
                <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button color="link" onClick={() => handleDelete(row.original.kindergartenId)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>
    ), [handleEdit, handleDelete]);

    const columnHelper = createColumnHelper<DetailPlayItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: '놀이 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('age-tag.name', {
            header: '연령대',
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: ActionCell,
        }),
    ], [ActionCell]);

    const table = useReactTable({
        data: playInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });    
    
    const handleDomainChange = (index: number, value: string) => {
        const newSelectedDevDomains = [...selectedDevDomains];
        const selectedDomain = devDomains.find(domain => domain.devDomainId === parseInt(value));
        newSelectedDevDomains[index] = selectedDomain || {} as DevDomain;
        setSelectedDevDomains(newSelectedDevDomains);
    };

    const addDomain = () => {
        setSelectedDevDomains(prev => [...prev, {} as DevDomain]);
    };

    const removeDomain = (index: number) => {
        setSelectedDevDomains(prev => prev.filter((_, i) => i !== index));
    };

    const resetModal = () => {
        setCurrentPost({});
        setIsEditing(false);
        setSelectedDevDomains([]);
    };    

    const toggle = () => {
        setModal(!modal);
        if (modal) {
            resetModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPost.title || !currentPost.text || !currentPost.tools || !currentPost['recommend-age'] || !currentPost['age-tag'] || !currentPost['dev-domains']) {
            setSubmitError('모든 필수 항목을 입력해주세요.');
            return;
        }

        const playData = {
            id: isEditing && currentPost.id ? currentPost.id : null,
            title: currentPost.title,
            text: currentPost.text,
            tools: currentPost.tools,
            "recommend-age": currentPost['recommend-age'],
            "age-tag": currentPost['age-tag'],
            "dev-domains": selectedDevDomains.filter(domain => domain.devDomainId)
        };
    
        try {
            const response = await postPlayAdminData(playData);
            fetchInitialPlayData();
            toggle();
        } catch (error) {
            console.error('API 오류:', error);
            setSubmitError('데이터 제출 중 오류가 발생했습니다.');
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!playInfo) return <div>No data available</div>;
  
    const totalPages = playInfo.pageInfo.total;

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>놀이 정보 관리</b></h1>

                <div className="text-right mb-4">
                    <Button color="primary" onClick={toggle}>게시글 등록</Button>
                </div>
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

             <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>게시글 등록</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">놀이 이름</Label>
                            <Input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={currentPost.title || ''}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="region">연령대</Label>
                            <Input 
                                type="select" 
                                name="region" 
                                id="region" 
                                value={currentPost['age-tag']?.id || ''}
                                onChange={(e) => setCurrentPost({...currentPost, "age-tag": ages.find(r => r.id === parseInt(e.target.value))})}
                            >
                                <option value="">선택하세요</option>
                                {ages.map(age => (
                                    <option key={age.id} value={age.id}>{age.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label>발달 영역</Label>
                            {selectedDevDomains.map((domain, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Input 
                                        type="select" 
                                        value={domain.devDomainId || ''}
                                        onChange={(e) => handleDomainChange(index, e.target.value)}
                                        className="me-2"
                                    >
                                        <option value="">선택하세요</option>
                                        {devDomains.map(a => (
                                            <option key={a.devDomainId} value={a.devDomainId}>{a.devDomainType}</option>
                                        ))}
                                    </Input>
                                    {selectedDevDomains.length > 1 && (
                                        <Button color="danger" onClick={() => removeDomain(index)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button color="primary" onClick={addDomain}>
                                <FontAwesomeIcon icon={faPlus} /> 영역 추가
                            </Button>
                        </FormGroup>
                                                <FormGroup>
                            <Label for="useTools">사용 교구</Label>
                            <Input 
                                type="text" 
                                name="useTools" 
                                id="useTools" 
                                value={currentPost.tools || ''}
                                onChange={(e) => setCurrentPost({...currentPost, tools: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">놀이 설명</Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                id="description" 
                                value={currentPost.text || ''}
                                rows="10"
                                onChange={(e) => setCurrentPost({...currentPost, text: e.target.value})}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={!currentPost.title || !currentPost.text}>
                        {isEditing ? '수정' : '등록'}
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>취소</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
                <ModalHeader toggle={() => setDeleteModal(false)}>삭제 확인</ModalHeader>
                <ModalBody>
                    정말로 이 게시글을 삭제하시겠습니까?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={confirmDelete}>삭제</Button>{' '}
                    <Button color="secondary" onClick={() => setDeleteModal(false)}>취소</Button>
                </ModalFooter>
            </Modal>

            <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            />
            <Footer />
        </div>
    );
}

export default Play;