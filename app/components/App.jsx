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
      cabecera: "Login",
      inferior: "Salir",
      debug: true,
      input1: null, //usuario, maquina
      input2: null, //empresa, almacen
      input3: null, //clave, idioma
      data: null,
      index:-1,
      keyp:undefined,
    };
    this.appClick = this.appClick.bind(this);
    this.salirClick = this.salirClick.bind(this);
  }

  handleData(e) {
    let result = JSON.parse(e.data);
    this.setState({
      data: result,
    });
    console.log(result);
    if(this.state.cabecera === "Login"){
      if(result.payload.data_code!=="OK"){
        console.log("Credenciales erroneas");
//        window.alert("Las contraseñas no coinciden")
      }else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "LOGIN_MENU"){
        this.setState({
          cabecera: "Inicio sesión",
          token: result.token,
        });
      }else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "NEW_PASS"){
        this.setState({
          cabecera: "Cambiar clave"
        });
      }
    }/*else if(this.state.cabecera === "Menú"){
      console.log(result);
    }*/
  }

  componentDidUpdate(prevProps, prevState){
    let url = "ws://mock.grupoleuter.com"
    if (this.state.input3 !== null && prevState.cabecera === "Login" && this.state.cabecera==="Login"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
       {"device_type":"Browser",
       "message_type":"LOGIN",
       "payload": {"loginFields":
          {"username":this.state.input1,
           "password":this.state.input3,
           "company":this.state.input2},
          "data_code":"LOGIN_FIRST"}});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
    }else if(prevState.cabecera === "Inicio sesión" &&this.state.cabecera==="Menú"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
        {"device_type":"Browser",
          "token": this.state.token,
          "message_type":"LOGIN",
          "payload":{
            "data_code":"MENU",
            "loginFields":{
            "selectedWarehouse": this.state.input2,
            "selectedLanguage": this.state.input3,
            "selectedMachine": this.state.input1}
          }});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
  }else if(prevState.cabecera === "Cambiar clave" && this.state.cabecera==="Inicio sesión"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
        {"device_type":"Browser",
          "token": this.state.token,
          "message_type":"LOGIN",
          "payload":{
            "data_code":"LOGIN_NEW_PASS",
            "loginFields":{
            "password": this.state.input3}
          }});
      connection.onopen = () => connection.send(json_test)
      connection.onerror = () => console.log("ERROR")
      connection.onmessage = this.handleData.bind(this);
    }else if(prevState.keyp !==this.state.keyp && this.state.cabecera==="Menú" && this.state.keyp !== undefined){
      if(this.state.keyp === "Enviar"){
        let connection = new WebSocket(url+'/action');
        let json_test=JSON.stringify(
          {"device_type":"Browser",
            "token": this.state.token,
            "message_type":"ACTION_TAKEN",
            "payload":{
              "data_code":"ACTION_TAKEN",
              "input": this.state.keyp
            }});
        connection.onopen = () => connection.send(json_test)
        connection.onerror = () => console.log("ERROR")
        connection.onmessage = this.handleData.bind(this);
        console.log(json_test);
        console.log(connection);
      }else{
        let connection = new WebSocket(url+'/action');
        let json_test=JSON.stringify(
          {"device_type":"Browser",
            "token": this.state.token,
            "message_type":"ACTION",
            "payload":{
              "data_code":"ACTION_MENU",
              "selectedMenu": this.state.keyp
            }});
        connection.onopen = () => connection.send(json_test)
        connection.onerror = () => console.log("ERROR")
        connection.onmessage = this.handleData.bind(this);
      }
    }
  }

  render() {
    return (
      <Grid>
        <Row>
          <Superior cabecera={this.state.cabecera}/>
        </Row>
        <Row className="Ppal">
          <Principal
            cabecera={this.state.cabecera}
            debug={this.state.debug}
            data={this.state.data}
            index={this.state.index}
            keyp={this.state.keyp}
            appClick={this.appClick}/>
        </Row>
        <Row className="Pie">
          <Inferior
            salirClick={this.salirClick}/>
        </Row>
      </Grid>
    );
  }

  appClick(cabecera, document, keyp) {
    if (cabecera == "Login"){
      this.setState({
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
    }else if(cabecera == "Menú"){
        this.setState({
          cabecera: "Menú",
          index: document,
          keyp: keyp,
        });
    }
  }

  salirClick() {
    this.setState({
      cabecera: "Login"
    });
  }

}
