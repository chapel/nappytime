/** @jsx React.DOM */

var Home = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    if (Modernizr.geolocation) {
      this.state.canGeo = true;
    }
  },
  getLocation: function () {
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log(pos)
      });
    }
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
    var buttonClass = 'btn btn-default';
    if (!this.state.canGeo) {
      buttonClass += ' disabled';
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <label className="control-label">Nickname</label>
        <input type="text" placeholder="What's your nickname?" ref="name" className="form-control" />
        <label className="control-label">Room Name</label>
        <input type="text" placeholder="What's your office/team name?" ref="roomname" className="form-control" />
        <label className="control-label">Location</label>
        <div className="input-group">
          <input type="text" placeholder="Where are you?" ref="location" className="form-control" />
          <span className="input-group-btn">
            <button onClick={this.getLocation} className={buttonClass} type="button"><span className="glyphicon glyphicon-map-marker" alt="Get Location"></span></button>
          </span>
        </div>
        <input type="submit" value="Create Room" className="btn btn-primary" />
      </form>
    );
  }
});

React.renderComponent(
  <Home />,
  document.getElementById('new-room')
);
