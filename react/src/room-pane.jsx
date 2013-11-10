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
      restaurants: [
        { 
          name: 'Thai', 
          value: [
            {
              name: 'Amarin',
              location: 'Something',
              chosen: true
            }
          ]
        },
        { 
          name: 'Indian',
          value: [
            {
              name: 'Sakoon',
              location: 'Something',
              chosen: true
            },
            {
              name: 'Amber',
              location: 'Something',
              chosen: true
            },
            {
              name: 'Shiva\'s',
              location: 'Something'
            }
          ]
        },
        { 
          name: 'Japanese',
          value: [
            {
              name: 'SUSHITOMI',
              location: 'Something'
            }
          ]
        }
      ]
    });
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? 'frozen' : 'edit')
    });
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.state.restaurants[categoryIndex];
        toggleCat.value.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.state.restaurants[categoryIndex].value[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    }
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.value.length; i++) {
      if (cat.value[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    return this.state.restaurants
    .filter(function (cat) {
      if (this.state.mode === 'edit') {
        return true;
      } else {
        return this.doesCatHaveChosen(cat);
      }
    }, this)
    .map(function (cat, index) {
      return <RoomPaneCategory 
                data={cat} 
                index={index} 
                mode={this.state.mode} 
                choose={this.clickChosen} />;
    }, this);
  },
  renderButton: function () {
    if (this.state.mode === 'edit') {
      return (
        <button type="button" className="pull-right btn btn-default" onClick={this.toggleMode}>
          &times;
        </button>
      );
    } else {
      return (
        <button type="button" className="pull-right btn btn-default" onClick={this.toggleMode}>
          <span className="glyphicon glyphicon-edit"></span>
        </button>
      );
    }
  },
  render: function () {
    return (
      <table className="table" data-mode={this.state.mode}>
        <tr>
          <td>
            <ul className="list-group">
              {this.renderCategories()}
            </ul>
          </td>
          <td className="buttonRow">
            {this.renderButton()}
          </td>
        </tr>
      </table>
    );
  }
});