
function lineScorechart(){

var line_svg = d3v4.select("#lineScorechart"),
    margin = {top: 20, right: 10, bottom: 30, left: 40},
    width = +line_svg.attr("width") - margin.left - margin.right,
    height = +line_svg.attr("height") - margin.top - margin.bottom;

var x = d3v4.scaleLinear().range([0, width]);
var y = d3v4.scaleLinear().range([height, 0]);

var bisectDate = d3v4.bisector(function(d) { return d.score; }).left;

var line = d3v4.line()
    .x(function(d) { return x(d.score); })
    .y(function(d) { return y(d.popularity); });

var g = line_svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3v4.csv("data/Score_Popularity1.csv", function(error, data) {
    if (error) throw error;
    data.forEach(function(d) {
      d.score = +d.score;
      d.popularity = (+d.popularity) * 100;
    });

    console.log("In the line score chart");
    console.log(data);

    x.domain(d3v4.extent(data, function(data) { return data.score; }));
    y.domain([d3v4.min(data, function(data) { return data.popularity; }), d3v4.max(data, function(d) { return d.popularity; })]);

    console.log(x,y);
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3v4.axisBottom(x).ticks(20))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "translate("+width+",15)")
        // .attr("transform", "rotate()")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Rating (0.0 - 10.0)");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3v4.axisLeft(y).ticks(10))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Percentage of Movies (%)");

    console.log(data);
    g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", height);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", width)
        .attr("x2", width);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
      	.attr("dy", ".31em");

    line_svg.append("rect")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() { focus.style("display", "none"); })
        .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3v4.mouse(this)[0]);
      // console.log(x0);
      var  i = bisectDate(data, x0, 1);
      console.log()
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.score > d1.score - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.score) + "," + y(d.popularity) + ")");
      console.log(x(d.score), y(d.popularity));
      focus.select("text").text(function() { return d.score+" : "+d3.format(",.3n")(d.popularity)+"%" });
      focus.select(".x-hover-line").attr("y2", height - y(d.popularity));
      focus.select(".y-hover-line").attr("x2", width + width);
    }
});
}