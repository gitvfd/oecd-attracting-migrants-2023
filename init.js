var screenWidth=window.innerWidth;
var chartWidth = document.getElementById("vizDesc").offsetWidth;

var width="";
var counter=1;

while(width==""){
	if((chartWidth/counter)>150 && (chartWidth/counter)<200)
		width= Math.round(chartWidth/counter)-4.5;
	counter++;
	if(counter>50)
		width=195;

}
var lollipopRadius;
if (width > 1200) lollipopRadius = 10; else if (width > 700) lollipopRadius = 8; else lollipopRadius = 5; 

var margin=100;
var padding = 0;


var height = 150;
var colorDim = d3.scaleOrdinal()
	.domain(["Urgency", "Coverage", "Participation", "Inclusiveness", "Alignment", "Financing", "Flexiguidance", "Flexibility & Guidance", "Quality", "Perceived Impact",  "Impact"])
	.range(["rgb(89, 89, 89)", "rgb(102, 45, 145)", "rgb(102, 45, 145)", "rgb(161, 138, 186)", "rgb(57, 181, 74)", "rgb(0, 104, 56)", "rgb(0, 167, 157)", "rgb(0, 167, 157)", "rgb(43, 182, 115)", "rgb(43, 182, 115)","rgb(43, 182, 115)"])

var selCounColor ="rgb(251,176,64)"//"#EF8083";

var selCompCounColor = "rgb(251, 221, 91)"//#225760";


/////////////////////////////////////
/////////////////////////////////////
/** SET UP DASHBOARD    **/
/////////////////////////////////////
/////////////////////////////////////

var chartDash;
var titleDash;
var numberIndicators = 8; // 7 indicators + 1 dimensions for names
var barHeightDash;
var formatDash = d3.format(",.1f");
var marginDash = 5,
	overallwidthDash, heightDash;
//overallwidthDash = document.getElementById("viz").offsetWidth,
overallwidthDash=window.innerWidth;
heightDash = window.innerHeight;
var limitDash = 35 * window.innerHeight / 75; // max height after which part of the tooltip is hidden


var widthDash = overallwidthDash / numberIndicators;


var div = d3.select("#title").append("div")
	.attr("class", "tooltipTitle")
	.style("display", "none");


/////////////////////////////////////
/** SET Scales for each indicator **/
/////////////////////////////////////

var xUrgency = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xCoverage= d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xInclusiveness = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xFinancing = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xQuality = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xAlignment = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);

var xFlexiguidance = d3.scaleLinear()
	.range([0, widthDash - 2 * marginDash]);


/////////////////////////////////////
/////////////////////////////////////
/** SET UP PEARL CHART    **/
/////////////////////////////////////
/////////////////////////////////////
var overallwidth=0.9*screenWidth;
var widthBar=0.55*screenWidth;
var heightPearl=60;
var heightBar=90;
var sideMargin=overallwidth/5;
var marginLeft=sideMargin;
var marginRight=sideMargin;

var marginBar=5;
var formatNumber = d3.format(".0f");
var format= d3.format(",.1f");








function pickSector(topicSelected){
	var color;
	indicators_metadata.forEach(function(d){
		if(d.Indicator_code==topicSelected) {
			color= (d.Dimension).toLowerCase();
			}
	})
	return color;
	
};

function returnName(topicSelected){
	var name;
	indicators_metadata.forEach(function(d){
		if(d.Indicator_code==topicSelected) {
			name = d.Indicator;
		}
	})
	return name;
};

function returnSource(topicSelected) {
	var name;
	indicators_metadata.forEach(function (d) {
		if (d.Indicator_code == topicSelected) {
			name = d.Source;
		}
	})
	return name;
};
var xPearl = d3.scaleLinear()
    .rangeRound([marginLeft, overallwidth-marginRight]);
// end settings pearl charts


var xBar = d3.scaleBand()
    .range([marginBar, widthBar-marginBar])
    .padding(0.1);;

var yBar = d3.scaleLinear()
    .range([heightBar-marginBar, marginBar]);


var tooltip = d3.select("body")
   .append("div")
   .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
	.style("color", "#474747")
    .style("padding", "8px")
    .style("background-color", "#f0f0f0")
	.style("border-radius", "3px")
    .style("font", "11")
	.style("font-family", "Quattrocento Sans")
	.style("text-anchor", "middle")
	.text("");  

var mousemove = function() {
      		return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
  		}

var mouseout = function(){return tooltip.style("visibility", "hidden");} 

//Load Indicators guide
var indicators_metadata=[]
d3.tsv("data/indicator_guide.tsv",function(data){
	data.forEach(function(d){
		indicators_metadata.push(d);
	})
})


//Data to load
var urls = {
alignment: "data/alignment_wide.tsv",
financing: "data/financing_wide.tsv",
flexiguidance: "data/flexiguidance_wide.tsv",
inclusiveness: "data/inclusiveness_wide.tsv",
participation: "data/participation_wide.tsv",
quality: "data/quality_wide.tsv",
urgency: "data/urgency_wide.tsv"

};

d3.queue()
.defer(d3.tsv, urls.alignment)
.defer(d3.tsv, urls.financing)
.defer(d3.tsv, urls.flexiguidance)
.defer(d3.tsv, urls.inclusiveness)
.defer(d3.tsv, urls.participation)
.defer(d3.tsv, urls.quality)
.defer(d3.tsv, urls.urgency)
.await(loadData);

var alignment=[];
var financing=[];
var flexiguidance=[];
var inclusiveness=[];
var participation=[];
var quality=[];
var urgency=[];

var dimDef=[]

d3.json("data/def.json", function (data) {
	data.forEach(function (d){
		dimDef.push(d)
	})
})


var dimGuides = [{ "dimGuide": "urgencyData", "guides": ["← least urgent", "most urgent  →"] },
{ "dimGuide": "participationData", "guides": ["← lowest coverage", "highest coverage →"] },
{ "dimGuide": "inclusivenessData", "guides": ["← least inclusive", "most inclusive →"] },
	{ "dimGuide": "financingData", "guides": ["← weakest financing arrangements", "strongest financing arrangements →"] },
{ "dimGuide": "alignmentData", "guides": ["← least aligned", "most aligned →"] },
{ "dimGuide": "qualityData", "guides": ["← lowest perceived impact", "highest perceived impact →"] },
	{ "dimGuide": "flexiguidanceData", "guides": ["← weakest flexibility and guidance", "strongest flexibility and guidance →"] }]



function loadData(err,alignmentTemp,financingTemp,flexiguidanceTemp,inclusivenessTemp,participationTemp,qualityTemp,urgencyTemp){
alignmentTemp.forEach(function(d){
	alignment.push(d);
})
financingTemp.forEach(function(d){
	financing.push(d);
})
flexiguidanceTemp.forEach(function(d){
	flexiguidance.push(d);
})
inclusivenessTemp.forEach(function(d){
	inclusiveness.push(d);
})
participationTemp.forEach(function(d){
	participation.push(d);
})
qualityTemp.forEach(function(d){
	quality.push(d);
})
urgencyTemp.forEach(function(d){
	urgency.push(d);
})
render(err,alignmentTemp,financingTemp,flexiguidanceTemp,inclusivenessTemp,participationTemp,qualityTemp,urgencyTemp);
}

var dimension=[];

function render(err,alignment,financing,flexiguidance,inclusiveness,participation,quality,urgency){
	var alignmentRank=[]
	alignment.filter(function (k) { return k.variable == "Total" }).forEach(function(k){
		if(k.value!="NA")
			alignmentRank.push(k.value);
	})

	var financingRank = []
	financing.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			financingRank.push(k.value);
	})

	var flexiguidanceRank = []
	flexiguidance.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			flexiguidanceRank.push(k.value);
	})

	var inclusivenessRank = []
	inclusiveness.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			inclusivenessRank.push(k.value);
	})

	var participationRank = []
	participation.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			participationRank.push(k.value);
	})

	var qualityRank = []
	quality.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			qualityRank.push(k.value);
	})

	var urgencyRank = []
	urgency.filter(function (k) { return k.variable == "Total" }).forEach(function (k) {
		if (k.value != "NA")
			urgencyRank.push(k.value);
	})

	d3.map(alignment, function(d){return d.Country;}).keys().forEach(function(d){dimension.push({'Country':d});})

	alignment.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.alignment=d.value;
					k.alignmentRanking = alignmentRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})

	financing.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.financing = d.value;
					k.financingRanking = financingRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})
	flexiguidance.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.flexiguidance = d.value;
					k.flexiguidanceRanking = flexiguidanceRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})
	inclusiveness.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.inclusiveness = d.value;
					k.inclusivenessRanking = inclusivenessRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})
	participation.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.participation = d.value;
					k.participationRanking = participationRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})
	quality.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.quality = d.value;
					k.qualityRanking = qualityRank.sort().reverse().indexOf(d.value) + 1;
				}
			})
		}
	})
	urgency.forEach(function (d){
		if(d.variable=="Total"){
			dimension.forEach(function(k){
				if(k.Country==d.Country){
					k.urgency = d.value;
					k.urgencyRanking = urgencyRank.sort().indexOf(d.value) + 1;
				}
			})
		}
	})



/// launch pearcharts creation
	loopOverIndicators(alignment,financing,flexiguidance,inclusiveness,participation,quality,urgency)
	createDashboard(urgency.filter(function (d) { return d.variable == "Total" }), participation.filter(function (d) { return d.variable == "Total" }), inclusiveness.filter(function (d) { return d.variable == "Total" }), financing.filter(function (d) { return d.variable == "Total" }), quality.filter(function (d) { return d.variable == "Total" }), alignment.filter(function (d) { return d.variable == "Total" }), flexiguidance.filter(function (d) { return d.variable == "Total" }))

	dimDesc("Urgency_Desc", urgency.filter(function (d) { return d.variable == "Total" }))
	d3.selectAll(".btn")
	.on("click",function(d){
		//console.log(this.id)
		if (this.id =="Urgency_Desc")
			dimDesc(this.id, urgency.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Participation_Desc")
			dimDesc(this.id, participation.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Inclusiveness_Desc")
			dimDesc(this.id, inclusiveness.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Financing_Desc")
			dimDesc(this.id, financing.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Quality_Desc")
			dimDesc(this.id, quality.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Alignment_Desc")
			dimDesc(this.id, alignment.filter(function (d) { return d.variable == "Total" }))
		if (this.id == "Flexiguidance_Desc")
			dimDesc(this.id, flexiguidance.filter(function (d) { return d.variable == "Total" }))
	})
}
//window.onresize = function(){ location.reload(); }

