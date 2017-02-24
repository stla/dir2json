Shiny.addCustomMessageHandler("drawTree", function(message) {
  $("#title,#chooseBar").fadeOut();
  $("#searchBars").fadeIn();
  var dirTree = message.dirTree;
  drawTree(dirTree);
});
  