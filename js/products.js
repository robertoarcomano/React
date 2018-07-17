// 14. Products component
class Products extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(() => this.forceUpdate());
  }
  edit(obj) {
    // 14.1. Click on edit send an action to let show Modal Popup Modify Product
    store.dispatch( {type: "EDITING", editing: obj} )
  }
  render() {
    // 14.2. Show Product List
    var products = store.listFilteredSorted().map(
      (obj_temp,index) => {
        var obj = Object.assign(
          {},
          obj_temp,
          {active: true}
        )
        return (
          <div className="card" style={{width: '18rem'}} key={obj.id}>
            <div className="card-body">
              <h5 className="card-title">{obj.name}</h5>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#edit" onClick={() => this.edit(obj)}>
                Edit
              </button>&nbsp;
              <a href="#" className="btn btn-danger" onClick={() => store.dispatch({type: "DELETE", id: obj.id})}>Delete</a>
            </div>
          </div>
        );
      }
    )
    return (
      <div>
        {products}
      </div>
    );
  }
}

ReactDOM.render(
  <Products/>,
  document.getElementById('products')
);
