// 10. Reducer
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

// 11. Default state
const initialState = {
  "title": "products",
  "list": [],
  "filter": "",
  "editing": { "active": false, "id": "", "name": ""}
}

// 12. Create Store
const store = Redux.createStore(reducer,initialState);

// 13. Function to get product list, filtered and sorted
store.listFilteredSorted = function() {
  return this.getState().list.filter(
    (product) => {
      return product.name.indexOf(store.getState().filter) != -1
    }
  ).sort(function (a,b) { return (a.name > b.name) - (a.name < b.name)})
}
