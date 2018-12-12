var RadarChart = {
  draw: function(id, d, options){
  var cfg = {
	 radius: 5,
	 w: 400,
	 h: 400,
	 factor: 1,
	 factorLegend: .85,
	 levels: 6,
	 maxValue: 100,
	 radians: 2 * Math.PI,
	 opacityArea: 0.5,
	 ToRight: 5,
	 TranslateX: 50,
	 TranslateY: 30,
	 ExtraWidthX: 100,
	 ExtraWidthY: 100,
	 color: d3.scaleOrdinal(d3.schemeCategory10)
	};

	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){
		  cfg[i] = options[i];
		}
	  }
	}
	cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
	var allAxis = (d[0].map(function(i, j){return i.axis}));
	var total = allAxis.length;
	var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
	var Format = d3.format('.0f');
	d3.select(id).select("svg").remove();

	var g = d3.select(id)
			.append("svg")
			.attr("width", cfg.w+cfg.ExtraWidthX)
			.attr("height", cfg.h+cfg.ExtraWidthY)
			.append("g")
			.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
			;

	var tooltip;

	//Circular segments
	for(var j=0; j<cfg.levels-1; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data(allAxis)
	   .enter()
	   .append("svg:line")
	   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
	   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
	   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
	   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
	   .attr("class", "line")
	   .style("stroke", "grey")
	   .style("stroke-opacity", "0.75")
	   .style("stroke-width", "0.3px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
	}

	//Text indicating at what % each level is
	for(var j=0; j<cfg.levels; j++){
	  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
	  g.selectAll(".levels")
	   .data([1]) //dummy data
	   .enter()
	   .append("svg:text")
	   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
	   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
	   .attr("class", "legend")
	   .style("font-family", "sans-serif")
	   .style("font-size", "10px")
	   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
	   .attr("fill", "#737373")
	   .text(Format((j+1)*cfg.maxValue/cfg.levels));
	}

	series = 0;

	var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

	axis.append("line")
		.attr("x1", cfg.w/2)
		.attr("y1", cfg.h/2)
		.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		.attr("class", "line")
		.style("stroke", "grey")
		.style("stroke-width", "1px");

	axis.append("text")
		.attr("class", "legend")
		.text(function(d){return d})
		.style("font-family", "sans-serif")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "1.5em")
		.attr("transform", function(d, i){return "translate(0, -10)"})
		.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
		.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


	d.forEach(function(y, x){
	  dataValues = [];
	  g.selectAll(".nodes")
		.data(y, function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		  ]);
		});
	  dataValues.push(dataValues[0]);
	  g.selectAll(".area")
					 .data([dataValues])
					 .enter()
					 .append("polygon")
					 .attr("class", "radar-chart-serie"+series)
					 .style("stroke-width", "2px")
					 .style("stroke", cfg.color(series))
					 .attr("points",function(d) {
						 var str="";
						 for(var pti=0;pti<d.length;pti++){
							 str=str+d[pti][0]+","+d[pti][1]+" ";
						 }
						 return str;
					  })
					 .style("fill", function(j, i){return cfg.color(series)})
					 .style("fill-opacity", cfg.opacityArea)
					 // .on('mouseover', function (d){
						// 				z = "polygon."+d3.select(this).attr("class");
						// 				g.selectAll("polygon")
						// 				 .transition(200)
						// 				 .style("fill-opacity", 0.1);
						// 				g.selectAll(z)
						// 				 .transition(200)
						// 				 .style("fill-opacity", .7);
						// 			  })
					 // .on('mouseout', function(){
						// 				g.selectAll("polygon")
						// 				 .transition(200)
						// 				 .style("fill-opacity", cfg.opacityArea);
					 // })
					 ;
	  series++;
	});
	series=0;


	d.forEach(function(y, x){
	  g.selectAll(".nodes")
		.data(y).enter()
		.append("svg:circle")
		.attr("class", "radar-chart-serie"+series)
		.attr('r', cfg.radius)
		.attr("alt", function(j){return Math.max(j.value, 0)})
		.attr("cx", function(j, i){
		  dataValues.push([
			cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
			cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
		]);
		return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
		})
		.attr("cy", function(j, i){
		  return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
		})
		.attr("data-id", function(j){return j.axis})
		.style("fill", cfg.color(series)).style("fill-opacity", .9)
		// .on('mouseover', function (d){
		// 			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
		// 			newY =  parseFloat(d3.select(this).attr('cy')) - 5;

		// 			tooltip
		// 				.attr('x', newX)
		// 				.attr('y', newY)
		// 				.text(Format(d.value))
		// 				.transition(200)
		// 				.style('opacity', 1);

		// 			z = "polygon."+d3.select(this).attr("class");
		// 			g.selectAll("polygon")
		// 				.transition(200)
		// 				.style("fill-opacity", 0.1);
		// 			g.selectAll(z)
		// 				.transition(200)
		// 				.style("fill-opacity", .7);
		// 		  })
		// .on('mouseout', function(){
		// 			tooltip
		// 				.transition(200)
		// 				.style('opacity', 0);
		// 			g.selectAll("polygon")
		// 				.transition(200)
		// 				.style("fill-opacity", cfg.opacityArea);
		// 		  })
		.append("svg:title")
		.text(function(j){return Math.max(j.value, 0)});

	  series++;
	});
	//Tooltip
	// tooltip = g.append('text')
	// 		   .style('opacity', 0)
	// 		   .style('font-family', 'sans-serif')
	// 		   .style('font-size', '13px');
  }
};


// // https://github.com/johnwalley/d3-simple-slider Version 1.3.0. Copyright 2018 John Walley.
// (function (global, factory) {
//   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array'), require('d3-axis'), require('d3-dispatch'), require('d3-drag'), require('d3-ease'), require('d3-scale'), require('d3-selection')) :
//   typeof define === 'function' && define.amd ? define(['exports', 'd3-array', 'd3-axis', 'd3-dispatch', 'd3-drag', 'd3-ease', 'd3-scale', 'd3-selection'], factory) :
//   (factory((global.d3 = global.d3 || {}),global.d3,global.d3,global.d3,global.d3,global.d3,global.d3,global.d3));
// }(this, (function (exports,d3Array,d3Axis,d3Dispatch,d3Drag,d3Ease,d3Scale,d3Selection) { 'use strict';

//   var UPDATE_DURATION = 200;
//   var SLIDER_END_PADDING = 8;

//   var top = 1;
//   var right = 2;
//   var bottom = 3;
//   var left = 4;

//   function translateX(x) {
//     return 'translate(' + x + ',0)';
//   }

//   function translateY(y) {
//     return 'translate(0,' + y + ')';
//   }

//   function slider(orientation, scale) {
//     scale = typeof scale !== 'undefined' ? scale : null;

//     var value = 0;
//     var defaultValue = 0;
//     var domain = [0, 10];
//     var width = 100;
//     var height = 100;
//     var displayValue = true;
//     var handle = 'M-5.5,-5.5v10l6,5.5l6,-5.5v-10z';
//     var step = null;
//     var tickValues = null;
//     var marks = null;
//     var tickFormat = null;
//     var ticks = null;
//     var displayFormat = null;

//     var listeners = d3Dispatch.dispatch('onchange', 'start', 'end', 'drag');

//     var selection = null;
//     var identityClamped = null;

//     var k = orientation === top || orientation === left ? -1 : 1;
//     var x = orientation === left || orientation === right ? 'y' : 'x';
//     var y = orientation === left || orientation === right ? 'x' : 'y';

//     var transformAlong =
//       orientation === top || orientation === bottom ? translateX : translateY;

//     var transformAcross =
//       orientation === top || orientation === bottom ? translateY : translateX;

//     var axisFunction = null;

//     switch (orientation) {
//       case top:
//         axisFunction = d3Axis.axisTop;
//         break;
//       case right:
//         axisFunction = d3Axis.axisRight;
//         break;
//       case bottom:
//         axisFunction = d3Axis.axisBottom;
//         break;
//       case left:
//         axisFunction = d3Axis.axisLeft;
//         break;
//     }

//     var handleSelection = null;
//     var textSelection = null;

//     function slider(context) {
//       selection = context.selection ? context.selection() : context;

//       if (scale) {
//         domain = [d3Array.min(scale.domain()), d3Array.max(scale.domain())];
//         scale = scale.clamp(true);
//       } else {
//         scale = domain[0] instanceof Date ? d3Scale.scaleTime() : d3Scale.scaleLinear();

//         scale = scale
//           .domain(domain)
//           .range([
//             0,
//             orientation === top || orientation === bottom ? width : height,
//           ])
//           .clamp(true);
//       }

//       identityClamped = d3Scale.scaleLinear()
//         .range(scale.range())
//         .domain(scale.range())
//         .clamp(true);

//       // Ensure value is valid
//       value = d3Scale.scaleLinear()
//         .range(domain)
//         .domain(domain)
//         .clamp(true)(value);

//       tickFormat = tickFormat || scale.tickFormat();
//       displayFormat = displayFormat || tickFormat || scale.tickFormat();

//       var axis = selection.selectAll('.axis').data([null]);

//       axis
//         .enter()
//         .append('g')
//         .attr('transform', transformAcross(k * 7))
//         .attr('class', 'axis');

//       var slider = selection.selectAll('.slider').data([null]);

//       var sliderEnter = slider
//         .enter()
//         .append('g')
//         .attr('class', 'slider')
//         .attr(
//           'cursor',
//           orientation === top || orientation === bottom
//             ? 'ew-resize'
//             : 'ns-resize'
//         )
//         .call(
//           d3Drag.drag()
//             .on('start', dragstarted)
//             .on('drag', dragged)
//             .on('end', dragended)
//         );

//       sliderEnter
//         .append('line')
//         .attr('class', 'track')
//         .attr(x + '1', scale.range()[0] - SLIDER_END_PADDING)
//         .attr('stroke', '#bbb')
//         .attr('stroke-width', 6)
//         .attr('stroke-linecap', 'round');

//       sliderEnter
//         .append('line')
//         .attr('class', 'track-inset')
//         .attr(x + '1', scale.range()[0] - SLIDER_END_PADDING)
//         .attr('stroke', '#eee')
//         .attr('stroke-width', 4)
//         .attr('stroke-linecap', 'round');

//       sliderEnter
//         .append('line')
//         .attr('class', 'track-overlay')
//         .attr(x + '1', scale.range()[0] - SLIDER_END_PADDING)
//         .attr('stroke', 'transparent')
//         .attr('stroke-width', 40)
//         .attr('stroke-linecap', 'round')
//         .merge(slider.select('.track-overlay'));

//       var handleEnter = sliderEnter
//         .append('g')
//         .attr('class', 'parameter-value')
//         .attr('transform', transformAlong(scale(value)))
//         .attr('font-family', 'sans-serif')
//         .attr(
//           'text-anchor',
//           orientation === right
//             ? 'start'
//             : orientation === left
//               ? 'end'
//               : 'middle'
//         );

//       handleEnter
//         .append('path')
//         .attr('transform', 'rotate(' + (orientation + 1) * 90 + ')')
//         .attr('d', handle)
//         .attr('fill', 'white')
//         .attr('stroke', '#777');

//       if (displayValue) {
//         handleEnter
//           .append('text')
//           .attr('font-size', 10) // TODO: Remove coupling to font-size in d3-axis
//           .attr(y, k * 27)
//           .attr(
//             'dy',
//             orientation === top
//               ? '0em'
//               : orientation === bottom
//                 ? '.71em'
//                 : '.32em'
//           )
//           .text(tickFormat(value));
//       }

//       context
//         .select('.track')
//         .attr(x + '2', scale.range()[1] + SLIDER_END_PADDING);
//       context
//         .select('.track-inset')
//         .attr(x + '2', scale.range()[1] + SLIDER_END_PADDING);
//       context
//         .select('.track-overlay')
//         .attr(x + '2', scale.range()[1] + SLIDER_END_PADDING);

//       context.select('.axis').call(
//         axisFunction(scale)
//           .tickFormat(tickFormat)
//           .ticks(ticks)
//           .tickValues(tickValues)
//       );

//       // https://bl.ocks.org/mbostock/4323929
//       selection
//         .select('.axis')
//         .select('.domain')
//         .remove();

//       context.select('.axis').attr('transform', transformAcross(k * 7));

//       context
//         .selectAll('.axis text')
//         .attr('fill', '#aaa')
//         .attr(y, k * 20)
//         .attr(
//           'dy',
//           orientation === top ? '0em' : orientation === bottom ? '.71em' : '.32em'
//         )
//         .attr(
//           'text-anchor',
//           orientation === right
//             ? 'start'
//             : orientation === left
//               ? 'end'
//               : 'middle'
//         );

//       context.selectAll('.axis line').attr('stroke', '#aaa');

//       context
//         .select('.parameter-value')
//         .attr('transform', transformAlong(scale(value)));

//       fadeTickText();

//       function dragstarted() {
//         d3Selection.select(this).classed('active', true);

//         var pos = identityClamped(
//           orientation === bottom || orientation === top ? d3Selection.event.x : d3Selection.event.y
//         );

//         var newValue = alignedValue(scale.invert(pos));

//         updateHandle(newValue);
//         listeners.call('start', slider, newValue);
//         updateValue(newValue, true);
//       }

//       function dragged() {
//         var pos = identityClamped(
//           orientation === bottom || orientation === top ? d3Selection.event.x : d3Selection.event.y
//         );
//         var newValue = alignedValue(scale.invert(pos));

//         updateHandle(newValue);
//         listeners.call('drag', slider, newValue);
//         updateValue(newValue, true);
//       }

//       function dragended() {
//         d3Selection.select(this).classed('active', false);
//         var pos = identityClamped(
//           orientation === bottom || orientation === top ? d3Selection.event.x : d3Selection.event.y
//         );
//         var newValue = alignedValue(scale.invert(pos));

//         updateHandle(newValue);
//         listeners.call('end', slider, newValue);
//         updateValue(newValue, true);
//       }

//       textSelection = selection.select('.parameter-value text');
//       handleSelection = selection.select('.parameter-value');
//     }

//     function fadeTickText() {
//       if (displayValue) {
//         var distances = [];

//         selection.selectAll('.axis .tick').each(function(d) {
//           distances.push(Math.abs(d - value));
//         });

//         var index = d3Array.scan(distances);

//         selection.selectAll('.axis .tick text').attr('opacity', function(d, i) {
//           return i === index ? 0 : 1;
//         });
//       }
//     }

//     function alignedValue(newValue) {
//       if (step) {
//         var valueModStep = (newValue - domain[0]) % step;
//         var alignValue = newValue - valueModStep;

//         if (valueModStep * 2 > step) {
//           alignValue += step;
//         }

//         return newValue instanceof Date ? new Date(alignValue) : alignValue;
//       }

//       if (marks) {
//         var index = d3Array.scan(
//           marks.map(function(d) {
//             return Math.abs(newValue - d);
//           })
//         );

//         return marks[index];
//       }

//       return newValue;
//     }

//     function updateValue(newValue, notifyListener) {
//       if (value !== newValue) {
//         value = newValue;

//         if (notifyListener) {
//           listeners.call('onchange', slider, newValue);
//         }

//         fadeTickText();
//       }
//     }

//     function updateHandle(newValue, animate) {
//       animate = typeof animate !== 'undefined' ? animate : false;

//       if (animate) {
//         handleSelection
//           .transition()
//           .ease(d3Ease.easeQuadOut)
//           .duration(UPDATE_DURATION)
//           .attr('transform', transformAlong(scale(newValue)));
//       } else {
//         handleSelection.attr('transform', transformAlong(scale(newValue)));
//       }

//       if (displayValue) {
//         textSelection.text(displayFormat(newValue));
//       }
//     }

//     slider.min = function(_) {
//       if (!arguments.length) return domain[0];
//       domain[0] = _;
//       return slider;
//     };

//     slider.max = function(_) {
//       if (!arguments.length) return domain[1];
//       domain[1] = _;
//       return slider;
//     };

//     slider.domain = function(_) {
//       if (!arguments.length) return domain;
//       domain = _;
//       return slider;
//     };

//     slider.width = function(_) {
//       if (!arguments.length) return width;
//       width = _;
//       return slider;
//     };

//     slider.height = function(_) {
//       if (!arguments.length) return height;
//       height = _;
//       return slider;
//     };

//     slider.tickFormat = function(_) {
//       if (!arguments.length) return tickFormat;
//       tickFormat = _;
//       return slider;
//     };

//     slider.displayFormat = function(_) {
//       if (!arguments.length) return displayFormat;
//       displayFormat = _;
//       return slider;
//     };

//     slider.ticks = function(_) {
//       if (!arguments.length) return ticks;
//       ticks = _;
//       return slider;
//     };

//     slider.value = function(_) {
//       if (!arguments.length) return value;
//       var pos = identityClamped(scale(_));
//       var newValue = alignedValue(scale.invert(pos));

//       updateHandle(newValue, true);
//       updateValue(newValue, true);

//       return slider;
//     };

//     slider.silentValue = function(_) {
//       if (!arguments.length) return value;
//       var pos = identityClamped(scale(_));
//       var newValue = alignedValue(scale.invert(pos));

//       updateHandle(newValue, false);
//       updateValue(newValue, false);

//       return slider;
//     };

//     slider.default = function(_) {
//       if (!arguments.length) return defaultValue;
//       defaultValue = _;
//       value = _;
//       return slider;
//     };

//     slider.step = function(_) {
//       if (!arguments.length) return step;
//       step = _;
//       return slider;
//     };

//     slider.tickValues = function(_) {
//       if (!arguments.length) return tickValues;
//       tickValues = _;
//       return slider;
//     };

//     slider.marks = function(_) {
//       if (!arguments.length) return marks;
//       marks = _;
//       return slider;
//     };

//     slider.handle = function(_) {
//       if (!arguments.length) return handle;
//       handle = _;
//       return slider;
//     };

//     slider.displayValue = function(_) {
//       if (!arguments.length) return displayValue;
//       displayValue = _;
//       return slider;
//     };

//     slider.on = function() {
//       var value = listeners.on.apply(listeners, arguments);
//       return value === listeners ? slider : value;
//     };

//     return slider;
//   }

//   function sliderHorizontal(scale) {
//     return slider(bottom, scale);
//   }

//   function sliderVertical(scale) {
//     return slider(left, scale);
//   }

//   function sliderTop(scale) {
//     return slider(top, scale);
//   }

//   function sliderRight(scale) {
//     return slider(right, scale);
//   }

//   function sliderBottom(scale) {
//     return slider(bottom, scale);
//   }

//   function sliderLeft(scale) {
//     return slider(left, scale);
//   }

//   exports.sliderHorizontal = sliderHorizontal;
//   exports.sliderVertical = sliderVertical;
//   exports.sliderTop = sliderTop;
//   exports.sliderRight = sliderRight;
//   exports.sliderBottom = sliderBottom;
//   exports.sliderLeft = sliderLeft;

//   Object.defineProperty(exports, '__esModule', { value: true });

// })));