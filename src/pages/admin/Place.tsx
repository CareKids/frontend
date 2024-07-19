import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getPlaceAdminData, postPlaceAdminData, deletePlaceAdminData } from '../../api/admin';
import { PlaceAdminInfo, PlaceAdminItem } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;
const Place: React.FC = () => {
    const [placeInfo, setPlaceInfo] = useState<PlaceAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<PlaceAdminItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchInitialPlaceData();
    }, []);
    
    useEffect(() => {
        fetchInitialPlaceData();
    }, [currentPage]);

    const fetchInitialPlaceData = async () => {
        setLoading(true);
        try {
            const data = await getPlaceAdminData(currentPage, ITEMS_PER_PAGE);
            setPlaceInfo(data);
        } catch (err) {
            setError('장소 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (post: PlaceAdminItem) => {
        setCurrentPost(post);
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
                await deletePlaceAdminData(deleteId);
                fetchInitialPlaceData();
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
            <Button color="link" onClick={() => handleDelete(row.original.id)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>
    ), [handleEdit, handleDelete]);

    const columnHelper = createColumnHelper<PlaceAdminItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: '장소 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('maincate.name', {
            header: '카테고리',
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: ActionCell,
        }),
    ], [ActionCell]);

    const table = useReactTable({
        data: placeInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const resetModal = () => {
        setCurrentPost({});
        setIsEditing(false);
    };

    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            resetModal();
        }
    };
    
    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const placeData = {
    //         id: isEditing && currentPost.id ? currentPost.id : null,
    //         name: currentPost.name,
    //         "img-url": currentPost['img-url'],
    //         address: currentPost.address,
    //         'new-address': currentPost['new-address'] || '',
    //         phone: currentPost.phone || '',
    //         region: currentPost.region,
    //         type: currentPost.type,
    //         "parking-type": currentPost['parking-type'],
    //         "is-free": currentPost['is-free'],
    //         'operate-time': currentPost['operate-time'],
    //         maincate: currentPost.maincate,
    //         subcate: currentPost.subcate,
    //         keywords: currentPost.keywords,
    //     };
    
    //     try {
    //         const response = await postPlaceAdminData(placeData);
    //         fetchInitialPlaceData();
    //         toggle();
    //     } catch (error) {
    //         console.error('API 오류:', error);
    //     }
    // };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!placeInfo) return <div>No data available</div>;
  
    const totalPages = placeInfo.pageInfo.total;

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>장소 관리</b></h1>

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

             {/* 게시글 등록 모달 */}
             <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>게시글 등록</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="placeName">장소 이름</Label>
                            <Input 
                                type="text" 
                                name="placeName" 
                                id="placeName" 
                                value={currentPost.name || ''}
                                onChange={(e) => setCurrentPost({...currentPost, name: e.target.value})} 
                            />
                        </FormGroup>
                        {/* <FormGroup>
                            <Label for="category">카테고리</Label>
                            <Input 
                                type="select" 
                                name="category" 
                                id="category" 
                                value={newPost.category || ''}
                                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>카페</option>
                                <option>음식점</option>
                                <option>놀이터</option>
                            </Input>
                        </FormGroup> */}
                        <FormGroup>
                            <Label for="url">대표 이미지</Label>
                            <Input 
                                type="text" 
                                name="url" 
                                id="url" 
                                value={currentPost['img-url'] || ''}
                                onChange={(e) => setCurrentPost({...currentPost, "img-url": e.target.value})} 
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="primary" onClick={handleSubmit} disabled={!currentPost.name || !currentPost.address}>
                        {isEditing ? '수정' : '등록'}
                    </Button>{' '}
                    <Button color="secondary" onClick={toggle}>취소</Button> */}
                    <Button color="primary" disabled={!currentPost.name || !currentPost.address}>
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

export default Place;