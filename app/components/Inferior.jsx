import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RaisedButton from 'material-ui/RaisedButton';
import LogoutIcon from '@material-ui/icons/Lock';
import KeyboardIcon from '@material-ui/icons/Keyboard';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import Dock from 'react-dock';



const styles = theme => ({
  root: {
    width: 500,
  },
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
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  fabTop: {
    position: 'absolute',
    top: theme.spacing.unit * 8,
    right: theme.spacing.unit * 2,
  },
  fabButton:{
    marginLeft: theme.spacing.unit
  },
  keyboard:{
    position: "fixed",
    bottom: "0px"
  }
});
class Inferior extends React.Component {

  constructor(props) {
    super(props);
    this.botonClick = this.botonClick.bind(this);
    this.toggleKeyboard = this.toggleKeyboard.bind(this);
    this.state = {
      showKeyboard: false
    }
  }

  render() {
    const { classes } = this.props;
    const fab =
      {
        color: 'secondary',
        className: this.state.showKeyboard ? classes.fabTop : classes.fab,
        icon: <LogoutIcon />,
      };
    const toggle =
      {
        color: 'primary',
        className: this.state.showKeyboard ? classes.fabTop : classes.fab,
        icon: <KeyboardIcon />,
      };
    
    let toggleKeyboardTooltip = this.state.showKeyboard ? "Ocultar" : "Mostrar" + " teclado";
    let keyboardButton = 
      <Tooltip title={toggleKeyboardTooltip} placement={this.state.showKeyboard ? "bottom" : "top"}>
          <Button variant="fab" onClick={this.toggleKeyboard} className={classes.fabButton} color={toggle.color}>
            {toggle.icon}
          </Button>
      </Tooltip>;
    let keyboardWrapper = 
      <Dock position='bottom' isVisible={this.state.showKeyboard} dimMode='none'>
        <Keyboard
          style={styles.keyboard}
          ref={r => (this.keyboard = r)}
          onChange={input => this.onChange(input)}
          onKeyPress={button => this.onKeyPress(button)}
        />
      </Dock>;
    let logoutButton = 
      <Tooltip title="Cerrar sesión" placement={this.state.showKeyboard ? "bottom" : "top"}>
          <Button variant="fab" onClick={this.botonClick} className={classes.fabButton} color={fab.color}>
            {fab.icon}
          </Button>
      </Tooltip>;

    if(this.props.loggedIn){
      return (
        <div>
          <div className={fab.className}>
            {keyboardButton}
            {logoutButton}
          </div>
          {keyboardWrapper}
        </div>
      );
    }else{
      return ( 
        <div>
        <div className={fab.className}>
          {keyboardButton}
        </div>
          {keyboardWrapper}
        </div>
      );
    } 
  }

  botonClick(){
    this.props.salirClick();
  }

  toggleKeyboard(){
    this.setState({
      showKeyboard: !this.state.showKeyboard
    });
  }
}

Inferior.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Inferior);
