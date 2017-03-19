import React, { Component } from 'react';
import { connect } from 'react-redux'

import Widget from '../widget/Widget';

import { fetchTab, saveTabLayout } from '../actions'
import { getTabWidgets } from '../reducers'

class Tabs extends Component {
  
  constructor(props) {
    super(props);
    this.onMove = this.onMove.bind(this);
  }

  componentDidMount() {
      this.props.fetchTabData(this.props.params.tabId);
  }

  componentDidUpdate(prevProps) {
    let prevId = prevProps.params ? prevProps.params.tabId : null;
    let currentId = this.props.params ? this.props.params.tabId : null;
    
    if(currentId !== prevId && currentId) {
      this.props.fetchTabData(this.props.params.tabId);
    }
  }

  onMove(tabId, widgetId, direction) {
    const widgets = this.props.widgets(this.props.params.tabId) || [[],[],[],[]];

    this.props.requestMove(widgets, tabId, widgetId, direction)
  }
  
  render() {
    const widgets = this.props.widgets(this.props.params.tabId) || [[],[],[],[]];

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6">
            <div className="row">
              <div className="col-lg-6">{
                widgets[0].map(widget => (
                  <Widget key={widget.id} id={widget.id} tabId={this.props.params.tabId} widgetType={widget.widgetType} config={widget.config} requestMove={this.onMove} />
                ))
              }</div>
              <div className="col-lg-6">{
                widgets[1].map(widget => (
                  <Widget key={widget.id} id={widget.id} tabId={this.props.params.tabId} widgetType={widget.widgetType} config={widget.config} requestMove={this.onMove} />
                ))
              }</div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-lg-6">{
                widgets[2].map(widget => (
                  <Widget key={widget.id} id={widget.id} tabId={this.props.params.tabId} widgetType={widget.widgetType} config={widget.config} requestMove={this.onMove} />
                ))
              }</div>
              <div className="col-lg-6">{
                widgets[3].map(widget => (
                  <Widget key={widget.id} id={widget.id} tabId={this.props.params.tabId} widgetType={widget.widgetType} config={widget.config} requestMove={this.onMove} />
                ))
              }</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  widgets : (tabId) => getTabWidgets(state, tabId),
});

const mapDispatchToProps = (dispatch) => ({
  fetchTabData : (tabId) => { dispatch(fetchTab(tabId)) },
  requestMove : (widgets, tabId, widgetId, direction) =>{

    var layout = widgets.map((c) => c.map((w) => w.id))

    let foundCol = undefined
    let foundIdx = undefined
    for(let col=0; col<layout.length && !foundCol; col++) {
      for(let w=0; w<layout[col].length && !foundIdx; w++) {
        if(layout[col][w] == widgetId) {
          foundCol = col
          foundIdx = w
        }
      }
    }
    if(foundIdx !== undefined && foundCol !== undefined)
    {
      layout[foundCol].splice(foundIdx,1)

      switch(direction) {
        case "UP":
        {
          layout[foundCol].splice(foundIdx-1,0,widgetId)
          break;
        }
        case "DOWN":
        {
          layout[foundCol].splice(foundIdx+1,0,widgetId)
          break;
        }
        case "LEFT":
        {
          layout[foundCol-1].push(widgetId)
          break;
        }
        case "RIGHT":
        {
          layout[foundCol+1].push(widgetId)
          break;
        }
      }
      
      dispatch(saveTabLayout(tabId, layout))
    }
  }
});

Tabs = connect(mapStateToProps,mapDispatchToProps)(Tabs)
export default Tabs;