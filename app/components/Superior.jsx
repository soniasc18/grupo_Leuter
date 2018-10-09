import React from 'react';

export default class Superior extends React.Component {

  render() {
    return (
      <header className="titulo">
        <b>{this.props.cabecera}</b>
      </header>
    );  }

}
