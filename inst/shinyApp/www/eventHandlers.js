// size, circle, and text are defined in update()
function mouseover(Div) {
  return function() {
    d3.select(this).select("circle").transition()
      .duration(750)
      .attr("r", 9);

    d3.select(this).select("text").transition()
      .duration(750)
      .style("stroke-width", ".5px")
      .style("font", "20px sans-serif")
      .style("fill", "blue")
      .attr("transform", "translate(0,25)");

    // FAIRE la taille de Div proportionnel à la longueur de size !
    var size = d3.select(this).select("size").text();
    if (size !== "") {
      Div.transition() //Opacity transition when the tooltip appears
        .duration(500)
        .style("opacity", "1")
        .style("display", "block")
        //.style("z-index", "-1")
        .style("width", 6 + 12 * size.length);
      Div.html("<i>size:</i> " + size)
        .style("left", (d3.event.pageX - 0) + "px")
        .style("top", (d3.event.pageY - 32) + "px");
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
      .style("font", "10px sans-serif")
      .attr("transform", "translate(0,0)");

    if (d3.select(this).select("size").text() !== "") {
      Div.transition() //Opacity transition when the tooltip disappears
        .duration(500)
        .style("opacity", "0")
        .style("display", "none");
    }
  };
}

function zoom() { // http://stackoverflow.com/questions/17405638/d3-js-zooming-and-panning-a-collapsible-tree-diagram
  var scale = d3.event.scale,
    translation = d3.event.translate,
    tbound = -height * scale,
    bbound = height * scale,
    lbound = (-width + margin.right) * scale,
    rbound = (width - margin.left) * scale;
  // limit translation to thresholds
  translation = [
    Math.max(Math.min(translation[0], rbound), lbound),
    Math.max(Math.min(translation[1], bbound), tbound)
  ];
  console.log(scale);
  var temp = d3.select(".drawarea")
    .attr("transform", "translate(" + translation + ")" +
      " scale(" + scale + ")");
}
