function loadSlider(){

			var data3 = d3.range(1, 23).map(function (d) {
            return new Date(1993 + d, 01, 01);
        });

        var slider3 = d3.sliderHorizontal()
            .min(d3.min(data3))
            .max(d3.max(data3))
            .step(1000 * 60 * 60 * 24 * 365)
            .width(1050)
            .tickFormat(d3.timeFormat('%Y'))
            .tickValues(data3)
            .on('onchange', val => {
                year = d3.timeFormat('%Y')(val);
                updateCharts(year);
            });

        var group3 = d3.select("#containerYearOscarGrossBudget")
        	.attr("width", 1100)
		      .attr("height", 100)
		      .append("g")
          .attr("transform", "translate(30,30)");
        group3.call(slider3);
	}

loadSlider();

var margin = { top: 50, right: 80, bottom: 50, left: 80 },
        width =  700,
        // width = Math.min(700, window.innerWidth / 4) - margin.left - margin.right,
        height = Math.min(width, window.innerHeight - margin.top - margin.bottom);

      let data_temp = {};
      
      function test(data, year){
          var meh = data[year]['Movie Title'];
          return meh;
        }

      function RadarData(){
        return Promise.all([
                d3.csv("data/Oscars-Year-Budget-Gross-Score.csv"),
                d3.csv("data/highestGross.csv"),
            ]).then(datasets => {
                data_temp.radarData = datasets[0];
                data_temp.radarGrossData = datasets[1];
                console.log(data_temp);
                return data_temp;
            })
      }
      
      function convert_radar_Data(radarData){

        console.log(radarData)
         let result = radarData.reduce((result, d) => {
           result[d.title_year] = {
                  "Budget": (d.budget/212500000)*100,
                  "Gross Box Office": (d.gross/700000000)*100,
                  "IMDB Rating": d.imdb_score*10,
                    "Num Critics": (d.num_critics/700)*100,
                    "Duration": (d.duration/240)*100,
                    "Movie Title": (d.movie_title)
                 }
           return result;
            }, {})
         console.log("Radar result: ",result);
        return result;
      }

      var axisData = [];
      function formatAxisData(data, data_gross, year){
             
            var data_obj = [
        { name: 'Best Grosser Picture',
          axes: [
            {axis: 'IMDB Rating', value: data_gross[year]['IMDB Rating']},
            {axis: 'Num Critics', value: data_gross[year]['Num Critics']},
            {axis: 'Budget', value: data_gross[year]['Budget']},
            {axis: 'Gross Box Office Profit', value: data_gross[year]['Gross Box Office']},
            {axis: 'Duration', value: data_gross[year]['Duration']}
          ]
        },
        { name: 'Best Picture Award Winner',
          axes: [
            {axis: 'IMDB Rating', value: data[year]['IMDB Rating']},
            {axis: 'Num Critics', value: data[year]['Num Critics']},
            {axis: 'Budget', value: data[year]['Budget']},
            {axis: 'Gross Box Office Profit', value: data[year]['Gross Box Office']},
            {axis: 'Duration', value: data[year]['Duration']}
          ]
        }
        ];

        return data_obj;
        }

        let radar_data = {}
        let radar_gross_data = {}
      function draw_radar_Data(){
        radar_data =  data_temp.radarData;
        radar_gross_data = data_temp.radarGrossData;
        console.log(radar_data);
        radar_data_conv = convert_radar_Data(radar_data)
        radar_gross_data_conv = convert_radar_Data(radar_gross_data)
        year = "1994"
        axisData = formatAxisData(radar_data_conv, radar_gross_data_conv, year)
          mT = test(radar_data_conv, year);
          var x = document.getElementById("oscar"); 
          x.innerHTML = mT;

          mT = test(radar_gross_data_conv, year);
          var x = document.getElementById("gross"); 
          x.innerHTML = mT;

          let svg_radar1 = RadarChart(".radarChart", axisData, radarChartOptions);
      }



      var radarChartOptions = {
        w: 290,
        h: 350,
        margin: margin,
        levels: 5,
        roundStrokes: true,
        color: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
        format: '.0f',
        legend: { title: 'Organization XYZ', translateX: 100, translateY: 40 }
      };

      function updateCharts(year){
            axisData = formatAxisData(radar_data_conv, radar_gross_data_conv, year)
          mT = test(radar_data_conv, year);
          var x = document.getElementById("oscar"); 
          x.innerHTML = mT;

          mT = test(radar_gross_data_conv, year);
          var x = document.getElementById("gross"); 
          x.innerHTML = mT;

          let svg_radar1 = RadarChart(".radarChart", axisData, radarChartOptions);
        }

      RadarData().then(draw_radar_Data);