// 17. New Component
class New extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this)
    this.add = this.add.bind(this)
    store.subscribe(() => this.forceUpdate());
  }
  // 17.1. Manage Key Press to update Store
  handleKeyUp(e) {
    store.dispatch( {type: "FILTER", filter: e.target.value} )
  }
  // 17.2. Manage Adding Product on Store
  add() {
    store.dispatch( {type: "ADD"} )
  }
  render() {
    return (
      <div>
        Search & Create Product
        <input type="text" id="searchAndCreateName" value={store.getState().filter} onChange={this.handleKeyUp}/>&nbsp;
        <button className="btn btn-info" onClick={this.add} disabled={ store.getState().filter.length > 0?"":"disabled"}>Add</button>
      </div>
    )
  }
}

ReactDOM.render(
  <New/>,
  document.getElementById('new')
);
