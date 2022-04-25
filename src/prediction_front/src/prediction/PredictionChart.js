import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {predictFile, savePredict} from "../util/APIUtils";
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
            image: [],
            isLoading: true,
            data: null
        }
        /*        this.loadAllFiles = this.loadAllFiles.bind(this)
                this.downloadThisFile = this.downloadThisFile.bind(this)
                this.deleteThisFile = this.deleteThisFile.bind(this)*/
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
        savePredict(data, "PredictionPayments")
            .then(response => {
                alert('Файл успешно сохранён')
            })
            .catch(error => {
                alert('Что-то пошло не так')
            })
    }

    buildChart() {
        predictFile(this.props.match.params.fileId)
            .then(response => {
                if (this._isMounted) {
                    this.setState({isLoading: false, data: response})
                    console.log(response)
                    this.chart = new Chart(document.getElementById('myChart').getContext('2d'), {
                        type: 'line',
                        data: {
                            datasets: [{
                                label: 'Объем платежей',
                                data: response,
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
                                    'rgba(54, 162, 235, 1)',
                                    // 'rgba(255, 206, 86, 1)',
                                    // 'rgba(75, 192, 192, 1)',
                                    // 'rgba(153, 102, 255, 1)',
                                    // 'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
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
                    overflow: 'auto',
                    minHeight: 200,
                    height: '100%',
                    paddingBottom: 20,
                    width: '75%',
                }}>
                <Col sm={{size: 5.4}} style={{
                    minHeight: 200,
                    height: '100%',
                    display: 'flex'
                }}>
                    {this.state.isLoading &&
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>}
                    {!this.state.isLoading &&
                    <canvas id="myChart">
                    </canvas>}
                </Col>
                    <div style={{marginTop:15}}>
                        {!this.state.isLoading &&
                            <Button color="primary" size="sm" onClick={() => this.savePrediction(this.state.data)}>
                                Сохранить предсказание
                            </Button>}
                    </div>
                </Col>
            </Row>
        )
    }
}