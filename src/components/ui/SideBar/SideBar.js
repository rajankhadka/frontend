import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import classes from "./SideBar.module.css";

function SideBar(props) {
    const history = useHistory();
    const location = useLocation();

    const [activeClass, setActiveClass] = useState('');
    const logoutHandler = () =>{
        localStorage.clear();
        props.submittedFalse();
        history.replace('/login');
    }

    const updatePagePathHandler = (event) =>{
        const path = (event.target.id);
        setActiveClass(path);
        if(path === 'inventory') return history.push('/');
        return history.push(`/${path}`);
    }

    useEffect(() =>{
        const path = location.pathname;
        const _split = path.split('/');
        if(_split[1] === ''){
            setActiveClass('inventory');
        }else{
            setActiveClass(_split[1]);
        }
        history.push(path);
    },[history, location.pathname]);


    return (
        <div className={classes.sideBar}>
            <ul>
                <li onClick={updatePagePathHandler}>
                    <span id="inventory" className={
                        (activeClass==='inventory') ? classes.active : ''
                    }>Inventory</span>
                </li>
                <li onClick={updatePagePathHandler} >
                    <span id="bills" className={
                        (activeClass==='bills') ? classes.active : ''
                    }>Bills</span>
                </li>
                <li onClick={updatePagePathHandler}>
                    <span id="category" className={
                        (activeClass==='category') ? classes.active : ''
                    }>Category</span>
                </li>
                <li onClick={updatePagePathHandler}>
                    <span id="sells" className={
                        (activeClass==='sells') ? classes.active : ''
                    }>Sell Product</span>
                </li>
                <li onClick={updatePagePathHandler} >
                    <span id="customer" className={
                        (activeClass==='customer') ? classes.active : ''
                    }>Customer</span>
                </li>
            </ul>

            <ul>
                <li onClick={logoutHandler}>
                    <span>Log Out</span>
                </li>
            </ul>
        </div>
    )
}

export default SideBar;