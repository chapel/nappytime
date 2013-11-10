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
        React.DOM.label( {className:"control-label"}, "Nickname"),
        React.DOM.input( {type:"text", placeholder:"What's your nickname?", ref:"name", className:"form-control"} ),
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvYWxpbjkvRG9jdW1lbnRzL2hhY2svbmFwcHl0aW1lL2NsaWVudC9yZWFjdC9ob21lL2hvbWUuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIEhvbWUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChNb2Rlcm5penIuZ2VvbG9jYXRpb24pIHtcbiAgICAgIHRoaXMuc3RhdGUuY2FuR2VvID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIGdldExvY2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKE1vZGVybml6ci5nZW9sb2NhdGlvbikge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvcylcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpO1xuICAgIG9wdGlvbnMubG9jYXRpb24gPSB0aGlzLnJlZnMubG9jYXRpb24uZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBpZiAoIW9wdGlvbnMubmFtZSB8fCAhb3B0aW9ucy5sb2NhdGlvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcm9vbS9uZXc/bG9jYXRpb249JyArIG9wdGlvbnMubG9jYXRpb24gKyAnJm5hbWU9JyArIG9wdGlvbnMubmFtZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBidXR0b25DbGFzcyA9ICdidG4gYnRuLWRlZmF1bHQnO1xuICAgIGlmICghdGhpcy5zdGF0ZS5jYW5HZW8pIHtcbiAgICAgIGJ1dHRvbkNsYXNzICs9ICcgZGlzYWJsZWQnO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmZvcm0oIHtvblN1Ym1pdDp0aGlzLmhhbmRsZVN1Ym1pdH0sIFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIk5pY2tuYW1lXCIpLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoYXQncyB5b3VyIG5pY2tuYW1lP1wiLCByZWY6XCJuYW1lXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIlJvb20gTmFtZVwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInRleHRcIiwgcGxhY2Vob2xkZXI6XCJXaGF0J3MgeW91ciBvZmZpY2UvdGVhbSBuYW1lP1wiLCByZWY6XCJyb29tbmFtZVwiLCBjbGFzc05hbWU6XCJmb3JtLWNvbnRyb2xcIn0gKSxcbiAgICAgICAgUmVhY3QuRE9NLmxhYmVsKCB7Y2xhc3NOYW1lOlwiY29udHJvbC1sYWJlbFwifSwgXCJMb2NhdGlvblwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImlucHV0LWdyb3VwXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoZXJlIGFyZSB5b3U/XCIsIHJlZjpcImxvY2F0aW9uXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiaW5wdXQtZ3JvdXAtYnRuXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHtvbkNsaWNrOnRoaXMuZ2V0TG9jYXRpb24sIGNsYXNzTmFtZTpidXR0b25DbGFzcywgdHlwZTpcImJ1dHRvblwifSwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLW1hcC1tYXJrZXJcIiwgYWx0OlwiR2V0IExvY2F0aW9uXCJ9KSlcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJzdWJtaXRcIiwgdmFsdWU6XCJDcmVhdGUgUm9vbVwiLCBjbGFzc05hbWU6XCJidG4gYnRuLXByaW1hcnlcIn0gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIEhvbWUobnVsbCApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJvb20nKVxuKTtcbiJdfQ==
;