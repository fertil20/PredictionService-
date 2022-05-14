import React, {Component, useState} from 'react';
import './AppHeader.css';
import {Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown} from 'reactstrap';
import {Link, withRouter} from "react-router-dom";


class AppHeader extends Component {
    constructor(props) {
        super(props);   
        this.handleMenuClick = this.handleMenuClick.bind(this);   
    }

    handleMenuClick() {
        this.props.onLogout();
    }

    render() {
        if(this.props.currentUser) {
          return(
            <NavBarLogged className='header-of-app' currentUser={this.props.currentUser} handleMenuClick={this.handleMenuClick}/>
          )
        } else {
          return(
              <NavBarNotLogged/>
          )
        }
    }
}

const NavBarNotLogged = () => {

    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

        return (
            <div className='nav-bar-container'>
                <Row style={{width: 'inherit'}}>
                    <Col>
                    </Col>
                    <Col>
                        <a href="/" style={{textDecoration: "none"}}><div className='main-title'>Sigma Prediction</div></a>
                    </Col>
                    <Col>
                    </Col>
                </Row>
            </div>
        );
}

function NavBarLogged(props){

    return (
        <div className='nav-bar-container'>
            <Row style={{width: 'inherit'}}>
                <Col>
                </Col>
                <Col>
            <a href="/" style={{textDecoration: "none"}}><div className='main-title'>Sigma Prediction</div></a>
                </Col>
                <Col>
            <div className='caret-css'>
                <UncontrolledDropdown>
                    <DropdownToggle nav caret>
                        {props.currentUser.name}
                    </DropdownToggle>
                    <DropdownMenu end>
                        <div style={{textAlign: 'center'}}>{props.currentUser.username}</div>
                        <div style={{textAlign: 'center'}}> @{props.currentUser.username}</div>
                        <DropdownItem divider/>
                        <Link to={`/users/${props.currentUser.username}`}>
                            <DropdownItem>
                                Профиль
                            </DropdownItem>
                        </Link>
                        <DropdownItem divider/>
                        <Link to={`/files/${props.currentUser.username}`}>
                            <DropdownItem>
                                Мои файлы
                            </DropdownItem>
                        </Link>
                        <DropdownItem divider/>
                        <Link to={`/changePassword`}>
                            <DropdownItem>
                                Сменить пароль
                            </DropdownItem>
                        </Link>
                        <DropdownItem onClick={props.handleMenuClick} href="/login">
                            Выйти
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
                </Col>
            </Row>
        </div>
    )
}

export default withRouter(AppHeader);