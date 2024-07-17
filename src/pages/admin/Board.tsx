import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'

type Post = {
    id: number;
    title: string;
    image: string;
    description: string;
    createdAt: string;
};

function Place() {
    const [data, setData] = useState<Post[]>([
        { id: 1, title: '공지사항1', image: '/api/placeholder/50/50', description: '공지사항\n입니다.', createdAt: '2024-06-28' },
        { id: 2, title: '공지사항2', image: '/api/placeholder/50/50', description: '공지사항\n입니다.', createdAt: '2024-06-28' },
    ]);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [newPost, setNewPost] = useState<Partial<Post>>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleEdit = (post: Post) => {
        setCurrentPost(post);
        setEditModal(true);
    };
    
    const openImageInNewTab = (imageUrl: string) => {
        window.open(imageUrl, '_blank');
    };

    const columnHelper = createColumnHelper<Post>();
    const columns = [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('title', {
            header: '제목',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('image', {
            header: '첨부 이미지',
            cell: info => (
                <img 
                    src={info.getValue()} 
                    alt="이미지" 
                    style={{ width: '50px', height: '50px', cursor: 'pointer' }} 
                    onClick={() => openImageInNewTab(info.getValue())}
                />
            ),
        }),
        columnHelper.accessor('createdAt', {
            header: '등록 일자',
            cell: info => info.getValue(),
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: (info) => (
                <div>
                    <Button color="link" className="mr-3" onClick={() => handleEdit(info.row.original)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button color="link" onClick={() => console.log('삭제')}>
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 파일 타입 검증
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
        setNewPost({});
        setPreviewImage(null);
        setFileError(null);
        setCurrentPost(null);
    };

    const toggle = () => {
        setModal(!modal);
        if (modal) {
            resetModal();
        }
    };

    const toggleEdit = () => {
        setEditModal(!editModal);
        if (editModal) {
            resetModal();
        }
    };

    const handleSubmit = () => {
        if (newPost.title ) {
            setData([...data, { ...newPost, id: data.length + 1, createdAt: new Date().toISOString().split('T')[0], image: previewImage || '/api/placeholder/50/50' } as Post]);
            toggle();
        }
    };

    const handleUpdate = () => {
        if (currentPost) {
            setData(data.map(post => post.id === currentPost.id ? { ...currentPost, ...newPost, image: previewImage || currentPost.image } : post));
            toggleEdit();
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

             {/* 게시글 등록 모달 */}
             <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>게시글 등록</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">제목</Label>
                            <Input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={newPost.title || ''}
                                onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
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
                            ) : currentPost?.image && (
                                <img 
                                    src={currentPost.image} 
                                    alt="Current" 
                                    style={{ width: '100px', marginTop: '10px', cursor: 'pointer' }} 
                                    onClick={() => openImageInNewTab(currentPost.image)}
                                />
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="description"></Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                id="description" 
                                value={newPost.description || ''}
                                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                                style={{ height: '300px', resize: 'none'  }}
                            >
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={!!fileError || !newPost.title || !newPost.description}>등록</Button>{' '}
                    <Button color="secondary" onClick={toggle}>취소</Button>
                </ModalFooter>
            </Modal>

            {/* 게시글 수정 모달 */}
            <Modal isOpen={editModal} toggle={toggleEdit}>
                <ModalHeader toggle={toggleEdit}>게시글 수정</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="title">제목</Label>
                            <Input 
                                type="text" 
                                name="title" 
                                id="title" 
                                value={newPost.title || currentPost?.title || ''}
                                onChange={(e) => setNewPost({...newPost, title: e.target.value})} 
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
                            {previewImage ? 
                                <img src={previewImage} alt="Preview" style={{ width: '100px', marginTop: '10px' }} /> :
                                currentPost?.image && <img src={currentPost.image} alt="Current" style={{ width: '100px', marginTop: '10px' }} />
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label for="description"></Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                id="description" 
                                value={newPost.description || currentPost?.description || ''}
                                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                                style={{ height: '300px', resize: 'none'  }}
                            >
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdate} disabled={!!fileError}>수정</Button>{' '}
                    <Button color="secondary" onClick={toggleEdit}>취소</Button>
                </ModalFooter>
            </Modal>

            <Footer />
        </div>
    );
}

export default Place;