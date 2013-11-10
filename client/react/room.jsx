/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState(this.props.res);
  },
  render: function () {
    return (
      <div id="room">
        <RoomPeople />
        <RoomPane categories={this.state.categories}/>
        <RoomModal />
      </div>
    );
  }
});

room.createRoom({location: 'mountain view'}, function (err, res) {
  React.renderComponent(
    <Room url="/realtime" res={res} />,
    document.getElementById('room-container')
  );
});