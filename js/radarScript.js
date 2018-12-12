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
                updateChartsGen(year);
            });

        var group3 = d3.select("#containerYearOscarGrossBudget")
        	.attr("width", 1100)
		      .attr("height", 100)
		      .append("g")
          .attr("transform", "translate(30,30)");
        group3.call(slider3);
	}

	data_temp = {}
  data_temp_gross = {}
	data_sub = {}
  data_sub_gross = {}
	function RadarData(){
			return Promise.all([
            	d3.csv("data/Oscars-Year-Budget-Gross-Score.csv")
	        ]).then(datasets => {
	            data_temp.radarData = datasets[0];
	            return data_temp;
	        })
	}

	function convert_radar_Data(radarData){
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

	function draw_radar_Data(){
		let raw_data =  data_temp.radarData
		data_sub = convert_radar_Data(raw_data)
		year = "1994"
		axisData = formatAxisData(data_sub, year)
    mT = test(data_sub, year);
    var x = document.getElementById("oscar"); 
    x.innerHTML = mT;
    // console.log("DataSub: ", data_sub);
    RadarChart.draw("#radar", axisData)
	}

	function formatAxisData(data, year){
        var d=[
            [
                {axis:"IMDB Rating",value:data[year]['IMDB Rating']},
                {axis:"Num Critics",value:data[year]['Num Critics']},
                {axis:"Budget",value:data[year]['Budget']},
                {axis:"Gross Box Office",value:data[year]['Gross Box Office']},
                {axis:"Duration",value:data[year]['Duration']},
                // {data:"Movie Title", value:data[year]['Movie Title']}
            ]
        ]
        // console.log("d: ",d)
        return d
    }

    function test(data, year){
      var meh = data[year]['Movie Title'];
      // console.log("meh: ", meh);
      return meh;
    }

	  function updateCharts(year){
        axisData = formatAxisData(data_sub, year)
        mT = test(data_sub, year);
        var x = document.getElementById("oscar"); 
        x.innerHTML = mT;
        RadarChart.draw("#radar", axisData);
        // console.log("AxisData: ",axisData);
    }
    

    loadSlider()
    RadarData().then(draw_radar_Data);

//GENERAL GRAPH ******************************************************************************88

    function RadarDataGen(){
      return Promise.all([
                d3.csv("data/highestGross.csv"), //change this CSV file
          ]).then(datasets => {
              data_temp_gross.radarData = datasets[0];
              return data_temp_gross;
          })
    }

    function draw_radar_Data_Gen(){
      let raw_data =  data_temp_gross.radarData
      data_sub_gross = convert_radar_Data(raw_data)
      year = "1994"
      axisData = formatAxisData(data_sub_gross, year)
      RadarChart.draw("#radarGen", axisData)
      mT = test(data_sub_gross, year);
      var x = document.getElementById("gross"); 
      x.innerHTML = mT;
    }
    function updateChartsGen(year){
        axisData = formatAxisData(data_sub_gross, year)
        RadarChart.draw("#radarGen", axisData)
        mT = test(data_sub_gross, year);
        var x = document.getElementById("gross"); 
        x.innerHTML = mT;
        // d3.select(#oscar).append("h3");
    }

    RadarDataGen().then(draw_radar_Data_Gen);