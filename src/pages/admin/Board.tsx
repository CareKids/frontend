import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper, CellContext } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getBoardAdminData, postBoardAdminData, deleteBoardAdminData } from '../../api/admin';
import { BoardAdminInfo, BoardAdminItem } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;
const Board: React.FC = () => {
    const [boardInfo, setBoardInfo] = useState<BoardAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<BoardAdminItem>>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchInitialBoardData();
    }, []);
    
    useEffect(() => {
        fetchInitialBoardData();
    }, [currentPage]);

    const handleEdit = (post: BoardAdminItem) => {
        setCurrentPost(post);
        setIsEditing(true);
        setModal(true);
    };

    const openImageInNewTab = useCallback((imageUrl: string) => {
        window.open(imageUrl, '_blank');
    }, []);

    const ImageCell = useCallback(({ getValue }: CellContext<BoardAdminItem, string>) => {
        const value = getValue();
        if (!value) {
            return <span>-</span>;
        }
        return (
            <img 
                src={value} 
                alt="이미지" 
                style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
                onClick={() => openImageInNewTab(value)}
            />
        );
    }, [openImageInNewTab]);

    const handleDelete = async (id: number) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteBoardAdminData(deleteId);
                fetchInitialBoardData();
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
    
    const columnHelper = createColumnHelper<BoardAdminItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: '제목',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('img', {
            header: '첨부 이미지',
            cell: ImageCell,
        }),
        columnHelper.accessor('createdAt', {
            header: '등록 일자',
            cell: info => {
                const dateArray = info.getValue();
                if (Array.isArray(dateArray) && dateArray.length >= 3) {
                    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    return date.toLocaleDateString();
                }
                return 'Invalid Date';
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: ActionCell,
        }),
    ], [ImageCell, ActionCell]);

    const table = useReactTable({
        data: boardInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const fetchInitialBoardData = async () => {
        setLoading(true);
        try {
            const data = await getBoardAdminData(currentPage, ITEMS_PER_PAGE);
            setBoardInfo(data);
        } catch (err) {
            setError('공지사항 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber);
      };
  
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!boardInfo) return <div>No data available</div>;
  
    const totalPages = boardInfo.pageInfo.total;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setFileError('올바른 이미지 파일을 선택해주세요 (JPG, PNG, GIF)');
                setPreviewImage(null);
                return;
            }

            setFileError(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const resetModal = () => {
        setCurrentPost({});
        setPreviewImage(null);
        setFileError(null);
        setIsEditing(false);
    };

    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            resetModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
    
        const blob = new Blob([JSON.stringify({
            id: isEditing ? currentPost.id : null,
            title: currentPost.title,
            description: currentPost.description
        })], {type: 'application/json'})
        formData.append('data', blob, 'data.json')
    
        if (previewImage) {
            const response = await fetch(previewImage);
            const imageblob = await response.blob();
            formData.append('file', imageblob, 'image.jpg');
        }
        else {
            formData.append('file', "");
        }
    
        try {
            const response = await postBoardAdminData(formData);
            fetchInitialBoardData();
            toggle();
        } catch (error) {
            console.error('API 오류:', error);
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>공지사항 관리</b></h1>

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
                <ModalHeader toggle={toggle}>{isEditing ? '게시글 수정' : '게시글 등록'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">제목</Label>
                            <Input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={currentPost.title || ''}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="image">첨부 이미지</Label>
                            <Input 
                                type="file" 
                                name="image" 
                                id="image" 
                                onChange={handleImageChange}
                                accept="image/jpeg, image/png, image/gif"
                            />
                            {fileError && <Alert color="danger">{fileError}</Alert>}
                            {previewImage ? (
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }} 
                                    onClick={() => openImageInNewTab(previewImage)}
                                />
                            ) : currentPost.img && (
                                <img 
                                    src={currentPost.img} 
                                    alt="Current" 
                                    style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }}
                                />
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">내용</Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                id="description" 
                                value={currentPost.description || ''}
                                onChange={(e) => setCurrentPost({...currentPost, description: e.target.value})}
                                style={{ height: '300px', resize: 'none'  }}
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={!!fileError || !currentPost.title || !currentPost.description}>
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

export default Board;