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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBIb21lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoTW9kZXJuaXpyLmdlb2xvY2F0aW9uKSB7XG4gICAgICB0aGlzLnN0YXRlLmNhbkdlbyA9IHRydWU7XG4gICAgfVxuICB9LFxuICBnZXRMb2NhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIGlmIChNb2Rlcm5penIuZ2VvbG9jYXRpb24pIHtcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24gKHBvcykge1xuICAgICAgICBjb25zb2xlLmxvZyhwb3MpXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIGhhbmRsZVN1Ym1pdDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBvcHRpb25zID0ge307XG4gICAgb3B0aW9ucy5uYW1lID0gdGhpcy5yZWZzLm5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBvcHRpb25zLmxvY2F0aW9uID0gdGhpcy5yZWZzLmxvY2F0aW9uLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUgfHwgIW9wdGlvbnMubG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Jvb20vbmV3P2xvY2F0aW9uPScgKyBvcHRpb25zLmxvY2F0aW9uICsgJyZuYW1lPScgKyBvcHRpb25zLm5hbWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uQ2xhc3MgPSAnYnRuIGJ0bi1kZWZhdWx0JztcbiAgICBpZiAoIXRoaXMuc3RhdGUuY2FuR2VvKSB7XG4gICAgICBidXR0b25DbGFzcyArPSAnIGRpc2FibGVkJztcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5mb3JtKCB7b25TdWJtaXQ6dGhpcy5oYW5kbGVTdWJtaXR9LCBcbiAgICAgICAgUmVhY3QuRE9NLmxhYmVsKCB7Y2xhc3NOYW1lOlwiY29udHJvbC1sYWJlbFwifSwgXCJSb29tIE5hbWVcIiksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOlwiV2hhdCdzIHlvdXIgb2ZmaWNlL3RlYW0gbmFtZT9cIiwgcmVmOlwibmFtZVwiLCBjbGFzc05hbWU6XCJmb3JtLWNvbnRyb2xcIn0gKSxcbiAgICAgICAgUmVhY3QuRE9NLmxhYmVsKCB7Y2xhc3NOYW1lOlwiY29udHJvbC1sYWJlbFwifSwgXCJMb2NhdGlvblwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmRpdigge2NsYXNzTmFtZTpcImlucHV0LWdyb3VwXCJ9LCBcbiAgICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoZXJlIGFyZSB5b3U/XCIsIHJlZjpcImxvY2F0aW9uXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICAgIFJlYWN0LkRPTS5zcGFuKCB7Y2xhc3NOYW1lOlwiaW5wdXQtZ3JvdXAtYnRuXCJ9LCBcbiAgICAgICAgICAgIFJlYWN0LkRPTS5idXR0b24oIHtvbkNsaWNrOnRoaXMuZ2V0TG9jYXRpb24sIGNsYXNzTmFtZTpidXR0b25DbGFzcywgdHlwZTpcImJ1dHRvblwifSwgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJnbHlwaGljb24gZ2x5cGhpY29uLW1hcC1tYXJrZXJcIiwgYWx0OlwiR2V0IExvY2F0aW9uXCJ9KSlcbiAgICAgICAgICApXG4gICAgICAgICksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJzdWJtaXRcIiwgdmFsdWU6XCJDcmVhdGUgUm9vbVwiLCBjbGFzc05hbWU6XCJidG4gYnRuLXByaW1hcnlcIn0gKVxuICAgICAgKVxuICAgICk7XG4gIH1cbn0pO1xuXG5SZWFjdC5yZW5kZXJDb21wb25lbnQoXG4gIEhvbWUobnVsbCApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3LXJvb20nKVxuKTtcbiJdfQ==
;