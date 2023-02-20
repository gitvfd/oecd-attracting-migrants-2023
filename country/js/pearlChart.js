function loopOverIndicators() {
  pearlchart(
    "Workers",
    document.getElementById("country_dropdown").options[
      document.getElementById("country_dropdown").selectedIndex
    ].value,
    document.getElementById("country_dropdown_comp").options[
      document.getElementById("country_dropdown_comp").selectedIndex
    ].value,
    data.filter(function (d) {
      return d.Cat == "Workers";
    })
  );
  pearlchart(
    "Entrepreneurs",
    document.getElementById("country_dropdown").options[
      document.getElementById("country_dropdown").selectedIndex
    ].value,
    document.getElementById("country_dropdown_comp").options[
      document.getElementById("country_dropdown_comp").selectedIndex
    ].value,
    data.filter(function (d) {
      return d.Cat == "Entrepreneurs";
    })
  );
  pearlchart(
    "Start-up-founders",
    document.getElementById("country_dropdown").options[
      document.getElementById("country_dropdown").selectedIndex
    ].value,
    document.getElementById("country_dropdown_comp").options[
      document.getElementById("country_dropdown_comp").selectedIndex
    ].value,
    data.filter(function (d) {
      return d.Cat == "Start-up founders";
    })
  );
  pearlchart(
    "Student",
    document.getElementById("country_dropdown").options[
      document.getElementById("country_dropdown").selectedIndex
    ].value,
    document.getElementById("country_dropdown_comp").options[
      document.getElementById("country_dropdown_comp").selectedIndex
    ].value,
    data.filter(function (d) {
      return d.Cat == "Students";
    })
  );
}

function pearlchart(nameIndic, selectedCou, compCou, indicData) {
  var indicData = indicData.filter(function (d) {
    return d.value != "NA";
  });

  var rankArray = [];
  indicData
    .filter(function (k) {
      return k.variable == "Total";
    })
    .forEach(function (k) {
      if (k.value != "NA") rankArray.push(k.value);
    });
  indicData.forEach(function (k) {
    k.ranking = rankArray.sort().reverse().indexOf(k.value) + 1;
  });

  var currentChart = "#chart_" + nameIndic;
  d3.selectAll(currentChart).selectAll("*").remove();

  var idTopic = "title_" + nameIndic;
  var IDChart = "#chart_" + nameIndic;

  //if(nameIndic!="Alignment" && nameIndic!="Financing" && nameIndic!="Flexiguidance" && nameIndic!="Inclusiveness" && nameIndic!="Coverage" && nameIndic!="Quality" && nameIndic!="Urgency")

  var compChart = d3
    .select(IDChart)
    .append("svg")
    .attr("id", nameIndic)
    .attr("width", width)
    .attr("height", heightPearl)
    .style("background", "none")
    .append("g")
    .attr("class", "compChart")
    .attr("transform", "translate(" + 0 + "," + 0 + ")");

  var minValue = d3.min(indicData, function (d) {
    return parseFloat(d.value);
  });
  var maxValue = d3.max(indicData, function (d) {
    return parseFloat(d.value);
  });

  if (nameIndic == "???" || nameIndic == "???")
    xPearl.domain([minValue, maxValue]);
  else xPearl.domain([minValue, maxValue]);

  var guideStart2display, guideEnd2display;

  /** dimGuides.forEach(function (d) {
			var indic2pick;
			if (nameIndic=="Coverage")
				indic2pick="participationData"
			else
				indic2pick = nameIndic + "Data"

			if (d.dimGuide.toLowerCase() == indic2pick.toLowerCase()) {
				guideStart2display = d.guides[0];
				guideEnd2display = d.guides[1];
			}
		})*/

  var dimDescGuide = compChart
    .append("text")
    .append("tspan")
    .attr("id", "chartGuidePearl")
    .attr("x", 5)
    .attr("y", 9)
    //.attr("y", heightPearl -3)
    .html(guideStart2display);
  //.call(wrap,0.25*width);

  var dimDescGuideEnd = compChart
    .append("text")
    .append("tspan")
    .attr("id", "chartGuidePearlEnd")
    .attr("x", width - 5)
    .attr("y", 9)
    //.attr("y", heightPearl -3)
    .html(guideEnd2display)
    .style("text-anchor", "end");

  compChart
    .append("line")
    .attr("x1", xPearl(minValue))
    .attr("y1", heightPearl / 2)
    .attr("x2", xPearl(maxValue))
    .attr("y2", heightPearl / 2)
    .style("stroke", "#585a5c")
    .style("stroke-width", "1px");

  var circleGroup = compChart
    .selectAll("g")
    .data(indicData)
    .enter()
    .append("g")

    .filter(function (d) {
      return (
        d.Country == selectedCou ||
        d.Country == compCou ||
        d.value == minValue ||
        d.value == maxValue
      );
    })
    .attr("class", function (d) {
      return d.variable;
    });

  circleGroup
    .append("circle")
    .attr("cx", function (d) {
      if (d.value !== "") return xPearl(parseFloat(d.value));
    })
    .attr("cy", heightPearl / 2)
    .attr("r", function (d) {
      if (d.ISO == selectedCou) return 8;
      else return 8;
    })
    .style("fill", function (d) {
      if (d.Country == selectedCou) return selCounColor;
      else if (d.Country == compCou) return selCompCounColor;
      else if (d.value == minValue) return colorDim(nameIndic);
      else if (d.value == maxValue) return colorDim(nameIndic);
      else return "";
    });

  circleGroup
    .append("text")
    .attr("class", "label")
    .attr("dx", function (d) {
      if (d.value !== "") return xPearl(parseFloat(d.value));
    })
    .attr("dy", function (d) {
      if (d.Country == selectedCou) return heightPearl / 2 + 18;
      else if (d.Country == compCou) return heightPearl / 2 + 27;
      else return heightPearl / 2 - 10;
    })
    .style("text-anchor", "middle")
    .text(function (d) {
      if (d.value == minValue) return "Bottom performer";
      else if (d.value == maxValue) return "Top performer";
      else return d.Country /** + " (" + format(d.value) + ""+")"*/;
    });

  var dispCou = false;
  indicData.forEach(function (k) {
    if (k.Country == selectedCou) dispCou = true;
  });

  if (!dispCou) {
    compChart
      .append("text")
      .attr("class", "noDataAvailable")
      .attr("x", (1 / 4) * width)
      .attr("y", 15)
      .text("data unavailable for the selected country ");
  }

  compChart
    .selectAll("circle")
    .on("mouseover", function (d) {
      tooltip.html(d.Country + "<br> score: " + d3.format(".2f")(d.value));
      tooltip.style("visibility", "visible");
    })
    .on("mousemove", mousemove)
    .on("mouseout", mouseout);
}
