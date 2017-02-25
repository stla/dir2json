library(shiny)


shinyUI(fluidPage(

  tags$head(
    conditionalPanel(
      condition = "$('html').hasClass('shiny-busy')",
      tags$div(
        style = "float:right; padding-right:10px; padding-top:10px;",
        tags$img(
          src = "spinner.gif",
          height = 120,
          width = 120
        )
      ),
      tags$div(style = "float:right; padding-right:10px; padding-top:10px; color:red; background-color:white; font-family:arial; font-size:17px", "Calculating... Please wait...")
    ),
    tags$script(src="select2.full.min.js"),
    tags$link(rel="stylesheet", href="select2.min.css"),
    tags$script(src="d3.v3.min.js"),
    #tags$script(src="d3-zoom.v1.min.js"),
    tags$script(src="jsondirtree.js"),
    tags$script(src="eventHandlers.js"),
    tags$script(src="d3Tree.js"),
    tags$link(rel="stylesheet", href="font-awesome-4.7.0/css/font-awesome.min.css"),
    tags$link(rel="stylesheet", href="d3Tree.css"),
    tags$script(src="custom_drawTree.js")
  ),

  #verbatimTextOutput("value"),

  conditionalPanel("output.dirIsNotGiven == true",
                   tags$div(id="title",
                            titlePanel("D3 folder structure")
                   )
  ),

  conditionalPanel("output.dirIsNotGiven == true",
                   tags$div(id="chooseBar",
                            fluidRow(column(width=3,
                                            wellPanel(numericInput("depth", "Set the desired depth, or leave blank", value=Inf, min=1L)))
                            ),
                            fluidRow(column(width=3,
                                            wellPanel(actionButton("chooseDir", "Choose a directory")))
                            )
                   )
  ),

  br(),
  tags$div(id="searchBars", style="display:none;", class="container-1",
           fluidRow(
             column(width=6, class="container-2",
                    tags$select(id="search", style="width:80%;",
                                multiple="multiple",
                                tags$option()),
                    tags$button(class="icon", id="icon1", style="pointer-events:none", tags$i(class="fa fa-search"))
             ),
             column(width=6, class="container-2",
                    tags$select(id="searchExt", style="width:80%", multiple="multiple",
                                tags$option()),
                    tags$button(class="icon", id="icon2", tags$i(class="fa fa-search"))
             )
           ),
           span(style="color:gold;float:right;position:relative;padding-top:5px", includeMarkdown("www/help.md")
)
  ),

  br(),
  div(id="container-tree", style="overflow:auto")
))
