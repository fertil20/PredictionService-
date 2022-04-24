import {getAvatarColor} from '../../util/Colors';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {Button, Col, Form, Input, Row} from 'reactstrap';
import {Avatar} from "antd";
import React, {Component} from "react";
import {getUserProfile, profileEdit} from "../../util/APIUtils";
import './ProfileEdit.css';
import NavigationPanel from "../../navigation/NavigationPanel";
import {Redirect} from "react-router-dom";

class ProfileEdit extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false,
            username: {value: ''},
            email: {value: ''},
            name:{value:''},
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadUserProfile(username) {
        this._isMounted && this.setState({
            isLoading: true
        });

        getUserProfile(username)
            .then(response => {
                this._isMounted && this.setState({
                    user: response,
                    isLoading: false,
                });
                this._isMounted && this.setState({
                    email: {value: this.state.user.email},
                    name: {value: this.state.user.name},
                })
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

    // componentDidUpdate(prevProps) {
    //     if(this.props.match.params.username !== prevProps.match.params.username) {
    //         this.loadUserProfile(this.props.match.params.username);
    //     }
    // }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const profileEditRequest = {
            email: this.state.email.value,
            name: this.state.name.value,
        };
        profileEdit(profileEditRequest, this.state.user.username)
            .then(response => {
                this.props.history.push(`/users/${this.state.user.username}`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
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

        if ((!this.state.CurUser.currentUser.privileges.includes('Edit_Users'))
            && (this.state.CurUser.currentUser.username !== this.props.match.params.username)) {
            return <Redirect to={"/users/" + this.props.match.params.username}/>
        }



        return (
            <div className="profile"  >
                {
                    this.state.user ? (
                        <Form onSubmit={this.handleSubmit}>
                            <Row >
                                <NavigationPanel/>
                                <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white',borderRadius:10,height:500, width: '30%'}}>
                                    <div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:"auto"}}>
                                        <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>
                                            {this.state.user.name.toUpperCase()}
                                        </Avatar>
                                    </div>
                                    <Row>
                                        <Col sm={{size:'auto'}}>{/*todo переделать колонки в строки*/}
                                            <div style={{height: 5}}/>
                                            <div className='profile-text1'>E-mail:</div>
                                        </Col>
                                        <Col>
                                            <Input type="email" name="email" id="email" placeholder="sophie@example.com"
                                                   value={this.state.email.value}
                                                   required
                                                   style={{width:165}}
                                                   onChange={(event) => {this.handleInputChange(event)}}/>
                                            <div style={{height: 10}}/>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col sm={{ size: 6.6}} style={{backgroundColor: 'white',borderRadius:10,height:500, marginLeft: '2%', width: '43%'}}>
                                    <Row>
                                        <Col sm={{ size: 'auto'}}>
                                            <div style={{marginTop:20}} className='profile-text1'>Ф.И.О:</div>
                                        </Col>
                                        <Col sm={{ size: 7}}>
                                            <div style={{height: 15}}/>
                                            <Row>
                                                <Col >{this.state.CurUser.currentUser.privileges.includes('Edit_Users') &&
                                                <Input type="text" name="name" id="editName" placeholder={"Попов Валерий Александрович"}
                                                       required
                                                       value={this.state.name.value} style={{width:155}}
                                                       onChange={(event) => this.handleInputChange(event)}/>}
                                                    {!this.state.CurUser.currentUser.privileges.includes('Edit_Users') &&
                                                    <div style={{marginBottom:10,height:30}}>{this.state.user.name}</div>}
                                                </Col>
                                            </Row>
                                            <div style={{height: 10}}/>
                                            <div style={{marginTop:20}}>
                                                <Button color="primary" size="sm">
                                                    Сохранить
                                                </Button>

                                            </div>
                                        </Col>

                                    </Row>
                                </Col>
                                <div style={{margin:10}}>

                                </div>
                            </Row>
                        </Form>
                    ): null
                }
            </div>
        );
    }
}

export default ProfileEdit;