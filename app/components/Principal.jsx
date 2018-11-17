import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
import ActionSettings from 'material-ui/svg-icons/action/settings';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import MenuItemCore from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Button from '@material-ui/core/Button';


const styles = theme => ({
  button: {
    margin: 12,
    alignSelf: 'stretch'
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
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {},
  icon: {},
  button: {
    margin: theme.spacing.unit,
  },
});

class Principal extends React.Component {

  constructor(props) {
    super(props);

    let url = new URL(this.props.debug ? "http://terminal.grupoleuter.com?empresa=123456&operario=SUP" : window.location.href);
    let empresaURL = url.searchParams.get("empresa");
    let operarioURL = url.searchParams.get("operario");

    history.replaceState({}, document.title, "/");

    this.state = {
      document: document,
      url: url,
      seleccion: 0,
      valueinput1: "",
      valueinput2: "",
      almacen: "",
      maquina: "",
      idioma: "",
      empresa: empresaURL ? empresaURL : "",
      operario: operarioURL ? operarioURL : "",
      clave: "", 
      inputTerminal: "",
      actionId: 0
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
    const { classes } = this.props;
    const colorVolver = "primary";
    console.log("Cabecera en Principal: -" + this.props.cabecera + "-");
    console.log("isLoading en Principal: -" + this.props.isLoading + "-");

    if(this.state.actionId != this.props.actionId) this.setState({inputTerminal: "", actionId: this.props.actionId});

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
            <TextField
              hintText="Password"
              floatingLabelText="Nueva contraseña"
              value={this.state.valueinput1}
              id="Clave"
              onChange={(e, value) => this.setState({valueinput1: value})}
              type="password"
              autoFocus
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="Repetir la contraseña"
              value={this.state.valueinput2}
              id="NewClave"
              onChange={(e, value) => this.setState({valueinput2: value})}
              type="password"
            /><br />
            <RaisedButton
              label="Guardar"
              primary={true}
              style={styles.button}
              icon={<ActionSettings />}
              onClick={this.botonClick}
            />
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
        console.log("CurrentMenuItem en Principal", this.props.currentMenuItem);
        if(this.props.currentMenuItem !== undefined 
        && this.props.currentMenuItem.children !== undefined){
          console.log("Ha entrado a children en Principal", this.props.currentMenuItem);
          let menuItems = [];
          menuItems.push(this.props.currentMenuItem.children.map((element, index) => {
            let e = element.item_text;
            if(element.hasChild){
              //si hay hijos bajo ese boton que estoy preparando solo le paso el index del boton que clicko
              //si no hay hijos le paso el index, que realmente no sirve para nada mas que para saber cual pintar, y la item_key que ira en al json
              return(
                // <MenuItemCore key={index} onClick={()=>this.props.appClick(this.props.cabecera, index)}>{e}</MenuItemCore>
                <Row key={index}  style={{display: "grid"}}>
                  <Button 
                  variant="contained" 
                  className={classes.button} 
                  onClick={()=>this.props.appClick(this.props.cabecera, index, true, element)}>
                    {e}
                  </Button>
                </Row>
              );
            }else{
              return(
                // <MenuItemCore key={index} onClick={()=>this.props.appClick(this.props.cabecera, index, element.item_key)}>{e}</MenuItemCore>
                <Row key={index}  style={{display: "grid"}}>
                  <Button 
                  variant="contained" 
                  className={classes.button} 
                  onClick={()=>this.props.appClick(this.props.cabecera, index, false, element.item_key)}>
                    {e}
                  </Button>
                </Row>
              );
            }
          }));
          return (
            <div>
              <Row>{this.props.currentMenuItem.item_text}</Row>
              {menuItems}
              <Row>
                <Button disabled={!this.props.volverEnabled} variant="contained" color={colorVolver} className={classes.button} onClick={this.volverClick}>
                  Volver
                </Button>
              </Row>
              {/* <Row>
                <button onClick={this.botonClick}>Seleccionar</button>
                <button onClick={this.arribaClick}>Arriba</button>
                <button onClick={this.abajoClick}>Abajo</button>
              </Row> */}
            </div>
          );
        }else{
          return null;
        }
      }
      else if (this.props.cabecera == "Acción"){
        if(this.props.data !== null && this.props.data.payload.data_code === "ACTION_NEW" && this.props.data.payload.screenContent !== undefined){
          let botones = this.props.data.payload.screenContent.keys.map((element, index) => {
            let texto = element.code + ": " + element.text;
            return(
              <Button variant="contained" color="primary" className={classes.button} key={index} 
              onClick={()=>this.props.appClick(this.props.cabecera, index, undefined, this.state.inputTerminal ? this.state.inputTerminal : "0", element.code)}>
                {texto}
              </Button>
            );
          });
          return(
              <div>
                <Row><div>{this.props.data.payload.screenContent.title}</div></Row><br />
                <Row><div>{this.props.data.payload.screenContent.content}</div></Row><br />
                <Row><div>{this.props.data.payload.screenContent.message}</div></Row><br />
                <Row>
                    {/* <input type="text" className="menu-input" name="menu-input" id="menu-input" defaultValue="123"/> */}
                    <TextField
                      hintText="Input terminal"
                      floatingLabelText="Input"
                      id="menu-input"
                      value={this.state.inputTerminal}
                      onChange={(e, value) => this.setState({inputTerminal: value})}
                    /><br />
                </Row>
                <Row>{botones}</Row>
              </div>
          );
        }
      }
      else{
        return null;
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
    this.props.volverClick();
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
      if (this.state.valueinput1 === this.state.valueinput2){
        this.props.appClick(this.props.cabecera, this.state);
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

Principal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Principal);