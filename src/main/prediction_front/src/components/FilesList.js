import React, {Component} from "react";
import {Button, Col, Row} from 'reactstrap';
import {loadFilesByUser, parseFile} from "../util/APIUtils";
import {Link} from "react-router-dom";
import ".//Files.css"

export default class FilesList extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            files: null,
            image: [],
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

    ImgLoaded(){
        this.setState({isLoading: true})
    }


    loadAllFiles(){
        loadFilesByUser(this.state.CurUser.currentUser.id)
            .then(response => {
                this.setState({files: response})
                if(response){
                    this.setState({isLoading:true})
                }
            })
            .catch(error => {
            });
    }

/*    deleteFilesByID(filesId){
        deleteFiles(filesId)
            .then(response => {
                alert('Новость удалена.');
                this.props.history.go(`/files`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }*/

    render () {
        if (this.state.isLoading) {
            return(
                <Row>
                    <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>
                        {
                            this.state.files ? (
                                <div>
                                    {
                                        this.state.files.map(
                                            (files, index) =>(
                                                <div style={{width:570, marginBottom:30}}>
                                                    <Row>
                                                    <Col className='news-title'>{files.id}</Col>
                                                    <Col> <a className='parse-link' onClick={event => parseFile(files.fileName)}>{files.fileName}</a></Col>
                                                    </Row>
                                                </div>)
                                        ).reverse()
                                    }
                                </div>
                            ) : null
                        }
                    </Col>
                </Row>
            )
        }else{
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
    }
}