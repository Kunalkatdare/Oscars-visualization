var line_svg = d3.select("#linechart"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +line_svg.attr("width") - margin.left - margin.right,
    height = +line_svg.attr("height") - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y")
    bisectDate = d3.bisector(function(d) { return d.Year; }).left;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var line = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.MovieCount); });

var g = line_svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function linechart(){
d3.json("data/Year-MovieCount.json", function(error, data) {
    if (error) throw error;

    let datayear = data.filter(d => {
    return d.Year > 0 && d.Year < 2016;
    });
    datayear.forEach(function(d) {
      d.Year = +d.Year;
    });
    data = datayear;

    console.log("In the line chart");
    console.log(data);

    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([d3.min(data, function(d) { return d.MovieCount; }), d3.max(data, function(d) { return d.MovieCount; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d3.format("d")))
        .append("text")
        .attr("class", "axis-title")
        .attr("transform", "translate("+width+",15)")
        // .attr("transform", "rotate()")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Year");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return d; }))
      .append("text")
        .attr("class", "axis-title")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .attr("fill", "#5D6971")
        .text("Count of Movies");

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
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(data, x0, 1),
          d0 = data[i - 1],
          d1 = data[i],
          d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.MovieCount) + ")");
      focus.select("text").text(function() { return d.MovieCount; });
      focus.select(".x-hover-line").attr("y2", height - y(d.MovieCount));
      focus.select(".y-hover-line").attr("x2", width + width);
    }
});
}