import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {loadFilesByUser, downloadFile, deleteFile, editFile} from "../util/APIUtils";
import {Menu, Dropdown, Button, Modal, Input} from 'antd';
import {DownloadOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import NavigationPanel from "../navigation/NavigationPanel";
import 'antd/dist/antd.min.css';
import {Link} from "react-router-dom";



export default class PredictionList extends Component {

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
        loadFilesByUser("DATA_PAYMENTS")
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
        downloadFile(fileId)
            .then(r => {})
            .catch(error => {
                alert('Что-то пошло не так')
            })
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
                    <Col style={{paddingLeft: 0, paddingRight: 0, backgroundColor:'white', overflow:'auto', borderRadius:10, height:'100%', paddingBottom:20, width: '75%', maxWidth: '75%'}}>
                        {this.state.files ? (
                            this.state.files.map(
                                (files, index) => (
                                    <Row style={{width:'100%', margin: 0}}>
                                        <Col style={{
                                            textAlign: 'center',
                                            width: '5%',
                                            maxWidth: '5%',
                                            margin: 0,
                                            padding: 0
                                        }} className='news-title'>
                                            {files.id}
                                        </Col>
                                        <Col style={{
                                            textAlign: 'center',
                                            width: '60%',
                                            maxWidth: '60%',
                                            margin: 0,
                                            padding: 0
                                        }} className='news-title'>
                                            <Link to={`/history/${this.state.CurUser.currentUser.username}/${files.id}`}>{files.fileName}</Link>
                                        </Col>
                                        <Col style={{
                                            textAlign: 'center',
                                            width: '20%',
                                            maxWidth: '20%',
                                            margin: 0,
                                            padding: 0
                                        }} className='news-title'>
                                            {files.createDateTime}
                                        </Col>
                                        <Col style={{
                                            textAlign: 'center',
                                            width: '5%',
                                            maxWidth: '5%',
                                            margin: 0,
                                            padding: 0
                                        }} className='news-title'>
                                            <Button>
                                                <DownloadOutlined
                                                    onClick={() => this.downloadThisFile(files.id)}/>
                                            </Button>
                                        </Col>
                                        <Col style={{
                                            textAlign: 'center',
                                            width: '10%',
                                            maxWidth: '10%',
                                            margin: 0,
                                            padding: 0
                                        }} className='news-title'>
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
                                    </Row>)
                            ).reverse()
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