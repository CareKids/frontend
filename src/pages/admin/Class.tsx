import React, { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'

type Post = {
    id: number;
    placeName: string;
    region: string;
    createdAt: string;
    address: string;
    phone: string;
    openHour: string;
};

function Class() {
    const [data, setData] = useState<Post[]>([
        { id: 1, placeName: '어린이집1', region: '강남구', createdAt: '2024-06-28', address: '서울시 강남구', phone: '010-1234-5678', openHour: '09:00-18:00' },
        { id: 2, placeName: '어린이집2', region: '관악구', createdAt: '2024-06-28', address: '서울시 관악구', phone: '010-1234-5678', openHour: '09:00-18:00' },
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
        columnHelper.accessor('placeName', {
            header: '장소 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('region', {
            header: '지역',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('address', {
            header: '주소',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('phone', {
            header: '연락처',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('openHour', {
            header: '운영 시간',
            cell: info => info.getValue(),
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
        if (newPost.placeName && newPost.region) {
            setData([...data, { ...newPost, id: data.length + 1, createdAt: new Date().toISOString().split('T')[0], } as Post]);
            toggle();
        }
    };

    const handleUpdate = () => {
        if (currentPost) {
            setData(data.map(post => post.id === currentPost.id ? { ...currentPost, ...newPost, } : post));
            toggleEdit();
        }
    };

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>주말 어린이집 관리</b></h1>

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
                                value={newPost.placeName || ''}
                                onChange={(e) => setNewPost({...newPost, placeName: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="region">지역구</Label>
                            <Input 
                                type="select" 
                                name="region" 
                                id="region" 
                                value={newPost.region || ''}
                                onChange={(e) => setNewPost({...newPost, region: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>강남구</option>
                                <option>강서구</option>
                                <option>관악구</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">주소</Label>
                            <Input 
                                type="text" 
                                name="address" 
                                id="address" 
                                value={newPost.address || ''}
                                onChange={(e) => setNewPost({...newPost, address: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">연락처</Label>
                            <Input 
                                type="text" 
                                name="phone" 
                                id="phone" 
                                value={newPost.phone || ''}
                                onChange={(e) => setNewPost({...newPost, phone: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="openHour">운영시간</Label>
                            <Input 
                                type="text" 
                                name="openHour" 
                                id="openHour" 
                                value={newPost.openHour || ''}
                                onChange={(e) => setNewPost({...newPost, openHour: e.target.value})} 
                            />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={ !newPost.placeName || !newPost.region || !newPost.address || !newPost.phone|| !newPost.openHour }>등록</Button>{' '}
                    <Button color="secondary" onClick={toggle}>취소</Button>
                </ModalFooter>
            </Modal>

            {/* 게시글 수정 모달 */}
            <Modal isOpen={editModal} toggle={toggleEdit}>
                <ModalHeader toggle={toggleEdit}>게시글 수정</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="placeName">장소 이름</Label>
                            <Input 
                                type="text" 
                                name="placeName" 
                                id="placeName" 
                                value={newPost.placeName || currentPost?.placeName || ''}
                                onChange={(e) => setNewPost({...newPost, placeName: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="region">지역구</Label>
                            <Input 
                                type="select" 
                                name="region" 
                                id="region" 
                                value={newPost.region || currentPost?.region || ''}
                                onChange={(e) => setNewPost({...newPost, region: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                <option>강남구</option>
                                <option>강서구</option>
                                <option>관악구</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">주소</Label>
                            <Input 
                                type="text" 
                                name="address" 
                                id="address" 
                                value={newPost.address || currentPost?.address || ''}
                                onChange={(e) => setNewPost({...newPost, address: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">연락처</Label>
                            <Input 
                                type="text" 
                                name="phone" 
                                id="phone" 
                                value={newPost.phone || currentPost?.phone || ''}
                                onChange={(e) => setNewPost({...newPost, phone: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="openHour">운영시간</Label>
                            <Input 
                                type="text" 
                                name="openHour" 
                                id="openHour" 
                                value={newPost.openHour || currentPost?.openHour || ''}
                                onChange={(e) => setNewPost({...newPost, openHour: e.target.value})} 
                            />
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

export default Class;