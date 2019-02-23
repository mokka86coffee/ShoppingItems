import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// Store
import store from './store/store';

// Components
import ShopItems from './components/ShopItems';
import Login from './components/Login';
import Register from './components/Register';

export default class extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <Router>
                    <div className="container py-4">
                        <Route path="/" exact component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/search" component={ShopItems} />
                    </div>
                </Router>
            </Provider>
        )
    }
}
