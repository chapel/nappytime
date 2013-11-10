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
    this.props.parent.refs.modal.startCountdown();
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  getCategories: function () {
    return this.props.parent.state.categories;
  },
  getMe: function () {
    return this.props.parent.state.me;
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
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
    } else if (this.state.mode === 'frozen') {
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
                mode:this.state.mode, 
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
    if (this.state.mode === 'edit') {
      buttonMessage = 'Close';
    }
    if (this.getMe().isCreator) {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.toggleMode}, 
          buttonMessage
        )
      );
    }
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    if (this.state.mode === 'frozen') {
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
    } else if (this.state.mode === 'needChoice') {
      if (this.getMe().isCreator) {
        return (
          React.DOM.h4(null, "Click Edit and make your choices")
        );
      } else {
        return (
          React.DOM.h4(null, "The owner of this room need to choose some options from the list first")
        );
      }
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'I\'m Done';
    if (this.state.mode === 'frozen') {
      return (
        React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.initDone}, 
          buttonMessage
        )
      );
    }
  },
  render: function () {
    var mode = this.state.mode;
    if (this.props.hasWinner) {
      mode = 'winner';
    }
    return (
      React.DOM.table( {className:"table", 'data-mode':mode}, 
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
  renderSmallMessage: function () {
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
    return React.DOM.h3(null, msg);
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'small' ? 'large' : 'small')
    });
  },
  renderSmall: function () {
    return this.renderSmallMessage();
  },
  renderPeople: function () {
    return this.getPeople()
    .filter(function (person) {
      return person._id !== this.getMe()._id;
    }, this)
    .map(function (person) {
      var personClass = 'pull-left label label-';
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
      React.DOM.div( {className:"media"}, 
        this.renderPeople()
      )
    );
  },
  render: function () {
    return (
      React.DOM.nav( {className:"navbar navbar-default navbar-fixed-top room-people", 'data-mode':this.state.mode, onClick:this.toggleMode}, 
        React.DOM.div( {className:"container"}, 
         this.state.mode === 'small' ? this.renderSmall() : this.renderLarge()
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
    return {location: {}, categories: [], people: [], me: {}};
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
        categories: res.categories
      });
      room.joinRoom({room: res.room, name: 'foo'}, function (err, res) {
        self.setState({people: res.current, me: res.me});
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
      React.DOM.div( {id:"room"}, 
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1jb3VudGRvd24uanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcmVzdGF1cmFudC1kZXRhaWxzLmpzeCIsIi9Vc2Vycy9qY2hhcGVsL1Byb2plY3RzL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpO1xuXG52YXIgUm9vbU1vZGFsID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCBvbkNvdW50ZG93biA9IGZ1bmN0aW9uIG9uQ291bnRkb3duKGNvdW50VmFsKSB7XG4gICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb3VudGRvd246IGNvdW50VmFsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY291bnRWYWwgPiAxKSB7XG4gICAgICAgICAgICAgIG9uQ291bnRkb3duKGNvdW50VmFsIC0gMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzZWxmLnByb3BzLm9uRmluaXNoKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgb25Db3VudGRvd24odGhpcy5wcm9wcy5jb3VudGRvd24pO1xuICB9LFxuICByZW5kZXJDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWluID0gKHRoaXMuc3RhdGUuY291bnRkb3duIC8gNjApIHwgMFxuICAgICAgLCBzZWMgPSAodGhpcy5zdGF0ZS5jb3VudGRvd24gJSA2MCk7XG4gICAgcmV0dXJuIChtaW4gPCAxMCA/ICcwJyA6ICcnKSArIG1pbiArICc6JyArIChzZWMgPCAxMCA/ICcwJyA6ICcnKSArIHNlYztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5oMihudWxsLCBcIlBpY2tpbmcgYSB3aW5uZXIgaW4gXCIsIHRoaXMucmVuZGVyQ291bnRkb3duKCkpXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbUNvdW50ZG93biA9IHJlcXVpcmUoJy4vcm9vbS1jb3VudGRvd24uanN4JylcblxudmFyIFJvb21Nb2RhbCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIC8vIFRoZSBmb2xsb3dpbmcgdHdvIG1ldGhvZHMgYXJlIHRoZSBvbmx5IHBsYWNlcyB3ZSBuZWVkIHRvXG4gIC8vIGludGVncmF0ZSB3aXRoIEJvb3RzdHJhcCBvciBqUXVlcnkhXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAvLyBXaGVuIHRoZSBjb21wb25lbnQgaXMgYWRkZWQsIHR1cm4gaXQgaW50byBhIG1vZGFsXG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSlcbiAgICAgIC5tb2RhbCh7YmFja2Ryb3A6ICdzdGF0aWMnLCBrZXlib2FyZDogZmFsc2UsIHNob3c6IGZhbHNlfSk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5vZmYoJ2hpZGRlbicpO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcbiAgfSxcbiAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcbiAgfSxcbiAgc3RhcnRDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICdjb3VudGRvd24nXG4gICAgfSk7XG4gICAgdGhpcy5vcGVuKCk7XG4gIH0sXG4gIGFmdGVyQ291bnRkb3duOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5jbG9zZSgpO1xuICAgIHRoaXMucHJvcHMucGFyZW50LmNob29zZVdpbm5lcigpO1xuICB9LFxuICByZW5kZXJCb2R5OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2NvdW50ZG93bicpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJvb21Db3VudGRvd24oIHtjb3VudGRvd246MSwgb25GaW5pc2g6dGhpcy5hZnRlckNvdW50ZG93bn0gKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwgZmFkZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1kaWFsb2dcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1jb250ZW50XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQm9keSgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS1yZXN0YXVyYW50LmpzeCcpO1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3RhdXJhbnRzID0gdGhpcy5wcm9wcy5kYXRhLnJlc3RhdXJhbnRzO1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpLCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlckxhYmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2Zyb3plbicgJiYgdGhpcy5wcm9wcy5kYXRhLnZldG8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtZGFuZ2VyXCJ9LCBcIlZldG9lZCFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIG5hbWUgPSBjYXQubmFtZVxuICAgICAgLCByZXN0YXVyYW50cyA9IGNhdC5yZXN0YXVyYW50cztcbiAgICB2YXIgY2F0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLWNhdFwiO1xuICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCkpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIGlmIChjYXQud2lucykge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgd2lubmVyXCI7XG4gICAgfVxuICAgIHZhciByZW5kZXJlZCA9IHJlc3RhdXJhbnRzXG4gICAgLm1hcChmdW5jdGlvbiAoZWF0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lUmVzdGF1cmFudCggXG4gICAgICAgICAgICAgICAge2RhdGE6ZWF0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgcGFyZW50SW5kZXg6dGhpcy5wcm9wcy5pbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLnByb3BzLm1vZGUsXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMucHJvcHMuY2hvb3NlfSApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6Y2F0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgbmFtZSwgdGhpcy5yZW5kZXJMYWJlbCgpKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgICAgcmVuZGVyZWRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21SZXN0YXVyYW50RGV0YWlscyA9IHJlcXVpcmUoJy4vcm9vbS1yZXN0YXVyYW50LWRldGFpbHMuanN4Jyk7XG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5wcm9wcy5kYXRhLmNob3NlbiwgdGhpcy5wcm9wcy5wYXJlbnRJbmRleCwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS5yb3VuZENob3Nlbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJsYWJlbCBsYWJlbC1zdWNjZXNzXCJ9LCBcIkNob3NlbiFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWF0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIGVhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1yZXN0XCI7XG4gICAgaWYgKGVhdC5jaG9zZW4pIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIGlmIChlYXQud2lucykge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgd2lubmVyXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6ZWF0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVzdGF1cmFudC1kZXRhaWxzLXdyYXBwZXJcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwic21hbGxcIn0sIGVhdC5uYW1lLCB0aGlzLnJlbmRlckxhYmVsKCkpLFxuICAgICAgICAgIFJvb21SZXN0YXVyYW50RGV0YWlscygge2RhdGE6ZWF0fSApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3gnKTtcblxudmFyIFJvb21QYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnZnJvemVuJ1xuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6IHRoaXMuZ2V0RnJvemVuU3RhdGUoKVxuICAgIH0pO1xuICB9LFxuICBnZXRGcm96ZW5TdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5pc0FueUNhdENob3NlbigpKSB7XG4gICAgICByZXR1cm4gJ25lZWRDaG9pY2UnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2Zyb3plbic7XG4gICAgfVxuICB9LFxuICBpbml0RG9uZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucHJvcHMucGFyZW50LnJlZnMubW9kYWwuc3RhcnRDb3VudGRvd24oKTtcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnID8gdGhpcy5nZXRGcm96ZW5TdGF0ZSgpIDogJ2VkaXQnKVxuICAgIH0pO1xuICB9LFxuICBnZXRDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLmNhdGVnb3JpZXM7XG4gIH0sXG4gIGdldE1lOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLm1lO1xuICB9LFxuICBjbGlja0Nob3NlbjogZnVuY3Rpb24gKGlzQ2hvc2VuLCBjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgd2hvbGUgY2F0ZWdvcnlcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQucmVzdGF1cmFudHMuZm9yRWFjaChmdW5jdGlvbiAoZWF0KSB7XG4gICAgICAgICAgZWF0LmNob3NlbiA9IGlzQ2hvc2VuO1xuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHNpbmdsZSByZXN0YXVyYW50XG4gICAgICAgIHZhciB0b2dnbGVFYXQgPSB0aGlzLmdldENhdGVnb3JpZXMoKVtjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICAvLyB2ZXRvIC8gcm91bmRDaG9zZW4gbW9kZVxuICAgICAgaWYgKHR5cGVvZihyZXN0YXVyYW50SW5kZXgpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB2ZXRvIGJ5IGNhdGVnb3JpZXNcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQudmV0byA9ICF0b2dnbGVDYXQudmV0bztcbiAgICAgICAgaWYgKHRvZ2dsZUNhdC52ZXRvKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApICsgMSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmV0b2VzOiAodGhpcy5zdGF0ZS52ZXRvZXMgfHwgMCkgLSAxIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2dnbGluZyBzaW5nbGUgcmVzdGF1cmFudFxuICAgICAgICB2YXIgdG9nZ2xlRWF0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbY2F0ZWdvcnlJbmRleF0ucmVzdGF1cmFudHNbcmVzdGF1cmFudEluZGV4XTtcbiAgICAgICAgdG9nZ2xlRWF0LnJvdW5kQ2hvc2VuID0gIXRvZ2dsZUVhdC5yb3VuZENob3NlbjtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUucm91bmRDaG9zZW4pIHtcbiAgICAgICAgICB2YXIgaWogPSB0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuO1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLmdldENhdGVnb3JpZXMoKVtpalswXV0ucmVzdGF1cmFudHNbaWpbMV1dLnJvdW5kQ2hvc2VuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2dnbGVFYXQucm91bmRDaG9zZW4pIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcm91bmRDaG9zZW46IFtjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXhdIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3VuZENob3NlbjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uIChjYXQpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQucmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYXQucmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBpc0FueUNhdENob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2V0Q2F0ZWdvcmllcygpLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2F0ID0gdGhpcy5nZXRDYXRlZ29yaWVzKClbaV07XG4gICAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbihjYXQpKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICByZW5kZXJDYXRlZ29yaWVzOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciByZW5kZXJlZCA9IHRoaXMuZ2V0Q2F0ZWdvcmllcygpXG4gICAgLm1hcChmdW5jdGlvbiAoY2F0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lQ2F0ZWdvcnkoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmNhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5zdGF0ZS5tb2RlLCBcbiAgICAgICAgICAgICAgICBjaG9vc2U6dGhpcy5jbGlja0Nob3Nlbn0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgIHJlbmRlcmVkXG4gICAgICApXG4gICAgKTtcbiAgICAgICAgICAgIFxuICB9LFxuICByZW5kZXJCdXR0b25FZGl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbk1lc3NhZ2UgPSAnRWRpdCc7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBidXR0b25NZXNzYWdlID0gJ0Nsb3NlJztcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0TWUoKS5pc0NyZWF0b3IpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgICAgYnV0dG9uTWVzc2FnZVxuICAgICAgICApXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVySW5mbzogZnVuY3Rpb24gKCkge1xuICAgIHZhciB2ZXRvZXMgPSB0aGlzLnN0YXRlLnZldG9lcyB8fCAwXG4gICAgICAsIHJvdW5kQ2hvc2VuID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbiA/IDEgOiAwO1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicm9vbS1pbmZvIHB1bGwtcmlnaHRcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgdmV0b2VzKSwgXCIgdmV0b2VkXCIpLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgcm91bmRDaG9zZW4pLCBcIiBjaG9zZW5cIilcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlckNhbGxUb0FjdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1dpbm5lcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIFwiQW5kIHRoZSB3aW5uZXIgaXMuLi5cIilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICduZWVkQ2hvaWNlJykge1xuICAgICAgaWYgKHRoaXMuZ2V0TWUoKS5pc0NyZWF0b3IpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJDbGljayBFZGl0IGFuZCBtYWtlIHlvdXIgY2hvaWNlc1wiKVxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJUaGUgb3duZXIgb2YgdGhpcyByb29tIG5lZWQgdG8gY2hvb3NlIHNvbWUgb3B0aW9ucyBmcm9tIHRoZSBsaXN0IGZpcnN0XCIpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICByZW5kZXJCdXR0b25Jbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbk1lc3NhZ2UgPSAnSVxcJ20gRG9uZSc7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2Zyb3plbicpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy5pbml0RG9uZX0sIFxuICAgICAgICAgIGJ1dHRvbk1lc3NhZ2VcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtb2RlID0gdGhpcy5zdGF0ZS5tb2RlO1xuICAgIGlmICh0aGlzLnByb3BzLmhhc1dpbm5lcikge1xuICAgICAgbW9kZSA9ICd3aW5uZXInO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnRhYmxlKCB7Y2xhc3NOYW1lOlwidGFibGVcIiwgJ2RhdGEtbW9kZSc6bW9kZX0sIFxuICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDYWxsVG9BY3Rpb24oKSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2F0ZWdvcmllcygpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5ET00udGQoIHtjbGFzc05hbWU6XCJidXR0b24tcm93XCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJidXR0b24tcm93LWZpeGVkXCJ9LCBcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJJbmZvKCksXG4gICAgICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJjbGVhcmZpeFwifSksXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uRWRpdCgpLFxuICAgICAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY2xlYXJmaXhcIn0pLFxuICAgICAgICAgICAgICB0aGlzLnJlbmRlckJ1dHRvbkluaXQoKVxuICAgICAgICAgICAgKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUGVvcGxlUGFuZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ3NtYWxsJ1xuICAgIH07XG4gIH0sXG4gIGdldFBlb3BsZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnByb3BzLnBhcmVudC5zdGF0ZS5wZW9wbGU7XG4gIH0sXG4gIGdldE1lOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGFyZW50LnN0YXRlLm1lO1xuICB9LFxuICByZW5kZXJTbWFsbE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXNnID0gXCJcIlxuICAgICAgLCBoYXNQaWNrZWQgPSAwXG4gICAgICAsIG1lID0gdGhpcy5nZXRNZSgpO1xuICAgIGlmICghdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGgpIHtcbiAgICAgIG1zZyA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZXRQZW9wbGUoKS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGVyc29uID0gdGhpcy5nZXRQZW9wbGUoKVtpXTtcbiAgICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ2ZpbmlzaGVkJykge1xuICAgICAgICAgIGhhc1BpY2tlZCArPSAxO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtc2cgPSBoYXNQaWNrZWQgKyBcIiBvZiBcIiArIHRoaXMuZ2V0UGVvcGxlKCkubGVuZ3RoICsgXCIsIGluY2x1ZGluZyBtZSwgaGF2ZSBjaG9zZW5cIjtcbiAgICB9XG4gICAgcmV0dXJuIFJlYWN0LkRPTS5oMyhudWxsLCBtc2cpO1xuICB9LFxuICB0b2dnbGVNb2RlOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiAodGhpcy5zdGF0ZS5tb2RlID09PSAnc21hbGwnID8gJ2xhcmdlJyA6ICdzbWFsbCcpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlclNtYWxsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyU21hbGxNZXNzYWdlKCk7XG4gIH0sXG4gIHJlbmRlclBlb3BsZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmdldFBlb3BsZSgpXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocGVyc29uKSB7XG4gICAgICByZXR1cm4gcGVyc29uLl9pZCAhPT0gdGhpcy5nZXRNZSgpLl9pZDtcbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgdmFyIHBlcnNvbkNsYXNzID0gJ3B1bGwtbGVmdCBsYWJlbCBsYWJlbC0nO1xuICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ3dhaXRpbmcnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICd3YXJuaW5nJztcbiAgICAgIH0gZWxzZSBpZiAocGVyc29uLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdzdWNjZXNzJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdkZWZhdWx0JztcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOnBlcnNvbkNsYXNzfSwgcGVyc29uLm5hbWUpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlckxhcmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtZWRpYVwifSwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLm5hdigge2NsYXNzTmFtZTpcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIHJvb20tcGVvcGxlXCIsICdkYXRhLW1vZGUnOnRoaXMuc3RhdGUubW9kZSwgb25DbGljazp0aGlzLnRvZ2dsZU1vZGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNvbnRhaW5lclwifSwgXG4gICAgICAgICB0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyB0aGlzLnJlbmRlclNtYWxsKCkgOiB0aGlzLnJlbmRlckxhcmdlKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVJlc3RhdXJhbnREZXRhaWxzID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YTtcbiAgICBjb25zb2xlLmxvZygpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwicmVzdGF1cmFudC1kZXRhaWxzIG1lZGlhXCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInB1bGwtbGVmdFwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmltZygge2NsYXNzOlwibWVkaWEtb2JqZWN0XCIsIHNyYzplYXQuaW1hZ2VfdXJsLCBhbHQ6ZWF0Lm5hbWV9IClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzOlwibWVkaWEtYm9keVwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmg1KCB7Y2xhc3M6XCJtZWRpYS1oZWFkaW5nXCJ9LCBlYXQubmFtZSksXG4gICAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uaW1nKCB7Y2xhc3M6XCJtZWRpYS1vYmplY3RcIiwgc3JjOmVhdC5yYXRpbmdfaW1nX3VybF9zbWFsbCwgYWx0OlwicmF0aW5nc1wifSApKSxcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFxuICAgICAgICAgICAgUmVhY3QuRE9NLnNwYW4obnVsbCwgZWF0LmxvY2F0aW9uLmFkZHJlc3NbMF0gKyAnICcgKyBlYXQubG9jYXRpb24uY2l0eSlcbiAgICAgICAgICApLFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgXG4gICAgICAgICAgICBSZWFjdC5ET00uc3BhbihudWxsLCBlYXQuZGlzcGxheV9waG9uZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QZW9wbGUgPSByZXF1aXJlKCcuL3Jvb20tcGVvcGxlLmpzeCcpXG4gICwgUm9vbVBhbmUgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS5qc3gnKVxuICAsIFJvb21Nb2RhbCA9IHJlcXVpcmUoJy4vcm9vbS1tb2RhbC5qc3gnKVxuICAsIHJvb20gPSByZXF1aXJlKCdyZWFsdGltZS9yb29tJyk7XG5cbnZhciBSb29tID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7bG9jYXRpb246IHt9LCBjYXRlZ29yaWVzOiBbXSwgcGVvcGxlOiBbXSwgbWU6IHt9fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdGhpcy5sb2FkKCk7XG4gICAgcm9vbS5vbkpvaW5lZChmdW5jdGlvbiAocmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtwZW9wbGU6IHJlcy5jdXJyZW50fSk7XG4gICAgfSk7XG4gICAgcm9vbS5vbkxlZnQoZnVuY3Rpb24gKHJlcykge1xuICAgICAgc2VsZi5zZXRTdGF0ZSh7cGVvcGxlOiByZXMuY3VycmVudH0pO1xuICAgIH0pO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJvb20uY3JlYXRlUm9vbSh7bG9jYXRpb246IHJvb21Mb2NhdGlvbiB8fCAnbW91bnRhaW4gdmlldycsIG5hbWU6IHJvb21OYW1lfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgbG9jYXRpb246IHJlcy5sb2NhdGlvbixcbiAgICAgICAgY2F0ZWdvcmllczogcmVzLmNhdGVnb3JpZXNcbiAgICAgIH0pO1xuICAgICAgcm9vbS5qb2luUm9vbSh7cm9vbTogcmVzLnJvb20sIG5hbWU6ICdmb28nfSwgZnVuY3Rpb24gKGVyciwgcmVzKSB7XG4gICAgICAgIHNlbGYuc2V0U3RhdGUoe3Blb3BsZTogcmVzLmN1cnJlbnQsIG1lOiByZXMubWV9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBjaG9vc2VXaW5uZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ZWdvcmllcyA9IHRoaXMuc3RhdGUuY2F0ZWdvcmllc1xuICAgICAgLCB3aW5uaW5nQ2F0SW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnN0YXRlLmNhdGVnb3JpZXMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nQ2F0ID0gdGhpcy5zdGF0ZS5jYXRlZ29yaWVzW3dpbm5pbmdDYXRJbmRleF1cbiAgICAgICwgd2lubmluZ1Jlc3RhdXJhbnRJbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHdpbm5pbmdDYXQucmVzdGF1cmFudHMubGVuZ3RoKVxuICAgICAgLCB3aW5uaW5nUmVzdGF1cmFudCA9IHdpbm5pbmdDYXQucmVzdGF1cmFudHNbd2lubmluZ1Jlc3RhdXJhbnRJbmRleF07XG4gICAgd2lubmluZ0NhdC53aW5zID0gdHJ1ZTtcbiAgICB3aW5uaW5nUmVzdGF1cmFudC53aW5zID0gdHJ1ZTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGhhc1dpbm5lcjogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2lkOlwicm9vbVwifSwgXG4gICAgICAgIFJvb21QZW9wbGUoIHtyZWY6XCJwZW9wbGVcIixcbiAgICAgICAgICBwYXJlbnQ6dGhpc30gKSxcbiAgICAgICAgUm9vbVBhbmUoIHtyZWY6XCJwYW5lXCIsXG4gICAgICAgICAgcGFyZW50OnRoaXMsIGhhc1dpbm5lcjp0aGlzLnN0YXRlLmhhc1dpbm5lcn0gKSxcbiAgICAgICAgUm9vbU1vZGFsKCB7cmVmOlwibW9kYWxcIiwgXG4gICAgICAgICAgcGFyZW50OnRoaXN9IClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBSb29tKCB7dXJsOlwiL3JlYWx0aW1lXCJ9ICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb29tLWNvbnRhaW5lcicpXG4pO1xuIl19
;