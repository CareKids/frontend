import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/admin/Header'
import Footer from '../../components/Footer'
import Pagination from '../../components/Pagination';

import { getRegions } from '../../api/load';
import { Region, OperateTime } from '../../api/types';
import { getHospitalAdminData, postHospitalAdminData, deleteHospitalAdminData, getDays, getTypes } from '../../api/admin';
import { HospitalAdminInfo, HospitalAdminItem, Type, Day } from '../../api/adminTypes';

const ITEMS_PER_PAGE = 12;
const Hospital: React.FC = () => {
    const [hospitalInfo, setHospitalInfo] = useState<HospitalAdminInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState<Partial<HospitalAdminItem>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [types, setTypes] = useState<Type[]>([]);
    const [days, setDays] = useState<Day[]>([]);
    const [operateTimes, setOperateTimes] = useState<OperateTime[]>([]);
    const [newOperateTime, setNewOperateTime] = useState<OperateTime>({
        "operation-day": "",
        startTime: [9, 0],
        endTime: [18, 0]
    });

    useEffect(() => {
        fetchRegions();
        fetchTypes();
        fetchDays();
        fetchInitialHospitalData();
    }, []);
    
    useEffect(() => {
        fetchInitialHospitalData();
    }, [currentPage]);

    useEffect(() => {
        if (currentPost['operate-time']) {
            setOperateTimes(currentPost['operate-time']);
        }
    }, [currentPost]);

    const fetchInitialHospitalData = async () => {
        setLoading(true);
        try {
            const data = await getHospitalAdminData(currentPage, ITEMS_PER_PAGE);
            setHospitalInfo(data);
        } catch (err) {
            setError('긴급 진료기관 정보를 불러오는 데 실패했습니다.');
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

    const fetchTypes = async () => {
        try {
            const typeData = await getTypes();
            setTypes(typeData);
        } catch (err) {
            console.error('Failed to fetch types:', err);
            setError('분류 정보를 불러오는 데 실패했습니다.');
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

    const handleEdit = (post: HospitalAdminItem) => {
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
                await deleteHospitalAdminData(deleteId);
                fetchInitialHospitalData();
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
            <Button color="link" onClick={() => handleDelete(row.original.id)}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </div>
    ), [handleEdit, handleDelete]);

    const columnHelper = createColumnHelper<HospitalAdminItem>();
    const columns = useMemo(() => [
        columnHelper.accessor('id', {
            header: '번호',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: '장소 이름',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('type', {
            header: '분류',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('region.name', {
            header: '지역',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('new-address', {
            header: '주소',
            cell: info => truncateText(info.getValue() || '', 10),
        }),
        columnHelper.accessor('phone', {
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
        data: hospitalInfo?.pageList ?? [],
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

        if (!currentPost.name || !currentPost.address || !currentPost.region || !currentPost.type) {
            setSubmitError('모든 필수 항목을 입력해주세요.');
            return;
        }

        const hospitalData = {
            id: isEditing && currentPost.id ? currentPost.id : null,
            name: currentPost.name,
            address: currentPost.address,
            'new-address': currentPost['new-address'] || '',
            phone: currentPost.phone || '',
            region: currentPost.region,
            type: currentPost.type,
            'operate-time': formattedOperateTimes
        };
    
        try {
            const response = await postHospitalAdminData(hospitalData);
            fetchInitialHospitalData();
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
    if (!hospitalInfo) return <div>No data available</div>;
  
    const totalPages = hospitalInfo.pageInfo.total;

    return (
        <div className="App">
            <Header />
            <div className="container mt-4">
                <h1 className="mb-4"><b>긴급 진료기관 관리</b></h1>

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
                <ModalHeader toggle={toggle}>{isEditing ? '긴급 진료기관 수정' : '긴급 진료기관 등록'}</ModalHeader>
                <ModalBody>
                    <Form>
                        <FormGroup>
                            <Label for="name">진료기관 이름</Label>
                            <Input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={currentPost.name || ''}
                                onChange={(e) => setCurrentPost({...currentPost, name: e.target.value})} 
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="region">지역</Label>
                            <Input 
                                type="select" 
                                name="region" 
                                id="region" 
                                value={currentPost.region?.id || ''}
                                onChange={(e) => setCurrentPost({...currentPost, region: regions.find(r => r.id === parseInt(e.target.value))})}
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
                                value={currentPost.address || ''}
                                onChange={(e) => setCurrentPost({...currentPost, address: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="newAddress">도로명 주소</Label>
                            <Input 
                                type="text" 
                                name="newAddress" 
                                id="newAddress" 
                                value={currentPost['new-address'] || ''}
                                onChange={(e) => setCurrentPost({...currentPost, 'new-address': e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="phone">전화번호</Label>
                            <Input 
                                type="tel" 
                                name="phone" 
                                id="phone" 
                                value={currentPost.phone || ''}
                                onChange={(e) => setCurrentPost({...currentPost, phone: e.target.value})}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">분류</Label>
                            <Input 
                                type="select" 
                                name="type" 
                                id="type" 
                                value={currentPost.type || ''}
                                onChange={(e) => setCurrentPost({...currentPost, type: e.target.value})}
                            >
                                <option value="">선택하세요</option>
                                {types.map(type => (
                                    <option key={type.id} value={type.type}>{type.type}</option>
                                ))}
                            </Input>
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
                    <Button color="primary" onClick={handleSubmit} disabled={!currentPost.name || !currentPost.address}>
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

export default Hospital;