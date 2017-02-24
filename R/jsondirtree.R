.dir2json <- function(dir, depth){
  .C("dirToJSONtreeR", depth=as.integer(depth), dir=dir,
     result=character(1L), NACK=TRUE)$result
}

#' @title JSON representation of a directory
#' @description Returns the hiearchical structure of a folder as a JSON string.
#' @useDynLib JsonDirTreeR
#' @export
#' @return A string.
#' @param dir the path of the directory
#' @param depth a nonnegative integer, the desired depth, or \code{NULL} to search until the end
dir2json <- function(dir, depth=NULL){
  if(!dir.exists(dir)){
    stop(sprintf("Folder %s not found.", dir))
  }
  .dir2json(dir, ifelse(is.null(depth), -1L, depth))
}

#' @title Shiny app: tree representation of a folder
#' @description Shiny app to play with a Reingold-Tilford tree network diagram
#' representing a folder structure
#' @export
#' @import shiny
#' @importFrom rChoiceDialogs jchoose.dir
shinyReshape <- function(dat=NULL){
  appDir <- system.file("shinyApp", package = "dir2json")
  app <- shiny::shinyAppDir(appDir)
  shiny::runApp(app, display.mode="normal", launch.browser=TRUE)
}
