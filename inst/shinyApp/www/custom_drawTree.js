Shiny.addCustomMessageHandler("drawTree", function(message) {
  $("#title,#chooseBar").fadeOut();
  $("#searchBars").fadeIn();
  var dirTree = JSON.parse(message.dirTree);
  drawTree(dirTree);
});
