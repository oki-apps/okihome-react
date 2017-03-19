import React, { Component } from 'react';
import { connect } from 'react-redux'

import Settings from '../widget/Settings';
import Feed from '../widget/Feed';
import Email from '../widget/Email';

import { fetchFeedItems, fetchEmailItems, readFeedItems, saveWidgetConfig, deleteWidget } from '../actions'
import { getUserId, getFeedItems, getEmailItems } from '../reducers'

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
    this.onDelete = this.onDelete.bind(this);
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

  onDelete(e) {
    this.props.onDelete(e);
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
              <button type="button" className="btn btn-secondary" onClick={this.onRefresh} ><span className="fa fa-refresh" aria-hidden="true"></span></button>
              <button type="button" className="btn btn-secondary" onClick={this.settingsClick} ><span className="fa fa-cog" aria-hidden="true"></span></button>
              <button type="button" className="btn btn-secondary" onClick={this.onDelete} ><span className="fa fa-trash" aria-hidden="true"></span></button>
            </div>
          </div>
        </div>
        {settings ? <Settings config={this.props.config} onSave={this.onSettingsSave}/>:
        <div>
        {widgetType === "feed" ? <Feed items={displayedItems} onItemClick={(e, guid) => this.props.onFeedItemClick(e, guid, this.props.userId)} /> : null }
        {widgetType === "email" ? <Email items={displayedItems} /> : null }
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
      break
    case "email":
      items = getEmailItems(state, userId, ownProps.config.account_id)
      break
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
        break
      case "email":
        dispatch(fetchEmailItems(userId, config.account_id))
        break
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
  },
  onDelete: (event) => {
    console.log("onDelete", ownProps)
    dispatch(deleteWidget(ownProps.tabId, ownProps.id))
  }
});

Widget = connect(mapStateToProps,mapDispatchToProps)(Widget)
export default Widget;