# React + Redux: useful examples

## HTML Images
#### Main HTML and Chrome Source Inspector
<img src=html1.png>

#### Edit Modal Prompt
<img src=html2.png>

## Comments on index.html
#### 1. Include Bootstrap, jQuery, React, Babel, Redux
```
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
    <script src="https://unpkg.com/redux@latest/dist/redux.min.js"></script>
```
#### 2. Include Custom Scripts: Store and Components
```
    <script type="text/jsx" type="module" src="store.js"></script>
    <script type="text/jsx" type="module" src="products.js"></script>
    <script type="text/jsx" type="module" src="header.js"></script>
    <script type="text/jsx" type="module" src="edit.js"></script>
    <script type="text/jsx" type="module" src="new.js"></script>
```
#### 3. Script to select and focus on Modal Popup Modify Product
```
    <script>
      $(window).on('shown.bs.modal', function() {
        var inputObj = $(".modal-body").find("input");
        inputObj.select();
        inputObj.focus();
      });
    </script>
  </head>
  <body>
```
#### 4. Define DIV elements
```
    <div style="width: 350px">
      <div id="header"></div><br>
      <div id="products" style="height: 60%; overflow-y: scroll; width: '18rem'"></div><br><br>
      <div id="new"></div><br>
      <div id="edit" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true"></div>
    </div>
```
## Comments on index.js
#### 5. Require and Define Constant
```
var express = require("express");
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));
app.use(express.json());
const DEFAULT_PRODUCTS = 4;
const SERVERPORT = 80;
```
#### 6. Model Prototype
```
var model = {
  "title": "products",
  "list": [],
  "filter": "",
  "editing": { "active": false, "id": "", "name": ""}
}
```
#### 7. Init items
```
function initItems(n) {
  for (i = 1; i <= n; i++)
    model.list.push({
      "id": i,
      "name": "product " + i
    })
}
```
#### 8. Load & Save handler
```
app.post('/products/:action',function(req,res) {
	switch (req.params.action) {
    case "load":
      res.send(model);
      return;
    case "save":
      res.send("ok");
      model = req.body;
      return;
    default:
  }
});
```
#### 9. Listen
```
app.listen(SERVERPORT);
initItems(DEFAULT_PRODUCTS);
```
## Comments on store.js
#### 10. Reducer
```
function reducer(state, action) {
  // 10.1. Calculate Next ID
  var nextId = function(state) {
    var maxId = 0;
    state.list.forEach(function(item,index,arr) {
      if (item.id > maxId)
        maxId = item.id;
    })
    return maxId+1;
  }
  // 10.2. Switch action.type
  switch (action.type) {
    case "DELETE":
      return Object.assign({}, state,
        state.list.forEach(function(item,index,arr) {
            if (item.id == action.id)
              return arr.splice(index,1);
          })
      )
    case "ADD":
      return Object.assign({}, state, {
        "list": state.list.concat({id: nextId(state),name:state.filter}), "filter": ""
      })
    case "LOAD":
      return Object.assign({}, state, action.obj);
    case "FILTER":
      return Object.assign({}, state, { filter: action.filter });
    case "EDITING":
      return Object.assign({}, state, { editing: action.editing });
    case "EDIT":
      return Object.assign(
        {},
        state,
          { list: state.list.map(
              function (item) {
                if (item.id == action.editing.id)
                  item.name = action.editing.name;
                return item
              }
            ),
            editing: action.editing
          }
      );
    default:
      return state;
  }
}
```
#### 11. Default state
```
const initialState = {
  "title": "products",
  "list": [],
  "filter": "",
  "editing": { "active": false, "id": "", "name": ""}
}
```
#### 12. Create Store
```
const store = Redux.createStore(reducer,initialState);
```
#### 13. Function to get product list, filtered and sorted
```
store.listFilteredSorted = function() {
  return this.getState().list.filter(
    (product) => {
      return product.name.indexOf(store.getState().filter) != -1
    }
  ).sort(function (a,b) { return (a.name > b.name) - (a.name < b.name)})
}
```
## Comments on product.js
#### 14. Products component
```
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
```
## Comments on header.js
#### 15. Header Component
```
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
```
## Comments on edit.js
#### 16. Edit Component
```
class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this)
    store.subscribe(() => this.update())
  }
  // 16.1. Manage key press updating store
  handleKeyUp(e) {
    store.dispatch( {type: "EDITING", editing: {id: store.getState().editing.id, name: e.target.value, active: true}} )
  }
  // 16.2. Change Product on store
  edit() {
    store.dispatch({type: "EDIT", editing: {id: store.getState().editing.id, name: store.getState().editing.name, active: false}})
  }
  // 16.3. Update UI from Store, if finished editing => hide Popup
  update() {
    if (!store.getState().editing.active)
      $("#edit").trigger('click.dismiss.bs.modal')
    this.forceUpdate();
  }
  render() {
    return(
      <div className="modal-dialog modal-dialog-centered" role="document">
       <div className="modal-content">
         <div className="modal-header">
           <h5 className="modal-title" id="exampleModalLongTitle">Edit Product {store.getState().editing.id}</h5>
           <button type="button" className="close" data-dismiss="modal" aria-label="Close">
             <span aria-hidden="true">&times;</span>
           </button>
         </div>
         <div className="modal-body">
           <input type="text" value={store.getState().editing.name} onChange={this.handleKeyUp}/>
         </div>
         <div className="modal-footer">
           <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
           <button type="button" className="btn btn-primary" onClick={this.edit}>Edit</button>
         </div>
       </div>
      </div>
    )
  }
}
ReactDOM.render(
  <Edit/>,
  document.getElementById('edit')
)
```
## Comments on new.js
#### 17. New Component
```
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
```

# 18 TODO
## 18.1 Middleware
## 18.2 Webpack
## 18.3 Routing
## 18.4 Unit Testing
