import React from 'react';
import AppBar from '@material-ui/Core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

export default class Superior extends React.Component {

  render() {
    const styles = {
      title: {
        cursor: 'pointer',
      },
      header: {
        padding: "10px",
        textAlign: "center",
        position: "fixed",
        top: "0",
        left: "0"
      }
    };
    return (
      <header className="titulo">
        {/*<b>{this.props.cabecera}</b>*/}     
        <AppBar position="static" justify="center" style={styles.header}>
            <Typography variant="h6" color="inherit">
              <span style={styles.title}>{this.props.cabecera}</span>
            </Typography>
        </AppBar>   
      </header>
    );  }

}
