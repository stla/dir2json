Shiny.addCustomMessageHandler("drawTree", function(message) {
  $("#title,#chooseBar").fadeOut();
  $("#searchBars").fadeIn();
  var dirTree = JSON.parse(message.dirTree);
  orderFilesAndFolders(dirTree);
  drawTree(dirTree, message.rootNode);
});
