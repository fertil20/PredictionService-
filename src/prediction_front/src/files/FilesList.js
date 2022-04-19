import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {loadFilesByUser, parseFile, downloadFile, deleteFile} from "../util/APIUtils";
import ".//Files.css"
import { Button} from 'antd';
import { DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import NavigationPanel from "../navigation/NavigationPanel";

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
        this.downloadThisFile = this.downloadThisFile.bind(this)
        this.deleteThisFile = this.deleteThisFile.bind(this)
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

    downloadThisFile(fileId){
        downloadFile(fileId).then(r => {})
    }

    deleteThisFile(fileId){
        deleteFile(fileId)
            .then(response => {
                alert('Файл успешно удалён')
                window.location.reload();
            })
            .catch(error => {
                alert('Что-то пошло не так')
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
                    <NavigationPanel/>
                    <Col sm={{size: 5.4}} style={{backgroundColor:'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom:20, width: '75%'}}>
                        {
                            this.state.files ? (
                                <div>
                                    {
                                        this.state.files.map(
                                            (files, index) =>(
                                                <div style={{width:"auto", marginBottom:30}}>
                                                    <Row >
                                                    <Col style={{minWidth: '10%'}} className='news-title'>
                                                        {files.id}
                                                    </Col>
                                                    <Col style={{minWidth: '70%'}}>
                                                        <a className='parse-link' onClick={event => parseFile(files.id)}>{files.fileName}</a>
                                                    </Col>
                                                    <Col style={{minWidth: '10%'}}>
                                                        <Button>
                                                            <DownloadOutlined onClick={()=>this.downloadThisFile(files.id)}/>
                                                        </Button>
                                                    </Col>
                                                    <Col style={{minWidth: '10%'}}>
                                                        <Button>
                                                            <DeleteOutlined onClick={()=>this.deleteThisFile(files.id)}/>
                                                        </Button>
                                                    </Col>
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