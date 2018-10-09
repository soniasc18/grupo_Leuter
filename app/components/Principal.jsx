import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Websocket from 'react-websocket';

export default class Principal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      document: document,
      url: this.props.debug ? "http://dominio.com?empresa=123456&operario=SUP" : window.location.href,
      seleccion: 0,
    }
    this.botonClick = this.botonClick.bind(this);
  }

  render() {
    if (this.props.cabecera == "Login"){
      let url = new URL(this.state.url);
      let empresa = url.searchParams.get("empresa")
      let operario = url.searchParams.get("operario")
      return (
        <div>
          <form className="login">
            <Row className="input">
              <label>Empresa: <input type="text" className="login-input" name="Empresa" id="Empresa" placeholder="123456" defaultValue={empresa}/>
              </label>
            </Row>
            <Row className="input">
              <label>Operario: <input type="text" className="login-input" name="Usuario" id="Usuario" placeholder="OP" defaultValue={operario}/></label>
            </Row>
            <Row className="input">
              <label>Clave:   <input type="password" className="Clave" id="Clave" placeholder="password" autoComplete="off" autoFocus/></label>
            </Row>
          </form>
          <button onClick={this.botonClick}>Log in</button>
        </div>
      );
    }else if (this.props.cabecera == "Inicio sesión"){
      while(this.props.data !== null && this.props.data.payload.loginFields.warehouses !== undefined){
        let warehouses = this.props.data.payload.loginFields.warehouses.map((element, index) => {
          return(
            <option>{element}</option>
          );
        });
        let machines = this.props.data.payload.loginFields.machines.map((element, index) => {
          return(
            <option>{element}</option>
          );
        });
        let languages = this.props.data.payload.loginFields.machines.map((element, index) => {
          return(
            <option>{element}</option>
          );
        });
        return (
          <div>
            <div>Almacén: <select id="almacen">{warehouses}</select></div>
            <div>Máquinas: <select id="maquina">{machines}</select></div>
            <div>Idiomas: <select id="idioma">{languages}</select></div>
            <button className="login" onClick={this.botonClick}>{this.props.cabecera}</button>
          </div>
        );
      }
      return null;
    }else if (this.props.cabecera == "Cambiar clave"){
      return (
        <div>
          <form>
            <Row className="input">
              <label>Nueva contraseña: <input type="password" name="Clave" id="Clave" placeholder="Escribe la nueva contraseña" autoComplete="off"/>
              </label>
            </Row>
            <Row className="input">
              <label>Repita contraseña: <input type="password" name="NewClave" id="NewClave" autoComplete="off"/></label>
            </Row>
          </form>
          <button onClick={this.botonClick}>{this.props.cabecera}</button>
        </div>
      );
    }else if (this.props.cabecera == "Menú"){
      return (
        <div>
          <Row>Escoja una opción</Row>
          <Row><button onClick={this.seleccionClick}>Entradas</button></Row>
          <Row><button onClick={this.seleccionClick}>Salidas</button></Row>
          <Row><button onClick={this.seleccionClick}>Control</button></Row>
          <Row>
            <button onClick={this.botonClick}>Seleccionar</button>
            <button onClick={this.abajoClick}>Arriba</button>
            <button onClick={this.arribaClick}>Abajo</button>
          </Row>
        </div>
      );
    }
  }

  arribaClick(){
    if(this.state.seleccion > 0){
      let aux = this.state.seleccion - 1
      this.setState({
        seleccion: aux,
      });
    }
  }

  abajoClick(){
    if(this.state.seleccion < 2){
      let aux = this.state.seleccion + 1
      this.setState({
        seleccion: aux,
      });
    }
  }

  botonClick(){
    if(this.props.cabecera == "Login"){
      var empresa = document.getElementById("Empresa").value;
      var usuario = document.getElementById("Usuario").value;
      var clave = document.getElementById("Clave").value;
      if(empresa === "" || usuario === "" || clave === ""){
        window.alert("Rellena todo el formulario")
      }
      else{
        this.props.appClick(this.props.cabecera, document);
      }
    }else if (this.props.cabecera == "Inicio sesión"){
      this.props.appClick(this.props.cabecera, document);
    }else if(this.props.cabecera == "Cambiar clave"){
      var clave = document.getElementById("Clave").value;
      var newClave = document.getElementById("NewClave").value;
      if (clave === newClave){
        this.props.appClick(this.props.cabecera, document);
      }else{
        window.alert("Las contraseñas no coinciden")
      }
    }else if(this.props.cabecera == "Menú"){

      console.log("Seleccion: "+this.state.seleccion);
    }
  }
}
