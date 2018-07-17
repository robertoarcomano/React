// 15. Header Component
class Header extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(() => this.forceUpdate());
  }
  productsCount() {
    // 15.1. Get Records Count
    return store.listFilteredSorted().length;
  }
  load() {
    // 15.2. Load Button to get data from server
    fetch("/products/load", { method: 'post' })
    .then(results => { return results.json() })
    .then(json => {
      store.dispatch({type: "LOAD", obj: json })
    })
  }
  save() {
    // 15.3. Save Button to put data to server
    fetch("/products/save", { method: 'post', headers: {'Content-Type': 'application/json'},body: JSON.stringify(store.getState()) })
  }
  render() {
    return (
      <div>
        <h5 className="card-title">Products Count: {this.productsCount()}</h5>
        <button type="button" className="btn btn-success" onClick={this.load}>Load</button>&nbsp;
        <button type="button" className="btn btn-warning" onClick={this.save}>Save</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Header/>,
  document.getElementById('header')
);
