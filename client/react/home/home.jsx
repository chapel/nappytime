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
    var self = this;
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var locationDom = self.refs.location.getDOMNode();
        locationDom.value = 'Latitude: ' + pos.coords.latitude + ', Longitude: ' + pos.coords.longitude;
        self.state.coords = pos.coords;
      });
    }
  },
  handleSubmit: function () {
    var options = {};
    options.name = this.refs.roomname.getDOMNode().value.trim();
    options.location = this.refs.location.getDOMNode().value.trim();
    options.coords = this.state.coords;
    var name = this.refs.name.getDOMNode().value.trim() || 'Anonymous';
    store.set('name', name);
    if (!options.name || (!options.location || !options.coords)) {
      return false;
    }
    var name = 'name=' + options.name;
    var location;
    if (options.coords) {
      location = 'lat=' + options.coords.latitude + '&lng=' + options.coords.longitude;
    } else {
      location = 'location=' + options.location;
    }
    window.location.href = '/room/new?' + location + '&' + name;
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
        <input type="text" value={store.get('name')} placeholder="What's your nickname?" ref="name" className="form-control" />
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
