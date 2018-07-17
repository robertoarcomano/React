// 16. Edit Component
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
