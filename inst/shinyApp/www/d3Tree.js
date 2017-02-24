// size, circle, and text are defined in update()
function mouseover(Div) {
  return function() {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 9);

    d3.select(this).select("text").transition()
      .duration(750)
      .style("stroke-width", ".5px")
      .style("font", "25px sans-serif"); // FAIRE un shift vers le bas
    //.style("opacity", 1);

    // FAIRE la taille de Div proportionnel à la longueur de size !
    var size = d3.select(this).select("size").text();
    if (size !== "") {
      Div.transition() //Opacity transition when the tooltip appears
        .duration(500)
        .style("opacity", "1")
        .style("display", "block")
        .style("z-index", "-1")
        .style("width", 12*size.length);
      Div.html("<i>size:</i> " + size)
        .style("left", (d3.event.pageX - 0) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
    }
  };
}

// mouseout event handler
function mouseout(Div) {
  return function() {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 4.5);

    d3.select(this).select("text").transition()
      .duration(750)
      .style("font", "10px sans-serif");
    //        .style("opacity", 0);

    if (d3.select(this).select("size").text() !== "") {
      Div.transition() //Opacity transition when the tooltip disappears
        .duration(500)
        .style("opacity", "0")
        .style("display", "none");
    }
  };
}

function drawTree(jsondata) {

  var div = d3.select("body")
    .append("div") // declare the tooltip div
    .attr("class", "tooltip")
    .style("opacity", 0);

  var margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120
    },
    width = 960 - margin.right - margin.left,
    height = 800 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    root = jsondata,
    searchFile_data = getAllNames(jsondata),
    searchByExt_data = getFileExtensions(jsondata),
    filemap = fileMapByExtension(jsondata);

  var diameter = 960;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root.x0 = height / 2;
  root.y0 = 0;
  root.children.forEach(collapse);
  update(root);

  //init search box
  $("#search").select2({
    data: searchFile_data,
    placeholder: "Search a file or a folder in the tree",
    containerCssClass: "search"
  });

  //search box for files highlighter
  $("#searchExt").select2({
    data: searchByExt_data,
    placeholder: "Search all these files",
    containerCssClass: "search"
  });
  // event: highlight class R, pdf, etc (class is attributed on the text)

  //attach search box listener
  $("#search").on("select2:select select2:unselect", function(e) {
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
    for(var i=0; i<files.length; i++){
      paths = paths.concat(getPaths(root, files[i]));
    }
    if (eventType == "select2:select") {
      openPaths(paths);
    } else {
      closePaths(paths);
    }
  });


  d3.select(self.frameElement).style("height", "800px");

  function update(source) {
    // Compute the new tree layout.
    // SL filtrer ici (pdf, etc)   ?
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);
    console.log(nodes); // me semble OK pour filtrer

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
      d.y = d.depth * 180;
    });

    // Update the nodes
    // div déjà déclaré au début de la fonction drawtree !!!!
    //    var Div = d3.select("body")
    //            .append("div")
    //            .attr("class", "tooltip")
    //            .style("opacity", "0")
    //            .style("display", "none");
    var Div = div.style("display", "none");
    var node = svg.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      })
      .on("mouseover", mouseover(Div))
      .on("mouseout", mouseout(Div));


    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click); // to display children

    //SL : style pour empty folder ici
    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", function(d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function(d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) {
        return d.children || d._children ? "end" : "start";
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

    nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) {
        if (d.class === "found") {
          return "#ff4136"; //red
        } else if (d._children) {
          return "lightsteelblue";
        } else {
          return "#fff";
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
    link.enter().insert("path", "g")
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
  }

  //recursively collapse children
  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
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
