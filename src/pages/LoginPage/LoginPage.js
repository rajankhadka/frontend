import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { loginApi } from '../../api/auth.api';
import  './LoginPage.css';

function LoginPage(props) {
    // console.log(props);
    const history = useHistory();
    const [errorMessages, setErrorMessages] = useState({});
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // console.log("loginPage");
        // console.log(localStorage.getItem('authenticated'));
       ( localStorage.getItem('authenticated') || props.isSubmitted) && history.replace('/');
    }, [history, props.isSubmitted]);
    

    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>
    );

    const handleSubmit = (event) => {
        //Prevent page reload
        event.preventDefault();
        fetch(loginApi,{
            method:"post",
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                username:username,
                password:password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    throw new Error(data.message);
                }
                setUsername('');
                setPassword('');
                localStorage.setItem('accessToken',data.accessToken);
                localStorage.setItem('authenticated',true);
                props.submittedTrue();
                history.replace('/');

            })
            .catch(error => {
                localStorage.clear();
                props.submittedFalse();
                alert(error.message);
            })
      
        
    };

    const renderForm = (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Username </label>
                    <input type="text" name="uname" required  value={username} onChange={(event) => setUsername(event.target.value)} />
                    {renderErrorMessage("uname")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <input type="password" name="pass" required value={password} onChange={(event) => setPassword(event.target.value)}/>
                    {renderErrorMessage("pass")}
                </div>
                <div className="button-container">
                    <input type="submit" value="Log In" />
                </div>
            </form>
        </div>
    );

    return (

        <div className="app">
            <div className="login-form">
                <div className="title">Sign In</div>
                {renderForm}
            </div>
        </div> 
            

    )
}

export default LoginPage;