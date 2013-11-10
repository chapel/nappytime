/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {location: {}, categories: [], people: [], me: {}};
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    var self = this;
    room.createRoom({location: roomLocation || 'mountain view'}, function (err, res) {
      self.setState({
        location: res.location, 
        categories: res.categories, 
        people: [
          { name: 'Alice', id: '123', state: 'waiting' },
          { name: 'Bob', id: '456', state: 'finished' },
          { name: 'Charlie', id: '789', state: 'finished' }
        ],
        me: {
          name: 'Alice',
          isCreator: true
        }
      });
    });
  },
  getModal: function () {
    return this.refs.modal;
  },
  render: function () {
    return (
      <div id="room">
        <RoomPeople people={this.state.people} me={this.state.me} />
        <RoomPane categories={this.state.categories} 
          me={this.state.me}
          getModal={this.getModal}/>
        <RoomModal ref="modal" />
      </div>
    );
  }
});

React.renderComponent(
  <Room url="/realtime" />,
  document.getElementById('room-container')
);
