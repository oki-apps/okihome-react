import React, { Component } from 'react';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {title: props.config.title, count: props.config.display_count};

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCountChange = this.handleCountChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }
  handleCountChange(event) {
    this.setState({count: event.target.value});
  }

  handleSave(event) {
    this.props.onSave(event, this.state.title, this.state.count);
  }
  
  render() {

    return (
        <div className="card-block">
          <div className="form-group">
            <label htmlFor="inputTitle">Title</label>
            <input type="text" className="form-control" id="inputTitle" value={this.state.title} onChange={this.handleTitleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="inputCount">Items count</label>
            <input type="number" className="form-control" id="inputCount" value={this.state.count} onChange={this.handleCountChange} />
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.handleSave}>Save</button>
        </div>
    );
  }
}

export default Settings;