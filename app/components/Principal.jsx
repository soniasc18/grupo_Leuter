import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Websocket from 'react-websocket';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ActionLogin from 'material-ui/svg-icons/action/lock-open';
import ActionStart from 'material-ui/svg-icons/action/done';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';


const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};

export default class Principal extends React.Component {

  constructor(props) {
    super(props);

    let url = new URL(this.props.debug ? "http://terminal.grupoleuter.com?empresa=123456&operario=SUP" : window.location.href);
    let empresaURL = url.searchParams.get("empresa");
    let operarioURL = url.searchParams.get("operario");

    this.state = {
      document: document,
      url: url,
      seleccion: 0,
      valueinput1: "",
      valueinput2: "",
      almacen: "",
      maquina: "",
      idioma: "",
      empresa: empresaURL,
      operario: operarioURL,
      clave: ""
    }
    this.botonClick = this.botonClick.bind(this);
    this.abajoClick = this.abajoClick.bind(this);
    this.arribaClick = this.arribaClick.bind(this);
    this.volverClick = this.volverClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.botonClick1 = this.botonClick1.bind(this);
    this.botonClick2 = this.botonClick2.bind(this);
  }

  render() {
    console.log("Cabecera en Principal: -" + this.props.cabecera + "-");
    console.log("isLoading en Principal: -" + this.props.isLoading + "-");

    if(this.props.isLoading){
      return (
        <div>
          <CircularProgress size={80} thickness={5} />
          <h3>Cargando...</h3>
        </div>
      );
    }else{    
      if (this.props.cabecera === "Login"){
        let visibility = "hidden"
        // if(this.props.data !== null){
        //   this.props.data.payload.data_code="ALREADY_LOGGED_IN";
        //   if(this.props.data.payload.data_code==="ALREADY_LOGGED_IN"){
        //     visibility="visible";
        //   }
        // }
        return (
          <div>
            {/* <form className="login">
              <Row className="input">
                <label>Empresa: <input type="text" className="login-input" name="Empresa" id="Empresa" placeholder="Introduce código de empresa" defaultValue={empresa}/>
                </label>
              </Row>
              <Row className="input">
                <label>Operario: <input type="text" className="login-input" name="Usuario" id="Usuario" placeholder="OP" placeholder="Introduce id de operario" defaultValue={operario}/></label>
              </Row>
              <Row className="input">
                <label>Clave:   <input type="password" className="Clave" id="Clave" placeholder="password" autoComplete="off"placeholder="Introduce clave" defaultValue=""/></label>
              </Row>
            </form> */}

            
            <TextField
              hintText="Código de empresa CXXXXXXXXX"
              floatingLabelText="Empresa"
              value={this.state.empresa}
              id="empresa"
              onChange={(e, value) => this.setState({empresa: value})}
            /><br />
            <TextField
              hintText="Usuario"
              floatingLabelText="Nombre del operario"
              value={this.state.operario}
              id="usuario"
              onChange={(e, value) => this.setState({operario: value})}
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="Password"
              value={this.state.clave}
              id="clave"
              onChange={(e, value) => this.setState({clave: value})}
              type="password"
              autoFocus
            /><br />

            <h5 style={{visibility:!this.props.visible?"hidden":"visible"}}>Credenciales incorrectas</h5>
            <h5 style={{visibility:visibility}}>Sesión ya iniciada</h5>
            <RaisedButton
              label="Login"
              primary={true}
              style={styles.button}
              icon={<ActionLogin />}
              onClick={this.botonClick}
            />
            {/*<button onClick={this.botonClick}>Log in</button>*/}
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
                <label>Repita contraseña: <input type="password" onChange={this.handleChange} name="NewClave" id="NewClave" placeholder="Repite la contraseña" autoComplete="off" value={this.state.valueinput2}/></label>
              </Row>
            </form>
            <button onClick={this.botonClick}>{this.props.cabecera}</button>
          </div>
        );
      }
      else if (this.props.cabecera == "¿Cerrar sesión existente?"){
        const actions = [
          <FlatButton
            label="Sí, iniciar nueva sesión"
            primary={true}
            onClick={this.botonClick1}
          />,
          <FlatButton
            label="No, cambiar de usuario"
            primary={false}
            onClick={this.botonClick2}
          />,
        ];
        return (
          // <div>
          //   <button className="yesOverride" onClick={this.botonClick1}>Sí, iniciar nueva sesión</button>
          //   <button className="noOverride" onClick={this.botonClick2}>No, cambiar de usuario</button>
          // </div>
          <div>
            <Dialog
              title="Iniciar sesión de todas formas"
              actions={actions}
              modal={true}
              open={true}>
              Ya hay una sesión iniciada con ese usuario, ¿quieres cerrar su sesión e iniciar una nueva?
            </Dialog>
          </div>
        );
      }
      else if (this.props.cabecera == "Inicio sesión"){
        console.log("state.maquina: -" + this.state.maquina + "-");
        console.log("state.almacen: -" + this.state.almacen + "-");
        console.log("state.idioma: -" + this.state.idioma + "-");
        while(this.props.data !== null && this.props.data.payload.loginFields.warehouses !== undefined){
          let warehouses = this.props.data.payload.loginFields.warehouses.map((element, index) => {
            return(
              <MenuItem value={element} primaryText={element} key={element}/>
            );
          });
          let machines = this.props.data.payload.loginFields.machines.map((element, index) => {
            return(
              //<option key={index}>{element}</option>
              <MenuItem value={element} primaryText={element} key={element}/>
            );
          });
          let languages = this.props.data.payload.loginFields.languages.map((element, index) => {
            return(
              <MenuItem value={element} primaryText={element} key={element}/>
            );
          });
          return (
            <div>
              <div><SelectField
                              floatingLabelText="Almacén" 
                              id="almacen"
                              value={this.state.almacen}
                              onChange={(e, index, value) => this.handleChangeSelect("almacen", value)}>
                                {warehouses}
                            </SelectField></div>
              <div><SelectField
                              floatingLabelText="Máquina" 
                              id="maquina"
                              value={this.state.maquina}
                              onChange={(e, index, value) => this.handleChangeSelect("maquina", value)}>
                                {machines}
                            </SelectField></div>
              <div><SelectField
                              floatingLabelText="Idioma" 
                              id="idioma"
                              value={this.state.idioma}
                              onChange={(e, index, value) => this.handleChangeSelect("idioma", value)}>
                                {languages}
                            </SelectField>
              {/* <select id="idioma">{languages}</select> */}
              </div>
              <RaisedButton
                label="Comenzar"
                primary={true}
                style={styles.button}
                icon={<ActionStart />}
                onClick={this.botonClick}
              />
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
          if(this.props.keyp === undefined && this.props.data.payload.menu !== undefined){ //hay hijos
            let sol = this.props.data.payload.menu[this.props.index].children.map((element, index)=>{
              if(element.hasChild){
                return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index)}>{element.item_text}</button></Row>);
              }else{
                return(<Row key={index}><button onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{element.item_text}</button></Row>);
              }
            });
            return(
              <div>
                <Row>Escoja una opción</Row>
                {sol}
                <Row>
                  <button onClick={this.volverClick}>Volver</button>
                </Row>
                <Row>
                  <button onClick={this.botonClick}>Seleccionar</button>
                  <button onClick={this.arribaClick}>Arriba</button>
                  <button onClick={this.abajoClick}>Abajo</button>
                </Row>
              </div>
            );
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
              //if(element.text !== "Salir"){
                let texto = element.code + ": " + element.text;
                return(
                  <button key={index} onClick={()=>this.props.appClick(this.props.cabecera, index, undefined, document.getElementById("menu-input").value, element.code)}>{texto}</button>
                );
              //}
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
              <button onClick={this.volverClick}>Volver</button>
            </Row>
            <Row>
              <button onClick={this.botonClick}>Seleccionar</button>
              <button onClick={this.arribaClick}>Arriba</button>
              <button onClick={this.abajoClick}>Abajo</button>
            </Row>
          </div>
        );
      }
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

  volverClick(){
    console.log("¡VolverClick!");
    this.props.appClick(this.props.cabecera, -1);
  }
  handleChangeSelect(select, value){
    if(select === "almacen"){
      this.setState({
        almacen: value,
      });
    }else if(select === "maquina"){
      this.setState({
        maquina: value,
      });
    }else if(select === "idioma"){
      this.setState({
        idioma: value,
      });
    }
  }
  handleChange(e, index, value){
    if(e.target.name === "Clave"){
      this.setState({
        valueinput1: value,
      });
    }else if(e.target.name === "NewClave"){
      this.setState({
        valueinput2: value,
      });
    }
  }

  botonClick(){
    if(this.props.cabecera == "Login"){
      if(this.state.empresa === "" || this.state.operario === "" || this.state.clave === ""){
        window.alert("Rellena todo el formulario")
      }
      else{
        this.props.appClick(this.props.cabecera, this.state);
      }
    }
    else if (this.props.cabecera == "Inicio sesión"){
      this.props.appClick(this.props.cabecera, this.state);
    }
    else if(this.props.cabecera == "Cambiar clave"){
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
  botonClick1(){
    console.log("botonClick1 en Principal: -Y-");
    this.props.appClick(this.props.cabecera, document, "Y");
  }
  botonClick2(){
    console.log("botonClick2 en Principal: -N-");
    this.props.appClick(this.props.cabecera, document, "N");
  }

}
