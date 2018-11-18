import React from 'react';
import './../assets/scss/main.scss';
import Superior from './Superior.jsx';
import Inferior from './Inferior.jsx';
import Principal from './Principal.jsx';
import {Row, Col } from 'react-bootstrap';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
  root: {
    display: 'flex',
    maxWidth: "100%",
    maxHeight: "100%",
    overflow: "hidden"
  },
  paper: {
    margin: "auto"
  },
  keyboard: {
    position: "fixed",
    bottom: "0px",
    left: "0px"
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tunel: false,
      cabecera: "Login",
      debug: false,
      input1: null, //usuario, maquina
      input2: null, //empresa, almacen
      input3: null, //clave, idioma
      data: null,
      index:-1,
      keyp:undefined,
      wait: false,
      connection: undefined,
      visible: false,
      click:true,
      loggedIn: false, 
      pressedKey: undefined,
      isLoading: false,
      actionId: 0,
      currentMenuItem: {
        item_text: "Inicio"
      },
      menuStack: new Map()
    };
    this.appClick = this.appClick.bind(this);
    this.salirClick = this.salirClick.bind(this);
    this.volverClick = this.volverClick.bind(this);
  }

  handleData(e) {
    let result = JSON.parse(e.data);
    console.log(result);
    if(result.payload.menu !== undefined){
      this.setState({
        menu:result.payload.menu,
        isLoading: false
      });
    }
    if(this.state.cabecera === "Login" || this.state.cabecera === "¿Cerrar sesión existente?"){
      //vengo de login o de confirmar la sobreescritura de la sesión
      if(result.payload.data_code!=="OK"){
        console.log("data_code = " + result.payload.data_code);
        if(result.payload.data_code === "ALREADY_LOGGED_IN"){
          this.setState({
            cabecera: "¿Cerrar sesión existente?",
            isLoading: false
          });
        }else{
          this.setState({
            visible: true,
            click:false,
            isLoading: false
          });
          console.log("Credenciales incorrectas");
        }
      }
      else if(result.payload.data_code === "OK" && result.payload.loginFields.nextStep === "LOGIN_MENU"){
        this.setState({
          cabecera: "Inicio sesión",
          token: result.token,
          data: result,
          tunel:true,
          visible: false,
          isLoading: false
        });
      }
      else if(result.payload.data_code === "OK" && result.payload.loginFields.nextStep === "NEW_PASS"){
        this.setState({
          cabecera: "Cambiar clave",
          token: result.token,
          data: result,
          tunel:true,
          visible: false,
          isLoading: false
        });
      }
    }
    else if(this.state.cabecera === "Inicio sesión" && result.payload.data_code === "OK" && result.payload.loginFields.nextStep !== "LOGIN_MENU"){
      //aqui index es -1, pero es que ademas nextstep es ACTION_MENU
      this.setState({
        cabecera: "Menú",
        data: result,
        isLoading: false,
        currentMenuItem:{
          item_text: "Inicio",
          children: result.payload.menu
        }
      });
    }
    else if(this.state.cabecera === "Menú"){
      if(result.payload.data_code === "ACTION_NEW"){
        this.setState({
          data: result,
          isLoading: false,
          actionId: this.state.actionId + 1,
          cabecera: "Acción"
        });
      }
      else if(result.payload.data_code === "OK"){
        this.setState({
          index: -1,
          inputt: undefined,
          data: result,
          isLoading: false
        });
      }
    }
    else if(this.state.cabecera === "Cambiar clave"){      
      if(result.payload.data_code === "OK" && result.payload.loginFields.nextStep === "LOGIN_MENU"){
        this.setState({
          cabecera: "Inicio sesión",
          data: result,
          tunel:true,
          visible: false,
          isLoading: false
        });
      }
    }
    else if(this.state.cabecera === "Acción"){
      if(result.payload.data_code === "ACTION_NEW"){
        this.setState({
          data: result,
          isLoading: false,
          actionId: this.state.actionId + 1,
          cabecera: "Acción"
        });
      }
      else if(result.payload.data_code === "OK"){
        console.log("Volviendo al Menú desde Acción");
        console.log("CurrentMenuItem", this.state.currentMenuItem);
        console.log("Stack", this.state.menuStack);
        console.log("Volviendo al Menú desde Acción");
        this.setState({
          index: -1,
          inputt: undefined,
          data: result,
          isLoading: false,
          cabecera: "Menú"
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState){
    let url = "ws://api.grupoleuter.com";
    //let url = "ws://localhost:8080/compassapi";
    if (this.state.cabecera === "Login" && prevState.cabecera === this.state.cabecera && !this.state.tunel && this.state.click){
      //hacer que cuando le des click solo entre aqui una vez, ya sea metiendo otro atributo o lo que sea
      //pq si entra aqui mas de una vez no deja de enviar msg al servidor
      //pero aqui debe entrar tanto si el mensajito esta visible porque te hayas equivocado
      //como si no esta visible porque hayas acertado (en este caso seria la primera vez que entramos)
      //si es la primera vez que entras aux=0 siempre envias msg al servidor, y ya pones el mensajito visible
      //al estar el mensajito visible y aux ya no ser 0
      //if((aux===0 && !visible) || (aux===0 && visible))
      let connection = new WebSocket(url + '/login');
      let json_test = JSON.stringify(
        {
          "device_type": "Browser",
          "message_type": "LOGIN",
          "payload": {
            "loginFields": {
              "username": this.state.input1,
              "password": this.state.input3,
              "company": this.state.input2
            },
            "data_code": "LOGIN_FIRST"
          }
        });
      connection.onopen = () => connection.send(json_test);
      connection.onclose = () => console.log("onclose");
      connection.onerror = () => console.log("ERROR");
      connection.onmessage = this.handleData.bind(this);
      console.log(connection);
    }
    else if (this.state.cabecera === "¿Cerrar sesión existente?" && prevState.cabecera === this.state.cabecera && this.state.click){
      let connection = new WebSocket(url+'/login');
      let json_test=JSON.stringify(
       {"device_type":"Browser",
       "message_type":"LOGIN",
       "token": this.state.token,
       "payload": {"loginFields":
          {"username":this.state.input1,
           "password":this.state.input3,
           "company":this.state.input2,
           "overrideLogin": true
          },
          "data_code":"LOGIN_FIRST"}});
      connection.onopen = () => connection.send(json_test);
      connection.onclose = () => console.log("onclose");
      connection.onerror = () => console.log("ERROR");
      connection.onmessage = this.handleData.bind(this);
      console.log(connection);
    }
    else if(this.state.cabecera === "Cambiar clave" && prevState.cabecera === this.state.cabecera){
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
      connection.onopen = () => connection.send(json_test);
      connection.onerror = () => console.log("ERROR");
      connection.onmessage = this.handleData.bind(this);
      console.log(connection);
    }
    else if(this.state.cabecera === "Inicio sesión" && prevState.cabecera === this.state.cabecera && !this.state.loggedIn){
      let connection = new WebSocket(url + '/login');
      let json_test=JSON.stringify(
        {"device_type":"Browser",
          "token": this.state.token,
          "message_type": "LOGIN",
          "payload": {
            "data_code": "MENU",
            "loginFields":{
              "selectedWarehouse": this.state.input2,
              "selectedLanguage": this.state.input3,
              "selectedMachine": this.state.input1
            }
          }
        }
      );
      connection.onopen = () => connection.send(json_test);
      connection.onerror = () => console.log("ERROR");
      connection.onmessage = this.handleData.bind(this);
      console.log(connection);
      this.setState({
        loggedIn: true
      });
    }
    else if(this.state.cabecera === "Menú"){
      if(this.state.keyp !== undefined && prevState.keyp !== this.state.keyp && this.state.inputt === undefined){
        let connection = new WebSocket(url + '/action');
        let json_test=JSON.stringify(
          {
            "device_type": "Browser",
            "token": this.state.token,
            "message_type": "ACTION",
            "payload": {
              "data_code": "ACTION_MENU",
              "selectedMenu": this.state.keyp
            }});
        connection.onopen = () => connection.send(json_test);
        connection.onerror = () => console.log("ERROR");
        connection.onmessage = this.handleData.bind(this);
        console.log(connection);
      }
    }
    else if(this.state.cabecera === "Acción"){
      if(this.state.keyp === undefined && !this.state.wait && this.state.inputt !== undefined){
        //justo antes de entrar al else if este prevState.keyp no era undefined, al reves con inputt
        this.setState({wait:true});
        let connection = new WebSocket(url+'/action');
        console.log("Enviando ACTION_TAKEN: \n->input: -" + this.state.inputt + "-\n" + "->pressedKey: -" + this.state.pressedKey + "-");
        let json_test=JSON.stringify(
          {
            "device_type": "Browser",
            "token": this.state.token,
            "message_type": "ACTION_TAKEN",
            "payload": {
              "data_code": "ACTION_TAKEN",
              "input": this.state.inputt,
              "pressedKey": this.state.pressedKey
            }
          });
        connection.onopen = () => connection.send(json_test);
        connection.onerror = () => console.log("ERROR");
        connection.onmessage = this.handleData.bind(this);
        console.log(connection);
      }
    }    
  }

  render() {
    const { classes } = this.props;
    console.log("Cabecera en App: -" + this.state.cabecera + "-");
    console.log("CurrentMenuItem en App", this.state.currentMenuItem);
    return (
        <MuiThemeProvider> 
          <div>
            <Superior cabecera={this.state.cabecera}/>

            <div className={classes.root}>
              <Grid container spacing={24} direction="column">
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center"
                  style={{ minHeight: '100vh' }}>
                  <Grid item>
                    <Paper className={classes.paper}>        
                      <Row className="Ppal">
                        <Principal
                          cabecera={this.state.cabecera}
                          debug={this.state.debug}
                          data={this.state.data}
                          index={this.state.index}
                          keyp={this.state.keyp}
                          menu={this.state.menu}
                          visible={this.state.visible}
                          isLoading={this.state.isLoading}
                          appClick={this.appClick}
                          volverClick={this.volverClick}
                          actionId = {this.state.actionId}
                          currentMenuItem = {this.state.currentMenuItem}
                          volverEnabled = {this.state.menuStack.size > 0} />
                      </Row>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

            
              <Row className="Pie">
                <Inferior
                  salirClick={this.salirClick} 
                  loggedIn={this.state.loggedIn}/>
              </Row>
            </div>
            <div style={styles.keyboard}>
            </div>
          </div>
        </MuiThemeProvider>
    );
  }

  onChange(input) {
    console.log("Input changed", input);
  }

  onKeyPress(button) {
    console.log("Button pressed", button);
  }

  appClick(cabecera, document, keyp, inputt, pressedKeyCode) {
    console.log("AppClick desde: " + cabecera);
    if (cabecera === "Login"){
      console.log("state subido:");
      console.log(document);
      this.setState({
        input1: document.operario,
        input2: document.empresa,
        input3: document.clave,
        visible: false,
        click: true,
        isLoading: true
      });
    }
    else if(cabecera === "Cambiar clave"){
      this.setState({
        input3: document.valueinput1,
        isLoading: true
      });
    }
    else if (cabecera === "Inicio sesión" && !this.state.loggedIn){
      console.log("AppClick -> SetState desde: " + cabecera);
      this.setState({
        input1: document.maquina,
        input2: document.almacen,
        input3: document.idioma,
        isLoading: true
      });
    }
    else if(cabecera === "Menú"){
      //En keypt tenemos true si tiene hijos y en inputt el padre
      if(keyp){
        this.setState({
          keyp: undefined,
          menuStack: this.state.menuStack.set(this.state.menuStack.size + 1, this.state.currentMenuItem),
          currentMenuItem: inputt
        });
      }
      //Si keyp es false, entonces tendremos la key pulsada en inputt
      else{
        this.setState({
          index: document,
          keyp: inputt,
          wait: false,
          isLoading: (inputt !== undefined)
        });
      }
    }
    else if(cabecera === "Acción"){
      this.setState({
        //si sigue habiendo hijos keyp tendrá undefined
        index: document,
        keyp: keyp,
        inputt: inputt,
        wait:false,
        pressedKey: pressedKeyCode,
        isLoading: (keyp !== undefined)
      });
    }
    else if(cabecera === "¿Cerrar sesión existente?"){
      if(keyp === "Y"){
        this.setState({
          click: true,
          isLoading: true
        });
      }else if(keyp === "N"){
        this.setState({
          cabecera: "Login"
        })
      }
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
      visible: false,
      loggedIn: false
    });
  }

  volverClick() {
    if(this.state.menuStack.size > 0){
      let newCurrentMenuItem = this.state.menuStack.get(this.state.menuStack.size);
      let newMenuStack = this.state.menuStack;
      newMenuStack.delete(newMenuStack.size);
      this.setState({
        currentMenuItem: newCurrentMenuItem,
        menuStack: newMenuStack
      });
    }
  }

}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);