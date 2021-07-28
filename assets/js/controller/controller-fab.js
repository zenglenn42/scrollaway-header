//----------------------------------------------------------------------------------
// Controller (for FAB)
//
// These methods define the event listeners associated with the floating action 
// button.
//
// The event handlers typically cause the FAB model and view to be updated.
//----------------------------------------------------------------------------------
// TODO: Allow the view to subscribe to model-state changes.
//
//       Currently the controller shoulders responsibility for keeping the view
//       synchronized with the models.
//----------------------------------------------------------------------------------

Controller.prototype.getFabEventListener = function(createBodyFn) {
  let that = this
  function innerFunction() {
    that.FAB.setNextPageState("fab")

    // Persist to local storage if available.
    //
    // Since FAB state includes knowledge of the current focal page,
    // persisting state will enable support for resuming to that page 
    // in a subsequent user session.

    let fabState = that.FAB.get()
    that.cache.setFAB(fabState)

    createBodyFn()
  }
  return innerFunction
}
