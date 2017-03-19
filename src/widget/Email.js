import React, { Component } from 'react';

import TimeAgo from 'react-timeago'

class Email extends Component {
  
  render() {

    const items = this.props.items || [];

    return (
      <table className="table table-sm">
        <tbody>
        {
            items.map(item =>
                <tr key={item.guid}>
                    <td>
                        <a href={item.link} className={ item.read ? "" : "unread"} onClick={(e) => this.props.onItemClick(e, item.guid)}>{item.from} - {item.title}</a>
                        {' '}<small><TimeAgo date={item.published} /></small>
                    </td>
                </tr>
            )
        }
        </tbody>
      </table>
    );
  }
}

export default Email;