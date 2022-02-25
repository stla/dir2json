.dir2json <- function(dir, depth){
  .C(
    "dirToJSON", depth = as.integer(depth), dir = dir,
     result = character(1L), NACK = TRUE
  )[["result"]]
}

#' @title JSON representation of a directory
#' @description Returns the hierarchical structure of a folder as a JSON string.
#' @useDynLib JsonDirTree, .registration=true
#' @export
#' @return A string.
#' @param dir the path of the directory
#' @param depth a nonnegative integer, the desired depth, or \code{NULL} 
#'   (default) to search until the end
#' @examples
#' dir2json(".", 0)
#' dir2json(".", 1)
#' dir2json(Sys.getenv("R_HOME"), 1)
dir2json <- function(dir, depth = NULL){
  if(!dir.exists(dir)){
    stop(sprintf("Folder '%s' not found.", dir))
  }
  .dir2json(
    dir, 
    ifelse(is.null(depth) || is.na(depth) || is.infinite(depth), -1L, depth)
  )
}

.dir2jsonEnv <- new.env()

assignNullValues <- function(){
  vars <- ls(dir2json:::.dir2jsonEnv)
  for(var in vars){
    assign(var, NULL, envir = dir2json:::.dir2jsonEnv)
  }
  # assign("dir", NULL, envir = .dir2jsonEnv)
  # assign("depth", NULL, envir = .dir2jsonEnv)
}

#' @title Shiny app: tree representation of a folder
#' @description Shiny app to play with a Reingold-Tilford tree network diagram
#'   representing a folder structure.
#' @param dir path to a directory; if \code{NULL}, it is selected in the app
#' @param depth the desired depth, ignored if \code{dir=NULL}; 
#'   see \code{\link{dir2json}}
#' @param searchByExtension Boolean, whether to include a search bar in the 
#'   app to search files by their extension
#' @export
#' @importFrom shiny shinyAppDir runApp
#' @importFrom rChoiceDialogs jchoose.dir
shinyDirTree <- function(dir = NULL, depth = NULL, searchByExtension = TRUE){
  assign(
    "dir", 
    if(is.null(dir)) NULL else normalizePath(dir), 
    envir = .dir2jsonEnv
  )
  assign("depth", depth, envir = .dir2jsonEnv)
  assign("searchByExtension", searchByExtension, envir = .dir2jsonEnv)
  on.exit(assignNullValues())
  appDir <- system.file("shinyApp", package = "dir2json")
  app <- shinyAppDir(appDir)
  runApp(app, display.mode = "normal", launch.browser = TRUE)
  invisible()
}

#' @importFrom stringi stri_replace_last
#' @noRd
createFolder <- function(dat){
  TMPDIR <- tempdir()
  TMPDIR <- gsub("\\w+$", "root", TMPDIR)
  dat <- cbind(.level0 = rep(TMPDIR, nrow(dat)), dat)
  paths <- apply(dat, 1L, paste0, collapse = "/")
  paths <- gsub("/*$", "", paths)
  paths <- stri_replace_last(paths, "//", fixed = "/")
  paths <- strsplit(paths, "//")
  folders <- lapply(paths, head, 1L)
  files <- lapply(paths, function(path) do.call(file.path, as.list(path)))
  invisible(
    lapply(folders, dir.create, recursive = TRUE, showWarnings = FALSE)
  )
  invisible(
    lapply(files, file.create, showWarnings = FALSE)
  )
  TMPDIR
}

#' @title Shiny app: tree representation of a dataframe
#' @description Shiny app to play with a Reingold-Tilford tree network diagram
#'   representing a hierarchical data structure.
#' @param dat the data to be represented 
#' @param root Boolean, whether to include a root node
#'
#' @return No value, just runs a Shiny app.
#' @export
#'
#' @examples library(dir2json)
#' dat <- tibble::tribble(
#'   ~level1, ~level2, ~level3, ~level4, 
#'   "Beverages", "Water", "", "", 
#'   "Beverages", "Coffee", "", "", 
#'   "Beverages", "Tea", "Black tea", "", 
#'   "Beverages", "Tea", "White tea", "", 
#'   "Beverages", "Tea", "Green tea", "Sencha", 
#'   "Beverages", "Tea", "Green tea", "Gyokuro", 
#'   "Beverages", "Tea", "Green tea", "Matcha", 
#'   "Beverages", "Tea", "Green tea", "Pi Lo Chun"
#' )
#' shinyDataTree(dat)
shinyDataTree <- function(dat, root = TRUE){
  if(!root && length(unique(dat[[1L]])) > 1L){
    root <- TRUE
  }
  assign("root", root, envir = .dir2jsonEnv)
  assign("tooltips", FALSE, envir = .dir2jsonEnv)
  TMPDIR <- createFolder(dat)
  shinyDirTree(TMPDIR, searchByExtension = FALSE)
}

#' @title Shiny app: tree representation of an Excel table
#' @description Shiny app to play with a Reingold-Tilford tree network diagram
#'   representing a hierarchical data structure.
#' @param xlsx path to a xlsx file
#' @param sheet sheet to read; either a string (the name of a sheet), or an 
#'   integer (the position of the sheet)   
#' @param root Boolean, whether to include a root node
#'
#' @return No value, just runs a Shiny app.
#' @export
#' @importFrom readxl read_xlsx
#' @note This function runs \code{\link{shinyDataTree}} with the dataframe 
#'   imported from the xlsx file.
shinySheetTree <- function(xlsx, sheet = 1, root = TRUE){
  dat <- read_xlsx(xlsx, sheet = sheet)
  dat[is.na(dat)] <- ""
  shinyDataTree(dat, root = root)
}