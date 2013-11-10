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
    } else {
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.state.restaurants[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.state.restaurants[categoryIndex].value[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.state.restaurants[ij[0]].value[ij[1]].roundChosen;
        }
        if (toggleEat.roundChosen) {
          this.setState({ roundChosen: [categoryIndex, restaurantIndex] });
        } else {
          this.setState({ roundChosen: null });
        }
      }
    }
  },
  doesCatHaveChosen: function (cat) {
    var hasChosen = false;
    for (var i = 0; i < cat.restaurants.length; i++) {
      if (cat.restaurants[i].chosen) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    return this.props.categories
    .filter(function (cat) {
      if (self.state.mode === 'edit') {
        return true;
      } else {
        return self.doesCatHaveChosen(cat);
      }
    })
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
          close
        </button>
      );
    } else {
      return (
        <button type="button" className="pull-right btn btn-default" onClick={this.toggleMode}>
          Edit
        </button>
      );
    }
  },
  renderInfo: function () {
    var vetoes = this.state.vetoes || 0
      , roundChosen = this.state.roundChosen ? 1 : 0;
    return (
      <div className="room-info pull-right">
        <div><span className="badge">{vetoes}</span> vetoed</div>
        <div><span className="badge">{roundChosen}</span> chosen</div>
      </div>
    );
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
            <div className="clearfix"></div>
            {this.renderInfo()}
          </td>
        </tr>
      </table>
    );
  }
});