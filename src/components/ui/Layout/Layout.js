import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { specificUser } from '../../../api/user.api'
import CategoryPage from '../../../pages/CategoryPage/CategoryPage'
import HomePage from '../../../pages/HomePage/HomePage'
import PageNotFound from '../../../pages/PageNotFound/PageNotFound'
import NavBar from '../NavBar/NavBar'
import SideBar from '../SideBar/SideBar';
import classes from './Layout.module.css';
import BillPage from '../../../pages/BillPage/BillPage';
import SellProductPage from '../../../pages/SellProductPage/SellProductPage'


function Layout(props) {
    const history = useHistory();
    
    useEffect(() => {
        if(localStorage.getItem('accessToken')){
            fetch(specificUser,{
                method:'get',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => {
                    if(!(res.status === 200)) {
                        throw new Error('UnAuthorized');
                    };
                    return res.json()
                })
                .then(data => {
                    if(data.statusCode === 200){
    
                    }else{
                        throw new Error('UnAuthorized');
                    }
                })
                .catch(error => {
                    console.log("error",error.message);
                    alert(`${error.name} ${error.message}`);
                    localStorage.clear();
                    history.replace('/login');
                })
        }    
    }, [history])
    

    return (
        <div>
            <NavBar />
            <div className={classes.body}>
                <SideBar submittedFalse = {props.submittedFalse} />
                <div className={classes.content}>
                    <Switch>
                        <Route path="/category" component={CategoryPage} />
                        <Route path="/bills" component={BillPage} />
                        <Route path="/sells" component={SellProductPage} />
                        <Route exact path="/" component={HomePage} />
                        <Route exact path={"*"} component={PageNotFound}/>
                </Switch>
                </div>
                
            </div>
        </div>
    )
}

export default Layout