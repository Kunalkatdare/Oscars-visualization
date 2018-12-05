d3.csv("movie_metadata.csv").then(function(data) {
  // manipulate data here
  data.forEach(function(d) {
    // convert numeric strings to numbers
    d.gross = +d.gross;
    d.title_year = +d.title_year;
    d.budget = +d.budget;
    d.duration = +d.duration;
    d.winnner = +d.winner;
    d.nomination = +d.nomination;
    d.imdb_score = +d.imdb_score;
  });
  // console.log(data);

  showData(data);
  showData1(data);
  showData2(data);
  showData3(data);
});

function sizeChart() {
  let width = 1020;
  let height = 700;
  let margin = {
    top: 10,
    bottom: 50,
    left: 260,
    right: 40
  };
  //The body is the are that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  let container = d3.select("#containerGross");
  container.attr("width", width).attr("height", height);

  return { width, height, margin, bodyHeight, bodyWidth, container };
}
function getGrossChartScales(winnerData, config) {
  let { bodyWidth, bodyHeight } = config;
  let maximumGross = d3.max(winnerData, d => d.gross);
  // console.log(maximumGross);

  let xScale = d3
    .scaleLinear()
    .range([0, bodyWidth])
    .domain([0, maximumGross]);

  let yScale = d3
    .scaleBand()
    .range([0, bodyHeight])
    .domain(winnerData.map(d => d.movie_title))
    .padding(0.2);

  return { xScale, yScale };
}
function showTooltip(text, coords) {
  d3.select("#tooltip")
    .text(text)
    .style("top", coords[1])
    .style("left", coords[0])
    .style("display", "block");
}
function drawBarsGrossChart(winnerData, scales, config) {
  // this is equivalent to 'let margin = config.margin; let container = config.container'
  let { margin, container } = config;

  let { xScale, yScale } = scales;
  let body = container
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`);

  let bars = body.selectAll(".bar").data(winnerData);

  //Adding a rect tag for each movie
  bars
    .enter()
    .append("rect")
    .attr("height", yScale.bandwidth())
    .attr("y", d => yScale(d.movie_title))
    .attr("width", d => xScale(d.gross))
    .attr("fill", "#2a5599")
    .on("mouseover", d => {
      showTooltip(d.title_year, [d3.event.clientX, d3.event.clientY]);
    })
    .on("mouseleave", d => {
      d3.select("#tooltip").style("display", "none");
    });
}
function drawAxesGrossChart(winnerData, scales, config) {
  let { xScale, yScale } = scales;
  let { container, margin, height } = config;

  let axisX = d3.axisBottom(xScale).ticks(5);

  container
    .append("g")
    .style(
      "transform",
      `translate(${margin.left}px,${height - margin.bottom}px)`
    )
    .call(axisX);

  let axisY = d3.axisLeft(yScale);
  container
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`)
    .call(axisY);
}

function showData(data) {
  data.sort((a, b) => {
    return d3.descending(a.gross, b.gross);
  });
  // we want to show data from 1994 to recent years
  let filteredData = data.filter(d => {
    return d.title_year > 1993;
  });
  // we want to show best picture nominations
  let winnerData = filteredData.filter(d => {
    return d.winner > 0;
  });
  let config = sizeChart();
  let scales = getGrossChartScales(winnerData, config);
  drawBarsGrossChart(winnerData, scales, config);
  drawAxesGrossChart(winnerData, scales, config);
}

function sizeChartGenre() {
  let width = 1020;
  let height = 700;
  let margin = {
    top: 10,
    bottom: 50,
    left: 80,
    right: 40
  };
  //The body is the are that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  let containerGenre = d3.select("#containerGenre");
  containerGenre.attr("width", width).attr("height", height);

  return { width, height, margin, bodyHeight, bodyWidth, containerGenre };
}

function getGrossGenreScales(result, config1) {
  let { bodyWidth, bodyHeight } = config1;
  let maximumGenre = d3.max(result, d => d.Count);
  // console.log(maximumGross);

  let xScale = d3
    .scaleLinear()
    .range([0, bodyWidth])
    .domain([0, maximumGenre]);

  let yScale = d3
    .scaleBand()
    .range([0, bodyHeight])
    .domain(result.map(d => d.Genre))
    .padding(0.2);

  return { xScale, yScale };
}

function drawBarsGenreChart(result, scales, config1) {
  // console.log(config1);
  // this is equivalent to 'let margin = config.margin; let container = config.container'
  let { margin, containerGenre } = config1;
  // console.log(containerGenre);
  let { xScale, yScale } = scales;
  let body = containerGenre
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`);

  let bars = body.selectAll(".bar").data(result);

  //Adding a rect tag for each movie
  bars
    .enter()
    .append("rect")
    .attr("height", yScale.bandwidth())
    .attr("y", d => yScale(d.Genre))
    .attr("width", d => xScale(d.Count))
    .attr("fill", "#2a5599");
}
function drawAxesGenreChart(result, scales, config1) {
  let { xScale, yScale } = scales;
  let { containerGenre, margin, height } = config1;

  let axisX = d3.axisBottom(xScale).ticks(5);

  containerGenre
    .append("g")
    .style(
      "transform",
      `translate(${margin.left}px,${height - margin.bottom}px)`
    )
    .call(axisX);

  let axisY = d3.axisLeft(yScale);
  containerGenre
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`)
    .call(axisY);
}

function showData1(data) {
  // console.log(data);
  let filteredGenres = data.filter(d => {
    return d.winner > 0;
  });
  // console.log(filteredGenres);

  let resultaux = filteredGenres;
  // console.log(data);
  result = resultaux.reduce((result, d) => {
    let currentData = result[d.genre1] || {
      Genre: d.genre1,
      Count: 0
    };

    currentData.Count += 1;

    result[d.genre1] = currentData;

    return result;
  }, {});

  //We use this to convert the dictionary produced by the code above, into a list, that will make it easier to create the visualization.
  result = Object.keys(result).map(key => result[key]);
  result = result.sort((a, b) => d3.descending(a.Count, b.Count));
  // console.log(result);

  let config1 = sizeChartGenre();
  // console.log(config1);
  let scales = getGrossGenreScales(result, config1);
  drawBarsGenreChart(result, scales, config1);
  drawAxesGenreChart(result, scales, config1);
}
function sizeChartScatter() {
  let width = 1020;
  let height = 900;
  let margin = {
    top: 10,
    bottom: 50,
    left: 80,
    right: 40
  };
  //The body is the are that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;
  console.log(bodyHeight, bodyWidth);

  let containerScatter = d3.select("#scatterPlot");
  containerScatter.attr("width", width).attr("height", height);

  return { width, height, margin, bodyHeight, bodyWidth, containerScatter };
}
function getScatterScales(data, config2) {
  let { bodyWidth, bodyHeight } = config2;
  let maxGross = d3.max(data, d => d.gross);
  // console.log(maximumGross);

  let xScale = d3
    .scaleLinear()
    .range([0, bodyWidth])
    .domain([0, maxGross]);

  let yScale = d3
    .scaleBand()
    .range([0, bodyHeight])
    .domain(data.map(d => d.title_year))
    .padding(0.9);

  return { xScale, yScale };
}

function drawCirclesScatterChart(data, scales, config2) {
  let { margin, containerScatter } = config2;
  let { xScale, yScale } = scales;
  let body = containerScatter
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`);

  let circles = body.selectAll(".dot").data(data);

  let xValue = function(d) {
    return d.gross;
  };
  let xMap = function(d) {
    return xScale(xValue(d));
  };
  let yValue = function(d) {
    return d.title_year;
  };
  let yMap = function(d) {
    return yScale(yValue(d));
  };
  let cValue = function(d) {
      return d.winner;
    },
    color = d3.scaleOrdinal(d3.schemeCategory10);
  function showTooltip2(text, coords) {
    console.log(text);
    d3.select("#tooltip2")
      .text(text)
      .style("top", coords[1])
      .style("left", coords[0])
      .style("display", "block");
  }
  circles
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 3.8)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .style("fill", function(d) {
      return color(cValue(d));
    })
    .attr("height", yScale.bandwidth())
    .attr("y", d => yScale(d.Genre))
    .attr("width", d => xScale(d.Count))
    .attr("fill", "#2a5599")
    .on("mouseover", d => {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html(
          "<b>" +
            d.movie_title +
            "<br>" +
            "Gross:" +
            d3.format(",")(d.gross) +
            "<br>" +
            "Year:" +
            d.title_year
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
      // console.log(d);
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}
function drawAxesScatterChart(data, scales, config2) {
  let { xScale, yScale } = scales;
  let { containerScatter, margin, height } = config2;

  let axisX = d3.axisBottom(xScale).ticks(5);

  containerScatter
    .append("g")
    .style(
      "transform",
      `translate(${margin.left}px,${height - margin.bottom}px)`
    )
    .call(axisX);

  let axisY = d3.axisLeft(yScale);
  containerScatter
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`)
    .call(axisY);
}

function showData2(data) {
  data.sort((a, b) => {
    return d3.descending(a.title_year, b.title_year);
  });
  let scatterFilterData = data.filter(d => {
    return d.title_year > 1993;
  });
  let config2 = sizeChartScatter();
  let scales = getScatterScales(scatterFilterData, config2);
  drawCirclesScatterChart(scatterFilterData, scales, config2);
  drawAxesScatterChart(scatterFilterData, scales, config2);
}

function showData_Score_Popularity(data) {
  let bodyWidth = 700;
  let bodyHeight = 600;
  let body = d3.select("#body1");
  let maxPopularityCount = d3.max(data, d => d.popularity);
  let minScore = d3.min(data, d => d.score);
  let maxScore = d3.max(data, d => d.score);
  //console.log(maxPopularityCount,minScore,maxScore);
  let yScale = d3
    .scaleLinear()
    .domain([0, maxPopularityCount])
    .range([bodyHeight, 0]);
  body.append("g").call(d3.axisLeft(yScale));
  let xScale = d3
    .scaleLinear()
    .domain([minScore, maxScore])
    .range([0, bodyWidth]);
  body
    .append("g")
    .attr("transform", "translate(0," + bodyHeight + ")")
    .call(d3.axisBottom(xScale).tickFormat(d3.format(",.1f")));
  valueline = d3
    .line()
    .x(d => xScale(d.score))
    .y(d => yScale(d.popularity));
  body
    .append("path")
    .datum(data)
    .attr("d", valueline)
    .attr("class", "line")
    .on("mouseover", d => {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html("<b>" + d.MovieCount + "<b> :Donated:")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}

d3.csv("Score_Popularity1.csv").then(function(data_aux) {
  data_aux.forEach(function(d) {
    d.popularity = +d.popularity * 100;
    d.score = +d.score;
  });
  showData_Score_Popularity(data_aux);
});
let body = d3.select("#bodyyearmoviecount");

function showData_Year_MovieCount(data) {
  let bodyWidth = 700;
  let bodyHeight = 600;
  let maxMovieCount = d3.max(data, d => d.MovieCount);
  let minYear = d3.min(data, d => d.Year);
  let maxYear = d3.max(data, d => d.Year);
  let yScale = d3
    .scaleLinear()
    .domain([0, maxMovieCount])
    .range([bodyHeight, 0]);
  body.append("g").call(d3.axisLeft(yScale));
  let xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear])
    .range([0, bodyWidth]);
  body
    .append("g")
    .attr("transform", "translate(0," + bodyHeight + ")")
    .call(d3.axisBottom(xScale));
  valueline = d3
    .line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.MovieCount));
  body
    .append("path")
    .datum(data)
    .attr("d", valueline)
    .attr("class", "line")
    .on("mouseover", d => {
      div
        .transition()
        .duration(200)
        .style("opacity", 0.9);
      div
        .html("<b>" + d.MovieCount + "<b> :Donated:")
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
      // console.log(d);
    })
    .on("mouseout", function(d) {
      div
        .transition()
        .duration(500)
        .style("opacity", 0);
    });
}
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
d3.csv("Year-MovieCount.csv").then(function(data) {
  data.forEach(function(d) {
    d.MovieCount = +d.MovieCount;
  });
  showData_Year_MovieCount(data);
});

function sizeChartGenreAll() {
  let width = 1020;
  let height = 700;
  let margin = {
    top: 10,
    bottom: 50,
    left: 80,
    right: 40
  };
  //The body is the are that will be occupied by the bars.
  let bodyHeight = height - margin.top - margin.bottom;
  let bodyWidth = width - margin.left - margin.right;

  let containerAll = d3.select("#containerAll");
  //   console.log(containerAll);
  containerAll.attr("width", width).attr("height", height);

  return { width, height, margin, bodyHeight, bodyWidth, containerAll };
}

function getGrossGenreScalesAll(result, config4) {
  let { bodyWidth, bodyHeight } = config4;
  let maximumGenre = d3.max(result, d => d.Count);
  // console.log(maximumGross);

  let xScale = d3
    .scaleLinear()
    .range([0, bodyWidth])
    .domain([0, maximumGenre]);

  let yScale = d3
    .scaleBand()
    .range([0, bodyHeight])
    .domain(result.map(d => d.Genre))
    .padding(0.2);

  return { xScale, yScale };
}

function drawBarsGenreChartAll(result, scales, config4) {
  // console.log(config1);
  // this is equivalent to 'let margin = config.margin; let container = config.container'
  let { margin, containerAll } = config4;

  // console.log(containerGenre);
  let { xScale, yScale } = scales;

  let body = containerAll
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`);

  let bars = body.selectAll(".bar").data(result);

  //Adding a rect tag for each movie
  bars
    .enter()
    .append("rect")
    .attr("height", yScale.bandwidth())
    .attr("y", d => yScale(d.Genre))
    .attr("width", d => xScale(d.Count))
    .attr("fill", "#2a5599");
}
function drawAxesGenreChartAll(result, scales, config4) {
  let { xScale, yScale } = scales;
  let { containerAll, margin, height } = config4;

  let axisX = d3.axisBottom(xScale).ticks(5);

  containerAll
    .append("g")
    .style(
      "transform",
      `translate(${margin.left}px,${height - margin.bottom}px)`
    )
    .call(axisX);

  let axisY = d3.axisLeft(yScale);
  containerAll
    .append("g")
    .style("transform", `translate(${margin.left}px,${margin.top}px)`)
    .call(axisY);
}

function showData3(data) {
  // console.log(data);
  // let filteredGenres = data.filter(d => {
  //   return d.winner > 0;
  // });
  // console.log(filteredGenres);

  let resultaux = data;
  // console.log(data);
  result = resultaux.reduce((result, d) => {
    let currentData = result[d.genre1] || {
      Genre: d.genre1,
      Count: 0
    };

    currentData.Count += 1;

    result[d.genre1] = currentData;

    return result;
  }, {});

  //We use this to convert the dictionary produced by the code above, into a list, that will make it easier to create the visualization.
  result = Object.keys(result).map(key => result[key]);
  result = result.sort((a, b) => d3.descending(a.Count, b.Count));
  // console.log(result);

  let config4 = sizeChartGenreAll();
  console.log(config4);
  let scales = getGrossGenreScalesAll(result, config4);
  drawBarsGenreChartAll(result, scales, config4);
  drawAxesGenreChartAll(result, scales, config4);
}
