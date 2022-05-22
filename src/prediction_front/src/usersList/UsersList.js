import React, {Component} from 'react';
import {deleteUser, getAllUsers} from "../util/APIUtils";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import {Button, Col, Form, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import "./UsersList.css";
import search from '../media/search.png'
import NavigationPanel from "../navigation/NavigationPanel";


class UsersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            user: null,
            isLoading: false,
            deleteUserID: '',
            FIO: {value:''}
        }
        this.loadAllUsers = this.loadAllUsers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.DeleteUser = this.DeleteUser.bind(this);
    }

    loadAllUsers(id) {
        this._isMounted && this.setState({
            isLoading: true
        });

        getAllUsers(id)
            .then(async response => {
                this._isMounted && this.setState({
                    user: response,
                    isLoading: false
                });
                let byName = await this.state.user.slice(0);
                byName.sort(function(a, b) {
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                this.setState({user: byName})

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

    DeleteUser(userID){
        this.setState({deleteUserID: userID})
        deleteUser(userID)
            .then(response => {
                // alert('Пользователь удалён');
                this.componentDidMount(UsersList);
            })
            .catch(error => {
                if (error.status === 403) {
                    alert('Упс, кажется у вас недостаточно прав');
                } else {
                    alert('Что-то пошло не так');
                }
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadAllUsers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

/*    componentDidUpdate(prevState) {
        if(this.state.deleteUserID !== prevState.deleteUserID) {
            this.loadAllUsersBirthdays();
        }
    }*/

    render (){
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }

        if(this.state.notFound) {
            return <NotFound/>;
        }

        if(this.state.serverError) {
            return <ServerError/>;
        }

        return (
            <Row>
                <NavigationPanel/>
                <Col sm={{size: 5.4}} style={{backgroundColor:'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom:20, width: '85%'}}>
                    <div>
                        <Form>
                            <Row style={{width:'auto', marginRight: '0%', marginLeft: '0%'}}>
                                <Col sm={{size: 1.1}} style={{backgroundColor:'white', borderRadius:0,overflow: 'auto', height:'100%', paddingBottom:0, width: 'auto'}}>
                                    <Input placeholder='Поиск'
                                       className='search-bar'
                                       id="FIO" name='FIO' type='text'
                                       value={this.state.FIO.value}
                                       onChange={(event) => {this.handleInputChange(event)}}
                                /></Col>
                                <Col sm={{size: 1.1}} style={{backgroundColor:'white', borderRadius:0,overflow: 'auto', height:'100%', paddingBottom:0, width: '10%'}}>
                                <img src={search} width={25} height={25} alt='Search' className='search-image'/>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                    {
                        this.state.user ? (
                            <div style={{marginRight: '1%', marginLeft: '1%', overflowX: 'auto'}}>
                                <ListGroup horizontal className='table-top-line' key={"TABLE"}>
                                    <ListGroupItem style={{width:'10%', overflowX: 'auto'}} key={"ID"}>ID</ListGroupItem>
                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={"USERNAME"}>Имя пользователя</ListGroupItem>
                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={"FIO"}>ФИО</ListGroupItem>
                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={"CONTACTS"}>Почта</ListGroupItem>
                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={"DEL"}></ListGroupItem>
                                </ListGroup>
                                {
                                    this.state.user.map(
                                        user =>

                                            ((user.name.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.id.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.username.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)
                                                || (user.email.toLowerCase().indexOf(this.state.FIO.value.toLowerCase()) !== -1)) && <div>
                                                <ListGroup horizontal className='table-top-line' key={user.id}>
                                                    <ListGroupItem style={{width:'10%', overflowX: 'auto'}} key={user.id+'.1'}>{user.id}</ListGroupItem>
                                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={user.id+'.2'}>{user.username}</ListGroupItem>
                                                    <ListGroupItem style={{width:'20%', overflowX: 'auto', color: '#0a58ca'}} key={user.id+'.3'} tag = 'a' href={`/users/${user.username}`}>{user.name}</ListGroupItem>
                                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={user.id+'.4'}>{user.email}</ListGroupItem>
                                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={user.id+'.5'}>
                                                        {user.username !== this.state.CurUser.currentUser.username &&
                                                            <Button size='sm' color='danger' style={{height:30, marginTop:5}} key={user.id+'.5'} onClick={() => this.DeleteUser(user.id)}>Удалить пользователя</Button>}
                                                    </ListGroupItem>
                                                </ListGroup>
                                        </div>
                                    )
                                }
                            </div>
                        ):null
                    }
                    <div>
                        <Button size="sm" href='/newUser' style={{marginTop:10, marginLeft:10}} className='add-button'>
                            Добавить пользователя
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default UsersList
