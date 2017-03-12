.dir2tree <- function(dir, depth, vertical){
  .C("dirToTreeR", depth=as.integer(depth), dir=as.character(dir),
     vertical=as.integer(vertical), result=character(1L), NACK=TRUE)$result
}

#' @title Tree representation of a directory
#' @description Returns the hiearchical structure of a folder as a tree.
#' @useDynLib JsonDirTreeR
#' @export
#' @return A string.
#' @param dir the path of the directory
#' @param depth a nonnegative integer, the desired depth, or \code{NULL} (default) to search until the end
#' @param vertical logical, whether to get a vertical tree
#' @examples
#' cat(dir2tree(".", 1))
#' cat(dir2tree(".", 2))
#' cat(dir2tree(".", 2, vertical=TRUE))
dir2tree <- function(dir, depth=NULL, vertical=FALSE){
  if(!dir.exists(dir)){
    stop(sprintf("Folder %s not found.", dir))
  }
  .dir2tree(dir, ifelse(is.null(depth) || is.na(depth) || is.infinite(depth), -1L, depth), as.integer(vertical))
}
