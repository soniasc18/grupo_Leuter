import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class Superior extends React.Component {

  render() {
    const styles = {
      title: {
        cursor: 'pointer',
      },
    };
    return (
      <header className="titulo">
        {/*<b>{this.props.cabecera}</b>*/}        
        <AppBar
          title={<span style={styles.title}>{this.props.cabecera}</span>}
        />
      </header>
    );  }

}
