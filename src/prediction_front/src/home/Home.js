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
                    <Col sm={{size: 1.5}} style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        height: '100%',
                        padding: 10,
                        marginRight: '2%',
                        width: '53%'
                    }}>
                        <div style={{width: '100%', maxHeight: '80%'}}>
                            <Link to="/file/add">
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

