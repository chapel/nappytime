;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */

var Home = module.exports = React.createClass({
  getInitialState: function () {
    return {};
  },
  componentWillMount: function() {
    if (Modernizr.geolocation) {
      this.state.canGeo = true;
    }
  },
  getLocation: function () {
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        console.log(pos)
      });
    }
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
    var buttonClass = 'btn btn-default';
    if (!this.state.canGeo) {
      buttonClass += ' disabled';
    }
    return (
      React.DOM.form( {onSubmit:this.handleSubmit}, 
        React.DOM.label( {className:"control-label"}, "Room Name"),
        React.DOM.input( {type:"text", placeholder:"What's your office/team name?", ref:"name", className:"form-control"} ),
        React.DOM.label( {className:"control-label"}, "Location"),
        React.DOM.div( {className:"input-group"}, 
          React.DOM.input( {type:"text", placeholder:"Where are you?", ref:"location", className:"form-control"} ),
          React.DOM.span( {className:"input-group-btn"}, 
            React.DOM.button( {onClick:this.getLocation, className:buttonClass, type:"button"}, React.DOM.span( {className:"glyphicon glyphicon-map-marker", alt:"Get Location"}))
          )
        ),
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9ob21lL2hvbWUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgSG9tZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKE1vZGVybml6ci5nZW9sb2NhdGlvbikge1xuICAgICAgdGhpcy5zdGF0ZS5jYW5HZW8gPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgZ2V0TG9jYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoTW9kZXJuaXpyLmdlb2xvY2F0aW9uKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgY29uc29sZS5sb2cocG9zKVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBoYW5kbGVTdWJtaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHt9O1xuICAgIG9wdGlvbnMubmFtZSA9IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgb3B0aW9ucy5sb2NhdGlvbiA9IHRoaXMucmVmcy5sb2NhdGlvbi5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpO1xuICAgIGlmICghb3B0aW9ucy5uYW1lIHx8ICFvcHRpb25zLmxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yb29tL25ldz9sb2NhdGlvbj0nICsgb3B0aW9ucy5sb2NhdGlvbiArICcmbmFtZT0nICsgb3B0aW9ucy5uYW1lO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbkNsYXNzID0gJ2J0biBidG4tZGVmYXVsdCc7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNhbkdlbykge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gJyBkaXNhYmxlZCc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZm9ybSgge29uU3VibWl0OnRoaXMuaGFuZGxlU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiUm9vbSBOYW1lXCIpLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoYXQncyB5b3VyIG9mZmljZS90ZWFtIG5hbWU/XCIsIHJlZjpcIm5hbWVcIiwgY2xhc3NOYW1lOlwiZm9ybS1jb250cm9sXCJ9ICksXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiTG9jYXRpb25cIiksXG4gICAgICAgIFJlYWN0LkRPTS5kaXYoIHtjbGFzc05hbWU6XCJpbnB1dC1ncm91cFwifSwgXG4gICAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInRleHRcIiwgcGxhY2Vob2xkZXI6XCJXaGVyZSBhcmUgeW91P1wiLCByZWY6XCJsb2NhdGlvblwiLCBjbGFzc05hbWU6XCJmb3JtLWNvbnRyb2xcIn0gKSxcbiAgICAgICAgICBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImlucHV0LWdyb3VwLWJ0blwifSwgXG4gICAgICAgICAgICBSZWFjdC5ET00uYnV0dG9uKCB7b25DbGljazp0aGlzLmdldExvY2F0aW9uLCBjbGFzc05hbWU6YnV0dG9uQ2xhc3MsIHR5cGU6XCJidXR0b25cIn0sIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiZ2x5cGhpY29uIGdseXBoaWNvbi1tYXAtbWFya2VyXCIsIGFsdDpcIkdldCBMb2NhdGlvblwifSkpXG4gICAgICAgICAgKVxuICAgICAgICApLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwic3VibWl0XCIsIHZhbHVlOlwiQ3JlYXRlIFJvb21cIiwgY2xhc3NOYW1lOlwiYnRuIGJ0bi1wcmltYXJ5XCJ9IClcbiAgICAgIClcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBIb21lKG51bGwgKSxcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ25ldy1yb29tJylcbik7XG4iXX0=
;