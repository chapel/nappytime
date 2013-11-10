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
    if (!options.name || (!options.location && !options.coords)) {
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBIb21lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICBpZiAoTW9kZXJuaXpyLmdlb2xvY2F0aW9uKSB7XG4gICAgICB0aGlzLnN0YXRlLmNhbkdlbyA9IHRydWU7XG4gICAgfVxuICB9LFxuICBnZXRMb2NhdGlvbjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoTW9kZXJuaXpyLmdlb2xvY2F0aW9uKSB7XG4gICAgICBuYXZpZ2F0b3IuZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uRG9tID0gc2VsZi5yZWZzLmxvY2F0aW9uLmdldERPTU5vZGUoKTtcbiAgICAgICAgbG9jYXRpb25Eb20udmFsdWUgPSAnTGF0aXR1ZGU6ICcgKyBwb3MuY29vcmRzLmxhdGl0dWRlICsgJywgTG9uZ2l0dWRlOiAnICsgcG9zLmNvb3Jkcy5sb25naXR1ZGU7XG4gICAgICAgIHNlbGYuc3RhdGUuY29vcmRzID0gcG9zLmNvb3JkcztcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnJlZnMucm9vbW5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBvcHRpb25zLmxvY2F0aW9uID0gdGhpcy5yZWZzLmxvY2F0aW9uLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgb3B0aW9ucy5jb29yZHMgPSB0aGlzLnN0YXRlLmNvb3JkcztcbiAgICB2YXIgbmFtZSA9IHRoaXMucmVmcy5uYW1lLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCkgfHwgJ0Fub255bW91cyc7XG4gICAgc3RvcmUuc2V0KCduYW1lJywgbmFtZSk7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUgfHwgKCFvcHRpb25zLmxvY2F0aW9uICYmICFvcHRpb25zLmNvb3JkcykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmFyIG5hbWUgPSAnbmFtZT0nICsgb3B0aW9ucy5uYW1lO1xuICAgIHZhciBsb2NhdGlvbjtcbiAgICBpZiAob3B0aW9ucy5jb29yZHMpIHtcbiAgICAgIGxvY2F0aW9uID0gJ2xhdD0nICsgb3B0aW9ucy5jb29yZHMubGF0aXR1ZGUgKyAnJmxuZz0nICsgb3B0aW9ucy5jb29yZHMubG9uZ2l0dWRlO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2NhdGlvbiA9ICdsb2NhdGlvbj0nICsgb3B0aW9ucy5sb2NhdGlvbjtcbiAgICB9XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3Jvb20vbmV3PycgKyBsb2NhdGlvbiArICcmJyArIG5hbWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgYnV0dG9uQ2xhc3MgPSAnYnRuIGJ0bi1kZWZhdWx0JztcbiAgICBpZiAoIXRoaXMuc3RhdGUuY2FuR2VvKSB7XG4gICAgICBidXR0b25DbGFzcyArPSAnIGRpc2FibGVkJztcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIFJlYWN0LkRPTS5mb3JtKCB7b25TdWJtaXQ6dGhpcy5oYW5kbGVTdWJtaXR9LCBcbiAgICAgICAgUmVhY3QuRE9NLmxhYmVsKCB7Y2xhc3NOYW1lOlwiY29udHJvbC1sYWJlbFwifSwgXCJOaWNrbmFtZVwiKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInRleHRcIiwgdmFsdWU6c3RvcmUuZ2V0KCduYW1lJyksIHBsYWNlaG9sZGVyOlwiV2hhdCdzIHlvdXIgbmlja25hbWU/XCIsIHJlZjpcIm5hbWVcIiwgY2xhc3NOYW1lOlwiZm9ybS1jb250cm9sXCJ9ICksXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiUm9vbSBOYW1lXCIpLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoYXQncyB5b3VyIG9mZmljZS90ZWFtIG5hbWU/XCIsIHJlZjpcInJvb21uYW1lXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIkxvY2F0aW9uXCIpLFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiaW5wdXQtZ3JvdXBcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOlwiV2hlcmUgYXJlIHlvdT9cIiwgcmVmOlwibG9jYXRpb25cIiwgY2xhc3NOYW1lOlwiZm9ybS1jb250cm9sXCJ9ICksXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJpbnB1dC1ncm91cC1idG5cIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge29uQ2xpY2s6dGhpcy5nZXRMb2NhdGlvbiwgY2xhc3NOYW1lOmJ1dHRvbkNsYXNzLCB0eXBlOlwiYnV0dG9uXCJ9LCBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImdseXBoaWNvbiBnbHlwaGljb24tbWFwLW1hcmtlclwiLCBhbHQ6XCJHZXQgTG9jYXRpb25cIn0pKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInN1Ym1pdFwiLCB2YWx1ZTpcIkNyZWF0ZSBSb29tXCIsIGNsYXNzTmFtZTpcImJ0biBidG4tcHJpbWFyeVwifSApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlckNvbXBvbmVudChcbiAgSG9tZShudWxsICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcm9vbScpXG4pO1xuIl19
;