/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'

class ModalImage extends Component {
  render() {
    if (this.props.isOpen === false) {
      return null;
    }
    
    return(
      <div isOpen={this.props.isOpen} className="modal" onClick={this.props.onClick} name={this.props.name}>
        <div className="modal__body">
          <header className="modal__title">{this.props.title}</header>
          <img src={this.props.src} alt={this.props.alt}/>
          <a className="modal__close" href="#" onClick={this.props.onClick}>
            <span className="fa fa-times"></span>
          </a>
        </div>
      </div>
    )
  }
};

export default ModalImage;

