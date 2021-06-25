import React, { Fragment, useRef } from 'react';
import { EmployeesGrid } from './components/employeesGrid/EmployeesGrid';
import Search from './components/searchS/Search';


export function App() {

    const employeeRef = useRef();

    function searchEmployee() {
        let employeeName = document.getElementById('inputSearch').value;
        employeeRef.current.updateComponentFromOutside(employeeName);
    }

    return (
        <Fragment>
            <Search searchEmployee={searchEmployee} />
            <EmployeesGrid ref={employeeRef}/>
        </Fragment>
    );
}