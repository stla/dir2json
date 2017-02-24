library(shiny)


shinyUI(fluidPage(

  tags$head(
    tags$script(src="select2.full.min.js"),
    tags$link(rel="stylesheet", href="select2.min.css"),
    tags$script(src="d3.v3.min.js"),
    tags$script(src="jsondirtree.js"),
    tags$script(src="d3Tree.js"),
    tags$link(rel="stylesheet", href="font-awesome-4.7.0/css/font-awesome.min.css"),
    tags$link(rel="stylesheet", href="d3Tree.css"),
    tags$script(src="custom_drawTree.js")
  ),

  tags$div(id="title",
    titlePanel("D3 folder structure")
  ),

  tags$div(id="chooseBar",
    fluidRow(column(width=12,
                    wellPanel(actionButton("chooseDir", "Choose a directory"))))
  ),

  br(),
  tags$div(id="searchBars", style="display:none;", class="container-1",
           fluidRow(
             column(width=6,
                    #tags$span(class="icon", tags$i(class="fa fa-search")),
                    tags$select(id="search", style="width:100%",
                                multiple="multiple",
                                tags$option())
             ),
             column(width=6,
                    #tags$span(class="icon", tags$i(class="fa fa-search")),
                    tags$select(id="searchExt", style="width:100%", multiple="multiple",
                                tags$option())
             )
           )
  )


))
