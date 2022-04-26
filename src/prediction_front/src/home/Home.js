import React, {Component} from "react";
import './Home.css';
import {Col, Row} from 'reactstrap';
import {Link} from "react-router-dom";
import NavigationPanel from "../navigation/NavigationPanel";


export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(localStorage.getItem('app'))
        }
        this.loadMe = this.loadMe.bind(this)
    }

    loadMe() {
        this._isMounted && this.setState({
            user: JSON.parse(localStorage.getItem('app'))
        })
    }

    componentDidMount() {
        setInterval(() => {
            this.loadMe()
        }, 100);
        this._isMounted = true;
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.user.currentUser == null;
    }

    componentWillUnmount() {
        clearInterval()
        this._isMounted = false;
    }

    render () {
        if (this.state.user.currentUser !== null) {
            return (
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size: 5.4}} style={{backgroundColor:'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom:20, width: '75%'}}>
                        <div style={{width: '100%', maxHeight: '80%'}}>
                            <Link to={`/files/${this.state.user.currentUser.username}/add`}>
                                <div className='row-navigation'>Загрузить файлы</div>
                            </Link>
                        </div>
                    </Col>
                </Row>
            )
        }
        else
        {
            return (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
    }
}

