import React, {Component} from "react";
import {Col, Row} from 'reactstrap';
import {loadFilesByUser, downloadFile, deleteFile, predictFile} from "../util/APIUtils";
import NavigationPanel from "../navigation/NavigationPanel";
import {Chart, registerables} from "chart.js";

export default class PredictionChart extends Component {

    constructor(props) {
        super(props);
        this._isMounted = false;
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            image: [],
            isLoading: true,
            data: null
        }
/*        this.loadAllFiles = this.loadAllFiles.bind(this)
        this.downloadThisFile = this.downloadThisFile.bind(this)
        this.deleteThisFile = this.deleteThisFile.bind(this)*/
        this.buildChart = this.buildChart.bind(this)
        Chart.register(...registerables);
    }


    componentDidMount() {
        this.buildChart()
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

    buildChart(){
        predictFile(this.props.match.params.fileId)
            .then(async response => {
                await this.setState({data: response})
                this.setState({isLoading: false})
                console.log(this.state.data)
                const ctx = document.getElementById('myChart').getContext('2d');
                const myChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Объем платежей',
                            data: this.state.data,
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
        if (!this.state.isLoading) {
            return(
                <Row>
                    <NavigationPanel/>
                    <Col sm={{size: 5.4}} style={{backgroundColor:'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom:20, width: '75%'}}>
                        {
                            <div>
                                <canvas id="myChart">
                                </canvas>
                            </div>
                        }
                    </Col>
                </Row>
            )
        } else {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
    }
}