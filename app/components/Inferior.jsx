import React from 'react';

export default class Inferior extends React.Component {

  constructor(props) {
    super(props);
    this.botonClick = this.botonClick.bind(this);
  }

  render() {
    return (
      <button onClick={this.botonClick}>F8: Salir</button>
    );  }

    botonClick(){
      this.props.salirClick();
    }
}
