import React from 'react';
import './../assets/scss/main.scss';
import Superior from './Superior.jsx';
import Inferior from './Inferior.jsx';
import Principal from './Principal.jsx';
import { Grid, Row, Col } from 'react-bootstrap';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cabecera: "LogIn",
      inferior: "Salir",
      debug: true,
      input1: null, //usuario, maquina
      input2: null, //empresa, almacen
      input3: null, //clave, idioma
      data: null,
    };
    this.appClick = this.appClick.bind(this);
    this.salirClick = this.salirClick.bind(this);
  }

  handleData(e) {
    let result = JSON.parse(e.data);
    console.log("OK");
    this.setState({
      data: result,
    });
    console.log(result);
    if(this.state.cabecera === "Inicio sesión"){
      //si queremos pasar a la segunda pantalla comprobamos la clave y luego
      //si el usuario es la primera vez que accede
      if(result.payload.data_code!=="OK"){
        //ERROR en Clave
        this.setState({
          cabecera: "LogIn"
        });
      }else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "LOGIN"){
        this.setState({
          cabecera: "Inicio sesión"
        });
      }else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "NEW_PASS"){
        this.setState({
          cabecera: "Cambiar clave"
        });
      }
    }else if(this.state.cabecera === "Menú"){
      console.log("waitt");
    }
  }

  componentDidUpdate(prevProps, prevState){
    let url = "ws://mock.grupoleuter.com"
    if (this.state.input3 !== null && prevState.cabecera === "LogIn" && this.state.cabecera==="Inicio sesión"){
      //si no es null es pq ya han hecho click y se ha metido el valor de la clave en el estado
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify( //El que envio al servidor
       {"device_type":"browser",
       "message_type":"LOGIN",
       "payload": {"loginFields":
          {"username":this.state.input1,
           "password":this.state.input3,
           "company":this.state.input2},
          "data_code":"LOGIN_FIRST"}});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
      console.log(connection)
      console.log(this.state);
    }else if(prevState.cabecera === "Inicio sesión" &&this.state.cabecera==="Menú"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
        {"device_type":"browser",
          "token": this.state.data.token,
          "message_type":"LOGIN",
          "payload":{
            "data_code":"LOGIN_MENU",
            "loginFields":{
            "selectedWarehouse": this.state.input2,
            "selectedLanguage": this.state.input3,
            "selectedMachine": this.state.input1}
          }});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
    //  console.log(connection)
  }else if(prevState.cabecera === "Cambiar clave" && this.state.cabecera==="Inicio sesión"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
        {"device_type":"browser",
          "token": this.state.data.token,
          "message_type":"LOGIN",
          "payload":{
            "data_code":"LOGIN_NEW_PASS",
            "loginFields":{
            "password": this.state.input3}
          }});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
    }
  }

/*  componentDidMount(){
    this.setState({
      input1: document.getElementById("Usuario").value,
      input2: document.getElementById("Empresa").value,
    });
  }
*/
  render() {
    console.log("rend");
    return (
      <Grid>
        <Row className="Cabecera">
          <Superior cabecera={this.state.cabecera}/>
        </Row>
        <Row className="Ppal">
          <Principal
            cabecera={this.state.cabecera}
            debug={this.state.debug}
            data={this.state.data}
            appClick={this.appClick}/>
        </Row>
        <Row className="Pie">
          <Inferior
            salirClick={this.salirClick}/>
        </Row>
      </Grid>
    );
  }

  appClick(cabecera, document) {
    if (cabecera == "LogIn"){ //cabecera indica de qué pantalla venimos
      this.setState({
        cabecera: "Inicio sesión", //cabecera: "LogIn", --> check componentDidUpdate
        input1: document.getElementById("Usuario").value,
        input2: document.getElementById("Empresa").value,
        input3: document.getElementById("Clave").value,
      });
    }else if(cabecera == "Cambiar clave"){
      this.setState({
        cabecera: "Inicio sesión",
        input3: document.getElementById("Clave").value,
      });
    }else if (cabecera == "Inicio sesión"){
      this.setState({
        cabecera: "Menú",
        input1: document.getElementById("maquina").value,
        input2: document.getElementById("almacen").value,
        input3: document.getElementById("idioma").value,
      });
    }
  }

  salirClick() {
    this.setState({
      cabecera: "LogIn"
    });
  }

}
