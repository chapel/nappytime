/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {location: {}, categories: []};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    var self = this;
    room.createRoom({location: roomLocation || 'mountain view'}, function (err, res) {
      self.setState({location: res.location, categories: res.categories});
    });
  },
  getModal: function () {
    return this.refs.modal;
  },
  render: function () {
    return (
      <div id="room">
        <RoomPeople />
        <RoomPane categories={this.state.categories} getModal={this.getModal}/>
        <RoomModal ref="modal" />
      </div>
    );
  }
});

React.renderComponent(
  <Room url="/realtime" />,
  document.getElementById('room-container')
);
