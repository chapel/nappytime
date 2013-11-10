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
    options.name = this.refs.roomname.getDOMNode().value.trim();
    options.location = this.refs.location.getDOMNode().value.trim();
    var name = this.refs.name.getDOMNode().value.trim() || 'Anonymous';
    store.set('name', name);
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
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxudmFyIEhvbWUgPSBtb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9LFxuICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChNb2Rlcm5penIuZ2VvbG9jYXRpb24pIHtcbiAgICAgIHRoaXMuc3RhdGUuY2FuR2VvID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG4gIGdldExvY2F0aW9uOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKE1vZGVybml6ci5nZW9sb2NhdGlvbikge1xuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHBvcylcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnJlZnMucm9vbW5hbWUuZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBvcHRpb25zLmxvY2F0aW9uID0gdGhpcy5yZWZzLmxvY2F0aW9uLmdldERPTU5vZGUoKS52YWx1ZS50cmltKCk7XG4gICAgdmFyIG5hbWUgPSB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpIHx8ICdBbm9ueW1vdXMnO1xuICAgIHN0b3JlLnNldCgnbmFtZScsIG5hbWUpO1xuICAgIGlmICghb3B0aW9ucy5uYW1lIHx8ICFvcHRpb25zLmxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yb29tL25ldz9sb2NhdGlvbj0nICsgb3B0aW9ucy5sb2NhdGlvbiArICcmbmFtZT0nICsgb3B0aW9ucy5uYW1lO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGJ1dHRvbkNsYXNzID0gJ2J0biBidG4tZGVmYXVsdCc7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNhbkdlbykge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gJyBkaXNhYmxlZCc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZm9ybSgge29uU3VibWl0OnRoaXMuaGFuZGxlU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiTmlja25hbWVcIiksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOlwiV2hhdCdzIHlvdXIgbmlja25hbWU/XCIsIHJlZjpcIm5hbWVcIiwgY2xhc3NOYW1lOlwiZm9ybS1jb250cm9sXCJ9ICksXG4gICAgICAgIFJlYWN0LkRPTS5sYWJlbCgge2NsYXNzTmFtZTpcImNvbnRyb2wtbGFiZWxcIn0sIFwiUm9vbSBOYW1lXCIpLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoYXQncyB5b3VyIG9mZmljZS90ZWFtIG5hbWU/XCIsIHJlZjpcInJvb21uYW1lXCIsIGNsYXNzTmFtZTpcImZvcm0tY29udHJvbFwifSApLFxuICAgICAgICBSZWFjdC5ET00ubGFiZWwoIHtjbGFzc05hbWU6XCJjb250cm9sLWxhYmVsXCJ9LCBcIkxvY2F0aW9uXCIpLFxuICAgICAgICBSZWFjdC5ET00uZGl2KCB7Y2xhc3NOYW1lOlwiaW5wdXQtZ3JvdXBcIn0sIFxuICAgICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOlwiV2hlcmUgYXJlIHlvdT9cIiwgcmVmOlwibG9jYXRpb25cIiwgY2xhc3NOYW1lOlwiZm9ybS1jb250cm9sXCJ9ICksXG4gICAgICAgICAgUmVhY3QuRE9NLnNwYW4oIHtjbGFzc05hbWU6XCJpbnB1dC1ncm91cC1idG5cIn0sIFxuICAgICAgICAgICAgUmVhY3QuRE9NLmJ1dHRvbigge29uQ2xpY2s6dGhpcy5nZXRMb2NhdGlvbiwgY2xhc3NOYW1lOmJ1dHRvbkNsYXNzLCB0eXBlOlwiYnV0dG9uXCJ9LCBSZWFjdC5ET00uc3Bhbigge2NsYXNzTmFtZTpcImdseXBoaWNvbiBnbHlwaGljb24tbWFwLW1hcmtlclwiLCBhbHQ6XCJHZXQgTG9jYXRpb25cIn0pKVxuICAgICAgICAgIClcbiAgICAgICAgKSxcbiAgICAgICAgUmVhY3QuRE9NLmlucHV0KCB7dHlwZTpcInN1Ym1pdFwiLCB2YWx1ZTpcIkNyZWF0ZSBSb29tXCIsIGNsYXNzTmFtZTpcImJ0biBidG4tcHJpbWFyeVwifSApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlckNvbXBvbmVudChcbiAgSG9tZShudWxsICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcm9vbScpXG4pO1xuIl19
;