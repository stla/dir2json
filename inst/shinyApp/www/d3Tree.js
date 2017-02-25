
function drawTree(jsondata) {

  margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120
    };
    width = window.innerWidth - margin.right - margin.left - 50;
    height = 80*jsondata.children.length - margin.top - margin.bottom;

  id_incr = 0;
  duration = d3.event && d3.event.altKey ? 5000 : 500;
  root = jsondata;

  var
    searchFile_data = getAllNames(jsondata),
    searchByExt_data = getFileExtensions(jsondata),
    filemap = fileMapByExtension(jsondata);

  tree = d3.layout.tree()
    .size([height, width]);

  diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  svg = d3.select("#container-tree").append("svg:svg")
    .attr("class", "svg_container")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .style("overflow", "auto")
    .style("background-color", "#EEEEEE")
    .append("svg:g")
    .attr("class", "drawarea")
    .append("svg:g")
    .attr("transform", "translate(" + margin.right + "," + margin.top + ")");


  root.x0 = height / 2;
  root.y0 = 0;
  root.children.forEach(collapse);

  // var botao = d3.select("#form #button");
  // botao.on("click", function() {
  //   toggle(root);
  //   update(root);
  //   var height = 800;
  //   tree = d3.layout.tree()
  //     .size([height, 900]);
  //   svg.attr("height", height + 50).append("svg:g");
  // });

  update(root);


  //init search box
  $("#search").select2({
    data: searchFile_data,
    placeholder: "Search a file or a folder in the tree...",
    containerCssClass: "search"
  });

  //search box for files highlighter
  $("#searchExt").select2({
    data: searchByExt_data,
    placeholder: "Search all these files...",
    containerCssClass: "search"
  });
  // event: highlight class R, pdf, etc (class is attributed on the text)

  //attach search box listener
  $("#search").on("select2:select select2:unselect", function(e) {
    if ($(this)[0].selectedOptions.length === 0) {
      $("#icon1").show();
    } else {
      $("#icon1").hide();
    }
    var eventType = e.type;
    var paths = getPaths(root, e.params.data.text); // je pourrais faire un Map
    if (typeof(paths) !== "undefined") {
      if (eventType == "select2:select") {
        openPaths(paths);
      } else {
        closePaths(paths);
      }
    } else {
      alert(e.params.data.text + " not found!");
    }
  });

  $("#searchExt").on("select2:select select2:unselect", function(e) {
    var eventType = e.type;
    var extension = e.params.data.text;
    var files = filemap[extension]; // search all files matching
    var paths = [];
    for (var i = 0; i < files.length; i++) {
      paths = paths.concat(getPaths(root, files[i]));
    }
    if (eventType == "select2:select") {
      openPaths(paths);
    } else {
      closePaths(paths);
    }
  });


  //d3.select(self.frameElement).style("height", "800px");

  //recursively collapse children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  function openPaths(paths) {
    for (var i = 0; i < paths.length; i++) {
      if (paths[i].id !== "1") { //i.e. not root
        paths[i].class = 'found';
        if (paths[i]._children) { //if children are hidden: open them, otherwise: don't do anything
          paths[i].children = paths[i]._children;
          paths[i]._children = null;
        }
        update(paths[i]);
      }
    }
  }

  function closePaths(paths) {
    for (var i = 0; i < paths.length; i++) {
      if (paths[i].id !== "1") { //i.e. not root
        delete paths[i].class;
        if (paths[i]._children) { //if children are hidden: open them, otherwise: don't do anything
          paths[i].children = paths[i]._children;
          paths[i]._children = null;
        }
        update(paths[i]);
      }
    }
  }

}

function update(source) {
  // div for tooltips
  Div = d3.select("body")
    .append("div") // declare the tooltip div
    .attr("class", "tooltip")
    .style("opacity", 0);


  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
    links = tree.links(nodes);
  console.log(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) {
    d.y = d.depth * 180;
  });

  // Update the nodes
  var node = svg.selectAll("g.node")
    .data(nodes, function(d) {
      return d.id || (d.id = ++id_incr);
    })
    .on("mouseover", mouseover(Div))
    .on("mouseout", mouseout(Div));


  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
    .attr("class", "node")
    .attr("transform", function(d) {
      return "translate(" + source.y0 + "," + source.x0 + ")";
    })
    .on("click", function(d) {
      if (d.children) {
        d._children = d.children;
        d.children = null;
      } else {
        d.children = d._children;
        d._children = null;
      }
      update(d);
    }); // to display children

  nodeEnter.append("text")
    .attr("x", function(d) {
      return d._type == "folder" ? -10 : 10;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", function(d) {
      return d._type == "folder" ? "end" : "start";
    })
    .text(function(d) {
      return d.name;
    })
    .style("fill-opacity", 1e-6)
    .attr("class", function(d) {
      return basefilename(d.name);
    });

  //SL append size
  nodeEnter.append("size")
    .text(function(d) {
      return d.size;
    });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")";
    });

  //SL : gold for empty folder
  // problem : non-empty folder at leaves are gold
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) {
      if (d._type == "file") {
        return "#fff";
      } else {
        return d._children ? "lightsteelblue" : "gold";
      }
    });

  nodeUpdate.select("circle")
    .attr("r", 4.5)
    .style("fill", function(d) {
      if (d.class === "found") {
        return "#ff4136"; //red
      } else if (d._children) {
        return "lightsteelblue";
      } else {
        return d._type == "file" ? "#fff" : "gold";
      }
    })
    .style("stroke", function(d) {
      if (d.class === "found") {
        return "#ff4136"; //red
      }
    });

  nodeUpdate.select("text")
    .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
    .duration(duration)
    .attr("transform", function(d) {
      return "translate(" + source.y + "," + source.x + ")";
    })
    .remove();

  nodeExit.select("circle")
    .attr("r", 1e-6);

  nodeExit.select("text")
    .style("fill-opacity", 1e-6);

  // Update the linksâ€¦
  var link = svg.selectAll("path.link")
    .data(links, function(d) {
      return d.target.id;
    });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
    .attr("class", "link")
    .attr("d", function(d) {
      var o = {
        x: source.x0,
        y: source.y0
      };
      return diagonal({
        source: o,
        target: o
      });
    });

  // Transition links to their new position.
  link.transition()
    .duration(duration)
    .attr("d", diagonal)
    .style("stroke", function(d) {
      if (d.target.class === "found") {
        return "#ff4136";
      }
    });

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
    .duration(duration)
    .attr("d", function(d) {
      var o = {
        x: source.x,
        y: source.y
      };
      return diagonal({
        source: o,
        target: o
      });
    })
    .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });

  nclicks=1;
  d3.select("svg")
      .call(d3.behavior.zoom()
            .scaleExtent([0.5, 5])
            .on("zoom", zoom) // https://github.com/d3/d3-zoom
            // .on("wheel.zoom", null) // https://github.com/d3/d3-3.x-api-reference/blob/master/Zoom-Behavior.md
            .on("zoomend", function(event){
               console.log("zoomend");
            })
          )
      .on("dblclick", function(){
         var scale = d3.event.shiftKey ? 0.5 : 2;
         var drawareaContainer = d3.select("svg");
         drawareaContainer.attr("height", scale*drawareaContainer.attr("height"));
      });


}
