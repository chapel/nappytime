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
    var self = this;
    if (Modernizr.geolocation) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        var locationDom = self.refs.location.getDOMNode();
        locationDom.value = 'Latitude: ' + pos.coords.latitude + ', Longitude: ' + pos.coords.longitude;
        self.state.coords = pos.coords;
      });
    }
  },
  handleSubmit: function () {
    var options = {};
    options.name = this.refs.roomname.getDOMNode().value.trim();
    options.location = this.refs.location.getDOMNode().value.trim();
    options.coords = this.state.coords;
    var name = this.refs.name.getDOMNode().value.trim() || 'Anonymous';
    store.set('name', name);
    if (!options.name || (!options.location || !options.coords)) {
      return false;
    }
    var name = 'name=' + options.name;
    var location;
    if (options.coords) {
      location = 'lat=' + options.coords.latitude + '&lng=' + options.coords.longitude;
    } else {
      location = 'location=' + options.location;
    }
    window.location.href = '/room/new?' + location + '&' + name;
    return false;
  },
  render: function () {
    var buttonClass = 'btn btn-default';
    if (!this.state.canGeo) {
      buttonClass += ' disabled';
    }
    return (
      React.DOM.form( {onSubmit:this.handleSubmit}, 
        React.DOM.label( {className:"control-label"}, "Nickname"),
        React.DOM.input( {type:"text", value:store.get('name'), placeholder:"What's your nickname?", ref:"name", className:"form-control"} ),
        React.DOM.label( {className:"control-label"}, "Room Name"),
        React.DOM.input( {type:"text", placeholder:"What's your office/team name?", ref:"roomname", className:"form-control"} ),
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9ob21lL2hvbWUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG52YXIgSG9tZSA9IG1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge307XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgaWYgKE1vZGVybml6ci5nZW9sb2NhdGlvbikge1xuICAgICAgdGhpcy5zdGF0ZS5jYW5HZW8gPSB0cnVlO1xuICAgIH1cbiAgfSxcbiAgZ2V0TG9jYXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgaWYgKE1vZGVybml6ci5nZW9sb2NhdGlvbikge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBsb2NhdGlvbkRvbSA9IHNlbGYucmVmcy5sb2NhdGlvbi5nZXRET01Ob2RlKCk7XG4gICAgICAgIGxvY2F0aW9uRG9tLnZhbHVlID0gJ0xhdGl0dWRlOiAnICsgcG9zLmNvb3Jkcy5sYXRpdHVkZSArICcsIExvbmdpdHVkZTogJyArIHBvcy5jb29yZHMubG9uZ2l0dWRlO1xuICAgICAgICBzZWxmLnN0YXRlLmNvb3JkcyA9IHBvcy5jb29yZHM7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgb3B0aW9ucy5uYW1lID0gdGhpcy5yZWZzLnJvb21uYW1lLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgb3B0aW9ucy5sb2NhdGlvbiA9IHRoaXMucmVmcy5sb2NhdGlvbi5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpO1xuICAgIG9wdGlvbnMuY29vcmRzID0gdGhpcy5zdGF0ZS5jb29yZHM7XG4gICAgdmFyIG5hbWUgPSB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpIHx8ICdBbm9ueW1vdXMnO1xuICAgIHN0b3JlLnNldCgnbmFtZScsIG5hbWUpO1xuICAgIGlmICghb3B0aW9ucy5uYW1lIHx8ICghb3B0aW9ucy5sb2NhdGlvbiB8fCAhb3B0aW9ucy5jb29yZHMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHZhciBuYW1lID0gJ25hbWU9JyArIG9wdGlvbnMubmFtZTtcbiAgICB2YXIgbG9jYXRpb247XG4gICAgaWYgKG9wdGlvbnMuY29vcmRzKSB7XG4gICAgICBsb2NhdGlvbiA9ICdsYXQ9JyArIG9wdGlvbnMuY29vcmRzLmxhdGl0dWRlICsgJyZsbmc9JyArIG9wdGlvbnMuY29vcmRzLmxvbmdpdHVkZTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9jYXRpb24gPSAnbG9jYXRpb249JyArIG9wdGlvbnMubG9jYXRpb247XG4gICAgfVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yb29tL25ldz8nICsgbG9jYXRpb24gKyAnJicgKyBuYW1lO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbkNsYXNzID0gJ2J0biBidG4tZGVmYXVsdCc7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNhbkdlbykge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gJyBkaXNhYmxlZCc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZm9ybSgge29uU3VibWl0OnRoaXMuaGFuZGxlU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiTmlja25hbWVcIiksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHZhbHVlOnN0b3JlLmdldCgnbmFtZScpLCBwbGFjZWhvbGRlcjpcIldoYXQncyB5b3VyIG5pY2tuYW1lP1wiLCByZWY6XCJuYW1lXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIlJvb20gTmFtZVwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInRleHRcIiwgcGxhY2Vob2xkZXI6XCJXaGF0J3MgeW91ciBvZmZpY2UvdGVhbSBuYW1lP1wiLCByZWY6XCJyb29tbmFtZVwiLCBjbGFzc05hbWU6XCJmb3JtLWNvbnRyb2xcIn0gKSxcbiAgICAgICAgUmVhY3QuRE9NLmxhYmVsKCB7Y2xhc3NOYW1lOlwiY29udHJvbC1sYWJlbFwifSwgXCJMb2NhdGlvblwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImlucHV0LWdyb3VwXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoZXJlIGFyZSB5b3U/XCIsIHJlZjpcImxvY2F0aW9uXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiaW5wdXQtZ3JvdXAtYnRuXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHtvbkNsaWNrOnRoaXMuZ2V0TG9jYXRpb24sIGNsYXNzTmFtZTpidXR0b25DbGFzcywgdHlwZTpcImJ1dHRvblwifSwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLW1hcC1tYXJrZXJcIiwgYWx0OlwiR2V0IExvY2F0aW9uXCJ9KSlcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJzdWJtaXRcIiwgdmFsdWU6XCJDcmVhdGUgUm9vbVwiLCBjbGFzc05hbWU6XCJidG4gYnRuLXByaW1hcnlcIn0gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIEhvbWUobnVsbCApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJvb20nKVxuKTtcbiJdfQ==
;