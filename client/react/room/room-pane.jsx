/** @jsx React.DOM */

var RoomPaneCategory = require('./room-pane-category.jsx');

var RoomPane = module.exports = React.createClass({
  getInitialState: function () {
    return {
      mode: 'frozen',
      categories: this.props.categories
    };
  },
  componentWillMount: function() {
    this.load();
  },
  load: function () {
    this.setState({
      mode: this.getFrozenState()
    });
  },
  getFrozenState: function () {
    if (!this.isAnyCatChosen()) {
      return 'needChoice';
    } else {
      return 'frozen';
    }
  },
  initDone: function () {
    this.props.getModal().open();
  },
  toggleMode: function () {
    this.setState({
      mode: (this.state.mode === 'edit' ? this.getFrozenState() : 'edit')
    });
  },
  clickChosen: function (isChosen, categoryIndex, restaurantIndex) {
    if (this.state.mode === 'edit') {
      if (typeof(restaurantIndex) === 'undefined') {
        // toggling whole category
        var toggleCat = this.state.categories[categoryIndex];
        toggleCat.restaurants.forEach(function (eat) {
          eat.chosen = isChosen;
        }, this);
      } else {
        // toggling single restaurant
        var toggleEat = this.state.categories[categoryIndex].restaurants[restaurantIndex];
        toggleEat.chosen = isChosen;
      }
      this.setState();
    } else if (this.state.mode === 'frozen') {
      // veto / roundChosen mode
      if (typeof(restaurantIndex) === 'undefined') {
        // veto by categories
        var toggleCat = this.state.categories[categoryIndex];
        toggleCat.veto = !toggleCat.veto;
        if (toggleCat.veto) {
          this.setState({ vetoes: (this.state.vetoes || 0) + 1 });
        } else {
          this.setState({ vetoes: (this.state.vetoes || 0) - 1 });
        }
      } else {
        // toggling single restaurant
        var toggleEat = this.state.categories[categoryIndex].restaurants[restaurantIndex];
        toggleEat.roundChosen = !toggleEat.roundChosen;
        if (this.state.roundChosen) {
          var ij = this.state.roundChosen;
          delete this.state.categories[ij[0]].restaurants[ij[1]].roundChosen;
        }
        if (toggleEat.roundChosen) {
          this.setState({ roundChosen: [categoryIndex, restaurantIndex] });
        } else {
          this.setState({ roundChosen: null });
        }
      }
      console.log(arguments);
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
  isAnyCatChosen: function () {
    var hasChosen = false;
    for (var i = 0; i < this.state.categories.length; i++) {
      var cat = this.state.categories[i];
      if (this.doesCatHaveChosen(cat)) {
        hasChosen = true;
        break;
      }
    }
    return hasChosen;
  },
  renderCategories: function () {
    var self = this;
    var rendered = this.props.categories
    .map(function (cat, index) {
      return <RoomPaneCategory 
                data={cat} 
                index={index} 
                mode={this.state.mode} 
                choose={this.clickChosen} />;
    }, this);
    return (
      <ul className="list-group">
        {rendered}
      </ul>
    );
            
  },
  renderButtonEdit: function () {
    var buttonMessage = 'Edit';
    if (this.state.mode === 'edit') {
      buttonMessage = 'Close';
    }
    return (
      <button type="button" className="pull-right btn btn-default" onClick={this.toggleMode}>
        {buttonMessage}
      </button>
    );
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
  renderCallToAction: function () {
    if (this.state.mode === 'needChoice') {
      return (
        <h4>Click Edit and make your choices</h4>
      );
    } else {
      return;
    }
  },
  renderButtonInit: function () {
    var buttonMessage = 'I\'m Done';
    return (
      <button type="button" className="pull-right btn btn-default" onClick={this.initDone}>
        {buttonMessage}
      </button>
    );
  },
  render: function () {
    return (
      <table className="table" data-mode={this.state.mode}>
        <tr>
          <td>
            {this.renderCallToAction()}
            {this.renderCategories()}
          </td>
          <td className="buttonRow">
            {this.renderButtonEdit()}
            <div className="clearfix"></div>
            {this.renderInfo()}
            <div className="clearfix"></div>
            {this.renderButtonInit()}
          </td>
        </tr>
      </table>
    );
  }
});