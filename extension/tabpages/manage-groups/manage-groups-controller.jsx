

document.addEventListener("DOMContentLoaded", () => {
  // Set tab title
  document.title = "Manage Groups";
  // Set tab icon
  Utils.setIcon("/share/icons/tabspace-active-64.png");

  ReactDOM.render(
    <ManageWrapper />
    , document.getElementById("content"));

});
