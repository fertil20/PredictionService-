import {Component} from "react";
import {Button, Col, Input, Row} from 'reactstrap';
import {uploadFile} from "../util/APIUtils";
import {Link} from "react-router-dom";



export default class FilesAdd extends Component {

    constructor(props) {
        super(props);
        this.state ={
            CurUser: JSON.parse(localStorage.getItem('app')),
            file: '',
            fileName: 'loadFile',
            fileUrl: 'loadFile'
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onChange = this.onChange.bind(this)
        this.addNewFile = this.addNewFile.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
    }


    componentWillUnmount() {
        this._isMounted = false;
    }

    addNewFile(){
        uploadFile(this.state.file)
            .then(response => {
                // alert('Файл добавлен')
                //this.props.history.push(`/news`);
            })
            .catch(error => {
                alert('Что-то пошло не так.');
            });
    }


    onChange(e) {
        if(e.target.files.length !== 0) {
            this.setState({
                file: e.target.files[0],
                fileUrl: URL.createObjectURL(e.target.files[0]),
                fileName: e.target.files[0].name
            })
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
            }
        });
    }

    render () {
        return(
            <Row>
                <Col sm={{size:1.5}} style={{backgroundColor: 'white', borderRadius: 10,overflow: 'auto', height:'100%', paddingBottom: 20, marginRight: '2%', width: '53%'}}>
                    <div style={{width:570, marginBottom:30}}>
                        <Row>
                            <Col>
                                {/*<img style={{paddingLeft:20}} src={this.state.fileUrl} alt={this.state.fileName} id = 'fileUpload' className='file-upload'/>*/}
                                <div style={{width:'100%',paddingLeft:20,marginRight:0,marginTop:20}}>
                                    <Input type='file' name='multipartFile' className="file" onChange={(event)=>this.onChange(event)}/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Link to={`/files/${this.state.CurUser.currentUser.username}`}><Button size='sm' color='danger' className='files-cancel'>Отменить</Button></Link>
                        <Button size='sm' className='files-publish' onClick={()=>{
                            this.addNewFile();
                            this.props.history.push({pathname:`/files/${this.state.CurUser.currentUser.username}`}, {update: true})}}>Подтвердить</Button>
                    </div>
                </Col>
            </Row>
        )
    }
}
