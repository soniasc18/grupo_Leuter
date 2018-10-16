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
      valueinput1: "",
      valueinput2: "",
    }
    this.botonClick = this.botonClick.bind(this);
    this.abajoClick = this.abajoClick.bind(this);
    this.arribaClick = this.arribaClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }

  render() {
    if (this.props.cabecera === "Login"){
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
              <label>Clave:   <input type="password" className="Clave" id="Clave" placeholder="password" autoComplete="off"defaultValue={operario} autoFocus/></label>
            </Row>
          </form>
          <button onClick={this.botonClick}>Log in</button>
        </div>
      );
    }
    else if (this.props.cabecera == "Cambiar clave"){
      return (
        <div>
          <form className="newpass">
            <Row className="input">
              <label>Nueva contraseña: <input type="text" onChange={this.handleChange} name="Clave" id="Clave" placeholder="Escribe la nueva contraseña" autoComplete="off" value={this.state.valueinput1}/>
              </label>
            </Row>
            <Row className="input">
              <label>Repita contraseña: <input type="password" onChange={this.handleChange} name="NewClave" id="NewClave" autoComplete="off" value={this.state.valueinput2}/></label>
            </Row>
          </form>
          <button onClick={this.botonClick}>{this.props.cabecera}</button>
        </div>
      );
    }
    else if (this.props.cabecera == "Inicio sesión"){
      while(this.props.data !== null && this.props.data.payload.loginFields.warehouses !== undefined){
        let warehouses = this.props.data.payload.loginFields.warehouses.map((element, index) => {
          return(
            <option key={index}>{element}</option>
          );
        });
        let machines = this.props.data.payload.loginFields.machines.map((element, index) => {
          return(
            <option key={index}>{element}</option>
          );
        });
        let languages = this.props.data.payload.loginFields.machines.map((element, index) => {
          return(
            <option key={index}>{element}</option>
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
    }
    else if (this.props.cabecera == "Menú"){
      if(this.props.index === -1 && this.props.data !== null){ //primera pantalla del menú (Elemento1, Elemento2...)
        if(this.props.data.payload.menu !== undefined){
          let arr= [];
          arr.push(this.props.data.payload.menu.map((element, index) => {
            let e = element.item_text;
            if(element.hasChild){
              //si hay hijos bajo ese boton que estoy preparando solo le paso el index del boton que clicko
              //si no hay hijos le paso el index, que realmente no sirve para nada mas que para saber cual pintar, y la item_key que ira en al json
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{e}</button></Row>);
            }else{
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{e}</button></Row>);
            }
          }));
          return (
            <div>
              <Row>Escoja una opción</Row>
              {arr}
              <Row>
                <button onClick={this.botonClick}>Seleccionar</button>
                <button onClick={this.arribaClick}>Arriba</button>
                <button onClick={this.abajoClick}>Abajo</button>
              </Row>
            </div>
          );
        }
        else if(this.props.data.payload.data_code === "OK"){
          let arr= [];
          arr.push(this.props.menu.map((element, index) => {
            let e = element.item_text;
            if(element.hasChild){
              //si hay hijos bajo ese boton que estoy preparando solo le paso el index del boton que clicko
              //si no hay hijos le paso el index, que realmente no sirve para nada mas que para saber cual pintar, y la item_key que ira en al json
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{e}</button></Row>);
            }else{
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{e}</button></Row>);
            }
          }));
          return (
            <div>
              <Row>Escoja una opción</Row>
              {arr}
              <Row>
                <button onClick={this.botonClick}>Seleccionar</button>
                <button onClick={this.arribaClick}>Arriba</button>
                <button onClick={this.abajoClick}>Abajo</button>
              </Row>
            </div>
          );
        }
        return null;
      }
      else{
        console.log("yass");
        if(this.props.keyp === undefined && this.props.data.payload.menu !== undefined){ //hay hijos
          let sol = this.props.data.payload.menu[this.props.index].children.map((element, index)=>{
            if(element.hasChild){
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{element.item_text}</button></Row>);
            }else{
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{element.item_text}</button></Row>);
            }
          });
          return sol;
        }
        else if(this.props.data.payload.data_code === "OK"){
          let sol = this.props.menu[this.props.index].children.map((element, index)=>{
            if(element.hasChild){
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{element.item_text}</button></Row>);
            }else{
              return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{element.item_text}</button></Row>);
            }
          });
          return sol;
        }
        else if(this.props.data !== null && this.props.data.payload.data_code === "ACTION_NEW" && this.props.data.payload.screenContent !== undefined){
          let botones = this.props.data.payload.screenContent.keys.map((element, index) => {
            if(element.text !== "Salir"){
              let texto = element.code + ": " + element.text;
              return(
                <button key={index} onClick={()=>this.props.appClick(this.props.cabecera, index, undefined, document.getElementById("menu-input").value)}>{texto}</button>
              );
            }
            return null;
          });
          return(
              <div>
                <Row><div>{this.props.data.payload.screenContent.title}</div></Row>
                <Row><div>{this.props.data.payload.screenContent.content}</div></Row>
                <Row><div>{this.props.data.payload.screenContent.message}</div></Row>
                <Row><input type="text" className="menu-input" name="menu-input" id="menu-input" defaultValue="123"/></Row>
                <Row>{botones}</Row>
              </div>
          );
          return null;
        }
        return null;
      }
    }
    else{
      let arr= [];
      arr.push(this.props.menu.map((element, index) => {
        let e = element.item_text;
        if(element.hasChild){
          return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{e}</button></Row>);
        }else{
          return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{e}</button></Row>);
        }
      }));
      return (
        <div>
          <Row>Escoja una opción</Row>
          {arr}
          <Row>
            <button onClick={this.botonClick}>Seleccionar</button>
            <button onClick={this.arribaClick}>Arriba</button>
            <button onClick={this.abajoClick}>Abajo</button>
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

  handleChange(e){
    if(e.target.name === "Clave"){
      this.setState({
        valueinput1: e.target.value,
      });
    }else if(e.target.name === "NewClave"){
      this.setState({
        valueinput2: e.target.value,
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
    }
    else if (this.props.cabecera == "Inicio sesión"){
      this.props.appClick(this.props.cabecera, document);
    }else if(this.props.cabecera == "Cambiar clave"){
      if (document.getElementById("Clave").value === document.getElementById("NewClave").value){
        this.props.appClick(this.props.cabecera, document);
      }else{
        window.alert("Las contraseñas no coinciden")
      }
    }
    else if(this.props.cabecera === "Menú"){
      this.props.appClick(this.props.cabecera, this.state.seleccion);
    }
  }
}
