import React, { Component } from 'react';
import { connect } from 'react-redux'

import Settings from '../widget/Settings';
import Feed from '../widget/Feed';

import { fetchFeedItems, readFeedItems, saveWidgetConfig } from '../actions'
import { getUserId, getFeedItems } from '../reducers'

class Widget extends Component {

  constructor(props) {
    super(props);

    this.state = {page: 0, settings: false};

    this.nextClick = this.nextClick.bind(this);
    this.previousClick = this.previousClick.bind(this);
    this.settingsClick = this.settingsClick.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onMarkAllRead = this.onMarkAllRead.bind(this);
    this.onSettingsSave = this.onSettingsSave.bind(this);
  }

  previousClick(e) {
    e.preventDefault();
    this.setState(function(previousState, currentProps) {
      return {page: previousState.page - 1};
    });
  }
  nextClick(e) {
    e.preventDefault();
    this.setState(function(previousState, currentProps) {
      return {page: previousState.page + 1};
    });
  }
  settingsClick(e) {
    e.preventDefault();
    this.setState(function(previousState, currentProps) {
      return {settings: !previousState.settings};
    });
  }
  
  componentDidMount() {
    this.props.fetchWidgetData(this.props.widgetType, this.props.config, this.props.userId);
  }

  onRefresh(e) {
    this.props.fetchWidgetData(this.props.widgetType, this.props.config, this.props.userId);
  }

  onMarkAllRead(e) {
    const itemGuids = this.props.items.map(item => item.guid);
    this.props.onMarkRead(this.props.widgetType, this.props.userId, itemGuids);
  }

  onSettingsSave(e, newTitle, newDisplayCount) {
    this.setState(function(previousState, currentProps) {
      return {settings: false};
    });
    this.props.onSettingsSave(e, newTitle, newDisplayCount);
  }
  
  render() {
    const widgetType = this.props.widgetType;
    const title = this.props.config.title;
    const link = this.props.config.link;

    const items = this.props.items || [];
    const page=this.state.page;
    const settings=this.state.settings;
    
    let unreadCount = 0;
    items.forEach(item => {
      if(!item.read) { unreadCount++;}
    });
    const allowMarkAllRead = (unreadCount>0) && (widgetType === "feed");

    const pageSize=this.props.config.display_count || 5;
    
    const hasItemsBefore = (page>0);
    const hasItemsAfter = items.length > (page+1)*pageSize;

    const displayedItems = items.slice(page*pageSize, (page+1)*pageSize)

    return (
      <div className="card">
        <div className="card-header">
          {link ? <a href="{link}" target="_blank">{title}</a> : <span>{title}</span>}
          <div className="pull-right">
            {unreadCount>0 ? <span className="tag tag-default">{unreadCount}</span> : null}  {' '}
            <div className="btn-group btn-group-sm" role="group" aria-label="Actions">
              {allowMarkAllRead ? <button type="button" className="btn btn-secondary" onClick={this.onMarkAllRead} ><span className="fa fa-envelope-open-o" aria-hidden="true"></span></button> : null }
              {widgetType === "feed" ? <button type="button" className="btn btn-secondary" onClick={this.onRefresh} ><span className="fa fa-refresh" aria-hidden="true"></span></button> : null }
              <button type="button" className="btn btn-secondary" onClick={this.settingsClick} ><span className="fa fa-cog" aria-hidden="true"></span></button>
            </div>
          </div>
        </div>
        {settings ? <Settings config={this.props.config} onSave={this.onSettingsSave}/>:
        <div>
        {widgetType === "feed" ? <Feed items={displayedItems} onItemClick={(e, guid) => this.props.onFeedItemClick(e, guid, this.props.userId)} /> : null }
        { hasItemsBefore || hasItemsAfter ? <div className="card-footer clearfix">
          { hasItemsBefore ? <a href="#" onClick={this.previousClick} className="card-link pull-left"><span className="fa fa-angle-double-left" aria-hidden="true"></span> Previous</a> : null }
          { hasItemsAfter ? <a href="#" onClick={this.nextClick} className="card-link pull-right">Next <span className="fa fa-angle-double-right" aria-hidden="true"></span></a> : null }
        </div> : null }
        </div>
        }
    </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  let items = [];
  const userId = getUserId(state);
  
  switch(ownProps.widgetType) {
    case "feed":
      items = getFeedItems(state, userId, ownProps.config.feed_id)
  }

  return {
    items,
    userId,
  }
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchWidgetData : (widgetType, config, userId) => { 
    switch(widgetType) {
      case "feed":
        dispatch(fetchFeedItems(userId, config.feed_id))
    }
  },
  onFeedItemClick : (event, guid, userId) => {
    dispatch(readFeedItems(userId, ownProps.config.feed_id, [guid]))
  },
  onMarkRead : (event, userId, itemGuids) => {
    dispatch(readFeedItems(userId, ownProps.config.feed_id, itemGuids))
  },
  onSettingsSave: (event, newTitle, newDisplayCount) => {
    console.log("onSettingsSave", ownProps)
    dispatch(saveWidgetConfig(ownProps.tabId, ownProps.id, {
      title: newTitle,
      display_count: parseInt(newDisplayCount,10),
    }))
  }
});

Widget = connect(mapStateToProps,mapDispatchToProps)(Widget)
export default Widget;