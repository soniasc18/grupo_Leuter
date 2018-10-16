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
      tunel: false,
      cabecera: "Login",
      debug: true,
      input1: null, //usuario, maquina
      input2: null, //empresa, almacen
      input3: null, //clave, idioma
      data: null,
      index:-1,
      keyp:undefined,
      wait: false,
    };
    this.appClick = this.appClick.bind(this);
    this.salirClick = this.salirClick.bind(this);
  }

  handleData(e) {
    let result = JSON.parse(e.data);
    if(result.payload.menu!==undefined){
      this.setState({
        menu:result.payload.menu,
      });
    }
    if(this.state.cabecera === "Login"){ //vengo de login
      if(result.payload.data_code!=="OK"){
        window.alert("Las contraseñas no coinciden")
      }
      else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "LOGIN_MENU"){
        this.setState({
          cabecera: "Inicio sesión",
          token: result.token,
          data: result,
        });
      }
      else if(result.payload.data_code==="OK" && result.payload.loginFields.nextStep === "NEW_PASS"){
        this.setState({
          cabecera: "Cambiar clave",
          token: result.token,
          data: result,
        });
      }
    }
    else if(this.state.cabecera==="Inicio sesión" && result.payload.data_code==="OK"){
      //aqui index es -1, pero es que ademas nextstep es ACTION_MENU
      this.setState({
        cabecera: "Menú",
        data: result,
      });
      console.log(this.state);
    }
    else if(this.state.cabecera === "Menú"){
      if(result.payload.data_code === "ACTION_NEW"){
        this.setState({
          data: result,
        });
      }
      else if(result.payload.data_code === "OK"){
        this.setState({
          index: -1,
          inputt: undefined,
          data: result,
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState){
    let url = "ws://mock.grupoleuter.com";
    if (this.state.cabecera==="Login" && prevState.cabecera === this.state.cabecera && !this.state.tunel){
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
      this.setState({tunel:true,});
    }
    else if(this.state.cabecera==="Cambiar clave" && prevState.cabecera === this.state.cabecera){
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
    }
    else if(this.state.cabecera==="Inicio sesión" && prevState.cabecera === this.state.cabecera){
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
    else if(this.state.cabecera==="Menú"){
      if(this.state.keyp !== undefined && prevState.keyp !== this.state.keyp && this.state.inputt === undefined){
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
      else if(this.state.keyp === undefined && !this.state.wait && this.state.inputt !== undefined){
        //justo antes de entrar al else if este prevState.keyp no era undefined, al reves con inputt
        this.setState({wait:true});
        let connection = new WebSocket(url+'/action');
        let json_test=JSON.stringify(
          {"device_type":"Browser",
            "token": this.state.token,
            "message_type":"ACTION_TAKEN",
            "payload":{
              "data_code":"ACTION_TAKEN",
              "input": this.state.inputt,
            }});
        connection.onopen = () => connection.send(json_test)
        connection.onerror = () => console.log("ERROR")
        connection.onmessage = this.handleData.bind(this);
      }
    }
  }

  render() {
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
        input3: document.getElementById("Clave").value,
      });
    }else if (cabecera == "Inicio sesión"){
      this.setState({
        input1: document.getElementById("maquina").value,
        input2: document.getElementById("almacen").value,
        input3: document.getElementById("idioma").value,
      });
    }else if(cabecera == "Menú"){
      console.log("keyp: "+keyp);
      this.setState({
        //si sigue habiendo hijos keyp tendrá undefined
        index: document,
        keyp: keyp,
        inputt: inputt,
        wait:false,
      });
      console.log(this.state);
    }
  }

  salirClick() {
    this.setState({
      tunel: false,
      cabecera: "Login",
      input1: null,
      input2: null,
      input3: null,
      data: null,
      index:-1,
      keyp:undefined,
      wait: false,
    });
  }

}
