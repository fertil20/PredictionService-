import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {loadFilesByUser} from "../util/APIUtils";
import 'antd/dist/antd.min.css';
import {Link} from "react-router-dom";



export default class PredictionHistory extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            files: null,
            isLoading: false
        }
        this.loadAllFiles = this.loadAllFiles.bind(this)
    }


    componentDidMount() {
        this.loadAllFiles()
        this._isMounted = true;
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    /*    componentDidUpdate(prevProps, prevState, snapshot) {
            if(!this.state.isLoading){
            let idVar = setInterval(() => {
                this.loadAllFiles()
                if(this.state.isLoading)clearInterval(idVar)
            }, 2000);}
        }*/

    loadAllFiles(){
        loadFilesByUser("PredictionPayments")
            .then(response => {
                this.setState({files: response})
                if(response){
                    this.setState({isLoading:true})
                }
            })
            .catch(error => {
            });
    }

/*    openPrediction(id) {
        loadOldPrediction(id)
            .then(response => {
            })
    }*/


    render () {
        return (
            <Col style={{
                backgroundColor: 'white',
                borderRadius: 10,
                height: '100%',
                paddingBottom: 20,
                width: '18%',
                maxWidth: '18%',
                padding: 0
            }}>
                {!this.state.isLoading &&
                    <div className="spinner-border" role="status" style={{margin: 'auto'}}>
                        <span className="sr-only">Loading...</span>
                    </div>}
                {this.state.isLoading && this.state.files ? (
                    this.state.files.map(
                        (files, index) => (
                            <Row style={{width:'100%', margin: 0}}>
                                <Col style={{textAlign: 'center', width: '45%', maxWidth: '45%', margin: 0, padding: 0}} className='news-title'>
                                    {files.createDateTime}
                                </Col>
{/*                                <Col style={{textAlign: 'center', width: '5%', maxWidth: '5%', margin: 0, padding: 0}} className='news-title'>
                                    {files.id}
                                </Col>*/}
                                <Col style={{textAlign: 'center', width: '55%', maxWidth: '55%', margin: 0, padding: 0}} className='news-title'>
                                    <Link to={`/history/${files.id}`}>{files.fileName}</Link>
                                </Col>
                            </Row>)
                    ).reverse()
                ) : null
                }
            </Col>
        )
    }
}