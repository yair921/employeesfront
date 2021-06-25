import React, { useState, forwardRef, useImperativeHandle, Fragment } from 'react';
import { useMutation, useQuery, gql } from "@apollo/client";
import { DataGrid } from '@material-ui/data-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, Button } from '@material-ui/core';
import Swal from 'sweetalert2';
import './employeesGrid.css';

const GET_EMPLOYEES = gql`
query 
        GetEmployees($name: String!) {
                getEmployees(name: $name) {
                    status
                    data{
                    id
                    name
                    age
                    username
                    hiredate
                    }
                }
        }
`;

const DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: Int!) {
        deleteEmployee(id:$id) {
                status
        }
    }
`;

export function EmployeesGrid(props, ref) {
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'name',
            headerName: 'Full Name',
            width: 400,
            editable: false,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 150,
            editable: false,
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 200,
            editable: false,
        },
        {
            field: 'hiredate',
            headerName: 'Hire Date',
            width: 150,
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Actions',
            width: 130,
            editable: false,
            renderCell: () => (
                <IconButton aria-label="delete" onClick={deleteEmployeeRow}>
                    <DeleteIcon />
                </IconButton>
            ),
        }
    ];

    const [employeeIdSelected, setEmployeeIdSelected] = useState(0);
    const [employeeNameSelected, setEmployeeNameSelected] = useState('');

    const { data } = useQuery(GET_EMPLOYEES, {
        variables: { name: employeeNameSelected },
        fetchPolicy: "network-only",
    });

    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
        variables: { id: employeeIdSelected },
        refetchQueries: [{ query: GET_EMPLOYEES, variables: { name: employeeNameSelected }, fetchPolicy: "network-only", }]
    });

    useImperativeHandle(ref, () => ({
        updateComponentFromOutside(employeeName) {
            searchEmployee(employeeName)
        }
    }), [])

    function selectedEmployee(employee) {
        setEmployeeIdSelected(employee.row.id);
    }

    function searchEmployee(employeeName) {
        if (employeeName.length !== 1) {
            setEmployeeNameSelected(employeeName);
        }
    }

    function deleteEmployeeRow() {
        Swal.fire({
            title: 'Delete',
            text: 'Do you want to delete this employee?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let result = await deleteEmployee({ variables: { id: employeeIdSelected } });
                if (result.data.deleteEmployee.status) {
                    Swal.fire(
                        'Deleted!',
                        'The employee has been deleted.',
                        'success'
                    );
                }
            }
        });
    }

    let dataRow = [];
    if (data &&
        data.getEmployees &&
        data.getEmployees.data) {
        dataRow = data.getEmployees.data
    }
    let content = <Fragment>
        <div className="divDataGrid" style={{ height: 300 }}>
            <DataGrid
                rows={dataRow}
                columns={columns}
                pageSize={5}
                disableSelectionOnClick
                onRowOver={(employee) => selectedEmployee(employee)}
                onColumnHeaderClick={() => {
                    searchEmployee('');
                }}
            />
        </div>
        <div className="divButtons">
            <Button variant="contained">
                Add new employee
            </Button>
        </div>
    </Fragment>
    return content;
}

EmployeesGrid = forwardRef(EmployeesGrid);
export default EmployeesGrid;