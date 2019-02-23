import React from 'react';
import CryptoJSmd5 from "crypto-js/md5";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Login extends React.Component {

    handleSubmit = (e) => {
        e.preventDefault();
        const formElems = e.target.elements;
        const email = formElems[0].value;
        const password = CryptoJSmd5(formElems[1].value).toString();

        let users = localStorage.getItem('users') 
                ? JSON.parse(localStorage.getItem('users'))
                : null;

        if ( users && email in users && users[email] === password ) {
            this.props.dispatch({type: 'LOGGED IN', payload: { email } })
            this.props.history.push('/search');
        }
    }

    render(){
        return (
            <form className="login" onSubmit = {this.handleSubmit}>
                <div className="col-12 text-center mb-2">
                    <label className="login__label">
                        <span className="d-block">Email</span>
                        <input type="email" />
                    </label> 
                </div>
                <div className="col-12 text-center mb-2">
                    <label className="login__label">
                        <span className="d-block">Password</span>
                        <input type="password" />
                    </label> 
                </div>
                <button className="btn btn-primary mb-2">Login</button>
                <span>Don't have account? <Link to="/register">Register</Link></span>
            </form>
        )
    }
}

export default  connect(store=>store)(Login);
