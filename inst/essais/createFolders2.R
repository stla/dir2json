library(tibble)
dat <- tibble::tribble(
  ~level1, ~level2, ~level3, ~level4, 
  "Beverages", "Water", "", "", 
  "Beverages", "Coffee", "", "", 
  "Beverages", "Tea", "Black tea", "", 
  "Beverages", "Tea", "White tea", "", 
  "Beverages", "Tea", "Green tea", "Sencha", 
  "Beverages", "Tea", "Green tea", "Gyokuro", 
  "Beverages", "Tea", "Green tea", "Matcha", 
  "Beverages", "Tea", "Green tea", "Pi Lo Chun"
)
TMPDIR <- tempdir()
TMPDIR <- gsub("\\w+$", "root", TMPDIR)
#unlink(list.files(TMPDIR, full.names = TRUE), force = TRUE, recursive = TRUE)
dat <- cbind(level0 = rep(TMPDIR, nrow(dat)), dat)

paths <- apply(dat, 1L, paste0, collapse = "/")
paths <- gsub("/*$", "", paths)
paths <- stringi::stri_replace_last(paths, "//", fixed = "/")
paths <- strsplit(paths, "//")
folders <- lapply(paths, head, 1L)
files <- lapply(paths, function(path) do.call(file.path, as.list(path)))
lapply(folders, dir.create, recursive = TRUE, showWarnings = FALSE)
lapply(files, file.create, showWarnings = FALSE)

dir2json::shinyDirTree(TMPDIR)

