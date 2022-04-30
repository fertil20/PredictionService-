import React, {Component} from "react";
import {Col, ListGroup, ListGroupItem, Row} from 'reactstrap';
import {predictFile, savePredict, viewPredict} from "../util/APIUtils";
import NavigationPanel from "../navigation/NavigationPanel";
import {Chart, registerables} from "chart.js";
import './PredictionChart.css'
import {Button} from "antd";



export default class PredictionChart extends Component {

    chart = null;

    constructor (props) {
        super(props);
        this._isMounted = false;
        this.state = {
            CurUser: JSON.parse(localStorage.getItem('app')),
            isLoading: true,
            data: null,
            built: (this.props.location.pathname === ('/history/' + this.props.match.params.username + "/" + this.props.match.params.fileId))
        }
        this.buildChart = this.buildChart.bind(this)
        this.savePrediction = this.savePrediction.bind(this)
        Chart.register(...registerables);
    }


    componentDidMount () {
        this.buildChart()
        this._isMounted = true;
    }


    componentWillUnmount () {
        if (this.chart != null) {
            this.chart.destroy();
        }
        this._isMounted = false;
    }

    /*    componentDidUpdate(prevProps, prevState, snapshot) {
            if(!this.state.isLoading){
            let idVar = setInterval(() => {
                this.loadAllFiles()
                if(this.state.isLoading)clearInterval(idVar)
            }, 2000);}
        }*/

    savePrediction(data) {
        savePredict(data.PREDICTION, "PREDICTION_PAYMENTS", this.props.history.location.state.fileName)
            .then(response => {
                alert('Файл успешно сохранён')
            })
            .catch(error => {
                alert('Что-то пошло не так')
            })
    }

    buildChart() {
        if (!this.state.built) {
            predictFile(this.props.match.params.fileId, "23.05.2021", "24.11.2021")
                .then(response => {
                    if (this._isMounted) {
                        this.setState({isLoading: false, data: response})
                        this.chart = new Chart(document.getElementById('myChart').getContext('2d'), {
                            type: 'line',
                            data: {
                                datasets: [{
                                    label: 'Исходные данные',
                                    data: response.DATA,
                                    backgroundColor: [
                                        'rgba(241,47,47,0.73)',
                                        // 'rgba(54, 162, 235, 0.2)',
                                        // 'rgba(255, 206, 86, 0.2)',
                                        // 'rgba(75, 192, 192, 0.2)',
                                        // 'rgba(153, 102, 255, 0.2)',
                                        // 'rgba(255, 159, 64, 0.2)'
                                    ],
                                    borderColor: [
                                        // 'rgba(255, 99, 132, 1)',
                                        'rgba(241,47,47,0.73)',
                                        // 'rgba(255, 206, 86, 1)',
                                        // 'rgba(75, 192, 192, 1)',
                                        // 'rgba(153, 102, 255, 1)',
                                        // 'rgba(255, 159, 64, 1)'
                                    ],
                                    borderWidth: 1
                                },
                                    {
                                        label: 'Предсказание',
                                        data: response.PREDICTION,
                                        backgroundColor: [
                                            'rgba(54, 162, 235, 1)',
                                            // 'rgba(54, 162, 235, 0.2)',
                                            // 'rgba(255, 206, 86, 0.2)',
                                            // 'rgba(75, 192, 192, 0.2)',
                                            // 'rgba(153, 102, 255, 0.2)',
                                            // 'rgba(255, 159, 64, 0.2)'
                                        ],
                                        borderColor: [
                                            // 'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            // 'rgba(255, 206, 86, 1)',
                                            // 'rgba(75, 192, 192, 1)',
                                            // 'rgba(153, 102, 255, 1)',
                                            // 'rgba(255, 159, 64, 1)'
                                        ],
                                        borderWidth: 1
                                    }
                                ]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                })
                .catch(error => {
                    alert('Что-то пошло не так')
                })
        }
        else {
            viewPredict(this.props.match.params.fileId)
                .then(response => {
                    if (this._isMounted) {
                        this.setState({isLoading: false, data: {PREDICTION: response}})
                        this.chart = new Chart(document.getElementById('myChart').getContext('2d'), {
                            type: 'line',
                            data: {
                                datasets: [
                                    {
                                        label: 'Предсказание',
                                        data: response,
                                        backgroundColor: [
                                            'rgba(54, 162, 235, 1)',
                                            // 'rgba(54, 162, 235, 0.2)',
                                            // 'rgba(255, 206, 86, 0.2)',
                                            // 'rgba(75, 192, 192, 0.2)',
                                            // 'rgba(153, 102, 255, 0.2)',
                                            // 'rgba(255, 159, 64, 0.2)'
                                        ],
                                        borderColor: [
                                            // 'rgba(255, 99, 132, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            // 'rgba(255, 206, 86, 1)',
                                            // 'rgba(75, 192, 192, 1)',
                                            // 'rgba(153, 102, 255, 1)',
                                            // 'rgba(255, 159, 64, 1)'
                                        ],
                                        borderWidth: 1
                                    }
                                ]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });
                    }
                })
                .catch(error => {
                    alert('Что-то пошло не так')
                })
        }
    }

    /*
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
        }*/

    /*    downloadThisFile(fileId){
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
        }*/

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
        return (
            <Row>
                <NavigationPanel/>
                <Col style={{
                    backgroundColor: 'white',
                    borderRadius: 10,
                    minHeight: 200,
                    height: '100%',
                    width: '75%',
                    maxWidth: '75%'
                }}>
                    <Row style={{flexWrap: 'wrap', display: 'flex', alignContent: 'stretch', maxHeight: 400}}>
                    <Col style={{
                        minHeight: 200,
                        display: 'flex',
                        width: '25%',
                        maxWidth: '25%',
                        maxHeight: 'inherit'
                    }}>
                        {this.state.isLoading &&
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>}
                        {
                            !this.state.isLoading && this.state.data.PREDICTION ? (
                                <div style={{overflowX: 'auto', overflowY: 'scroll', maxHeight: 'inherit'}}>
                                    <ListGroup horizontal className='table-top-line' key={"TABLE"}>
                                        <ListGroupItem style={{width: '50%', overflowX: 'auto'}}
                                                       key={"DATE"}>Дата</ListGroupItem>
                                        <ListGroupItem style={{width: '50%', overflowX: 'auto'}}
                                                       key={"SUM"}>Сумма</ListGroupItem>
                                    </ListGroup>
                                    {
                                        Object.keys(this.state.data.PREDICTION).map((key, index) => (
                                                <div>
                                                    <ListGroup horizontal className='table-top-line' key={index}>
                                                        <ListGroupItem style={{width: '50%', overflowX: 'auto'}}
                                                                       key={index}>{key}</ListGroupItem>
                                                        <ListGroupItem style={{width: '50%', overflowX: 'auto'}}
                                                                       key={index}>{Object.values(this.state.data.PREDICTION)[index]}</ListGroupItem>
                                                    </ListGroup>
                                                </div>
                                        ))
                                    }
                                </div>
                            ) : null
                        }
                    </Col>
                    <Col style={{
                        minHeight: 200,
                        height: '100%',
                        display: 'flex',
                        width: '75%',
                        maxWidth: '75%'
                    }}>
                        {this.state.isLoading &&
                            <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>}
                        {!this.state.isLoading &&
                            <canvas id="myChart">
                            </canvas>}
                    </Col>
                    </Row>
                    <div style={{marginTop: 25, marginBottom: 10}}>
                        {!this.state.isLoading && !this.state.built &&
                            <Button color="primary" size="sm" onClick={() => this.savePrediction(this.state.data)}>
                                Сохранить предсказание
                            </Button>}
                    </div>
                </Col>
            </Row>
        )
    }
}