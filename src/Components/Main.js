import { Outlet } from 'react-router-dom';
import {useState} from 'react'
import Header from './Header' ;


const Main = () => {
    return (
        <>
            <Header/>
            <div className='content'>
                <Outlet/>
            </div>
        </>
    );
};

export default Main;