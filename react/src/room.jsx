/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
  },
  render: function () {
    return (
      <div id="room">
        <RoomPeople />
        <RoomPane />
        <RoomModal />
      </div>
    );
  }
});

React.renderComponent(
  <Room url="/realtime" />,
  document.getElementById('room-container')
);