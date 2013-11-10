;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
var RoomCountdown = require('./room-countdown.jsx');

var RoomModal = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentDidMount: function() {
    var self = this
      , onCountdown = function onCountdown(countVal) {
          self.setState({
            countdown: countVal
          });
          setTimeout(function () {
            if (countVal > 1) {
              onCountdown(countVal - 1);
            } else {
              self.props.onFinish();
            }
          }, 1000);
        };
    onCountdown(this.props.countdown);
  },
  renderCountdown: function () {
    var min = (this.state.countdown / 60) | 0
      , sec = (this.state.countdown % 60);
    return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
  },
  render: function () {
    return (
      React.DOM.h2(null, "Picking a winner in ", this.renderCountdown())
    );
  }
});
},{"./room-countdown.jsx":1}],2:[function(require,module,exports){
/** @jsx React.DOM */
var RoomCountdown = require('./room-countdown.jsx')

var RoomModal = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  // The following two methods are the only places we need to
  // integrate with Bootstrap or jQuery!
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(this.getDOMNode())
      .modal({backdrop: 'static', keyboard: false, show: false});
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('hidden');
  },
  close: function() {
    $(this.getDOMNode()).modal('hide');
  },
  open: function() {
    $(this.getDOMNode()).modal('show');
  },
  startCountdown: function () {
    this.setState({
      mode: 'countdown'
    });
    this.open();
  },
  afterCountdown: function () {
    this.close();
    this.props.parent.chooseWinner();
  },
  renderBody: function () {
    if (this.state.mode === 'countdown') {
      return (
        RoomCountdown( {countdown:1, onFinish:this.afterCountdown} )
      );
    }
  },
  render: function () {
    return (
      React.DOM.div( {className:"modal fade"}, 
        React.DOM.div( {className:"modal-dialog"}, 
          React.DOM.div( {className:"modal-content"}, 
            this.renderBody()
          )
        )
      )
    );
  }
});
},{"./room-countdown.jsx":1}],3:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPaneRestaurant = require('./room-pane-restaurant.jsx');

var RoomPaneCategory = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  doesCatHaveChosen: function () {
    var restaurants = this.props.data.restaurants;
    var hasChosen = false;
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.doesCatHaveChosen(), this.props.index);
    return false;
  },
  renderLabel: function () {
    if (this.props.mode === 'frozen' && this.props.data.veto) {
      return (
        React.DOM.span( {className:"label label-danger"}, "Vetoed!")
      );
    }
  },
  render: function () {
    var cat = this.props.data
      , name = cat.name
      , restaurants = cat.restaurants;
    var catClass = "list-group-item room-cat";
    if (this.doesCatHaveChosen()) {
      catClass += " chosen";
    } else {
      catClass += " not-chosen";
    }
    if (cat.wins) {
      catClass += " winner";
    }
    var rendered = restaurants
    .map(function (eat, index) {
      return RoomPaneRestaurant( 
                {data:eat, 
                index:index, 
                parentIndex:this.props.index, 
                mode:this.props.mode,
                choose:this.props.choose} );
    }, this);
    return (
      React.DOM.li( {className:catClass, onClick:this.onToggle}, 
        React.DOM.h4(null, name, this.renderLabel()),
        React.DOM.ul( {className:"list-group"}, 
          rendered
        )
      )
    );
  }
});
},{"./room-pane-restaurant.jsx":4}],4:[function(require,module,exports){
/** @jsx React.DOM */
var RoomRestaurantDetails = require('./room-restaurant-details.jsx');

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  onToggle: function (ev) {
    ev.preventDefault();
    this.props.choose(!this.props.data.chosen, this.props.parentIndex, this.props.index);
    return false;
  },
  renderLabel: function () {
    if (this.props.mode === 'frozen' && this.props.data.roundChosen) {
      return (
        React.DOM.span( {className:"label label-success"}, "Chosen!")
      );
    }
  },
  render: function () {
    var eat = this.props.data
      , eatClass = "list-group-item room-rest";
    if (eat.chosen) {
      eatClass += " chosen";
    } else {
      eatClass += " not-chosen";
    }
    if (eat.wins) {
      eatClass += " winner";
    }
    return (
      React.DOM.li( {className:eatClass, onClick:this.onToggle}, 
        React.DOM.div( {className:"restaurant-details-wrapper"}, 
          React.DOM.span( {className:"small"}, eat.name, this.renderLabel()),
          RoomRestaurantDetails( {data:eat} )
        )
      )
    );
  }
});
},{"./room-restaurant-details.jsx":7}],5:[function(require,module,exports){
/** @jsx React.DOM */

var RoomPaneCategory = require('./room-pane-category.jsx');

var RoomPane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'frozen'
    };
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState({
      mode: this.getFrozenState()
    });
  },
  getFrozenState: function () {
    if (!this.isAnyCatChosen()) {
      return 'needChoice';
    } else {
      return 'frozen';
    }
  },
  initDone: function () {
    if (this.props.parent.state.isNew) {
      this.props.parent.saveRoom();
    } else {
      this.props.parent.submitChoices();
      this.props.parent.refs.modal.startCountdown();
    }
  },
  toggleMode: function () {
    this.setState({
      mode: (this.getMode() === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  getMode: function () {
    var mode = "";
    if (this.props.hasWinner) {
      mode = 'winner';
    } else if (this.state.mode === 'edit') {
      mode = this.state.mode;
    } else {
      mode = this.getFrozenState();
    }
    return mode;
  },
  getCategories: function () {
    return this.props.parent.state.categories;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.getMode() === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.restaurants.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    } else if (this.getMode() === 'frozen') {
      // do nothing if in new mode
      if (this.props.parent.state.isNew) {
        return false;
      }
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.getCategories()[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.getCategories()[categoryIndex].restaurants[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.getCategories()[ij[0]].restaurants[ij[1]].roundChosen;
        }
        if (toggleEat.roundChosen) {
          this.setState({ roundChosen: [categoryIndex, restaurantIndex] });
        } else {
          this.setState({ roundChosen: null });
        }
      }
    }
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.restaurants.length; i++) {
      if (cat.restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  isAnyCatChosen: function () {
    var hasChosen = false;
    for (var i = 0; i < this.getCategories().length; i++) {
      var cat = this.getCategories()[i];
      if (this.doesCatHaveChosen(cat)) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    var rendered = this.getCategories()
    .map(function (cat, index) {
      return RoomPaneCategory( 
                {data:cat, 
                index:index, 
                mode:this.getMode(), 
                choose:this.clickChosen} );
    }, this);
    return (
      React.DOM.ul( {className:"list-group"}, 
        rendered
      )
    );
            
  },
  renderButtonEdit: function () {
    var buttonMessage = 'Edit';
    if (this.getMode() === 'edit') {
      buttonMessage = 'Close';
    }
    return (
      React.DOM.button( {type:"button", className:"btn-edit pull-right btn btn-default", onClick:this.toggleMode}, 
        buttonMessage
      )
    );
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    if (this.getMode() === 'frozen') {
      return (
        React.DOM.div( {className:"room-info pull-right"}, 
          React.DOM.div(null, React.DOM.span( {className:"badge"}, vetoes), " vetoed"),
          React.DOM.div(null, React.DOM.span( {className:"badge"}, roundChosen), " chosen")
        )
      );
    }
  },
  renderCallToAction: function () {
    if (this.props.hasWinner) {
      return (
        React.DOM.h4(null, "And the winner is...")
      );
    } else if (this.getMode() === 'needChoice') {
      return (
        React.DOM.h4(null, "You need to pick at least one restaurant")
      );
    } else if (this.props.parent.state.isNew) {
      return (
        React.DOM.h4(null, "Click Done to finalize your choices")
      );
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'Done';
    if (this.getMode() === 'frozen') {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.initDone}, 
          buttonMessage
        )
      );
    }
  },
  render: function () {
    return (
      React.DOM.table( {className:"table", 'data-mode':this.getMode()}, 
        React.DOM.tr(null, 
          React.DOM.td(null, 
            this.renderCallToAction(),
            this.renderCategories()
          ),
          React.DOM.td( {className:"button-row"}, 
            React.DOM.div( {className:"button-row-fixed"}, 
              this.renderInfo(),
              React.DOM.div( {className:"clearfix"}),
              this.renderButtonEdit(),
              React.DOM.div( {className:"clearfix"}),
              this.renderButtonInit()
            )
          )
        )
      )
    );
  }
});
},{"./room-pane-category.jsx":3}],6:[function(require,module,exports){
/** @jsx React.DOM */

var PeoplePane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'small'
    };
  },
  getPeople: function () {
    return this.props.parent.state.people;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'small' ? 'large' : 'small')
    });
  },
  renderSmall: function () {
    var msg = ""
      , hasPicked = 0
      , me = this.getMe();
    if (!this.getPeople().length) {
      msg = "";
    } else {
      for (var i = 0; i < this.getPeople().length; i++) {
        var person = this.getPeople()[i];
        if (person.state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.getPeople().length + ", including me, have chosen";
    }
    return React.DOM.div( {className:"room-people-child"}, this.props.parent.state.roomId, " - ", msg);
  },
  renderPeople: function () {
    return this.getPeople()
    .filter(function (person) {
      return person._id !== this.getMe()._id;
    }, this)
    .map(function (person) {
      var personClass = 'room-people-child pull-left label label-';
      if (person.state === 'waiting') {
        personClass += 'warning';
      } else if (person.state === 'finished') {
        personClass += 'success';
      } else {
        personClass += 'default';
      }
      return React.DOM.div( {className:personClass}, person.name)
    });
  },
  renderLarge: function () {
    return (
      React.DOM.div( {className:"media room-people-child"}, 
        this.renderPeople()
      )
    );
  },
  renderNew: function () {
    return (
      React.DOM.div( {className:"room-people-new"}, 
        this.props.parent.state.roomId, " - This is a new room "
      )
    );
  },
  render: function () {
    if (!this.props.parent.state.roomId) {
      return (
        React.DOM.div(null)
      );
    }
    var peopleClass = "navbar navbar-default navbar-fixed-top room-people";
    return (
      React.DOM.nav( {className:peopleClass, 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        React.DOM.div( {className:"container"}, 
        this.renderSmall(),
        this.renderLarge(),
        this.renderNew()
        )
      )
    );
  }
});
},{}],7:[function(require,module,exports){
/** @jsx React.DOM */

var RoomRestaurantDetails = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  render: function () {
    var eat = this.props.data;
    console.log();
    return (
      React.DOM.div( {className:"restaurant-details media"}, 
        React.DOM.div( {className:"pull-left"}, 
          React.DOM.img( {class:"media-object", src:eat.image_url, alt:eat.name} )
        ),
        React.DOM.div( {class:"media-body"}, 
          React.DOM.h5( {class:"media-heading"}, eat.name),
          React.DOM.div(null, React.DOM.img( {class:"media-object", src:eat.rating_img_url_small, alt:"ratings"} )),
          React.DOM.div(null, 
            React.DOM.span(null, eat.location.address[0] + ' ' + eat.location.city)
          ),
          React.DOM.div(null, 
            React.DOM.span(null, eat.display_phone)
          )
        )
      )
    );
  }
});
},{}],8:[function(require,module,exports){
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
    room.onMidVote(function (res) {
      self.setState({roundId: res.roundId});
    });
  },
  load: function () {
    var self = this;
    var path = window.location.pathname;
    if (path === '/room/new') {
      var hasCoords = typeof roomCoords !== 'undefined';
      var hasLoc = typeof roomLocation !== 'undefined';
      if (!hasCoords && !hasLoc) {
        window.location.href = '/';
      }
      var loc = hasCoords ? roomCoords : roomLocation;
      room.createRoom({location: loc, name: roomName}, function (err, res) {
        self.setState({
          location: res.location,
          categories: res.categories,
          roomId: res.room,
          isNew: res.state === 'new'
        });
        /*
        room.joinRoom({room: res.room, name: self.state.me.name}, function (err, res) {
          self.setState({
            people: res.current,
            me: res.me
          });
        });
        */
      });
    } else {
      var roomId = path.substr(1).split('/')[1];
      room.joinRoom({room: roomId, name: self.state.me.name}, function (err, res) {
        if (err && err.code === 404) {
          window.location.href = '/';
          return;
        }
        self.setState({
          people: res.current, 
          me: res.me,
          location: res.room.location,
          categories: res.room.categories,
          roomId: roomId,
          isNew: false
        });
      });
    }
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
      window.location.href = '/room/' + res;
      return;
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
  submitChoices: function () {
    room.submitChoices({
      categories: this.state.categories,
      roundId: this.state.roundId
    });
  },
  render: function () {
    var roomClass = "";
    if (this.state.isNew) {
      roomClass += " is-new";
    }
    return (
      React.DOM.div( {id:"room", className:roomClass}, 
        RoomPeople( {ref:"people",
          parent:this} ),
        RoomPane( {ref:"pane",
          parent:this, hasWinner:this.state.hasWinner} ),
        RoomModal( {ref:"modal", 
          parent:this} )
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);

},{"./room-modal.jsx":2,"./room-pane.jsx":5,"./room-people.jsx":6}]},{},[1,2,3,4,5,6,7,8])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1jb3VudGRvd24uanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSb29tQ291bnRkb3duID0gcmVxdWlyZSgnLi9yb29tLWNvdW50ZG93bi5qc3gnKTtcblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICwgb25Db3VudGRvd24gPSBmdW5jdGlvbiBvbkNvdW50ZG93bihjb3VudFZhbCkge1xuICAgICAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICAgICAgY291bnRkb3duOiBjb3VudFZhbFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGNvdW50VmFsID4gMSkge1xuICAgICAgICAgICAgICBvbkNvdW50ZG93bihjb3VudFZhbCAtIDEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2VsZi5wcm9wcy5vbkZpbmlzaCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIDEwMDApO1xuICAgICAgICB9O1xuICAgIG9uQ291bnRkb3duKHRoaXMucHJvcHMuY291bnRkb3duKTtcbiAgfSxcbiAgcmVuZGVyQ291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1pbiA9ICh0aGlzLnN0YXRlLmNvdW50ZG93biAvIDYwKSB8IDBcbiAgICAgICwgc2VjID0gKHRoaXMuc3RhdGUuY291bnRkb3duICUgNjApO1xuICAgIHJldHVybiAobWluIDwgMTAgPyAnMCcgOiAnJykgKyBtaW4gKyAnOicgKyAoc2VjIDwgMTAgPyAnMCcgOiAnJykgKyBzZWM7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uaDIobnVsbCwgXCJQaWNraW5nIGEgd2lubmVyIGluIFwiLCB0aGlzLnJlbmRlckNvdW50ZG93bigpKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpXG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICAvLyBUaGUgZm9sbG93aW5nIHR3byBtZXRob2RzIGFyZSB0aGUgb25seSBwbGFjZXMgd2UgbmVlZCB0b1xuICAvLyBpbnRlZ3JhdGUgd2l0aCBCb290c3RyYXAgb3IgalF1ZXJ5IVxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgLy8gV2hlbiB0aGUgY29tcG9uZW50IGlzIGFkZGVkLCB0dXJuIGl0IGludG8gYSBtb2RhbFxuICAgICQodGhpcy5nZXRET01Ob2RlKCkpXG4gICAgICAubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlLCBzaG93OiBmYWxzZX0pO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkub2ZmKCdoaWRkZW4nKTtcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm1vZGFsKCdoaWRlJyk7XG4gIH0sXG4gIG9wZW46IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm1vZGFsKCdzaG93Jyk7XG4gIH0sXG4gIHN0YXJ0Q291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAnY291bnRkb3duJ1xuICAgIH0pO1xuICAgIHRoaXMub3BlbigpO1xuICB9LFxuICBhZnRlckNvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLnByb3BzLnBhcmVudC5jaG9vc2VXaW5uZXIoKTtcbiAgfSxcbiAgcmVuZGVyQm9keTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdjb3VudGRvd24nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSb29tQ291bnRkb3duKCB7Y291bnRkb3duOjEsIG9uRmluaXNoOnRoaXMuYWZ0ZXJDb3VudGRvd259IClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1vZGFsIGZhZGVcIn0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtZGlhbG9nXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtY29udGVudFwifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJvZHkoKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS5yZXN0YXVyYW50cztcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS52ZXRvKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImxhYmVsIGxhYmVsLWRhbmdlclwifSwgXCJWZXRvZWQhXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBuYW1lID0gY2F0Lm5hbWVcbiAgICAgICwgcmVzdGF1cmFudHMgPSBjYXQucmVzdGF1cmFudHM7XG4gICAgdmFyIGNhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1jYXRcIjtcbiAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpKSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICBpZiAoY2F0LndpbnMpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIHdpbm5lclwiO1xuICAgIH1cbiAgICB2YXIgcmVuZGVyZWQgPSByZXN0YXVyYW50c1xuICAgIC5tYXAoZnVuY3Rpb24gKGVhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZVJlc3RhdXJhbnQoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmVhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGV4OnRoaXMucHJvcHMuaW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5wcm9wcy5tb2RlLFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLnByb3BzLmNob29zZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIG5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKSksXG4gICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICAgIHJlbmRlcmVkXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBSb29tUmVzdGF1cmFudERldGFpbHMgPSByZXF1aXJlKCcuL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCcpO1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMucHJvcHMuZGF0YS5jaG9zZW4sIHRoaXMucHJvcHMucGFyZW50SW5kZXgsIHRoaXMucHJvcHMuaW5kZXgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlID09PSAnZnJvemVuJyAmJiB0aGlzLnByb3BzLmRhdGEucm91bmRDaG9zZW4pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtc3VjY2Vzc1wifSwgXCJDaG9zZW4hXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBlYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tcmVzdFwiO1xuICAgIGlmIChlYXQuY2hvc2VuKSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICBpZiAoZWF0LndpbnMpIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIHdpbm5lclwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmVhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJlc3RhdXJhbnQtZGV0YWlscy13cmFwcGVyXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcInNtYWxsXCJ9LCBlYXQubmFtZSwgdGhpcy5yZW5kZXJMYWJlbCgpKSxcbiAgICAgICAgICBSb29tUmVzdGF1cmFudERldGFpbHMoIHtkYXRhOmVhdH0gKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtY2F0ZWdvcnkuanN4Jyk7XG5cbnZhciBSb29tUGFuZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2Zyb3plbidcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZCgpO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiB0aGlzLmdldEZyb3plblN0YXRlKClcbiAgICB9KTtcbiAgfSxcbiAgZ2V0RnJvemVuU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNBbnlDYXRDaG9zZW4oKSkge1xuICAgICAgcmV0dXJuICduZWVkQ2hvaWNlJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdmcm96ZW4nO1xuICAgIH1cbiAgfSxcbiAgaW5pdERvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUuaXNOZXcpIHtcbiAgICAgIHRoaXMucHJvcHMucGFyZW50LnNhdmVSb29tKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJvcHMucGFyZW50LnN1Ym1pdENob2ljZXMoKTtcbiAgICAgIHRoaXMucHJvcHMucGFyZW50LnJlZnMubW9kYWwuc3RhcnRDb3VudGRvd24oKTtcbiAgICB9XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLmdldE1vZGUoKSA9PT0gJ2VkaXQnID8gdGhpcy5nZXRGcm96ZW5TdGF0ZSgpIDogJ2VkaXQnKVxuICAgIH0pO1xuICB9LFxuICBnZXRNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1vZGUgPSBcIlwiO1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1dpbm5lcikge1xuICAgICAgbW9kZSA9ICd3aW5uZXInO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIG1vZGUgPSB0aGlzLnN0YXRlLm1vZGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGUgPSB0aGlzLmdldEZyb3plblN0YXRlKCk7XG4gICAgfVxuICAgIHJldHVybiBtb2RlO1xuICB9LFxuICBnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmNhdGVnb3JpZXM7XG4gIH0sXG4gIGdldE1lOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLm1lO1xuICB9LFxuICBjbGlja0Nob3NlbjogZnVuY3Rpb24gKGlzQ2hvc2VuLCBjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXgpIHtcbiAgICBpZiAodGhpcy5nZXRNb2RlKCkgPT09ICdlZGl0Jykge1xuICAgICAgaWYgKHR5cGVvZihyZXN0YXVyYW50SW5kZXgpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB0b2dnbGluZyB3aG9sZSBjYXRlZ29yeVxuICAgICAgICB2YXIgdG9nZ2xlQ2F0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbY2F0ZWdvcnlJbmRleF07XG4gICAgICAgIHRvZ2dsZUNhdC5yZXN0YXVyYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlYXQpIHtcbiAgICAgICAgICBlYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdLnJlc3RhdXJhbnRzW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5jaG9zZW4gPSBpc0Nob3NlbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0TW9kZSgpID09PSAnZnJvemVuJykge1xuICAgICAgLy8gZG8gbm90aGluZyBpZiBpbiBuZXcgbW9kZVxuICAgICAgaWYgKHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmlzTmV3KSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vIHZldG8gLyByb3VuZENob3NlbiBtb2RlXG4gICAgICBpZiAodHlwZW9mKHJlc3RhdXJhbnRJbmRleCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHZldG8gYnkgY2F0ZWdvcmllc1xuICAgICAgICB2YXIgdG9nZ2xlQ2F0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbY2F0ZWdvcnlJbmRleF07XG4gICAgICAgIHRvZ2dsZUNhdC52ZXRvID0gIXRvZ2dsZUNhdC52ZXRvO1xuICAgICAgICBpZiAodG9nZ2xlQ2F0LnZldG8pIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmV0b2VzOiAodGhpcy5zdGF0ZS52ZXRvZXMgfHwgMCkgKyAxIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2ZXRvZXM6ICh0aGlzLnN0YXRlLnZldG9lcyB8fCAwKSAtIDEgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHNpbmdsZSByZXN0YXVyYW50XG4gICAgICAgIHZhciB0b2dnbGVFYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQucm91bmRDaG9zZW4gPSAhdG9nZ2xlRWF0LnJvdW5kQ2hvc2VuO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5yb3VuZENob3Nlbikge1xuICAgICAgICAgIHZhciBpaiA9IHRoaXMuc3RhdGUucm91bmRDaG9zZW47XG4gICAgICAgICAgZGVsZXRlIHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2lqWzBdXS5yZXN0YXVyYW50c1tpalsxXV0ucm91bmRDaG9zZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvZ2dsZUVhdC5yb3VuZENob3Nlbikge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3VuZENob3NlbjogW2NhdGVnb3J5SW5kZXgsIHJlc3RhdXJhbnRJbmRleF0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdW5kQ2hvc2VuOiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKGNhdCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdC5yZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNhdC5yZXN0YXVyYW50c1tpXS5jaG9zZW4pIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIGlzQW55Q2F0Q2hvc2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZXRDYXRlZ29yaWVzKCkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtpXTtcbiAgICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKGNhdCkpIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIHJlbmRlckNhdGVnb3JpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbmRlcmVkID0gdGhpcy5nZXRDYXRlZ29yaWVzKClcbiAgICAubWFwKGZ1bmN0aW9uIChjYXQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUm9vbVBhbmVDYXRlZ29yeSggXG4gICAgICAgICAgICAgICAge2RhdGE6Y2F0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLmdldE1vZGUoKSwgXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMuY2xpY2tDaG9zZW59ICk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICByZW5kZXJlZFxuICAgICAgKVxuICAgICk7XG4gICAgICAgICAgICBcbiAgfSxcbiAgcmVuZGVyQnV0dG9uRWRpdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25NZXNzYWdlID0gJ0VkaXQnO1xuICAgIGlmICh0aGlzLmdldE1vZGUoKSA9PT0gJ2VkaXQnKSB7XG4gICAgICBidXR0b25NZXNzYWdlID0gJ0Nsb3NlJztcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcImJ0bi1lZGl0IHB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIGJ1dHRvbk1lc3NhZ2VcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJJbmZvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZldG9lcyA9IHRoaXMuc3RhdGUudmV0b2VzIHx8IDBcbiAgICAgICwgcm91bmRDaG9zZW4gPSB0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuID8gMSA6IDA7XG4gICAgaWYgKHRoaXMuZ2V0TW9kZSgpID09PSAnZnJvemVuJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvb20taW5mbyBwdWxsLXJpZ2h0XCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFkZ2VcIn0sIHZldG9lcyksIFwiIHZldG9lZFwiKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFkZ2VcIn0sIHJvdW5kQ2hvc2VuKSwgXCIgY2hvc2VuXCIpXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXJDYWxsVG9BY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5oYXNXaW5uZXIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBcIkFuZCB0aGUgd2lubmVyIGlzLi4uXCIpXG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5nZXRNb2RlKCkgPT09ICduZWVkQ2hvaWNlJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiWW91IG5lZWQgdG8gcGljayBhdCBsZWFzdCBvbmUgcmVzdGF1cmFudFwiKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmlzTmV3KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJDbGljayBEb25lIHRvIGZpbmFsaXplIHlvdXIgY2hvaWNlc1wiKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckJ1dHRvbkluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uTWVzc2FnZSA9ICdEb25lJztcbiAgICBpZiAodGhpcy5nZXRNb2RlKCkgPT09ICdmcm96ZW4nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMuaW5pdERvbmV9LCBcbiAgICAgICAgICBidXR0b25NZXNzYWdlXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKCB7Y2xhc3NOYW1lOlwidGFibGVcIiwgJ2RhdGEtbW9kZSc6dGhpcy5nZXRNb2RlKCl9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2FsbFRvQWN0aW9uKCksXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3JpZXMoKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKCB7Y2xhc3NOYW1lOlwiYnV0dG9uLXJvd1wifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiYnV0dG9uLXJvdy1maXhlZFwifSwgXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVySW5mbygpLFxuICAgICAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY2xlYXJmaXhcIn0pLFxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckJ1dHRvbkVkaXQoKSxcbiAgICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJCdXR0b25Jbml0KClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFBlb3BsZVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdzbWFsbCdcbiAgICB9O1xuICB9LFxuICBnZXRQZW9wbGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5wYXJlbnQuc3RhdGUucGVvcGxlO1xuICB9LFxuICBnZXRNZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5tZTtcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/ICdsYXJnZScgOiAnc21hbGwnKVxuICAgIH0pO1xuICB9LFxuICByZW5kZXJTbWFsbDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtc2cgPSBcIlwiXG4gICAgICAsIGhhc1BpY2tlZCA9IDBcbiAgICAgICwgbWUgPSB0aGlzLmdldE1lKCk7XG4gICAgaWYgKCF0aGlzLmdldFBlb3BsZSgpLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmdldFBlb3BsZSgpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwZXJzb24gPSB0aGlzLmdldFBlb3BsZSgpW2ldO1xuICAgICAgICBpZiAocGVyc29uLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGggKyBcIiwgaW5jbHVkaW5nIG1lLCBoYXZlIGNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvb20tcGVvcGxlLWNoaWxkXCJ9LCB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5yb29tSWQsIFwiIC0gXCIsIG1zZyk7XG4gIH0sXG4gIHJlbmRlclBlb3BsZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBlb3BsZSgpXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocGVyc29uKSB7XG4gICAgICByZXR1cm4gcGVyc29uLl9pZCAhPT0gdGhpcy5nZXRNZSgpLl9pZDtcbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgdmFyIHBlcnNvbkNsYXNzID0gJ3Jvb20tcGVvcGxlLWNoaWxkIHB1bGwtbGVmdCBsYWJlbCBsYWJlbC0nO1xuICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ3dhaXRpbmcnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICd3YXJuaW5nJztcbiAgICAgIH0gZWxzZSBpZiAocGVyc29uLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdzdWNjZXNzJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdkZWZhdWx0JztcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOnBlcnNvbkNsYXNzfSwgcGVyc29uLm5hbWUpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlckxhcmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtZWRpYSByb29tLXBlb3BsZS1jaGlsZFwifSwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJOZXc6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvb20tcGVvcGxlLW5ld1wifSwgXG4gICAgICAgIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLnJvb21JZCwgXCIgLSBUaGlzIGlzIGEgbmV3IHJvb20gXCJcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMucGFyZW50LnN0YXRlLnJvb21JZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsKVxuICAgICAgKTtcbiAgICB9XG4gICAgdmFyIHBlb3BsZUNsYXNzID0gXCJuYXZiYXIgbmF2YmFyLWRlZmF1bHQgbmF2YmFyLWZpeGVkLXRvcCByb29tLXBlb3BsZVwiO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubmF2KCB7Y2xhc3NOYW1lOnBlb3BsZUNsYXNzLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGUsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJjb250YWluZXJcIn0sIFxuICAgICAgICB0aGlzLnJlbmRlclNtYWxsKCksXG4gICAgICAgIHRoaXMucmVuZGVyTGFyZ2UoKSxcbiAgICAgICAgdGhpcy5yZW5kZXJOZXcoKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUmVzdGF1cmFudERldGFpbHMgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWF0ID0gdGhpcy5wcm9wcy5kYXRhO1xuICAgIGNvbnNvbGUubG9nKCk7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyZXN0YXVyYW50LWRldGFpbHMgbWVkaWFcIn0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicHVsbC1sZWZ0XCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaW1nKCB7Y2xhc3M6XCJtZWRpYS1vYmplY3RcIiwgc3JjOmVhdC5pbWFnZV91cmwsIGFsdDplYXQubmFtZX0gKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3M6XCJtZWRpYS1ib2R5XCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaDUoIHtjbGFzczpcIm1lZGlhLWhlYWRpbmdcIn0sIGVhdC5uYW1lKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5pbWcoIHtjbGFzczpcIm1lZGlhLW9iamVjdFwiLCBzcmM6ZWF0LnJhdGluZ19pbWdfdXJsX3NtYWxsLCBhbHQ6XCJyYXRpbmdzXCJ9ICkpLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00uc3BhbihudWxsLCBlYXQubG9jYXRpb24uYWRkcmVzc1swXSArICcgJyArIGVhdC5sb2NhdGlvbi5jaXR5KVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKG51bGwsIGVhdC5kaXNwbGF5X3Bob25lKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBlb3BsZSA9IHJlcXVpcmUoJy4vcm9vbS1wZW9wbGUuanN4JylcbiAgLCBSb29tUGFuZSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLmpzeCcpXG4gICwgUm9vbU1vZGFsID0gcmVxdWlyZSgnLi9yb29tLW1vZGFsLmpzeCcpXG4gICwgcm9vbSA9IHJlcXVpcmUoJ3JlYWx0aW1lL3Jvb20nKTtcblxudmFyIFJvb20gPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtsb2NhdGlvbjoge30sIGNhdGVnb3JpZXM6IFtdLCBwZW9wbGU6IFtdLCBtZToge25hbWU6IHN0b3JlLmdldCgnbmFtZScpIHx8ICdBbm9ueW1vdXMnfX07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMubG9hZCgpO1xuICAgIHJvb20ub25Kb2luZWQoZnVuY3Rpb24gKHJlcykge1xuICAgICAgc2VsZi5zZXRTdGF0ZSh7cGVvcGxlOiByZXMuY3VycmVudH0pO1xuICAgIH0pO1xuICAgIHJvb20ub25MZWZ0KGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgIHNlbGYuc2V0U3RhdGUoe3Blb3BsZTogcmVzLmN1cnJlbnR9KTtcbiAgICB9KTtcbiAgICByb29tLm9uTWlkVm90ZShmdW5jdGlvbiAocmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtyb3VuZElkOiByZXMucm91bmRJZH0pO1xuICAgIH0pO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIGlmIChwYXRoID09PSAnL3Jvb20vbmV3Jykge1xuICAgICAgdmFyIGhhc0Nvb3JkcyA9IHR5cGVvZiByb29tQ29vcmRzICE9PSAndW5kZWZpbmVkJztcbiAgICAgIHZhciBoYXNMb2MgPSB0eXBlb2Ygcm9vbUxvY2F0aW9uICE9PSAndW5kZWZpbmVkJztcbiAgICAgIGlmICghaGFzQ29vcmRzICYmICFoYXNMb2MpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgICB9XG4gICAgICB2YXIgbG9jID0gaGFzQ29vcmRzID8gcm9vbUNvb3JkcyA6IHJvb21Mb2NhdGlvbjtcbiAgICAgIHJvb20uY3JlYXRlUm9vbSh7bG9jYXRpb246IGxvYywgbmFtZTogcm9vbU5hbWV9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgbG9jYXRpb246IHJlcy5sb2NhdGlvbixcbiAgICAgICAgICBjYXRlZ29yaWVzOiByZXMuY2F0ZWdvcmllcyxcbiAgICAgICAgICByb29tSWQ6IHJlcy5yb29tLFxuICAgICAgICAgIGlzTmV3OiByZXMuc3RhdGUgPT09ICduZXcnXG4gICAgICAgIH0pO1xuICAgICAgICAvKlxuICAgICAgICByb29tLmpvaW5Sb29tKHtyb29tOiByZXMucm9vbSwgbmFtZTogc2VsZi5zdGF0ZS5tZS5uYW1lfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBwZW9wbGU6IHJlcy5jdXJyZW50LFxuICAgICAgICAgICAgbWU6IHJlcy5tZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKi9cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcm9vbUlkID0gcGF0aC5zdWJzdHIoMSkuc3BsaXQoJy8nKVsxXTtcbiAgICAgIHJvb20uam9pblJvb20oe3Jvb206IHJvb21JZCwgbmFtZTogc2VsZi5zdGF0ZS5tZS5uYW1lfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIgJiYgZXJyLmNvZGUgPT09IDQwNCkge1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICBwZW9wbGU6IHJlcy5jdXJyZW50LCBcbiAgICAgICAgICBtZTogcmVzLm1lLFxuICAgICAgICAgIGxvY2F0aW9uOiByZXMucm9vbS5sb2NhdGlvbixcbiAgICAgICAgICBjYXRlZ29yaWVzOiByZXMucm9vbS5jYXRlZ29yaWVzLFxuICAgICAgICAgIHJvb21JZDogcm9vbUlkLFxuICAgICAgICAgIGlzTmV3OiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgc2F2ZVJvb206IGZ1bmN0aW9uICgpIHtcbiAgICAvLyBzZXJpYWxpemUgZm9yIHNhdmluZ1xuICAgIHZhciBzZXJpYWxpemVkID0ge307XG4gICAgc2VyaWFsaXplZC5sb2NhdGlvbiA9IHRoaXMuc3RhdGUubG9jYXRpb247XG4gICAgc2VyaWFsaXplZC5jcmVhdG9yID0gdGhpcy5zdGF0ZS5tZTtcbiAgICBzZXJpYWxpemVkLnJvb21JZCA9IHRoaXMuc3RhdGUucm9vbUlkO1xuICAgIHNlcmlhbGl6ZWQuY2F0ZWdvcmllcyA9IFtdO1xuICAgIHRoaXMuc3RhdGUuY2F0ZWdvcmllcy5mb3JFYWNoKGZ1bmN0aW9uIChjYXQpIHtcbiAgICAgIHZhciByZXN0YXVyYW50cyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQucmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGNhdC5yZXN0YXVyYW50c1tpXS5jaG9zZW4pIHtcbiAgICAgICAgICByZXN0YXVyYW50cy5wdXNoKGNhdC5yZXN0YXVyYW50c1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChyZXN0YXVyYW50cy5sZW5ndGgpIHtcbiAgICAgICAgc2VyaWFsaXplZC5jYXRlZ29yaWVzLnB1c2goe1xuICAgICAgICAgIG5hbWU6IGNhdC5uYW1lLFxuICAgICAgICAgIHJlc3RhdXJhbnRzOiByZXN0YXVyYW50c1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJvb20uc2F2ZVJvb20oc2VyaWFsaXplZCwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcm9vbS8nICsgcmVzO1xuICAgICAgcmV0dXJuO1xuICAgIH0pO1xuICB9LFxuICBjaG9vc2VXaW5uZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ZWdvcmllcyA9IHRoaXMuc3RhdGUuY2F0ZWdvcmllc1xuICAgICAgLCB3aW5uaW5nQ2F0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nQ2F0ID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzW3dpbm5pbmdDYXRJbmRleF1cbiAgICAgICwgd2lubmluZ1Jlc3RhdXJhbnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHdpbm5pbmdDYXQucmVzdGF1cmFudHMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nUmVzdGF1cmFudCA9IHdpbm5pbmdDYXQucmVzdGF1cmFudHNbd2lubmluZ1Jlc3RhdXJhbnRJbmRleF07XG4gICAgd2lubmluZ0NhdC53aW5zID0gdHJ1ZTtcbiAgICB3aW5uaW5nUmVzdGF1cmFudC53aW5zID0gdHJ1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGhhc1dpbm5lcjogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICBzdWJtaXRDaG9pY2VzOiBmdW5jdGlvbiAoKSB7XG4gICAgcm9vbS5zdWJtaXRDaG9pY2VzKHtcbiAgICAgIGNhdGVnb3JpZXM6IHRoaXMuc3RhdGUuY2F0ZWdvcmllcyxcbiAgICAgIHJvdW5kSWQ6IHRoaXMuc3RhdGUucm91bmRJZFxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcm9vbUNsYXNzID0gXCJcIjtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc05ldykge1xuICAgICAgcm9vbUNsYXNzICs9IFwiIGlzLW5ld1wiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwiLCBjbGFzc05hbWU6cm9vbUNsYXNzfSwgXG4gICAgICAgIFJvb21QZW9wbGUoIHtyZWY6XCJwZW9wbGVcIixcbiAgICAgICAgICBwYXJlbnQ6dGhpc30gKSxcbiAgICAgICAgUm9vbVBhbmUoIHtyZWY6XCJwYW5lXCIsXG4gICAgICAgICAgcGFyZW50OnRoaXMsIGhhc1dpbm5lcjp0aGlzLnN0YXRlLmhhc1dpbm5lcn0gKSxcbiAgICAgICAgUm9vbU1vZGFsKCB7cmVmOlwibW9kYWxcIiwgXG4gICAgICAgICAgcGFyZW50OnRoaXN9IClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pO1xuIl19
;