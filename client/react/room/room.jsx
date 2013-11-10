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
  chooseWinner: function () {
    var categories = this.state.categories
      , winningCatIndex = Math.floor(Math.random() * this.state.categories.length)
      , winningCat = this.state.categories[winningCatIndex]
      , winningRestaurantIndex = Math.floor(Math.random() * winningCat.restaurants.length)
      , winningRestaurant = winningCat.restaurants[winningRestaurantIndex];
    winningCat.wins = true;
    winningRestaurant.wins = true;
    this.setState({
      hasWinner: true
    });
  },
  render: function () {
    return (
      <div id="room">
        <RoomPeople ref="people"
          parent={this} />
        <RoomPane ref="pane"
          parent={this} hasWinner={this.state.hasWinner} />
        <RoomModal ref="modal" 
          parent={this} />
      </div>
    );
  }
});

React.renderComponent(
  <Room url="/realtime" />,
  document.getElementById('room-container')
);
