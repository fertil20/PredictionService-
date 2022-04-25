import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {loadFilesByUser, downloadFile, deleteFile, editFile} from "../util/APIUtils";
import ".//Files.css"
import {Menu, Dropdown, Button, Modal, Input} from 'antd';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import NavigationPanel from "../navigation/NavigationPanel";
import 'antd/dist/antd.css';



export default class FilesList extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            files: null,
            isLoading: false,
            loading: false,
            visible: false,
            name: null,
            id: null
        }
        this.loadAllFiles = this.loadAllFiles.bind(this)
        this.downloadThisFile = this.downloadThisFile.bind(this)
        this.deleteThisFile = this.deleteThisFile.bind(this)
        this.predictionChart = this.predictionChart.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
        this.showModal = this.showModal.bind(this)
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

    showModal = (id, name) => {
        this.setState({
            visible: true,
            id: id,
            name: name
        });
    };

    handleOk = () => {
        this.setState({ loading: true});
        this.editThisFile(this.state.id, this.state.name);
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

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
                window.location.reload(); //todo сделать норм ререндеринг
            })
            .catch(error => {
                alert('Что-то пошло не так')
            });
    }

    predictionChart(fileId) {
        this.props.history.push({pathname: "/prediction/" + fileId});
    }

    editThisFile(fileId, name) {
        editFile(fileId, name)
            .then(response => {
                this.setState({ loading: false, visible: false });
                alert('Файл успешно изменён')
                window.location.reload(); //todo сделать норм ререндеринг
            })
            .catch(error => {
                alert('Что-то пошло не так')
            });
    }

    handleMenuClick = (id, name, {key}) => {
        if (key === '1') {
            this.showModal(id, name)
        }
        if (key === '2') {
            this.deleteThisFile(id);
        }
    };


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
        const { visible, loading } = this.state;
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
                                                    <Row>
                                                        <Col style={{width: '5%'}} className='news-title'>
                                                            {files.id}
                                                        </Col>
                                                        <Col style={{width: '70%'}}>
                                                            <a className='parse-link'
                                                               onClick={() => this.predictionChart}>{files.fileName}</a>
                                                        </Col>
                                                        <Col style={{width: '15%'}} className='news-title'>
                                                            {files.date}
                                                        </Col>
                                                        <Col style={{width: '5%'}}>
                                                            <Button>
                                                                <DownloadOutlined
                                                                    onClick={() => this.downloadThisFile(files.id)}/>
                                                            </Button>
                                                        </Col>
                                                        <Col style={{width: '5%'}}>
                                                            <Dropdown.Button overlay={
                                                                <Menu
                                                                    onClick={({key}) => this.handleMenuClick(files.id, files.fileName, {key})}
                                                                    items={[
                                                                        {
                                                                            label: 'Редактировать',
                                                                            key: '1',
                                                                            icon: <EditOutlined/>
                                                                        },
                                                                        {
                                                                            label: 'Удалить',
                                                                            key: '2',
                                                                            icon: <DeleteOutlined/>
                                                                        }
                                                                    ]}
                                                                />
                                                            } trigger={['click']}>
                                                            </Dropdown.Button>
                                                        </Col>
                                                    </Row>
                                                </div>)
                                        ).reverse()
                                    }
                                </div>
                            ) : null
                        }
                    </Col>
                    <Modal
                        visible={visible}
                        title="Редактирование"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={[
                            <Button key="back" onClick={this.handleCancel}>
                                Закрыть
                            </Button>,
                            <Button key="submit" type="primary" loading={loading}
                                    onClick={this.handleOk}>
                                Сохранить
                            </Button>
                        ]}
                    >
                        <Input placeholder="Новое имя" defaultValue={this.state.name} maxLength={100}
                               onChange={this.onChange = (e) => {this.setState({name: e.target.value})}}>
                        </Input>
                    </Modal>
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