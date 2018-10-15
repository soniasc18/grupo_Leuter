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
      i:0,
      inputt: "escaner", //escaneado
    };
    this.appClick = this.appClick.bind(this);
    this.salirClick = this.salirClick.bind(this);
  }

  handleData(e) {
    let result = JSON.parse(e.data);
    this.setState({
      data: result,
    });
    if(result.payload.menu!==undefined){
      this.setState({
        menu:result.payload.menu,
      });
    }
    if(this.state.cabecera === "Login"){
      if(result.payload.data_code!=="OK"){
        if(this.state.i===0){
          this.setState({
            i:1,
          });
          window.alert("Las contraseñas no coinciden")
        }
      }
      else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "LOGIN_MENU"){
        this.setState({
          cabecera: "Inicio sesión",
          token: result.token,
        //  menu:result.payload.menu,
        });
      }else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "NEW_PASS"){
        this.setState({
          cabecera: "Cambiar clave",
          token: result.token,
        });
      }
    }
    else if(this.state.cabecera === "Menú"){
      if(result.payload.data_code==="OK"){
        this.setState({
          index: -1,
        });
      }else{
        this.setState({
          cabecera: "Menú"
        });
      }

    }
    console.log(result);
  }

  componentDidUpdate(prevProps, prevState){
    let url = "ws://mock.grupoleuter.com"
    if (prevState.cabecera === "Login" && this.state.cabecera==="Login" && this.state.input3 !== null){
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
    }
    else if(prevState.cabecera === "Cambiar clave" && this.state.cabecera==="Inicio sesión"){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
        {"device_type":"browser",
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
      console.log(json_test);
    }
    else if(prevState.cabecera === "Inicio sesión" && this.state.cabecera==="Menú"){
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
    }
    else if(this.state.cabecera==="Menú" && this.state.keyp !== undefined && prevState.keyp !== this.state.keyp){
      if(this.state.inputt === ""){
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
      }else{
        let connection = new WebSocket(url+'/action');
        let json_test=JSON.stringify(
          {"device_type":"Browser",
            "token": this.state.token,
            "message_type":"ACTION_TAKEN",
            "payload":{
              "data_code":"ACTION_TAKEN",
              "input": this.state.inputt,
            }});
            console.log(json_test);
        connection.onopen = () => connection.send(json_test)
        connection.onerror = () => console.log("ERROR")
        connection.onmessage = this.handleData.bind(this);
      }
    }
  }

  render() {
    console.log(this.state);
    return (
      <Grid className="container">
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
            menu={this.state.menu}
            appClick={this.appClick}/>
        </Row>
        <Row className="Pie">
          <Inferior
            salirClick={this.salirClick}/>
        </Row>
      </Grid>
    );
  }

  appClick(cabecera, document, keyp, inputt) {
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
      console.log(inputt);
      this.setState({
        cabecera: "Menú",
        index: document,
        keyp: keyp,
        inputt: inputt,
      });
    }
  }

  salirClick() {
    this.setState({
      cabecera: "Login",
      inferior: "Salir",
      debug: true,
      input1: null,
      input2: null,
      input3: null,
      data: null,
      index:-1,
      keyp:undefined,
    });
  }

}
