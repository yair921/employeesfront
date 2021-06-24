import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { DataGrid } from '@material-ui/data-grid';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useMutation,
    useQuery,
    gql,
    useLazyQuery
} from "@apollo/client";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Swal from 'sweetalert2';


const rows = [
    { id: 1, name: 'Yair', username: 'Jon', age: 35, hiredate: '2021-03-01' },
    { id: 2, name: 'Juan', username: 'Cersei', age: 42, hiredate: '2021-05-04' },
    { id: 3, name: 'Diana', username: 'Jaime', age: 45, hiredate: '2021-05-03' },
];

const GET_EMPLOYEES = gql`
query {
    getEmployees{
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

export function EmployeesGrid(props) {

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'name',
            headerName: 'Full Name',
            width: 150,
            editable: false,
        },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 110,
            editable: false,
        },
        {
            field: 'username',
            headerName: 'Username',
            width: 150,
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


    //const [getEmployees, { data, loading }] = useLazyQuery(GET_EMPLOYEES);
    const employeesObj = useQuery(GET_EMPLOYEES);

    //const [employees, setEmployees] = useState([]);
    const [employeeIdSelected, setEmployeeIdSelected] = useState(0);
    const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
        refetchQueries: [{ query: GET_EMPLOYEES }],
    });

    function selectedEmployee(employee) {
        setEmployeeIdSelected(employee.row.id);
        //console.log(employeeIdSelected);
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

    useEffect(() => {
        
    }, []);

    //const { loading, error, data } = useQuery(GET_EMPLOYEES);
    if (employeesObj.loading) return <p>Loading...</p>;
    if (employeesObj.error) return <p>Error</p>;

    return (
        <div style={{ height: 400, width: '75%' }}>
            <DataGrid
                rows={employeesObj.data.getEmployees.data}
                columns={columns}
                pageSize={5}
                checkboxSelection
                disableSelectionOnClick
                onRowOver={(employee) => selectedEmployee(employee)}
                checkboxSelection={false}
            />
        </div>
    );
}