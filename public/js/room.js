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
      , hasPicked = 0
      , me = this.props.me;
    if (!this.props.people.length) {
      msg = "";
    } else {
      for (var i = 0; i < this.props.people.length; i++) {
        var person = this.props.people[i];
        if (person.state === 'finished') {
          hasPicked += 1;
        }
      }
      msg = hasPicked + " of " + this.props.people.length + ", including me, have chosen";
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
    return this.props.people
    .filter(function (person) {
      return person.name !== this.props.me.name;
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
      React.DOM.div( {id:"room"}, 
        RoomPeople( {people:this.state.people, me:this.state.me} ),
        RoomPane( {categories:this.state.categories, 
          me:this.state.me,
          getModal:this.getModal}),
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1jb3VudGRvd24uanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tbW9kYWwuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS1jYXRlZ29yeS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wYW5lLXJlc3RhdXJhbnQuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20tcGFuZS5qc3giLCIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L3Jvb20vcm9vbS1wZW9wbGUuanN4IiwiL1VzZXJzL2pjaGFwZWwvUHJvamVjdHMvbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9yb29tL3Jvb20uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDektBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbUNvdW50ZG93biA9IHJlcXVpcmUoJy4vcm9vbS1jb3VudGRvd24uanN4Jyk7XG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzXG4gICAgICAsIG9uQ291bnRkb3duID0gZnVuY3Rpb24gb25Db3VudGRvd24oY291bnRWYWwpIHtcbiAgICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGNvdW50ZG93bjogY291bnRWYWxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChjb3VudFZhbCA+IDApIHtcbiAgICAgICAgICAgICAgb25Db3VudGRvd24oY291bnRWYWwgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfTtcbiAgICBvbkNvdW50ZG93bih0aGlzLnByb3BzLmNvdW50ZG93bik7XG4gIH0sXG4gIHJlbmRlckNvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBtaW4gPSAodGhpcy5zdGF0ZS5jb3VudGRvd24gLyA2MCkgfCAwXG4gICAgICAsIHNlYyA9ICh0aGlzLnN0YXRlLmNvdW50ZG93biAlIDYwKTtcbiAgICByZXR1cm4gKG1pbiA8IDEwID8gJzAnIDogJycpICsgbWluICsgJzonICsgKHNlYyA8IDEwID8gJzAnIDogJycpICsgc2VjO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmgyKG51bGwsIHRoaXMucmVuZGVyQ291bnRkb3duKCkpXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG52YXIgUm9vbUNvdW50ZG93biA9IHJlcXVpcmUoJy4vcm9vbS1jb3VudGRvd24uanN4Jyk7XG5cbnZhciBSb29tTW9kYWwgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICAvLyBUaGUgZm9sbG93aW5nIHR3byBtZXRob2RzIGFyZSB0aGUgb25seSBwbGFjZXMgd2UgbmVlZCB0b1xuICAvLyBpbnRlZ3JhdGUgd2l0aCBCb290c3RyYXAgb3IgalF1ZXJ5IVxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgLy8gV2hlbiB0aGUgY29tcG9uZW50IGlzIGFkZGVkLCB0dXJuIGl0IGludG8gYSBtb2RhbFxuICAgICQodGhpcy5nZXRET01Ob2RlKCkpXG4gICAgICAubW9kYWwoe2JhY2tkcm9wOiAnc3RhdGljJywga2V5Ym9hcmQ6IGZhbHNlLCBzaG93OiBmYWxzZX0pO1xuICB9LFxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzLmdldERPTU5vZGUoKSkub2ZmKCdoaWRkZW4nLCB0aGlzLmhhbmRsZUhpZGRlbik7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xuICB9LFxuICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAkKHRoaXMuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xuICB9LFxuICBzdGFydENvdW50ZG93bjogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogJ2NvdW50ZG93bidcbiAgICB9KTtcbiAgICB0aGlzLm9wZW4oKTtcbiAgfSxcbiAgcmVuZGVyQm9keTogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLm1vZGUgPT09ICdjb3VudGRvd24nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICBSb29tQ291bnRkb3duKCB7Y291bnRkb3duOjMwfSApXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gUmVhY3QuRE9NLmRpdihudWxsKTtcbiAgICB9XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwibW9kYWwgZmFkZVwifSwgXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1kaWFsb2dcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtb2RhbC1jb250ZW50XCJ9LCBcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQm9keSgpXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZVJlc3RhdXJhbnQgPSByZXF1aXJlKCcuL3Jvb20tcGFuZS1yZXN0YXVyYW50LmpzeCcpO1xuXG52YXIgUm9vbVBhbmVDYXRlZ29yeSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGRvZXNDYXRIYXZlQ2hvc2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3RhdXJhbnRzID0gdGhpcy5wcm9wcy5kYXRhLnJlc3RhdXJhbnRzO1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3RhdXJhbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVzdGF1cmFudHNbaV0uY2hvc2VuKSB7XG4gICAgICAgIGhhc0Nob3NlbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaGFzQ2hvc2VuO1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5kb2VzQ2F0SGF2ZUNob3NlbigpLCB0aGlzLnByb3BzLmluZGV4KTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlckxhYmVsOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMubW9kZSA9PT0gJ2Zyb3plbicgJiYgdGhpcy5wcm9wcy5kYXRhLnZldG8pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwibGFiZWwgbGFiZWwtZGFuZ2VyXCJ9LCBcIlZldG9lZCFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIG5hbWUgPSBjYXQubmFtZVxuICAgICAgLCByZXN0YXVyYW50cyA9IGNhdC5yZXN0YXVyYW50cztcbiAgICB2YXIgY2F0Q2xhc3MgPSBcImxpc3QtZ3JvdXAtaXRlbSByb29tLWNhdFwiO1xuICAgIGlmICh0aGlzLmRvZXNDYXRIYXZlQ2hvc2VuKCkpIHtcbiAgICAgIGNhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIHZhciByZW5kZXJlZCA9IHJlc3RhdXJhbnRzXG4gICAgLm1hcChmdW5jdGlvbiAoZWF0LCBpbmRleCkge1xuICAgICAgcmV0dXJuIFJvb21QYW5lUmVzdGF1cmFudCggXG4gICAgICAgICAgICAgICAge2RhdGE6ZWF0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgcGFyZW50SW5kZXg6dGhpcy5wcm9wcy5pbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLnByb3BzLm1vZGUsXG4gICAgICAgICAgICAgICAgY2hvb3NlOnRoaXMucHJvcHMuY2hvb3NlfSApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6Y2F0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBSZWFjdC5ET00uaDQobnVsbCwgbmFtZSwgdGhpcy5yZW5kZXJMYWJlbCgpKSxcbiAgICAgICAgUmVhY3QuRE9NLnVsKCB7Y2xhc3NOYW1lOlwibGlzdC1ncm91cFwifSwgXG4gICAgICAgICAgcmVuZGVyZWRcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBhbmVSZXN0YXVyYW50ID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICB9LFxuICBvblRvZ2dsZTogZnVuY3Rpb24gKGV2KSB7XG4gICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnByb3BzLmNob29zZSghdGhpcy5wcm9wcy5kYXRhLmNob3NlbiwgdGhpcy5wcm9wcy5wYXJlbnRJbmRleCwgdGhpcy5wcm9wcy5pbmRleCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXJMYWJlbDogZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnByb3BzLm1vZGUgPT09ICdmcm96ZW4nICYmIHRoaXMucHJvcHMuZGF0YS5yb3VuZENob3Nlbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJsYWJlbCBsYWJlbC1zdWNjZXNzXCJ9LCBcIkNob3NlbiFcIilcbiAgICAgICk7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZWF0ID0gdGhpcy5wcm9wcy5kYXRhXG4gICAgICAsIGVhdENsYXNzID0gXCJsaXN0LWdyb3VwLWl0ZW0gcm9vbS1yZXN0XCI7XG4gICAgaWYgKGVhdC5jaG9zZW4pIHtcbiAgICAgIGVhdENsYXNzICs9IFwiIGNob3NlblwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBlYXRDbGFzcyArPSBcIiBub3QtY2hvc2VuXCI7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00ubGkoIHtjbGFzc05hbWU6ZWF0Q2xhc3MsIG9uQ2xpY2s6dGhpcy5vblRvZ2dsZX0sIFxuICAgICAgICBlYXQubmFtZSwgdGhpcy5yZW5kZXJMYWJlbCgpXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBSb29tUGFuZUNhdGVnb3J5ID0gcmVxdWlyZSgnLi9yb29tLXBhbmUtY2F0ZWdvcnkuanN4Jyk7XG5cbnZhciBSb29tUGFuZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbW9kZTogJ2Zyb3plbidcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZCgpO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb2RlOiB0aGlzLmdldEZyb3plblN0YXRlKClcbiAgICB9KTtcbiAgfSxcbiAgZ2V0RnJvemVuU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuaXNBbnlDYXRDaG9zZW4oKSkge1xuICAgICAgcmV0dXJuICduZWVkQ2hvaWNlJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdmcm96ZW4nO1xuICAgIH1cbiAgfSxcbiAgaW5pdERvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnByb3BzLmdldE1vZGFsKCkuc3RhcnRDb3VudGRvd24oKTtcbiAgfSxcbiAgdG9nZ2xlTW9kZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW9kZTogKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2VkaXQnID8gdGhpcy5nZXRGcm96ZW5TdGF0ZSgpIDogJ2VkaXQnKVxuICAgIH0pO1xuICB9LFxuICBjbGlja0Nob3NlbjogZnVuY3Rpb24gKGlzQ2hvc2VuLCBjYXRlZ29yeUluZGV4LCByZXN0YXVyYW50SW5kZXgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIGlmICh0eXBlb2YocmVzdGF1cmFudEluZGV4KSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgLy8gdG9nZ2xpbmcgd2hvbGUgY2F0ZWdvcnlcbiAgICAgICAgdmFyIHRvZ2dsZUNhdCA9IHRoaXMucHJvcHMuY2F0ZWdvcmllc1tjYXRlZ29yeUluZGV4XTtcbiAgICAgICAgdG9nZ2xlQ2F0LnJlc3RhdXJhbnRzLmZvckVhY2goZnVuY3Rpb24gKGVhdCkge1xuICAgICAgICAgIGVhdC5jaG9zZW4gPSBpc0Nob3NlbjtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2dnbGluZyBzaW5nbGUgcmVzdGF1cmFudFxuICAgICAgICB2YXIgdG9nZ2xlRWF0ID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzW2NhdGVnb3J5SW5kZXhdLnJlc3RhdXJhbnRzW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5jaG9zZW4gPSBpc0Nob3NlbjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUubW9kZSA9PT0gJ2Zyb3plbicpIHtcbiAgICAgIC8vIHZldG8gLyByb3VuZENob3NlbiBtb2RlXG4gICAgICBpZiAodHlwZW9mKHJlc3RhdXJhbnRJbmRleCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIC8vIHZldG8gYnkgY2F0ZWdvcmllc1xuICAgICAgICB2YXIgdG9nZ2xlQ2F0ID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzW2NhdGVnb3J5SW5kZXhdO1xuICAgICAgICB0b2dnbGVDYXQudmV0byA9ICF0b2dnbGVDYXQudmV0bztcbiAgICAgICAgaWYgKHRvZ2dsZUNhdC52ZXRvKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZldG9lczogKHRoaXMuc3RhdGUudmV0b2VzIHx8IDApICsgMSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmV0b2VzOiAodGhpcy5zdGF0ZS52ZXRvZXMgfHwgMCkgLSAxIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2dnbGluZyBzaW5nbGUgcmVzdGF1cmFudFxuICAgICAgICB2YXIgdG9nZ2xlRWF0ID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzW2NhdGVnb3J5SW5kZXhdLnJlc3RhdXJhbnRzW3Jlc3RhdXJhbnRJbmRleF07XG4gICAgICAgIHRvZ2dsZUVhdC5yb3VuZENob3NlbiA9ICF0b2dnbGVFYXQucm91bmRDaG9zZW47XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnJvdW5kQ2hvc2VuKSB7XG4gICAgICAgICAgdmFyIGlqID0gdGhpcy5zdGF0ZS5yb3VuZENob3NlbjtcbiAgICAgICAgICBkZWxldGUgdGhpcy5wcm9wcy5jYXRlZ29yaWVzW2lqWzBdXS5yZXN0YXVyYW50c1tpalsxXV0ucm91bmRDaG9zZW47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRvZ2dsZUVhdC5yb3VuZENob3Nlbikge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyByb3VuZENob3NlbjogW2NhdGVnb3J5SW5kZXgsIHJlc3RhdXJhbnRJbmRleF0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJvdW5kQ2hvc2VuOiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBkb2VzQ2F0SGF2ZUNob3NlbjogZnVuY3Rpb24gKGNhdCkge1xuICAgIHZhciBoYXNDaG9zZW4gPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhdC5yZXN0YXVyYW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGNhdC5yZXN0YXVyYW50c1tpXS5jaG9zZW4pIHtcbiAgICAgICAgaGFzQ2hvc2VuID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBoYXNDaG9zZW47XG4gIH0sXG4gIGlzQW55Q2F0Q2hvc2VuOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhc0Nob3NlbiA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5jYXRlZ29yaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2F0ID0gdGhpcy5wcm9wcy5jYXRlZ29yaWVzW2ldO1xuICAgICAgaWYgKHRoaXMuZG9lc0NhdEhhdmVDaG9zZW4oY2F0KSkge1xuICAgICAgICBoYXNDaG9zZW4gPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGhhc0Nob3NlbjtcbiAgfSxcbiAgcmVuZGVyQ2F0ZWdvcmllczogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgcmVuZGVyZWQgPSB0aGlzLnByb3BzLmNhdGVnb3JpZXNcbiAgICAubWFwKGZ1bmN0aW9uIChjYXQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gUm9vbVBhbmVDYXRlZ29yeSggXG4gICAgICAgICAgICAgICAge2RhdGE6Y2F0LCBcbiAgICAgICAgICAgICAgICBpbmRleDppbmRleCwgXG4gICAgICAgICAgICAgICAgbW9kZTp0aGlzLnN0YXRlLm1vZGUsIFxuICAgICAgICAgICAgICAgIGNob29zZTp0aGlzLmNsaWNrQ2hvc2VufSApO1xuICAgIH0sIHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00udWwoIHtjbGFzc05hbWU6XCJsaXN0LWdyb3VwXCJ9LCBcbiAgICAgICAgcmVuZGVyZWRcbiAgICAgIClcbiAgICApO1xuICAgICAgICAgICAgXG4gIH0sXG4gIHJlbmRlckJ1dHRvbkVkaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uTWVzc2FnZSA9ICdFZGl0JztcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnZWRpdCcpIHtcbiAgICAgIGJ1dHRvbk1lc3NhZ2UgPSAnQ2xvc2UnO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge3R5cGU6XCJidXR0b25cIiwgY2xhc3NOYW1lOlwicHVsbC1yaWdodCBidG4gYnRuLWRlZmF1bHRcIiwgb25DbGljazp0aGlzLnRvZ2dsZU1vZGV9LCBcbiAgICAgICAgYnV0dG9uTWVzc2FnZVxuICAgICAgKVxuICAgICk7XG4gIH0sXG4gIHJlbmRlckluZm86IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmV0b2VzID0gdGhpcy5zdGF0ZS52ZXRvZXMgfHwgMFxuICAgICAgLCByb3VuZENob3NlbiA9IHRoaXMuc3RhdGUucm91bmRDaG9zZW4gPyAxIDogMDtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcInJvb20taW5mbyBwdWxsLXJpZ2h0XCJ9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdihudWxsLCBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImJhZGdlXCJ9LCB2ZXRvZXMpLCBcIiB2ZXRvZWRcIiksXG4gICAgICAgIFJlYWN0LkRPTS5kaXYobnVsbCwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJiYWRnZVwifSwgcm91bmRDaG9zZW4pLCBcIiBjaG9zZW5cIilcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXJDYWxsVG9BY3Rpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5tb2RlID09PSAnbmVlZENob2ljZScpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFJlYWN0LkRPTS5oNChudWxsLCBcIkNsaWNrIEVkaXQgYW5kIG1ha2UgeW91ciBjaG9pY2VzXCIpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9LFxuICByZW5kZXJCdXR0b25Jbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbk1lc3NhZ2UgPSAnSVxcJ20gRG9uZSc7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5idXR0b24oIHt0eXBlOlwiYnV0dG9uXCIsIGNsYXNzTmFtZTpcInB1bGwtcmlnaHQgYnRuIGJ0bi1kZWZhdWx0XCIsIG9uQ2xpY2s6dGhpcy5pbml0RG9uZX0sIFxuICAgICAgICBidXR0b25NZXNzYWdlXG4gICAgICApXG4gICAgKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS50YWJsZSgge2NsYXNzTmFtZTpcInRhYmxlXCIsICdkYXRhLW1vZGUnOnRoaXMuc3RhdGUubW9kZX0sIFxuICAgICAgICBSZWFjdC5ET00udHIobnVsbCwgXG4gICAgICAgICAgUmVhY3QuRE9NLnRkKG51bGwsIFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJDYWxsVG9BY3Rpb24oKSxcbiAgICAgICAgICAgIHRoaXMucmVuZGVyQ2F0ZWdvcmllcygpXG4gICAgICAgICAgKSxcbiAgICAgICAgICBSZWFjdC5ET00udGQoIHtjbGFzc05hbWU6XCJidXR0b25Sb3dcIn0sIFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJCdXR0b25FZGl0KCksXG4gICAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY2xlYXJmaXhcIn0pLFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJJbmZvKCksXG4gICAgICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiY2xlYXJmaXhcIn0pLFxuICAgICAgICAgICAgdGhpcy5yZW5kZXJCdXR0b25Jbml0KClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIFBlb3BsZVBhbmUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG1vZGU6ICdzbWFsbCdcbiAgICB9O1xuICB9LFxuICByZW5kZXJTbWFsbE1lc3NhZ2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbXNnID0gXCJcIlxuICAgICAgLCBoYXNQaWNrZWQgPSAwXG4gICAgICAsIG1lID0gdGhpcy5wcm9wcy5tZTtcbiAgICBpZiAoIXRoaXMucHJvcHMucGVvcGxlLmxlbmd0aCkge1xuICAgICAgbXNnID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BzLnBlb3BsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcGVyc29uID0gdGhpcy5wcm9wcy5wZW9wbGVbaV07XG4gICAgICAgIGlmIChwZXJzb24uc3RhdGUgPT09ICdmaW5pc2hlZCcpIHtcbiAgICAgICAgICBoYXNQaWNrZWQgKz0gMTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbXNnID0gaGFzUGlja2VkICsgXCIgb2YgXCIgKyB0aGlzLnByb3BzLnBlb3BsZS5sZW5ndGggKyBcIiwgaW5jbHVkaW5nIG1lLCBoYXZlIGNob3NlblwiO1xuICAgIH1cbiAgICByZXR1cm4gUmVhY3QuRE9NLmgzKG51bGwsIG1zZyk7XG4gIH0sXG4gIHRvZ2dsZU1vZGU6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vZGU6ICh0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyAnbGFyZ2UnIDogJ3NtYWxsJylcbiAgICB9KTtcbiAgfSxcbiAgcmVuZGVyU21hbGw6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5yZW5kZXJTbWFsbE1lc3NhZ2UoKTtcbiAgfSxcbiAgcmVuZGVyUGVvcGxlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMucGVvcGxlXG4gICAgLmZpbHRlcihmdW5jdGlvbiAocGVyc29uKSB7XG4gICAgICByZXR1cm4gcGVyc29uLm5hbWUgIT09IHRoaXMucHJvcHMubWUubmFtZTtcbiAgICB9LCB0aGlzKVxuICAgIC5tYXAoZnVuY3Rpb24gKHBlcnNvbikge1xuICAgICAgdmFyIHBlcnNvbkNsYXNzID0gJ3B1bGwtbGVmdCBsYWJlbCBsYWJlbC0nO1xuICAgICAgaWYgKHBlcnNvbi5zdGF0ZSA9PT0gJ3dhaXRpbmcnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICd3YXJuaW5nJztcbiAgICAgIH0gZWxzZSBpZiAocGVyc29uLnN0YXRlID09PSAnZmluaXNoZWQnKSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdzdWNjZXNzJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBlcnNvbkNsYXNzICs9ICdkZWZhdWx0JztcbiAgICAgIH1cbiAgICAgIHJldHVybiBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOnBlcnNvbkNsYXNzfSwgcGVyc29uLm5hbWUpXG4gICAgfSk7XG4gIH0sXG4gIHJlbmRlckxhcmdlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJtZWRpYVwifSwgXG4gICAgICAgIHRoaXMucmVuZGVyUGVvcGxlKClcbiAgICAgIClcbiAgICApO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLm5hdigge2NsYXNzTmFtZTpcIm5hdmJhciBuYXZiYXItZGVmYXVsdCBuYXZiYXItZml4ZWQtdG9wIHJvb20tcGVvcGxlXCIsICdkYXRhLW1vZGUnOnRoaXMuc3RhdGUubW9kZSwgb25DbGljazp0aGlzLnRvZ2dsZU1vZGV9LCBcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImNvbnRhaW5lclwifSwgXG4gICAgICAgICB0aGlzLnN0YXRlLm1vZGUgPT09ICdzbWFsbCcgPyB0aGlzLnJlbmRlclNtYWxsKCkgOiB0aGlzLnJlbmRlckxhcmdlKClcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgUm9vbVBlb3BsZSA9IHJlcXVpcmUoJy4vcm9vbS1wZW9wbGUuanN4JylcbiAgLCBSb29tUGFuZSA9IHJlcXVpcmUoJy4vcm9vbS1wYW5lLmpzeCcpXG4gICwgUm9vbU1vZGFsID0gcmVxdWlyZSgnLi9yb29tLW1vZGFsLmpzeCcpXG4gICwgcm9vbSA9IHJlcXVpcmUoJ3JlYWx0aW1lL3Jvb20nKTtcblxudmFyIFJvb20gPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtsb2NhdGlvbjoge30sIGNhdGVnb3JpZXM6IFtdLCBwZW9wbGU6IFtdLCBtZToge319O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMubG9hZCgpO1xuICB9LFxuICBsb2FkOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJvb20uY3JlYXRlUm9vbSh7bG9jYXRpb246IHJvb21Mb2NhdGlvbiB8fCAnbW91bnRhaW4gdmlldyd9LCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICBsb2NhdGlvbjogcmVzLmxvY2F0aW9uLCBcbiAgICAgICAgY2F0ZWdvcmllczogcmVzLmNhdGVnb3JpZXMsIFxuICAgICAgICBwZW9wbGU6IFtcbiAgICAgICAgICB7IG5hbWU6ICdBbGljZScsIGlkOiAnMTIzJywgc3RhdGU6ICd3YWl0aW5nJyB9LFxuICAgICAgICAgIHsgbmFtZTogJ0JvYicsIGlkOiAnNDU2Jywgc3RhdGU6ICdmaW5pc2hlZCcgfSxcbiAgICAgICAgICB7IG5hbWU6ICdDaGFybGllJywgaWQ6ICc3ODknLCBzdGF0ZTogJ2ZpbmlzaGVkJyB9XG4gICAgICAgIF0sXG4gICAgICAgIG1lOiB7XG4gICAgICAgICAgbmFtZTogJ0FsaWNlJyxcbiAgICAgICAgICBpc0NyZWF0b3I6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIGdldE1vZGFsOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVmcy5tb2RhbDtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5kaXYoIHtpZDpcInJvb21cIn0sIFxuICAgICAgICBSb29tUGVvcGxlKCB7cGVvcGxlOnRoaXMuc3RhdGUucGVvcGxlLCBtZTp0aGlzLnN0YXRlLm1lfSApLFxuICAgICAgICBSb29tUGFuZSgge2NhdGVnb3JpZXM6dGhpcy5zdGF0ZS5jYXRlZ29yaWVzLCBcbiAgICAgICAgICBtZTp0aGlzLnN0YXRlLm1lLFxuICAgICAgICAgIGdldE1vZGFsOnRoaXMuZ2V0TW9kYWx9KSxcbiAgICAgICAgUm9vbU1vZGFsKCB7cmVmOlwibW9kYWxcIn0gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIFJvb20oIHt1cmw6XCIvcmVhbHRpbWVcIn0gKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb20tY29udGFpbmVyJylcbik7XG4iXX0=
;