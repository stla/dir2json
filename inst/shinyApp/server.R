library(shiny)
library(rChoiceDialogs)
library(dir2json)

dirTree <- function(root){
  bname <- basename(root)
  out <- list(name=bname)
  infos <- file.info(root)
  isdir <- infos$isdir
  if(isdir){
    out[["_type"]] <- "folder"
    childs <- list.files(root, include.dirs=TRUE, full.names=TRUE)
    out$children <- lapply(childs, dirTree)
  }else{
    out[["_type"]] <- "file"
    out$size <- infos$size
  }
  return(out)
}

shinyServer(function(input, output, session) {

  session$onSessionEnded(function() {
    stopApp()
    # quit()
  })

  RV <- reactiveValues()
  RV[["dir"]] <- NULL

  observeEvent(input$chooseDir, {
    RV[["dir"]] <- jchoose.dir()
  })

  observeEvent(RV[["dir"]], {
    if(!is.null(dir <- RV[["dir"]])){
      session$sendCustomMessage("drawTree",
                                list(dirTree=dirTree(dir)))
    }
  })

})
