import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Websocket from 'react-websocket';

export default class Principal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      document: document,
      url: this.props.debug ? "http://dominio.com?empresa=123456&operario=SUP" : window.location.href,
    }
    this.botonClick = this.botonClick.bind(this);
  }

  render() {
    if (this.props.cabecera == "LogIn"){
      let url = new URL(this.state.url);
      let empresa = url.searchParams.get("empresa")
      let operario = url.searchParams.get("operario")
      return (
        <div>
          <form>
            <Row className="input">
              <label>Empresa: <input type="text" name="Empresa" id="Empresa" defaultValue={empresa}/>
              </label>
            </Row>
            <Row className="input">
              <label>Operario: <input type="text" name="Usuario" id="Usuario" defaultValue={operario}/></label>
            </Row>
            <Row className="input">
              <label>Clave:   <input type="password" name="Clave" id="Clave" placeholder="password" autoComplete="off"/></label>
            </Row>
          </form>
          <button /*style={{ pointerEvents:  "none" }}*/ onClick={this.botonClick}>{this.props.cabecera}</button>
        </div>
      );
    }else if (this.props.cabecera == "Inicio sesión"){
      console.log(this.props.data);
      while(this.props.data !== null && this.props.data.payload.loginFields.warehouses !== undefined){
        let aux = this.props.data.payload.loginFields.warehouses.map((member, index) => {
          {index};
        });
        let selector = this.props.data.payload.loginFields.warehouses.map((member)=> {
          for (var i=0; i<aux.length; i++){
            console.log(member);
            return member;
          }
        });
        console.log(selector);
        return (
          <div>Almacén
            <select id="almacen">
                <option>{this.props.data.payload.loginFields.warehouses[0]}</option>
                <option>{this.props.data.payload.loginFields.warehouses[1]}</option>
                <option>{this.props.data.payload.loginFields.warehouses[2]}</option>
            </select>
            <select id="maquina">
                <option>{this.props.data.payload.loginFields.machines[0]}</option>
                <option>{this.props.data.payload.loginFields.machines[1]}</option>
                <option>{this.props.data.payload.loginFields.machines[2]}</option>
            </select>
            <select id="idioma">
                <option>{this.props.data.payload.loginFields.languages[0]}</option>
                <option>{this.props.data.payload.loginFields.languages[1]}</option>
                <option>{this.props.data.payload.loginFields.languages[2]}</option>
            </select>
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
              <label>Nueva contraseña: <input type="password" name="Clave" id="Clave"/>
              </label>
            </Row>
            <Row className="input">
              <label>Repita contraseña: <input type="password" name="NewClave" id="NewClave"/></label>
            </Row>
          </form>
          <button onClick={this.botonClick}>{this.props.cabecera}</button>
        </div>
      );
    }else if (this.props.cabecera == "Menú"){
      return (
        <div>
          <Row>Escoja una opción</Row>
          <Row><button onClick={this.botonClick}>Entradas</button></Row>
          <Row><button onClick={this.botonClick}>Salidas</button></Row>
          <Row><button onClick={this.botonClick}>Control</button></Row>
        </div>
      );
    }

  }


  botonClick(){
    if(this.props.cabecera == "LogIn"){
      var empresa = document.getElementById("Empresa").value;
      var usuario = document.getElementById("Usuario").value;
      var clave = document.getElementById("Clave").value;
      if(empresa === "" || usuario === "" || clave === ""){
        console.log("Rellena todo el formulario")
        //alert
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
        console.log("Las contraseñas no coinciden");
      }
    }
  }
}
