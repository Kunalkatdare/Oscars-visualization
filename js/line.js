function linechart() {
  var line_svg = d3v4.select("#linechart"),
    margin = { top: 20, right: 110, bottom: 30, left: 45 },
    width = +line_svg.attr("width") - margin.left - margin.right,
    height = +line_svg.attr("height") - margin.top - margin.bottom;

  var parseTime = d3v4.timeParse("%Y");
  bisectDate = d3v4.bisector(function(d) {
    return d.Year;
  }).left;

  var x = d3v4.scaleLinear().range([0, width]);
  var y = d3v4.scaleLinear().range([height, 0]);

  var line = d3v4
    .line()
    .x(function(d) {
      return x(d.Year);
    })
    .y(function(d) {
      return y(d.MovieCount);
    });

  var g = line_svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3v4.json("data/Year-MovieCount.json", function(error, data) {
    if (error) throw error;

    let datayear = data.filter(d => {
      return d.Year > 0 && d.Year < 2016;
    });
    datayear.forEach(function(d) {
      d.Year = +d.Year;
    });
    data = datayear;

    console.log("In the line chart");
    // console.log(data);

    x.domain(
      d3v4.extent(data, function(d) {
        return d.Year;
      })
    );
    y.domain([
      d3v4.min(data, function(d) {
        return d.MovieCount;
      }),
      d3v4.max(data, function(d) {
        return d.MovieCount;
      })
    ]);

    g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(
        d3v4
          .axisBottom(x)
          .ticks(20)
          .tickFormat(d3v4.format("d"))
      )
      .append("text")
      .attr("class", "axis-title")
      .attr("transform", "translate(" + width + ",15)")
      // .attr("transform", "rotate()")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .attr("fill", "#5D6971")
      .text("Year");

    g.append("g")
      .attr("class", "axis axis--y")
      .call(
        d3v4
          .axisLeft(y)
          .ticks(6)
          .tickFormat(function(d) {
            return d;
          })
      )
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

    var focus = g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus
      .append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", height);

    focus
      .append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", width)
      .attr("x2", width);

    focus.append("circle").attr("r", 7.5);

    focus
      .append("text")
      .attr("x", 15)
      .attr("dy", ".31em");

    line_svg
      .append("rect")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() {
        focus.style("display", null);
      })
      .on("mouseout", function() {
        focus.style("display", "none");
      })
      .on("mousemove", mousemove);

    function mousemove() {
      var x0 = x.invert(d3v4.mouse(this)[0]),
        i = bisectDate(data, x0, 1);
      // console.log(i);
      var d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
      focus.attr(
        "transform",
        "translate(" + x(d.Year) + "," + y(d.MovieCount) + ")"
      );
      focus.select("text").text(function() {
        return d.Year + " : " + d.MovieCount;
      });
      focus.select(".x-hover-line").attr("y2", height - y(d.MovieCount));
      focus.select(".y-hover-line").attr("x2", width + width);
    }
  });
}
