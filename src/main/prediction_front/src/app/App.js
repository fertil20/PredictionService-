import React, {Component} from 'react';
import './App.css';
import {Route, withRouter, Switch} from 'react-router-dom';

import {getCurrentUser} from '../util/APIUtils';
import {ACCESS_TOKEN} from '../constants/constants';

import Login from '../user/login/Login';
import NotFound from '../common/NotFound';
import PrivateRoute from '../common/PrivateRoute';

import {Layout, notification} from 'antd';
import {PersistentState} from "../util/PersistentState";
import AppHeader from "../header/AppHeader";
import Home from "../home/Home";
import FilesAdd from "../components/FilesAdd";


const { Content } = Layout;

class App extends Component {
    constructor(props) {
        super(props);
        this.persistentState = new PersistentState(this, "app", {
            currentUser: null,
            isAuthenticated: false,
            isLoading: false
        })
        this.handleLogout = this.handleLogout.bind(this);
        this.loadCurrentUser = this.loadCurrentUser.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        notification.config({
            placement: 'topRight',
            top: 70,
            duration: 3,
        });
    }

    loadCurrentUser() {
        this.persistentState.setState({
            currentUser: this.persistentState.getState().currentUser,
            isAuthenticated: this.persistentState.getState().isAuthenticated,
            isLoading: true
         })
        getCurrentUser()
            .then(response => {
                this._isMounted && this.persistentState.setState({
                    currentUser: response,
                    isAuthenticated: true,
                    isLoading: false
                });
            })
            .catch(error => {
            this._isMounted && this.persistentState.setState({
                 currentUser: this.persistentState.getState().currentUser,
                 isAuthenticated: this.persistentState.getState().isAuthenticated,
                 isLoading: false
            });
            });
    }

    componentDidMount() {
        this.loadCurrentUser();
        this._isMounted = true;
    }

/*    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.match.params.username !== prevProps.match.params.username) {
            this.loadCurrentUser(this.props.match.params.username)
        }
    }*/

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);

        this.persistentState.setState({
            currentUser: null,
            isAuthenticated: false
        });
        this.props.history.push("/login");
    };

    handleLogin() {
        // notification.success({
        //   message: 'React App',
        //   description: "You're successfully logged in.",
        // });
        this.loadCurrentUser();
        this.props.history.push("/");
    }

    render() {
        if(this.persistentState.getState().isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        return (
            <Layout className="app-container">
                <AppHeader isAuthenticated={this.persistentState.getState().isAuthenticated}
                           currentUser={this.persistentState.getState().currentUser}
                           onLogout={this.handleLogout} className='header-of-app'/>
                <Content className="app-content">
                    <div className="container">
                        <Switch>
                            <PrivateRoute exact path="/" authenticated={this.persistentState.getState().isAuthenticated} component={Home}/>
                            <Route path="/login"
                                   render={(props) => <Login onLogin={this.handleLogin} {...props} />}/>
                            <PrivateRoute exact path="/file/add" authenticated={this.persistentState.getState().isAuthenticated} component={FilesAdd} handleLogout={this.handleLogout}/>
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </Content>
            </Layout>
        );
    }
}

export default withRouter(App);