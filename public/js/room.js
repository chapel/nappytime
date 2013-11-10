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
            if (countVal > 0) {
              onCountdown(countVal - 1);
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
      React.DOM.h2(null, this.renderCountdown())
    );
  }
});
},{"./room-countdown.jsx":1}],2:[function(require,module,exports){
/** @jsx React.DOM */
var RoomCountdown = require('./room-countdown.jsx');

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
    $(this.getDOMNode()).off('hidden', this.handleHidden);
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
  renderBody: function () {
    if (this.state.mode === 'countdown') {
      return (
        RoomCountdown( {countdown:30} )
      );
    } else {
      return React.DOM.div(null);
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

var RoomPaneRestaurant = module.exports = React.createClass({
  getInitialState: function () {
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
    return (
      React.DOM.li( {className:eatClass, onClick:this.onToggle}, 
        eat.name, this.renderLabel()
      )
    );
  }
});
},{}],5:[function(require,module,exports){
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
    this.props.getModal().startCountdown();
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.props.categories[categoryIndex];
        toggleCat.restaurants.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.props.categories[categoryIndex].restaurants[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    } else if (this.state.mode === 'frozen') {
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.props.categories[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.props.categories[categoryIndex].restaurants[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.props.categories[ij[0]].restaurants[ij[1]].roundChosen;
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
    for (var i = 0; i < this.props.categories.length; i++) {
      var cat = this.props.categories[i];
      if (this.doesCatHaveChosen(cat)) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    var rendered = this.props.categories
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
    return (
      React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.toggleMode}, 
        buttonMessage
      )
    );
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    return (
      React.DOM.div( {className:"room-info pull-right"}, 
        React.DOM.div(null, React.DOM.span( {className:"badge"}, vetoes), " vetoed"),
        React.DOM.div(null, React.DOM.span( {className:"badge"}, roundChosen), " chosen")
      )
    );
  },
  renderCallToAction: function () {
    if (this.state.mode === 'needChoice') {
      return (
        React.DOM.h4(null, "Click Edit and make your choices")
      );
    } else {
      return;
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'I\'m Done';
    return (
      React.DOM.button( {type:"button", className:"pull-right btn btn-default", onClick:this.initDone}, 
        buttonMessage
      )
    );
  },
  render: function () {
    return (
      React.DOM.table( {className:"table", 'data-mode':this.state.mode}, 
        React.DOM.tr(null, 
          React.DOM.td(null, 
            this.renderCallToAction(),
            this.renderCategories()
          ),
          React.DOM.td( {className:"buttonRow"}, 
            this.renderButtonEdit(),
            React.DOM.div( {className:"clearfix"}),
            this.renderInfo(),
            React.DOM.div( {className:"clearfix"}),
            this.renderButtonInit()
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
  renderSmallMessage: function () {
    var msg = ""
      , hasPicked = 0;
    if (!this.props.people.length) {
      msg = "You're all alone...";
    } else {
      for (var i = 0; i < this.props.people.length; i++) {
        if (this.props.people[i].state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.props.people.length + " have chosen";
      return (
        React.DOM.h3(null, msg)
      )
    }
    return msg;
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
    return this.props.people.map(function (person) {
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
          name: 'Alice'
        }
      });
    });
  },
  getModal: function () {
    return this.refs.modal;
  },
  render: function () {
    return (
      React.DOM.div( {id:"room"}, 
        RoomPeople( {people:this.state.people} ),
        RoomPane( {categories:this.state.categories, getModal:this.getModal}),
        RoomModal( {ref:"modal"} )
      )
    );
  }
});

React.renderComponent(
  Room( {url:"/realtime"} ),
  document.getElementById('room-container')
);

},{"./room-modal.jsx":2,"./room-pane.jsx":5,"./room-people.jsx":6}]},{},[1,2,3,4,5,6,7])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tY291bnRkb3duLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1tb2RhbC5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1yZXN0YXVyYW50LmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLmpzeCIsIi9Vc2Vycy9hbGluOS9Eb2N1bWVudHMvaGFjay9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2FsaW45L0RvY3VtZW50cy9oYWNrL25hcHB5dGltZS9jbGllbnQvcmVhY3Qvcm9vbS9yb29tLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpO1xuXG52YXIgUm9vbU1vZGFsID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpc1xuICAgICAgLCBvbkNvdW50ZG93biA9IGZ1bmN0aW9uIG9uQ291bnRkb3duKGNvdW50VmFsKSB7XG4gICAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBjb3VudGRvd246IGNvdW50VmFsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoY291bnRWYWwgPiAwKSB7XG4gICAgICAgICAgICAgIG9uQ291bnRkb3duKGNvdW50VmFsIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgMTAwMCk7XG4gICAgICAgIH07XG4gICAgb25Db3VudGRvd24odGhpcy5wcm9wcy5jb3VudGRvd24pO1xuICB9LFxuICByZW5kZXJDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWluID0gKHRoaXMuc3RhdGUuY291bnRkb3duIC8gNjApIHwgMFxuICAgICAgLCBzZWMgPSAodGhpcy5zdGF0ZS5jb3VudGRvd24gJSA2MCk7XG4gICAgcmV0dXJuIChtaW4gPCAxMCA/ICcwJyA6ICcnKSArIG1pbiArICc6JyArIChzZWMgPCAxMCA/ICcwJyA6ICcnKSArIHNlYztcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5oMihudWxsLCB0aGlzLnJlbmRlckNvdW50ZG93bigpKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xudmFyIFJvb21Db3VudGRvd24gPSByZXF1aXJlKCcuL3Jvb20tY291bnRkb3duLmpzeCcpO1xuXG52YXIgUm9vbU1vZGFsID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgLy8gVGhlIGZvbGxvd2luZyB0d28gbWV0aG9kcyBhcmUgdGhlIG9ubHkgcGxhY2VzIHdlIG5lZWQgdG9cbiAgLy8gaW50ZWdyYXRlIHdpdGggQm9vdHN0cmFwIG9yIGpRdWVyeSFcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIC8vIFdoZW4gdGhlIGNvbXBvbmVudCBpcyBhZGRlZCwgdHVybiBpdCBpbnRvIGEgbW9kYWxcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKVxuICAgICAgLm1vZGFsKHtiYWNrZHJvcDogJ3N0YXRpYycsIGtleWJvYXJkOiBmYWxzZSwgc2hvdzogZmFsc2V9KTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFVubW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICQodGhpcy5nZXRET01Ob2RlKCkpLm9mZignaGlkZGVuJywgdGhpcy5oYW5kbGVIaWRkZW4pO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcbiAgfSxcbiAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcbiAgfSxcbiAgc3RhcnRDb3VudGRvd246IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICdjb3VudGRvd24nXG4gICAgfSk7XG4gICAgdGhpcy5vcGVuKCk7XG4gIH0sXG4gIHJlbmRlckJvZHk6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnY291bnRkb3duJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUm9vbUNvdW50ZG93bigge2NvdW50ZG93bjozMH0gKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFJlYWN0LkRPTS5kaXYobnVsbCk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1vZGFsIGZhZGVcIn0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtZGlhbG9nXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwtY29udGVudFwifSwgXG4gICAgICAgICAgICB0aGlzLnJlbmRlckJvZHkoKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtcmVzdGF1cmFudC5qc3gnKTtcblxudmFyIFJvb21QYW5lQ2F0ZWdvcnkgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN0YXVyYW50cyA9IHRoaXMucHJvcHMuZGF0YS5yZXN0YXVyYW50cztcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHJlc3RhdXJhbnRzW2ldLmNob3Nlbikge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oKSwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS52ZXRvKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImxhYmVsIGxhYmVsLWRhbmdlclwifSwgXCJWZXRvZWQhXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBuYW1lID0gY2F0Lm5hbWVcbiAgICAgICwgcmVzdGF1cmFudHMgPSBjYXQucmVzdGF1cmFudHM7XG4gICAgdmFyIGNhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1jYXRcIjtcbiAgICBpZiAodGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpKSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgY2F0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICB2YXIgcmVuZGVyZWQgPSByZXN0YXVyYW50c1xuICAgIC5tYXAoZnVuY3Rpb24gKGVhdCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBSb29tUGFuZVJlc3RhdXJhbnQoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmVhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIHBhcmVudEluZGV4OnRoaXMucHJvcHMuaW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5wcm9wcy5tb2RlLFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLnByb3BzLmNob29zZX0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmNhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmg0KG51bGwsIG5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKSksXG4gICAgICAgIFJlYWN0LkRPTS51bCgge2NsYXNzTmFtZTpcImxpc3QtZ3JvdXBcIn0sIFxuICAgICAgICAgIHJlbmRlcmVkXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFJvb21QYW5lUmVzdGF1cmFudCA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgfSxcbiAgb25Ub2dnbGU6IGZ1bmN0aW9uIChldikge1xuICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5wcm9wcy5jaG9vc2UoIXRoaXMucHJvcHMuZGF0YS5jaG9zZW4sIHRoaXMucHJvcHMucGFyZW50SW5kZXgsIHRoaXMucHJvcHMuaW5kZXgpO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyTGFiZWw6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5tb2RlID09PSAnZnJvemVuJyAmJiB0aGlzLnByb3BzLmRhdGEucm91bmRDaG9zZW4pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtc3VjY2Vzc1wifSwgXCJDaG9zZW4hXCIpXG4gICAgICApO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGVhdCA9IHRoaXMucHJvcHMuZGF0YVxuICAgICAgLCBlYXRDbGFzcyA9IFwibGlzdC1ncm91cC1pdGVtIHJvb20tcmVzdFwiO1xuICAgIGlmIChlYXQuY2hvc2VuKSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBjaG9zZW5cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZWF0Q2xhc3MgKz0gXCIgbm90LWNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmxpKCB7Y2xhc3NOYW1lOmVhdENsYXNzLCBvbkNsaWNrOnRoaXMub25Ub2dnbGV9LCBcbiAgICAgICAgZWF0Lm5hbWUsIHRoaXMucmVuZGVyTGFiZWwoKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLWNhdGVnb3J5LmpzeCcpO1xuXG52YXIgUm9vbVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdmcm96ZW4nXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWQoKTtcbiAgfSxcbiAgbG9hZDogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogdGhpcy5nZXRGcm96ZW5TdGF0ZSgpXG4gICAgfSk7XG4gIH0sXG4gIGdldEZyb3plblN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLmlzQW55Q2F0Q2hvc2VuKCkpIHtcbiAgICAgIHJldHVybiAnbmVlZENob2ljZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnZnJvemVuJztcbiAgICB9XG4gIH0sXG4gIGluaXREb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5wcm9wcy5nZXRNb2RhbCgpLnN0YXJ0Q291bnRkb3duKCk7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdlZGl0JyA/IHRoaXMuZ2V0RnJvemVuU3RhdGUoKSA6ICdlZGl0JylcbiAgICB9KTtcbiAgfSxcbiAgY2xpY2tDaG9zZW46IGZ1bmN0aW9uIChpc0Nob3NlbiwgY2F0ZWdvcnlJbmRleCwgcmVzdGF1cmFudEluZGV4KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBpZiAodHlwZW9mKHJlc3RhdXJhbnRJbmRleCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHRvZ2dsaW5nIHdob2xlIGNhdGVnb3J5XG4gICAgICAgIHZhciB0b2dnbGVDYXQgPSB0aGlzLnByb3BzLmNhdGVnb3JpZXNbY2F0ZWdvcnlJbmRleF07XG4gICAgICAgIHRvZ2dsZUNhdC5yZXN0YXVyYW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlYXQpIHtcbiAgICAgICAgICBlYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQuY2hvc2VuID0gaXNDaG9zZW47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdmcm96ZW4nKSB7XG4gICAgICAvLyB2ZXRvIC8gcm91bmRDaG9zZW4gbW9kZVxuICAgICAgaWYgKHR5cGVvZihyZXN0YXVyYW50SW5kZXgpID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAvLyB2ZXRvIGJ5IGNhdGVnb3JpZXNcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XTtcbiAgICAgICAgdG9nZ2xlQ2F0LnZldG8gPSAhdG9nZ2xlQ2F0LnZldG87XG4gICAgICAgIGlmICh0b2dnbGVDYXQudmV0bykge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2ZXRvZXM6ICh0aGlzLnN0YXRlLnZldG9lcyB8fCAwKSArIDEgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApIC0gMSB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgc2luZ2xlIHJlc3RhdXJhbnRcbiAgICAgICAgdmFyIHRvZ2dsZUVhdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XS5yZXN0YXVyYW50c1tyZXN0YXVyYW50SW5kZXhdO1xuICAgICAgICB0b2dnbGVFYXQucm91bmRDaG9zZW4gPSAhdG9nZ2xlRWF0LnJvdW5kQ2hvc2VuO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5yb3VuZENob3Nlbikge1xuICAgICAgICAgIHZhciBpaiA9IHRoaXMuc3RhdGUucm91bmRDaG9zZW47XG4gICAgICAgICAgZGVsZXRlIHRoaXMucHJvcHMuY2F0ZWdvcmllc1tpalswXV0ucmVzdGF1cmFudHNbaWpbMV1dLnJvdW5kQ2hvc2VuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2dnbGVFYXQucm91bmRDaG9zZW4pIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcm91bmRDaG9zZW46IFtjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXhdIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3VuZENob3NlbjogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZG9lc0NhdEhhdmVDaG9zZW46IGZ1bmN0aW9uIChjYXQpIHtcbiAgICB2YXIgaGFzQ2hvc2VuID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYXQucmVzdGF1cmFudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChjYXQucmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBpc0FueUNhdENob3NlbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcHMuY2F0ZWdvcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNhdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllc1tpXTtcbiAgICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKGNhdCkpIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIHJlbmRlckNhdGVnb3JpZXM6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIHJlbmRlcmVkID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzXG4gICAgLm1hcChmdW5jdGlvbiAoY2F0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lQ2F0ZWdvcnkoIFxuICAgICAgICAgICAgICAgIHtkYXRhOmNhdCwgXG4gICAgICAgICAgICAgICAgaW5kZXg6aW5kZXgsIFxuICAgICAgICAgICAgICAgIG1vZGU6dGhpcy5zdGF0ZS5tb2RlLCBcbiAgICAgICAgICAgICAgICBjaG9vc2U6dGhpcy5jbGlja0Nob3Nlbn0gKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgIHJlbmRlcmVkXG4gICAgICApXG4gICAgKTtcbiAgICAgICAgICAgIFxuICB9LFxuICByZW5kZXJCdXR0b25FZGl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbk1lc3NhZ2UgPSAnRWRpdCc7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnKSB7XG4gICAgICBidXR0b25NZXNzYWdlID0gJ0Nsb3NlJztcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy50b2dnbGVNb2RlfSwgXG4gICAgICAgIGJ1dHRvbk1lc3NhZ2VcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJJbmZvOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZldG9lcyA9IHRoaXMuc3RhdGUudmV0b2VzIHx8IDBcbiAgICAgICwgcm91bmRDaG9zZW4gPSB0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuID8gMSA6IDA7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJyb29tLWluZm8gcHVsbC1yaWdodFwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgdmV0b2VzKSwgXCIgdmV0b2VkXCIpLFxuICAgICAgICBSZWFjdC5ET00uZGl2KG51bGwsIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiYmFkZ2VcIn0sIHJvdW5kQ2hvc2VuKSwgXCIgY2hvc2VuXCIpXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyQ2FsbFRvQWN0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ25lZWRDaG9pY2UnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgXCJDbGljayBFZGl0IGFuZCBtYWtlIHlvdXIgY2hvaWNlc1wiKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyQnV0dG9uSW5pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25NZXNzYWdlID0gJ0lcXCdtIERvbmUnO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uYnV0dG9uKCB7dHlwZTpcImJ1dHRvblwiLCBjbGFzc05hbWU6XCJwdWxsLXJpZ2h0IGJ0biBidG4tZGVmYXVsdFwiLCBvbkNsaWNrOnRoaXMuaW5pdERvbmV9LCBcbiAgICAgICAgYnV0dG9uTWVzc2FnZVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udGFibGUoIHtjbGFzc05hbWU6XCJ0YWJsZVwiLCAnZGF0YS1tb2RlJzp0aGlzLnN0YXRlLm1vZGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLnRyKG51bGwsIFxuICAgICAgICAgIFJlYWN0LkRPTS50ZChudWxsLCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2FsbFRvQWN0aW9uKCksXG4gICAgICAgICAgICB0aGlzLnJlbmRlckNhdGVnb3JpZXMoKVxuICAgICAgICAgICksXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKCB7Y2xhc3NOYW1lOlwiYnV0dG9uUm93XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uRWRpdCgpLFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVySW5mbygpLFxuICAgICAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNsZWFyZml4XCJ9KSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQnV0dG9uSW5pdCgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBQZW9wbGVQYW5lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtb2RlOiAnc21hbGwnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyU21hbGxNZXNzYWdlOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG1zZyA9IFwiXCJcbiAgICAgICwgaGFzUGlja2VkID0gMDtcbiAgICBpZiAoIXRoaXMucHJvcHMucGVvcGxlLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJZb3UncmUgYWxsIGFsb25lLi4uXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5wZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMucHJvcHMucGVvcGxlW2ldLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgICAgaGFzUGlja2VkICs9IDE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIG1zZyA9IGhhc1BpY2tlZCArIFwiIG9mIFwiICsgdGhpcy5wcm9wcy5wZW9wbGUubGVuZ3RoICsgXCIgaGF2ZSBjaG9zZW5cIjtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5oMyhudWxsLCBtc2cpXG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiBtc2c7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyAnbGFyZ2UnIDogJ3NtYWxsJylcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTbWFsbE1lc3NhZ2UoKTtcbiAgfSxcbiAgcmVuZGVyUGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGVvcGxlLm1hcChmdW5jdGlvbiAocGVyc29uKSB7XG4gICAgICB2YXIgcGVyc29uQ2xhc3MgPSAncHVsbC1sZWZ0IGxhYmVsIGxhYmVsLSc7XG4gICAgICBpZiAocGVyc29uLnN0YXRlID09PSAnd2FpdGluZycpIHtcbiAgICAgICAgcGVyc29uQ2xhc3MgKz0gJ3dhcm5pbmcnO1xuICAgICAgfSBlbHNlIGlmIChwZXJzb24uc3RhdGUgPT09ICdmaW5pc2hlZCcpIHtcbiAgICAgICAgcGVyc29uQ2xhc3MgKz0gJ3N1Y2Nlc3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGVyc29uQ2xhc3MgKz0gJ2RlZmF1bHQnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6cGVyc29uQ2xhc3N9LCBwZXJzb24ubmFtZSlcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyTGFyZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcIm1lZGlhXCJ9LCBcbiAgICAgICAgdGhpcy5yZW5kZXJQZW9wbGUoKVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubmF2KCB7Y2xhc3NOYW1lOlwibmF2YmFyIG5hdmJhci1kZWZhdWx0IG5hdmJhci1maXhlZC10b3Agcm9vbS1wZW9wbGVcIiwgJ2RhdGEtbW9kZSc6dGhpcy5zdGF0ZS5tb2RlLCBvbkNsaWNrOnRoaXMudG9nZ2xlTW9kZX0sIFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY29udGFpbmVyXCJ9LCBcbiAgICAgICAgIHRoaXMuc3RhdGUubW9kZSA9PT0gJ3NtYWxsJyA/IHRoaXMucmVuZGVyU21hbGwoKSA6IHRoaXMucmVuZGVyTGFyZ2UoKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGVvcGxlID0gcmVxdWlyZSgnLi9yb29tLXBlb3BsZS5qc3gnKVxuICAsIFJvb21QYW5lID0gcmVxdWlyZSgnLi9yb29tLXBhbmUuanN4JylcbiAgLCBSb29tTW9kYWwgPSByZXF1aXJlKCcuL3Jvb20tbW9kYWwuanN4JylcbiAgLCByb29tID0gcmVxdWlyZSgncmVhbHRpbWUvcm9vbScpO1xuXG52YXIgUm9vbSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge2xvY2F0aW9uOiB7fSwgY2F0ZWdvcmllczogW10sIHBlb3BsZTogW10sIG1lOiB7fX07XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5sb2FkKCk7XG4gIH0sXG4gIGxvYWQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcm9vbS5jcmVhdGVSb29tKHtsb2NhdGlvbjogcm9vbUxvY2F0aW9uIHx8ICdtb3VudGFpbiB2aWV3J30sIGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgIGxvY2F0aW9uOiByZXMubG9jYXRpb24sIFxuICAgICAgICBjYXRlZ29yaWVzOiByZXMuY2F0ZWdvcmllcywgXG4gICAgICAgIHBlb3BsZTogW1xuICAgICAgICAgIHsgbmFtZTogJ0FsaWNlJywgaWQ6ICcxMjMnLCBzdGF0ZTogJ3dhaXRpbmcnIH0sXG4gICAgICAgICAgeyBuYW1lOiAnQm9iJywgaWQ6ICc0NTYnLCBzdGF0ZTogJ2ZpbmlzaGVkJyB9LFxuICAgICAgICAgIHsgbmFtZTogJ0NoYXJsaWUnLCBpZDogJzc4OScsIHN0YXRlOiAnZmluaXNoZWQnIH1cbiAgICAgICAgXSxcbiAgICAgICAgbWU6IHtcbiAgICAgICAgICBuYW1lOiAnQWxpY2UnXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICBnZXRNb2RhbDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlZnMubW9kYWw7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7aWQ6XCJyb29tXCJ9LCBcbiAgICAgICAgUm9vbVBlb3BsZSgge3Blb3BsZTp0aGlzLnN0YXRlLnBlb3BsZX0gKSxcbiAgICAgICAgUm9vbVBhbmUoIHtjYXRlZ29yaWVzOnRoaXMuc3RhdGUuY2F0ZWdvcmllcywgZ2V0TW9kYWw6dGhpcy5nZXRNb2RhbH0pLFxuICAgICAgICBSb29tTW9kYWwoIHtyZWY6XCJtb2RhbFwifSApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlckNvbXBvbmVudChcbiAgUm9vbSgge3VybDpcIi9yZWFsdGltZVwifSApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vbS1jb250YWluZXInKVxuKTtcbiJdfQ==
;