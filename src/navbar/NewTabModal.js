import React, { Component } from 'react';

class NewTabModal extends Component {
  constructor(props) {
    super(props);
    this.handleNewTabSubmit = this.handleNewTabSubmit.bind(this);
    this.handleNewTabClick = this.handleNewTabClick.bind(this);
  }

  handleNewTabSubmit(event) {
    this.props.onNewTabClick(event, this.inputNewTabTitle.value);
    event.preventDefault();
  }

  handleNewTabClick(event) {
    this.props.onNewTabClick(event, this.inputNewTabTitle.value);
  }

  render() {        
    return (
        <div className="modal fade" id="newTabModal" tabIndex="-1" role="dialog" aria-labelledby="newTabModalTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="newTabModalTitle"><i className="fa fa-plus-circle fa-fw"></i> New tab</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleNewTabClick}>
                  <div className="form-group">
                    <label htmlFor="inputTitle">Title</label>
                    <input type="text" className="form-control" id="inputTitle" placeholder="Tab title" autoFocus ref={(input) => this.inputNewTabTitle = input} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="btn-group" role="group" aria-label="Actions">
                  <button type="button" className="btn btn-primary" onClick={this.handleNewTabClick} data-dismiss="modal">OK</button>
                  <button type="button" className="btn btn-warning" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default NewTabModal;