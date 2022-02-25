.onLoad <- function(libname, pkgname) {
  library.dynam("JsonDirTree", pkgname, libname, now = TRUE)
  .C("HsStart")
  invisible()
}

.onUnLoad <- function(libpath) {
  library.dynam.unload("JsonDirTree", libpath)
  invisible()
}
