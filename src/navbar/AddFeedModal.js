import React, { Component } from 'react';

class AddFeedModal extends Component {
  constructor(props) {
    super(props);
    this.handleAddFeedSubmit = this.handleAddFeedSubmit.bind(this);
    this.handleAddFeedClick = this.handleAddFeedClick.bind(this);
  }

  handleAddFeedSubmit(event) {
    const tabId = this.props.tabId ? this.props.tabId : null;
    this.props.onAddFeedClick(event, tabId, this.inputAddFeedUrl.value);
    event.preventDefault();
  }

  handleAddFeedClick(event) {
    const tabId = this.props.tabId ? this.props.tabId : null;
    this.props.onAddFeedClick(event, tabId, this.inputAddFeedUrl.value);
  }

  render() {        
    return (
        <div className="modal fade" id="addFeedModal" tabIndex="-1" role="dialog" aria-labelledby="addFeedModalTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addFeedModalTitle"><i className="fa fa-rss fa-fw"></i> Add feed</h5>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleAddFeedClick}>
                  <div className="form-group">
                    <label htmlFor="inputURL">Feed URL</label>
                    <input type="text" className="form-control" id="inputURL" placeholder="URL" autoFocus ref={(input) => this.inputAddFeedUrl = input} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <div className="btn-group" role="group" aria-label="Actions">
                  <button type="button" className="btn btn-primary" onClick={this.handleAddFeedClick} data-dismiss="modal">OK</button>
                  <button type="button" className="btn btn-warning" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}

export default AddFeedModal;