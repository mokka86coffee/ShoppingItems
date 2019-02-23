import React from 'react';
import classNames from 'classnames';
import CryptoJSmd5 from "crypto-js/md5";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Auth extends React.Component {

    constructor(props){
        super(props);
        this.form = React.createRef();
    }

    state = {
        error: ''
    }

    emailCheck = (email) => (/^[\w-]{1}[\w]*@[\w]+\.[\w]{2,6}$/i).test(email);
    

    submitHandler = (e) => {
        e.preventDefault();
        const formElems = this.form.current.elements;
        const email = formElems[0].value;
        const password = formElems[1].value;
        const passwordConf = formElems[2].value;

        if ( !email || !this.emailCheck(email) ) { this.setState({ error: 'Email is incorrect or empty' }) }
    
        else if ( !password || !passwordConf || password !== passwordConf ) { this.setState({ error: "Passwords don't match or empty" }) }

        else if ( localStorage ) {

            let users = localStorage.getItem('users') 
                ? JSON.parse(localStorage.getItem('users'))
                : {};

            if ( email in users ) { 
                this.setState({ error: "User has already been registered"}); 
                return; 
            } else {

                users = { ...users, [email]: CryptoJSmd5(password).toString() };
                localStorage.setItem('users', JSON.stringify(users));
                this.props.dispatch({type: 'LOGGED IN', payload: { email } })
                this.props.history.push('/search');
            }

        } 
    }

    render(){
        const { error } = this.state;
        const errorClassName = classNames('col-12', { 'd-none': !error });

        return (
            <>
                <div className={errorClassName}>
                    <p className="text-center text-danger">{error}</p>
                </div>
                <form ref={this.form} className="login" onSubmit={this.submitHandler}>
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
                    <div className="col-12 text-center mb-2">
                        <label className="login__label">
                            <span className="d-block">Password Confirm</span>
                            <input type="password" />
                        </label> 
                    </div>
                    <button className="btn btn-success mb-2" type="submit"> Sign up </button>
                    <span>Has already been registered? <Link to="/">Login</Link></span>
                </form>
            </>
        )
    }
}

export default  connect(store=>store)(Auth);
