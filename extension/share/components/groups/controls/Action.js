class Action {

  constructor({
    icon=null,
    message="",
    action=()=>{},
    key="no_name",
    close=false,
    disabled=false,
  }) {
    this.icon = icon
    this.message = message
    this.action = action
    this.key = key
    this.close = close
    this.disabled = disabled
  }
}

export default Action