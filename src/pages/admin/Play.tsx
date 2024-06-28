import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'

type Post = {
    id: number;
    age: string;
    playName: string;
    category: string;
    useTools: string;
    place: string;
    description: string;
    createdAt: string;
};

function Play() {
    const [data, setData] = useState<Post[]>([
        { id: 1, age: '24개월 미만', playName: '공놀이', category: '신체 발달', useTools: '공', place: '야외', description: '공차기를 하면서\n재미있게 놀 수 있습니다.', createdAt: '2024-06-28' },
        { id: 2, age: '5살', playName: '종이접기', category: '손재주', useTools: '종이, 풀', place: '실내', description: '여러가지 종이접기를\n해 봅시다.', createdAt: '2024-06-28' },
    ]);
    const [modal, setModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [currentPost, setCurrentPost] = useState<Post | null>(null);
    const [newPost, setNewPost] = useState<Partial<Post>>({});

    const handleEdit = (post: Post) => {
        setCurrentPost(post);
        setEditModal(true);
    };

    const columnHelper = createColumnHelper<Post>();
    const columns = [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('playName', {
            header: '놀이 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('age', {
            header: '연령대',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('category', {
            header: '발달 영역',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('useTools', {
            header: '사용 교구',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('place', {
            header: '추천 장소',
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

    const resetModal = () => {
        setNewPost({});
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
        if (newPost.playName && newPost.category) {
            setData([...data, { ...newPost, id: data.length + 1, createdAt: new Date().toISOString().split('T')[0] } as Post]);
            toggle();
        }
    };

    const handleUpdate = () => {
        if (currentPost) {
            setData(data.map(post => post.id === currentPost.id ? { ...currentPost, ...newPost } : post));
            toggleEdit();
        }
    };

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

             {/* 게시글 등록 모달 */}
             <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>게시글 등록</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="placeName">놀이 이름</Label>
                            <Input 
                                type="text" 
                                name="placeName" 
                                id="placeName" 
                                value={newPost.playName || ''}
                                onChange={(e) => setNewPost({...newPost, playName: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="age">연령대</Label>
                            <Input 
                                type="select" 
                                name="age" 
                                id="age" 
                                value={newPost.age || ''}
                                onChange={(e) => setNewPost({...newPost, age: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>24개월 미만</option>
                                <option>5살</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="category">발달 영역</Label>
                            <Input 
                                type="select" 
                                name="category" 
                                id="category" 
                                value={newPost.category || ''}
                                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>신체 발달</option>
                                <option>손재주</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="useTools">사용 교구</Label>
                            <Input 
                                type="text" 
                                name="useTools" 
                                id="useTools" 
                                value={newPost.useTools || ''}
                                onChange={(e) => setNewPost({...newPost, useTools: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="place">추천 장소</Label>
                            <Input 
                                type="select" 
                                name="place" 
                                id="place" 
                                value={newPost.place || ''}
                                onChange={(e) => setNewPost({...newPost, place: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>실내</option>
                                <option>야외</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">놀이 설명</Label>
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
                    <Button color="primary" onClick={handleSubmit} disabled={ !newPost.playName || !newPost.category}>등록</Button>{' '}
                    <Button color="secondary" onClick={toggle}>취소</Button>
                </ModalFooter>
            </Modal>

            {/* 게시글 수정 모달 */}
            <Modal isOpen={editModal} toggle={toggleEdit}>
                <ModalHeader toggle={toggleEdit}>게시글 수정</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="playName">놀이 이름</Label>
                            <Input 
                                type="text" 
                                name="playName" 
                                id="playName" 
                                value={newPost.playName || currentPost?.playName || ''}
                                onChange={(e) => setNewPost({...newPost, playName: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="age">연령대</Label>
                            <Input 
                                type="select" 
                                name="age" 
                                id="age" 
                                value={newPost.age || currentPost?.age || ''}
                                onChange={(e) => setNewPost({...newPost, age: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>24개월 미만</option>
                                <option>5살</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="category">발달 영역</Label>
                            <Input 
                                type="select" 
                                name="category" 
                                id="category" 
                                value={newPost.category || currentPost?.category || ''}
                                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>신체 발달</option>
                                <option>손재주</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="useTools">사용 교구</Label>
                            <Input 
                                type="text" 
                                name="useTools" 
                                id="useTools" 
                                value={newPost.useTools || currentPost?.useTools || ''}
                                onChange={(e) => setNewPost({...newPost, useTools: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="place">추천 장소</Label>
                            <Input 
                                type="select" 
                                name="place" 
                                id="place" 
                                value={newPost.place || currentPost?.place || ''}
                                onChange={(e) => setNewPost({...newPost, place: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>실내</option>
                                <option>야외</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">놀이 설명</Label>
                            <Input 
                                type="textarea" 
                                name="description" 
                                id="description" 
                                value={newPost.description || currentPost?.description || ''}
                                onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                                style={{ height: '300px', resize: 'none' }}
                            >
                            </Input>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleUpdate}>수정</Button>{' '}
                    <Button color="secondary" onClick={toggleEdit}>취소</Button>
                </ModalFooter>
            </Modal>

            <Footer />
        </div>
    );
}

export default Play;