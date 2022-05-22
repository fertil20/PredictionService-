import './NewUser.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import {
    Button,
    Col,
    Form,
    FormGroup,
    Input,
    Row
} from 'reactstrap';
import React, {Component} from "react";
import {checkEmailAvailability, checkUsernameAvailability, newUser} from "../../util/APIUtils";
import {EMAIL_MAX_LENGTH, USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "../../constants/constants";
import FormItem from "@ant-design/compatible/es/form/FormItem";
import NavigationPanel from "../../navigation/NavigationPanel";
import {Radio} from "antd";


class NewUser extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state = {
            user: null,
            isLoading: false,
            username: {value: ''},
            email: {value: ''},
            name:{value:''},
            role: 1
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

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

        this.setState({isLoading: true})
        const newUserRequest = {
            username: this.state.username.value,
            email: this.state.email.value,
            name: this.state.name.value,
            role: this.state.role
        };
        newUser(newUserRequest)
            .then(response => {
                this.setState({isLoading: false})
                alert('Новый пользователь создан.');
                this.props.history.push(`/users`);
            })
            .catch(error => {
                this.setState({isLoading: false})
                alert('Что-то пошло не так.');
            });
    }
    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email не может быть пустым'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email введён неверно'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email слишком длинный (Максимум - ${EMAIL_MAX_LENGTH} знаков)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateUsername = (username) => {
        if(username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `(Минимум - ${USERNAME_MIN_LENGTH} знака)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `(Максимум - ${USERNAME_MAX_LENGTH} знака)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if(usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: 'Имя пользователя занято'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be rechecked at server
            this.setState({
                username: {
                    value: usernameValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if(response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: 'Этот email уже зарегистрирован'
                        }
                    });
                }
            }).catch(error => {
            // Marking validateStatus as success, Form will be rechecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    isFormInvalid() {
        return !(this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success'
        );
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
            <div className="profile"  >
                {
                        <Form onSubmit={this.handleSubmit}>
                            <Row >
                                <NavigationPanel/>
                                <Col sm={{ size: 4.4 }} style={{backgroundColor: 'white', borderRadius:10, height:500, width: '37%'}}>
                                    {/*<div style={{backgroundColor: 'white', margin: 20,borderRadius:10,height:300,width:300}}>*/}
                                    {/*    /!*<Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name)}}>*!/*/}
                                    {/*    /!*    {this.state.user.name.toUpperCase()}*!/*/}
                                    {/*    /!*</Avatar>*!/*/}
                                    {/*</div>*/}
                                    <div className='profile-title'>Новый пользователь</div>
                                    <Row>
                                        <Col>{/*todo переделать колонки в строки*/}
                                            <div style={{marginTop:25}} className='profile-text1'>Username:</div>
                                            <div style={{marginTop:15}} className='profile-text1'>E-mail:</div>
                                        </Col>
                                        <Col>
                                            <FormGroup style={{marginTop:20}}>
                                                <FormItem hasFeedback
                                                          validateStatus={this.state.username.validateStatus}
                                                          help={this.state.username.errorMsg}
                                                          style={{height:50}}>
                                                    <Input
                                                        type="text" className='profile-form'
                                                        required
                                                        name="username"
                                                        autoComplete="off"
                                                        placeholder="drobovik123"
                                                        value={this.state.username.value}
                                                        onBlur={this.validateUsernameAvailability}
                                                        onChange={(event) => this.handleInputChange(event, this.validateUsername)} />
                                                </FormItem>
                                                <div style={{height: 10}}/>
                                                <FormItem
                                                    hasFeedback className='profile-form'
                                                    validateStatus={this.state.email.validateStatus}
                                                    help={this.state.email.errorMsg}
                                                    style={{height:80}}>
                                                    <Input
                                                        name="email"
                                                        type="email"
                                                        required
                                                        autoComplete="off"
                                                        placeholder="sophie@exmpl.com"
                                                        value={this.state.email.value}
                                                        onBlur={this.validateEmailAvailability}
                                                        onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                                                </FormItem> {/*todo надо фиксить формочки!*/}
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Col >
                                <Col sm={{ size: 1.1}} style={{backgroundColor: 'white',borderRadius:10, height:500, marginLeft: '1%', width: '47%'}}>
                                    <Row>
                                        <Col sm={{ size: 'auto'}}>
                                            <div className='profile-text1' style={{marginTop:15}}>Ф.И.О:</div>
                                        </Col>
                                        <Col sm={{ size: 7}}>
                                            <div style={{height: 10}}/>
                                            <Row>
                                                <Col>
                                            <Input type="text" name="name" id="editName" placeholder={"Иванов Иван Иванович"}
                                                   required style={{width:155}}
                                                   value={this.state.name.value}
                                                   onChange={(event) => this.handleInputChange(event)}/>
                                                </Col>
                                            </Row>
                                            <Radio.Group style={{marginTop: 20}} onChange={(e) => {this.setState({role: e.target.value})}} value={this.state.role}>
                                                <Radio value={1}>Пользователь</Radio>
                                                <Radio value={2}>Администратор</Radio>
                                            </Radio.Group>
                                            <div style={{marginTop:20}}>
                                                <Button color="primary" size="sm" disabled={this.isFormInvalid()}>
                                                    Добавить пользователя
                                                </Button>
                                                <div style={{margin:10}}>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                }
            </div>
        );
    }
}

export default NewUser;