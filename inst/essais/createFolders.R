library(tibble)

dat <- tibble::tribble(
  ~level1,~level2,~level3,~level4,
  "Beverages","Water","","",
  "Beverages","Coffee","","",
  "Beverages","Tea","Black tea","",
  "Beverages","Tea","White tea","",
  "Beverages","Tea","Green tea","Sencha",
  "Beverages","Tea","Green tea","Gyokuro",
  "Beverages","Tea","Green tea","Matcha",
  "Beverages","Tea","Green tea","Pi Lo Chun"
)

paths <- apply(dat, 1L, paste0, collapse = "/")
paths <- gsub("/*$", "", paths)
paths <- stringi::stri_replace_last(paths, "//", fixed = "/")
paths <- strsplit(paths, "//")
folders <- lapply(paths, head, 1L)
files <- lapply(paths, function(path) do.call(file.path, as.list(path)))
lapply(folders, dir.create, recursive = TRUE, showWarnings = FALSE)
lapply(files, file.create, showWarnings = FALSE)



paths <- data.frame(pathString = apply(dat, 1, paste0, collapse = "/"))

library(data.tree)
tree <- as.Node(paths)
LL <- as.list(tree)

LL <- as.list(tree, mode="explicit", unname=TRUE)
jsonlite::toJSON(LL, pretty = TRUE, auto_unbox = TRUE)

f <- function(x){
  if(is.list(x)){
    if("children" %in% names(x)){
      x <- c(x, list(type = "folder"))
      lapply(x[["children"]], f)
    }else{
      lapply(x, f)
    }
  }else{
    x <- "file"
  }
  x
}

lapply(LL, f)

library(rrapply)
