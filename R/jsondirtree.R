.dir2json <- function(dir, depth){
  .C("dirToJSONtreeR", depth=as.integer(depth), dir=dir,
     result=character(1L), NACK=TRUE)$result
}

#' @title JSON representation of a directory
#' @description Returns the hierarchical structure of a folder as a JSON string.
#' @useDynLib JsonDirTreeR
#' @export
#' @return A string.
#' @param dir the path of the directory
#' @param depth a nonnegative integer, the desired depth, or \code{NULL} (default) to search until the end
#' @examples
#' dir2json(".", 0)
#' dir2json(".", 1)
#' dir2json(Sys.getenv("R_HOME"), 1)
dir2json <- function(dir, depth=NULL){
  if(!dir.exists(dir)){
    stop(sprintf("Folder %s not found.", dir))
  }
  .dir2json(dir, ifelse(is.null(depth) || is.na(depth) || is.infinite(depth), -1L, depth))
}

.dir2jsonEnv <- new.env()

assignNullValues <- function(){
  assign("dir", NULL, envir = .dir2jsonEnv)
  assign("depth", NULL, envir = .dir2jsonEnv)
}

#' @title Shiny app: tree representation of a folder
#' @description Shiny app to play with a Reingold-Tilford tree network diagram
#' representing a folder structure
#' @param dir path to a directory; if \code{NULL}, it is selected in the app
#' @param depth the desired depth, ignored if \code{dir=NULL}; see \code{\link{dir2json}}
#' @export
#' @import shiny
#' @importFrom rChoiceDialogs jchoose.dir
shinyDirTree <- function(dir=NULL, depth=NULL){
  assign("dir", if(is.null(dir)) NULL else normalizePath(dir), envir = .dir2jsonEnv)
  assign("depth", depth, envir = .dir2jsonEnv)
  on.exit(assignNullValues())
  appDir <- system.file("shinyApp", package = "dir2json")
  app <- shiny::shinyAppDir(appDir)
  shiny::runApp(app, display.mode="normal", launch.browser=TRUE)
  return(invisible())
}
