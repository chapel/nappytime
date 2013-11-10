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
        React.DOM.input( {type:"text", placeholder:"What's your office/team name?", ref:"name"} ),
        React.DOM.input( {type:"text", placeholder:"Where are you?", ref:"location"} ),
        React.DOM.input( {type:"submit", value:"Create Room", class:"btn"} )
      )
    );
  }
});

React.renderComponent(
  Home(null ),
  document.getElementById('new-room')
);

},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvY2xpZW50L3JlYWN0L2hvbWUvaG9tZS5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbnZhciBIb21lID0gbW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7fTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgfSxcbiAgaGFuZGxlU3VibWl0OiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgICBvcHRpb25zLm5hbWUgPSB0aGlzLnJlZnMubmFtZS5nZXRET01Ob2RlKCkudmFsdWUudHJpbSgpO1xuICAgIG9wdGlvbnMubG9jYXRpb24gPSB0aGlzLnJlZnMubG9jYXRpb24uZ2V0RE9NTm9kZSgpLnZhbHVlLnRyaW0oKTtcbiAgICBpZiAoIW9wdGlvbnMubmFtZSB8fCAhb3B0aW9ucy5sb2NhdGlvbikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcm9vbS9uZXc/bG9jYXRpb249JyArIG9wdGlvbnMubG9jYXRpb24gKyAnJm5hbWU9JyArIG9wdGlvbnMubmFtZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAoXG4gICAgICBSZWFjdC5ET00uZm9ybSgge29uU3VibWl0OnRoaXMuaGFuZGxlU3VibWl0fSwgXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJ0ZXh0XCIsIHBsYWNlaG9sZGVyOlwiV2hhdCdzIHlvdXIgb2ZmaWNlL3RlYW0gbmFtZT9cIiwgcmVmOlwibmFtZVwifSApLFxuICAgICAgICBSZWFjdC5ET00uaW5wdXQoIHt0eXBlOlwidGV4dFwiLCBwbGFjZWhvbGRlcjpcIldoZXJlIGFyZSB5b3U/XCIsIHJlZjpcImxvY2F0aW9uXCJ9ICksXG4gICAgICAgIFJlYWN0LkRPTS5pbnB1dCgge3R5cGU6XCJzdWJtaXRcIiwgdmFsdWU6XCJDcmVhdGUgUm9vbVwiLCBjbGFzczpcImJ0blwifSApXG4gICAgICApXG4gICAgKTtcbiAgfVxufSk7XG5cblJlYWN0LnJlbmRlckNvbXBvbmVudChcbiAgSG9tZShudWxsICksXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZXctcm9vbScpXG4pO1xuIl19
;