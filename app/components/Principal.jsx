import React from 'react';
import {Row} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import SelectField from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import ActionLogin from '@material-ui/icons/LockOpen'
import ActionStart from '@material-ui/icons/Done';
import ActionCancel from '@material-ui/icons/Cancel';
import ActionSettings from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

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

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Principal extends React.Component {

  constructor(props) {
    super(props);

    let url = new URL(window.location.href);
    let empresaURL = url.searchParams.get("empresa");
    let operarioURL = url.searchParams.get("operario");

    history.replaceState({}, document.title, "/");

    this.state = {
      document: document,
      url: url,
      seleccion: 0,
      newPass1: "",
      newPass2: "",
      almacen: "",
      maquina: "",
      idioma: "",
      empresa: empresaURL ? empresaURL : "",
      operario: operarioURL ? operarioURL : "",
      clave: "", 
      inputTerminal: "",
      actionId: 0,
      showPassword: false,
      focusedElementChange: this.props.focusedElementChange
    }
    this.botonClick = this.botonClick.bind(this);
    this.abajoClick = this.abajoClick.bind(this);
    this.arribaClick = this.arribaClick.bind(this);
    this.volverClick = this.volverClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.botonClick1 = this.botonClick1.bind(this);
    this.botonClick2 = this.botonClick2.bind(this);
    this.handleKeyboardKeyPressed = this.handleKeyboardKeyPressed.bind(this);
    this.handleOnFocus = this.handleOnFocus.bind(this);
  }

  render() {
    const { classes } = this.props;
    const colorVolver = "primary";
    console.log("Cabecera en Principal: -" + this.props.cabecera + "-");
    console.log("isLoading en Principal: -" + this.props.isLoading + "-");

    if(this.state.actionId != this.props.actionId){
      this.setState({inputTerminal: "", actionId: this.props.actionId});
    }
    if(this.props.focusedElementChange.id != this.state.focusedElementChange.id){
      this.setState({
        focusedElementChange: this.props.focusedElementChange,
        [this.props.focusedElementChange.name]: this.props.focusedElementChange.value
      })
    }

    if(this.props.isLoading){
      return (
        <div>
          <CircularProgress size={80} thickness={5} />
          <h3>Cargando...</h3>
        </div>
      );
    }else{    
      if (this.props.cabecera === "Login"){
        return (
          <div> 
            <br />           
            <TextField
              fullWidth
              placeholder="Código de empresa CXXXXXXXXX"
              label="Empresa"
              value={this.state.empresa}
              id="empresa"          
              onChange={this.handleChange}
              inputProps={{
                name: "empresa"
              }}
              onFocus={this.handleOnFocus}
            /><br /><br />
            <TextField
              fullWidth
              placeholder="Usuario"
              label="Nombre del operario"
              value={this.state.operario}
              id="usuario"
              onChange={this.handleChange}
              inputProps={{
                name: "operario"
              }}
              onFocus={this.handleOnFocus}
            /><br /><br />
            {/* <TextField
              hintText="Password"
              floatingLabelText="Password"
              value={this.state.clave}
              id="clave"
              onChange={(e, value) => this.setState({clave: value})}
              type="password"
              autoFocus
            /><br /> */}
            
            <FormControl fullWidth>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="clave"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.clave}
                onChange={this.handleChange}
                autoFocus
                inputProps={{
                  name: "clave"
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={(e, value) => this.setState({showPassword: !this.state.showPassword})}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                onFocus={this.handleOnFocus}
              />
            </FormControl>

            <h5 style={{visibility: !this.props.visible ? "hidden" : "visible"}}>Credenciales incorrectas</h5>
            <Button 
              variant="contained" 
              color="primary" 
              style={styles.button}
              onClick={this.botonClick}>
              <ActionLogin />
              Login
            </Button>
          </div>
        );
      }
      else if (this.props.cabecera === "Cambiar clave"){
        return (
          <div>
            
          <FormControl fullWidth>
            <InputLabel htmlFor="adornment-password">Password</InputLabel>
            <Input
              id="adornment-password"
              type={this.state.showPassword ? 'text' : 'password'}
              value={this.state.newPass1}
              onChange={this.handleChange}
              inputProps={{
                name: 'newPass1'
              }}
              placeholder="Nueva clave"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={(e, value) => this.setState({showPassword: !this.state.showPassword})}
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              onFocus={this.handleOnFocus}
            />
          </FormControl>
            
            <FormControl fullWidth>
              <InputLabel htmlFor="adornment-password">Password</InputLabel>
              <Input
                id="adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.newPass2}
                onChange={this.handleChange}
                inputProps={{
                  name: 'newPass2'
                }}
                placeholder="Repetir clave"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Toggle password visibility"
                      onClick={(e, value) => this.setState({showPassword: !this.state.showPassword})}
                    >
                      {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                onFocus={this.handleOnFocus}
              />
            </FormControl>

    {/*         <TextField
              hintText="Password"
              floatingLabelText="Nueva contraseña"
              value={this.state.newPass1}
              id="Clave"
              onChange={(e, value) => this.setState({newPass1: value})}
              type="password"
              autoFocus
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="Repetir la contraseña"
              value={this.state.newPass2}
              id="NewClave"
              onChange={(e, value) => this.setState({newPass2: value})}
              type="password"
            /><br /> */}

            {/* <RaisedButton
              label="Guardar"
              primary={true}
              style={styles.button}
              icon={<ActionSettings />}
              onClick={this.botonClick}
            /> */}
            <Button 
              variant="contained" 
              color="primary" 
              style={styles.button}
              onClick={this.botonClick}>
              <ActionSettings />
              Guardar
            </Button>
          </div>
        );
      }
      else if (this.props.cabecera === "¿Cerrar sesión existente?"){
        const actions = [
          <Button 
            key="1"
            variant="contained" 
            color="primary" 
            style={styles.button}
            onClick={this.botonClick1}>
            <ActionStart />
            Sí, iniciar nueva sesión
          </Button>,
          <Button 
            key="2"
            variant="contained" 
            color="secondary" 
            style={styles.button}
            onClick={this.botonClick2}>
            <ActionCancel />
            No, cambiar de usuario
          </Button>
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
              modal="true"
              open={true}>
              Ya hay una sesión iniciada con ese usuario, ¿quieres cerrar su sesión e iniciar una nueva?
            </Dialog>

            <Dialog
              open={true}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"Iniciar sesión de todas formas"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Ya hay una sesión iniciada con ese usuario, ¿quieres cerrar su sesión e iniciar una nueva?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                {actions}
              </DialogActions>
            </Dialog>
          </div>
        );
      }
      else if (this.props.cabecera === "Inicio sesión"){
        console.log("state.maquina: -" + this.state.maquina + "-");
        console.log("state.almacen: -" + this.state.almacen + "-");
        console.log("state.idioma: -" + this.state.idioma + "-");
        while(this.props.data !== null && this.props.data.payload.loginFields.warehouses !== undefined){
          let warehouses = this.props.data.payload.loginFields.warehouses.map((element, index) => {
            return(
              <MenuItem value={element} key={element}>{element}</MenuItem>
            );
          });
          let machines = this.props.data.payload.loginFields.machines.map((element, index) => {
            return(
              //<option key={index}>{element}</option>
              <MenuItem value={element} key={element}>{element}</MenuItem>
            );
          });
          let languages = this.props.data.payload.loginFields.languages.map((element, index) => {
            return(
              <MenuItem value={element} key={element}>{element}</MenuItem>
            );
          });
          return (
            <div>
              <div>                
                <FormControl fullWidth>
                  <InputLabel>Almacén</InputLabel>
                  <SelectField
                    value={this.state.almacen}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'almacen',
                      id: 'almacen',
                    }}
                  >
                      <MenuItem value="" disabled>
                        Elegir un almacén
                      </MenuItem>
                      {warehouses}
                  </SelectField>
                </FormControl>
              </div><br />
              <div>                
                <FormControl fullWidth>
                  <InputLabel>Máquina</InputLabel>
                  <SelectField
                    value={this.state.maquina}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'maquina',
                      id: 'maquina',
                    }}
                  >
                      {machines}
                  </SelectField>
                </FormControl>
              </div><br />
              <div>                
                <FormControl fullWidth>
                  <InputLabel>Idioma</InputLabel>
                  <SelectField
                    value={this.state.idioma}
                    onChange={this.handleChange}
                    inputProps={{
                      name: 'idioma',
                      id: 'idioma',
                    }}
                  >
                      {languages}
                  </SelectField>
                </FormControl>
              </div><br />
              {/*<div><SelectField
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
               <select id="idioma">{languages}</select> 
              </div>
              <RaisedButton
                label="Comenzar"
                primary={true}
                style={styles.button}
                icon={<ActionStart />}
                onClick={this.botonClick}
              />*/}
              <Button 
                variant="contained" 
                color="primary" 
                style={styles.button}
                onClick={this.botonClick}>
                <ActionStart />
                Comenzar
              </Button>
            </div>
          );
        }
        return null;
      }
      else if (this.props.cabecera === "Menú"){
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
      else if (this.props.cabecera === "Acción"){
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
                      placeholder="Input terminal"
                      label="Input"
                      id="menu-input"
                      value={this.state.inputTerminal}
                      onChange={this.handleChange}
                      inputProps={{
                        name: "inputTerminal"
                      }}
                      onFocus={this.handleOnFocus}
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

  handleChange = (event) => {
    console.log("handleChange: " + event.target + "->" + event.target.value);
    console.log("target",event.target.name);
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleOnFocus(){
    if(document.activeElement){
      this.props.lastFocusedElement(document.activeElement);
    }
  }

  botonClick(){
    if(this.props.cabecera === "Login"){
      if(this.state.empresa === "" || this.state.operario === "" || this.state.clave === ""){
        window.alert("Rellena todo el formulario")
      }
      else{
        this.props.appClick(this.props.cabecera, this.state);
      }
    }
    else if (this.props.cabecera === "Inicio sesión"){
      this.props.appClick(this.props.cabecera, this.state);
    }
    else if(this.props.cabecera === "Cambiar clave"){
      if (this.state.newPass1 === this.state.newPass2){
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
  handleKeyboardKeyPressed = button =>{
    console.log("Button pressed en Principal:", button);
  }
}

Principal.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Principal);