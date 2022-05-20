library(shiny)
library(rChoiceDialogs)
library(dir2json)

#TODO : dir as argument

dirTree <- function(root){
  bname <- basename(root)
  out <- list("name" = bname)
  infos <- file.info(root)
  isdir <- infos[["isdir"]]
  if(isdir){
    out[["_type"]] <- "folder"
    childs <- list.files(root, include.dirs = TRUE, full.names = TRUE)
    out[["children"]] <- lapply(childs, dirTree)
  }else{
    out[["_type"]] <- "file"
    out[["size"]] <- infos[["size"]]
  }
  out
}

rootNode <- xor(
  isTRUE(dir2json:::.dir2jsonEnv[["root"]]),
  isTRUE(dir2json:::.dir2jsonEnv[["noroot"]])
)
print(rootNode)


shinyServer(function(input, output, session){

  session[["onSessionEnded"]](function(){
    stopApp()
    # quit()
  })

  output[["value"]] <- renderText({ input[["depth"]] })

  RV <- reactiveValues()
  RV[["dir"]] <- dir2json:::.dir2jsonEnv[["dir"]]
  RV[["depth"]] <- dir2json:::.dir2jsonEnv[["depth"]]

  output[["dirIsNotGiven"]] <- reactive({
    is.null(RV[["dir"]])
  })
  outputOptions(output, "dirIsNotGiven", suspendWhenHidden = FALSE)

  observeEvent(input[["chooseDir"]], {
    RV[["dir"]] <- jchoose.dir()
  })

  observeEvent(RV[["dir"]], {
    if(!is.null(dir <- RV[["dir"]])){
      depth <- ifelse(is.null(RV[["depth"]]), input[["depth"]], RV[["depth"]])
      if(is.numeric(depth) && depth == 0) depth <- 1L
      session[["sendCustomMessage"]](
        "drawTree", 
        list(
          "dirTree" = dir2json(dir, depth), 
          "rootNode" = rootNode
        )
      )
    }
  })

})
