import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getRegions } from '../../api/load';
import { Region, OperateTime, ClassInfo, ClassItem } from '../../api/types';
import { getClassAdminData, postClassAdminData, deleteClassAdminData, getDays } from '../../api/admin';
import { Day } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;
const Class: React.FC = () => {
    const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<ClassItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    const [operateTimes, setOperateTimes] = useState<OperateTime[]>([]);
    const [newOperateTime, setNewOperateTime] = useState<OperateTime>({
        "operation-day": "",
        startTime: [9, 0],
        endTime: [18, 0]
    });

    useEffect(() => {
        fetchRegions();
        fetchDays();
        fetchInitialClassData();
    }, []);
    
    useEffect(() => {
        fetchInitialClassData();
    }, [currentPage]);

    useEffect(() => {
        if (currentPost['operate-time']) {
            setOperateTimes(currentPost['operate-time']);
        }
    }, [currentPost]);

    const fetchInitialClassData = async () => {
        setLoading(true);
        try {
            const data = await getClassAdminData(currentPage, ITEMS_PER_PAGE);
            setClassInfo(data);
        } catch (err) {
            setError('주말 어린이집 정보를 불러오는 데 실패했습니다.');
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

    const fetchDays = async () => {
        try {
            const dayData = await getDays();
            setDays(dayData);
        } catch (err) {
            console.error('Failed to fetch days:', err);
            setError('요일 정보를 불러오는 데 실패했습니다.');
        }
    };

    const handleEdit = (post: ClassItem) => {
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
                await deleteClassAdminData(deleteId);
                fetchInitialClassData();
                setDeleteModal(false);
            } catch (error) {
                console.error('삭제 중 오류 발생:', error);
            }
        }
    };

    const formatTime = (time: number): string => {
        return time.toString().padStart(2, '0');
    };

    const formatTimeForDisplay = (time: [number, number]): string => {
        return `${time[0].toString().padStart(2, '0')}:${time[1].toString().padStart(2, '0')}`;
    };

    const formatTimeStringToArray = (timeString: string): [number, number] => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return [hours, minutes];
    };

    const handleOperateTimeChange = (index: number, field: keyof OperateTime, value: string) => {
        const newOperateTimes = [...operateTimes];
        if (field === 'operation-day') {
            newOperateTimes[index][field] = value;
        } else {
            newOperateTimes[index][field] = formatTimeStringToArray(value);
        }
        setOperateTimes(newOperateTimes);
    };

    const handleAddOperateTime = () => {
        setOperateTimes(prevTimes => [...prevTimes, newOperateTime]);
        setNewOperateTime({
            "operation-day": "",
            startTime: [9, 0],
            endTime: [18, 0]
        });
    };

    const handleRemoveOperateTime = (index: number) => {
        setOperateTimes(operateTimes.filter((_, i) => i !== index));
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

    const columnHelper = createColumnHelper<ClassItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('kindergartenId', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('kindergartenName', {
            header: '장소 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('kindergartenRegion.name', {
            header: '지역',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('kindergartenNewaddress', {
            header: '주소',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('kindergartenPhone', {
            header: '연락처',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('operate-time', {
            header: '운영 시간',
            cell: info => {
                const operateTime = info.getValue();
                if (Array.isArray(operateTime)) {
                    const timeString = operateTime.map(time => 
                        `${time["operation-day"]}: ${formatTime(time.startTime[0])}:${formatTime(time.startTime[1])} - ${formatTime(time.endTime[0])}:${formatTime(time.endTime[1])}`
                    ).join(', ');
                    return truncateText(timeString, 10);
                }
                return truncateText(String(operateTime) || '', 10);
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: '수정/삭제',
            cell: ActionCell,
        }),
    ], [ActionCell]);

    const table = useReactTable({
        data: classInfo?.pageList ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    
    const resetModal = () => {
        setCurrentPost({});
        setIsEditing(false);
        setOperateTimes([{
            "operation-day": "",
            startTime: [9, 0],
            endTime: [18, 0]
        }]);
    };
    
    const toggle = () => {
        setModal(!modal);
        if (!modal) {
            resetModal();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const formattedOperateTimes = operateTimes.map(time => ({
            "operation-day": time["operation-day"],
            startTime: time.startTime,
            endTime: time.endTime
        }));

        if (!currentPost.kindergartenName || !currentPost.kindergartenAddress || !currentPost.kindergartenRegion || !currentPost.kindergartenNewaddress || !currentPost.kindergartenPhone) {
            setSubmitError('모든 필수 항목을 입력해주세요.');
            return;
        }

        const classData = {
            id: isEditing && currentPost.kindergartenId ? currentPost.kindergartenId : null,
            name: currentPost.kindergartenName,
            address: currentPost.kindergartenAddress,
            'new-address': currentPost.kindergartenNewaddress,
            phone: currentPost.kindergartenPhone,
            region: currentPost.kindergartenRegion,
            'operate-time': formattedOperateTimes
        };
    
        try {
            const response = await postClassAdminData(classData);
            fetchInitialClassData();
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
    if (!classInfo) return <div>No data available</div>;
  
    const totalPages = classInfo.pageInfo.total;

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

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>게시글 등록</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="kindergartenName">장소 이름</Label>
                            <Input 
                                type="text" 
                                name="kindergartenName" 
                                id="kindergartenName" 
                                value={currentPost.kindergartenName || ''}
                                onChange={(e) => setCurrentPost({...currentPost, kindergartenName: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="region">지역</Label>
                            <Input 
                                type="select" 
                                name="region" 
                                id="region" 
                                value={currentPost.kindergartenRegion?.id || ''}
                                onChange={(e) => setCurrentPost({...currentPost, kindergartenRegion: regions.find(r => r.id === parseInt(e.target.value))})}
                            >
                                <option value="">선택하세요</option>
                                {regions.map(region => (
                                    <option key={region.id} value={region.id}>{region.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">주소</Label>
                            <Input 
                                type="text" 
                                name="address" 
                                id="address" 
                                value={currentPost.kindergartenAddress || ''}
                                onChange={(e) => setCurrentPost({...currentPost, kindergartenAddress: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="newAddress">도로명 주소</Label>
                            <Input 
                                type="text" 
                                name="newAddress" 
                                id="newAddress" 
                                value={currentPost.kindergartenNewaddress || ''}
                                onChange={(e) => setCurrentPost({...currentPost, kindergartenNewaddress: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">전화번호</Label>
                            <Input 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                value={currentPost.kindergartenPhone || ''}
                                onChange={(e) => setCurrentPost({...currentPost, kindergartenPhone: e.target.value})}
                            />
                        </FormGroup>                    
                        <FormGroup>
                            <Label>운영 시간</Label>
                            {operateTimes.map((time, index) => (
                                <div key={index} className="d-flex mb-2 align-items-center">
                                    <Input 
                                        type="select" 
                                        value={time["operation-day"]}
                                        onChange={(e) => handleOperateTimeChange(index, "operation-day", e.target.value)}
                                        className="me-2"
                                        style={{ width: '100px' }}
                                    >
                                        <option value="">선택</option>
                                        {days.map(day => (
                                            <option key={day.id} value={day['operate-day']}>{day['operate-day']}</option>
                                        ))}
                                    </Input>
                                    <Input 
                                        type="time" 
                                        value={formatTimeForDisplay(time.startTime)}
                                        onChange={(e) => handleOperateTimeChange(index, "startTime", e.target.value)}
                                        className="me-2"
                                    />
                                    <Input 
                                        type="time" 
                                        value={formatTimeForDisplay(time.endTime)}
                                        onChange={(e) => handleOperateTimeChange(index, "endTime", e.target.value)}
                                        className="me-2"
                                    />
                                    {operateTimes.length > 1 && (
                                        <Button color="danger" onClick={() => handleRemoveOperateTime(index)} className="me-2">
                                            <FontAwesomeIcon icon={faMinus} />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button color="primary" onClick={handleAddOperateTime} className="mb-2">
                                <FontAwesomeIcon icon={faPlus} /> 운영 시간 추가
                            </Button>
                        </FormGroup>
                    </Form>
                    {submitError && <Alert color="danger">{submitError}</Alert>}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit} disabled={!currentPost.kindergartenName || !currentPost.kindergartenAddress}>
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

export default Class;