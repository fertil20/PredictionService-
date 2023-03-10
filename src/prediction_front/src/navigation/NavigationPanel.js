import React, {Component} from "react";
import {Col} from 'reactstrap';
import './NavigationPanel.css';
import {Link} from "react-router-dom";


export default class NavigationPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('app')),
            events: [],
            toggleEvent: false
        }
        this.changeEventToggle = this.changeEventToggle.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    changeEventToggle(){
        if (this.state.toggleEvent === true){
            this.setState({toggleEvent: false})
        }
        if (this.state.toggleEvent === false){
            this.setState({toggleEvent: true})
        }
    }


    render() {
        return (
            <Col className='col-left'>
                <Col className='col-navigation'>
                    <Link to='/'>
                        <div style={{paddingTop: 10}} className='row-navigation'>Главная</div>
                    </Link>
                    <Link to={`/files/${this.state.user.currentUser.username}`}>
                        <div className='row-navigation'>Прогнозирование</div>
                    </Link>
                    <Link to={`/history/${this.state.user.currentUser.username}`}>
                        <div className='row-navigation'>История</div>
                    </Link>
                    <hr/>
                    {this.state.user.currentUser.privileges.includes('Manage_Users') &&
                        <div>
                            <Link to='/users'>
                        <div className='row-navigation'>Администрирование пользователей</div>
                            </Link>
                            <hr/>
                        </div>}
                    <Link to='/settings'>
                        <div className='row-navigation'>Настройки</div>
                    </Link>
                    <Link to='/about'>
                        <div className='row-navigation'>О программе</div>
                    </Link>
                    <div style={{paddingBottom: 10}}/>
                </Col>
            </Col>
        )
    }
}