import React, { Fragment } from 'react';
import { Input } from '@material-ui/core';
import './search.css';

export default function Search(props) {
    return (
        <Fragment>
            <div className="divInputSearch">
                <label htmlFor='inputSearch' className='labelInputSearch'>Employees:</label>
                <Input id='inputSearch' onChange={props.searchEmployee} placeholder="Search by name" inputProps={{ 'aria-label': 'description' }} />
            </div>
        </Fragment>
    );
}
