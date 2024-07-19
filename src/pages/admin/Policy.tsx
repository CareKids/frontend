import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getRegions, getAgeTags } from '../../api/load';
import { Region, AgeTag } from '../../api/types';
import { getPolicyAdminData, postPolicyAdminData, deletePolicyAdminData, getPolicyType } from '../../api/admin';
import { PolicyAdminInfo, PolicyAdminItem, PolicySubmit, PolicyType } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;
const Policy: React.FC = () => {
    const [policyInfo, setPolicyInfo] = useState<PolicyAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<PolicyAdminItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [ages, setAges] = useState<AgeTag[]>([]);
    const [policyType, setPolicyType] = useState<PolicyType[]>([]);
    const [selectedAges, setSelectedAges] = useState<AgeTag[]>([{} as AgeTag]);
    const [selectedRegions, setSelectedRegions] = useState<Region[]>([{} as Region]);

    useEffect(() => {
        fetchRegions();
        fetchAges();
        fetchPolicyTypes();
        fetchInitialPolicyData();
    }, []);
    
    useEffect(() => {
        fetchInitialPolicyData();
    }, [currentPage]);

    useEffect(() => {
        if (isEditing && currentPost) {
            setSelectedAges(currentPost['age-tag'] || []);
            setSelectedRegions(currentPost.region || []);
        }
    }, [isEditing, currentPost]);

    const fetchInitialPolicyData = async () => {
        setLoading(true);
        try {
            const data = await getPolicyAdminData(currentPage, ITEMS_PER_PAGE);
            setPolicyInfo(data);
        } catch (err) {
            setError('정책 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRegions = async () => {
        try {
            const regionData = await getRegions();
            setRegions(regionData);
        } catch (err) {
            console.error('Failed to fetch regions:', err);
            setError('지역 정보를 불러오는 데 실패했습니다.');
        }
    };

    const fetchAges = async () => {
        try {
            const ageData = await getAgeTags();
            setAges(ageData);
        } catch (err) {
            console.error('Failed to fetch ages:', err);
            setError('연령대 정보를 불러오는 데 실패했습니다.');
        }
    };

    const fetchPolicyTypes = async () => {
        try {
            const policyTypeData = await getPolicyType();
            setPolicyType(policyTypeData);
        } catch (err) {
            console.error('Failed to fetch ages:', err);
            setError('정책 종류를 불러오는 데 실패했습니다.');
        }
    }

    const handleEdit = (post: PolicyAdminItem) => {
        setCurrentPost(post);
        setSelectedAges(post['age-tag'] || []);
        setSelectedRegions(post.region || []);
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
                await deletePolicyAdminData(deleteId);
                fetchInitialPolicyData();
                setDeleteModal(false);
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        }
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
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

    const columnHelper = createColumnHelper<PolicyAdminItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: '정책 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('target', {
            header: '대상',
            cell: info => truncateText(info.getValue() || '', 30),
        }),
        columnHelper.accessor('type', {
            header: '종류',
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: ActionCell,
        }),
    ], [ActionCell]);

    const table = useReactTable({
        data: policyInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    
    const handleAgeChange = (index: number, value: string) => {
        const newSelectedAges = [...selectedAges];
        newSelectedAges[index] = ages.find(age => age.id === parseInt(value)) || selectedAges[index];
        setSelectedAges(newSelectedAges);
    };

    const handleRegionChange = (index: number, value: string) => {
        const newSelectedRegions = [...selectedRegions];
        newSelectedRegions[index] = regions.find(region => region.id === parseInt(value)) || selectedRegions[index];
        setSelectedRegions(newSelectedRegions);
    };

    const addAge = () => {
        setSelectedAges([...selectedAges, {} as AgeTag]);
    };

    const removeAge = (index: number) => {
        const newSelectedAges = selectedAges.filter((_, i) => i !== index);
        setSelectedAges(newSelectedAges);
    };

    const addRegion = () => {
        setSelectedRegions([...selectedRegions, {} as Region]);
    };

    const removeRegion = (index: number) => {
        const newSelectedRegions = selectedRegions.filter((_, i) => i !== index);
        setSelectedRegions(newSelectedRegions);
    };

    const resetModal = () => {
        setCurrentPost({});
        setIsEditing(false);
        setSelectedAges([{} as AgeTag]);
        setSelectedRegions([{} as Region]);
    };

    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            resetModal();
        } else {
            if (!isEditing) {
                setSelectedAges([]);
                setSelectedRegions([]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPost.title || !currentPost.text || !currentPost.target || !currentPost.process || !currentPost.type || !currentPost.url) {
            setSubmitError('모든 필수 항목을 입력해주세요.');
            return;
        }

        const policyData = {
            id: isEditing && currentPost.id ? currentPost.id: null,
            title: currentPost.title,
            text: currentPost.text,
            target: currentPost.target,
            process: currentPost.process,
            type: currentPost.type,
            url: currentPost.url,
            region: selectedRegions,
            "age-tag": selectedAges
        };
    
        try {
            const response = await postPolicyAdminData(policyData);
            fetchInitialPolicyData();
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
    if (!policyInfo) return <div>No data available</div>;
  
    const totalPages = policyInfo.pageInfo.total;

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>정책 정보 관리</b></h1>

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
                            <Label for="title">정책 이름</Label>
                            <Input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={currentPost.title || ''}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>연령대</Label>
                            {selectedAges.map((age, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Input 
                                        type="select" 
                                        value={age.id || ''}
                                        onChange={(e) => handleAgeChange(index, e.target.value)}
                                        className="me-2"
                                    >
                                        <option value="">선택하세요</option>
                                        {ages.map(a => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </Input>
                                    {selectedAges.length > 1 && (
                                        <Button color="danger" onClick={() => removeAge(index)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button color="primary" onClick={addAge}>
                                <FontAwesomeIcon icon={faPlus} /> 연령대 추가
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Label for="target">정책 대상</Label>
                            <Input 
                                type="text" 
                                name="target" 
                                id="target" 
                                value={currentPost.target || ''}
                                onChange={(e) => setCurrentPost({...currentPost, target: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>지역</Label>
                            {selectedRegions.map((region, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Input 
                                        type="select" 
                                        value={region.id || ''}
                                        onChange={(e) => handleRegionChange(index, e.target.value)}
                                        className="me-2"
                                    >
                                        <option value="">선택하세요</option>
                                        {regions.map(r => (
                                            <option key={r.id} value={r.id}>{r.name}</option>
                                        ))}
                                    </Input>
                                    {selectedRegions.length > 1 && (
                                        <Button color="danger" onClick={() => removeRegion(index)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button color="primary" onClick={addRegion}>
                                <FontAwesomeIcon icon={faPlus} /> 지역 추가
                            </Button>
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">정책 종류</Label>
                            <Input 
                                type="text" 
                                name="type" 
                                id="type" 
                                value={currentPost.type || ''}
                                onChange={(e) => setCurrentPost({...currentPost, type: e.target.value})} 
                            />
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="type">정책 종류</Label>
                            <Input 
                                type="select" 
                                name="type" 
                                id="type" 
                                value={currentPost.type || ''}
                                onChange={(e) => setCurrentPost({...currentPost, type: policyType.find(r => r.id === parseInt(e.target.value))?.['kids-policy-type']})}
                            >
                                <option value="">선택하세요</option>
                                {policyType.map(type => (
                                    <option key={type.id} value={type.id}>{type["kids-poliy-type"]}</option>
                                ))}
                            </Input>
                        </FormGroup> */}
                        <FormGroup>
                            <Label for="text">정책 내용</Label>
                            <Input 
                                type="text" 
                                name="text" 
                                id="text" 
                                value={currentPost.text || ''}
                                onChange={(e) => setCurrentPost({...currentPost, text: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="process">신청 방법</Label>
                            <Input 
                                type="text" 
                                name="process" 
                                id="process" 
                                value={currentPost.process || ''}
                                onChange={(e) => setCurrentPost({...currentPost, process: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="url">바로가기</Label>
                            <Input 
                                type="text" 
                                name="url" 
                                id="url" 
                                value={currentPost.url || ''}
                                onChange={(e) => setCurrentPost({...currentPost, url: e.target.value})} 
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

export default Policy;