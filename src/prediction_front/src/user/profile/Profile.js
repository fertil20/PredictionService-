import React, {Component} from 'react';
import {getUserProfile} from '../../util/APIUtils';
import {Avatar} from 'antd';
import {getAvatarColor} from '../../util/Colors';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {Button, Col, Row} from 'reactstrap';
import NavigationPanel from "../../navigation/NavigationPanel";


class Profile extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
    }

    loadUserProfile(username) {
        this._isMounted && this.setState({
            isLoading: true
        });

        getUserProfile(username)
        .then(response => {
            this._isMounted && this.setState({
                user: response,
                isLoading: false
            });
        }).catch(error => {
            if(error.status === 404) {
                this._isMounted && this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this._isMounted && this.setState({
                    serverError: true,
                    isLoading: false
                });        
            }
        });        
    }


    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadUserProfile(this.props.match.params.username);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.username !== prevProps.match.params.username) {
            this.loadUserProfile(prevProps.match.params.username);
        }
    }


    render() {
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>;
        }

        if(this.state.notFound) {
            return <NotFound />;
        }

        if(this.state.serverError) {
            return <ServerError />;
        }

        return (

            <div className="profile" >
                     {
                       this.state.user ? (
                <Row>
                    <NavigationPanel/>
                    <Col style={{backgroundColor: 'white', borderRadius:10, height:400, width: '40%', minWidth: '40%', maxWidth:'40%', marginLeft:'auto', marginRight:'auto'}}>
                        <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:200,width:"auto", display: 'flex'}}>
                            <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name), marginLeft:'auto', marginRight:'auto'}}>
                                {this.state.user.name.toUpperCase()}
                            </Avatar>
                        </div>
                        <Row>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text1'>Ф.И.О:</div>
                            </Col>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text2'>{this.state.user.name}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text1'>Логин:</div>
                            </Col>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text2'>{this.state.user.username}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text1'>Почта:</div>
                            </Col>
                            <Col style={{display:'flex'}}>
                                <div className='profile-text2'>{this.state.user.email}</div>
                            </Col>
                        </Row>
                        <div style={{marginTop:15}}>
                            {(this.state.CurUser.currentUser.privileges.includes('Edit_Users') || this.state.user.username === this.state.CurUser.currentUser.username) &&
                                <Button color="primary" size="sm" href={`/users/${this.state.user.username}/edit`}>
                                    Редактировать
                                </Button>}
                        </div>
                    </Col>
                </Row>
                       ): null
                     }
            </div>
        );
    }
}

export default Profile;