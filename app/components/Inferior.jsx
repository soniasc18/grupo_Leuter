import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ActionLogout from 'material-ui/svg-icons/action/lock-outline';


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
export default class Inferior extends React.Component {

  constructor(props) {
    super(props);
    this.botonClick = this.botonClick.bind(this);
  }

  render() {
    if(this.props.loggedIn){
      return (
        <RaisedButton
          label="Cerrar sesion"
          secondary={true}
          style={styles.button}
          icon={<ActionLogout />}
          onClick={this.botonClick}
        />
      );
    }else{
      return null;
    } 
  }

    botonClick(){
      this.props.salirClick();
    }
}
