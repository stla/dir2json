# dir2json, an R package

Originally, this package only dealt with the hierarchical data given by 
the structure of a folder, but now it can deal with any dataset with a 
hierarchical structure. 
It provides a Shiny application (see below). 
Also provides a function to get the tree view of a directory.

This package uses the DLL created by the Haskell libraries [jsondirtree](https://github.com/stla/jsondirtree) and [jsondirtreeR](https://github.com/stla/jsondirtreeR). They are standalone on 
Windows.

```r
library(dir2json)
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
shinyDataTree(dat, root = FALSE)
```

![](https://raw.githubusercontent.com/stla/dir2json/master/inst/images/shinyDataTree.gif)

This kind of tree is called a *Reingold-Tilford tree network diagram*. It 
is produced with the help of **D3.js**.
