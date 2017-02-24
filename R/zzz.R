.onLoad <- function(libname, pkgname) {
  library.dynam("JsonDirTreeR", pkgname, libname, now=TRUE)
  .C("HsStart")
  invisible()
}

.onUnLoad <- function(libpath) {
  library.dynam.unload("JsonDirTreeR", libpath)
  invisible()
}
