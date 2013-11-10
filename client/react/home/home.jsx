/** @jsx React.DOM */

var Home = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
  },
  handleSubmit: function () {
    var options = {};
    options.name = this.refs.name.getDOMNode().value.trim();
    options.location = this.refs.location.getDOMNode().value.trim();
    if (!options.name || !options.location) {
      return false;
    }
    window.location.href = '/room/new?location=' + options.location + '&name=' + options.name;
    return false;
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label className="control-label">Room Name</label>
        <input type="text" placeholder="What's your office/team name?" ref="name" className="form-control" />
        <label className="control-label">Location</label>
        <input type="text" placeholder="Where are you?" ref="location" className="form-control" />
        <input type="submit" value="Create Room" className="btn btn-primary" />
      </form>
    );
  }
});

React.renderComponent(
  <Home />,
  document.getElementById('new-room')
);
