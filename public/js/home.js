;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

var Home = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
  },
  handleSubmit: function () {
    var options = {};
    options.name = this.refs.name.getDOMNode().value.trim();
    options.location = this.refs.location.getDOMNode().value.trim();
    if (!options.name || !options.location) {
      return false;
    }
    window.location.href = '/room/new?location=' + options.location + '&name=' + options.name;
    return false;
  },
  render: function () {
    return (
      React.DOM.form( {onSubmit:this.handleSubmit}, 
        React.DOM.label( {className:"control-label"}, "Room Name"),
        React.DOM.input( {type:"text", placeholder:"What's your office/team name?", ref:"name", className:"form-control"} ),
        React.DOM.label( {className:"control-label"}, "Location"),
        React.DOM.input( {type:"text", placeholder:"Where are you?", ref:"location", className:"form-control"} ),
        React.DOM.input( {type:"submit", value:"Create Room", className:"btn btn-primary"} )
      )
    );
  }
});

React.renderComponent(
  Home(null ),
  document.getElementById('new-room')
);

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgSG9tZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gIH0sXG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgb3B0aW9ucy5uYW1lID0gdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBvcHRpb25zLmxvY2F0aW9uID0gdGhpcy5yZWZzLmxvY2F0aW9uLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUgfHwgIW9wdGlvbnMubG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Jvb20vbmV3P2xvY2F0aW9uPScgKyBvcHRpb25zLmxvY2F0aW9uICsgJyZuYW1lPScgKyBvcHRpb25zLm5hbWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmZvcm0oIHtvblN1Ym1pdDp0aGlzLmhhbmRsZVN1Ym1pdH0sIFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIlJvb20gTmFtZVwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInRleHRcIiwgcGxhY2Vob2xkZXI6XCJXaGF0J3MgeW91ciBvZmZpY2UvdGVhbSBuYW1lP1wiLCByZWY6XCJuYW1lXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIkxvY2F0aW9uXCIpLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoZXJlIGFyZSB5b3U/XCIsIHJlZjpcImxvY2F0aW9uXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwic3VibWl0XCIsIHZhbHVlOlwiQ3JlYXRlIFJvb21cIiwgY2xhc3NOYW1lOlwiYnRuIGJ0bi1wcmltYXJ5XCJ9IClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBIb21lKG51bGwgKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yb29tJylcbik7XG4iXX0=
;