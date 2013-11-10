/** @jsx React.DOM */

var RoomPeople = require('./room-people.jsx')
  , RoomPane = require('./room-pane.jsx')
  , RoomModal = require('./room-modal.jsx')
  , room = require('realtime/room');

var Room = module.exports = React.createClass({
  getInitialState: function () {
    return {location: {}, categories: [], people: [], me: {name: store.get('name') || 'Anonymous'}};
  },
  componentWillMount: function() {
    var self = this;
    this.load();
    room.onJoined(function (res) {
      self.setState({people: res.current});
    });
    room.onLeft(function (res) {
      self.setState({people: res.current});
    });
  },
  load: function () {
    var self = this;
    room.createRoom({location: roomLocation || 'mountain view', name: roomName}, function (err, res) {
      self.setState({
        location: res.location,
        categories: res.categories,
        roomId: res.room,
        isNew: res.state === 'new'
      });
      room.joinRoom({room: res.room, name: self.state.me.name}, function (err, res) {
        self.setState({
          people: res.current, 
          me: res.me
        });
      });
    });
  },
  saveRoom: function () {
    // serialize for saving
    var serialized = {};
    serialized.location = this.state.location;
    serialized.creator = this.state.me;
    serialized.roomId = this.state.roomId;
    serialized.categories = [];
    this.state.categories.forEach(function (cat) {
      var restaurants = [];
      for (var i = 0; i < cat.restaurants.length; i++) {
        if (cat.restaurants[i].chosen) {
          restaurants.push(cat.restaurants[i]);
        }
      }
      if (restaurants.length) {
        serialized.categories.push({
          name: cat.name,
          restaurants: restaurants
        })
      }
    });
    room.saveRoom(serialized, function (err, res) {
      console.log(arguments);
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
    var roomClass = "";
    if (this.state.isNew) {
      roomClass += " is-new";
    }
    return (
      <div id="room" className={roomClass}>
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
