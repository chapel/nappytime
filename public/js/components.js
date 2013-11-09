;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
var Timer = React.createClass({displayName: 'Timer',
  getInitialState: function () {
    return { time: 'N/A' };
  },
  componentWillMount: function() {
    this.loadFromServer ();
    //setInterval(this.loadFromServer, this.props.pollInterval);
  },
  loadFromServer: function () {
    var self = this;
    $.ajax({
      url: this.props.url,
      dateType: 'json',
      success: function (payload) {
        console.log(payload);
        self.setState({ time: payload.time });
      }
    })
  },
  render: function () {
    return (
      React.DOM.h1(null, this.state.time)
    );
  }
});

React.renderComponent(
  Timer( {url:"/time", pollInterval:2000} ),
  document.getElementById('clock')
);
},{}]},{},[1])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvamNoYXBlbC9Qcm9qZWN0cy9uYXBweXRpbWUvcmVhY3Qvc3JjL3RpbWVyLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQGpzeCBSZWFjdC5ET00gKi9cbnZhciBUaW1lciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogJ1RpbWVyJyxcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHsgdGltZTogJ04vQScgfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmxvYWRGcm9tU2VydmVyICgpO1xuICAgIC8vc2V0SW50ZXJ2YWwodGhpcy5sb2FkRnJvbVNlcnZlciwgdGhpcy5wcm9wcy5wb2xsSW50ZXJ2YWwpO1xuICB9LFxuICBsb2FkRnJvbVNlcnZlcjogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnVybCxcbiAgICAgIGRhdGVUeXBlOiAnanNvbicsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICBjb25zb2xlLmxvZyhwYXlsb2FkKTtcbiAgICAgICAgc2VsZi5zZXRTdGF0ZSh7IHRpbWU6IHBheWxvYWQudGltZSB9KTtcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgUmVhY3QuRE9NLmgxKG51bGwsIHRoaXMuc3RhdGUudGltZSlcbiAgICApO1xuICB9XG59KTtcblxuUmVhY3QucmVuZGVyQ29tcG9uZW50KFxuICBUaW1lcigge3VybDpcIi90aW1lXCIsIHBvbGxJbnRlcnZhbDoyMDAwfSApLFxuICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2xvY2snKVxuKTsiXX0=
;