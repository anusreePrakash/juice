
var extractData = function(data){
  var toBeRemoved = ["CTL","ctl","Fruits","Banana","Apple","Register User","banana"];
  var juiceData = d3.nest().key(function(d){return  d.drinkName }).rollup(function(leaf){return leaf.length}).entries(data);
  juiceData = juiceData.filter(function(d){
    if(toBeRemoved.indexOf(d.key) == -1)
      return d;
  })
  var isSugarData = d3.nest().key(function(d){if(d.isSugarless)return  d.drinkName }).rollup(function(leaf){return leaf.length}).entries(data);
  isSugarData= isSugarData.slice(1,isSugarData.length-2);
  var isSugarlessData = {}
  for(index in isSugarData)
    isSugarlessData[isSugarData[index].key] = isSugarData[index].values;

  for(juice in juiceData){
    juiceData[juice]["sugarQuantity"] = isSugarlessData[juiceData[juice].key] || 0;
  }
  return juiceData;
}



var createChart = function(){

  var width = 400,
      height = 120,
      twoPi = 2 * Math.PI;

  var arc = d3.svg.arc()
      .innerRadius(20)
      .outerRadius(60)
      .startAngle(0);

  d3.json('./juice_orders.json', function(error, data) {
    if (error) throw error;
    var juiceData = extractData(data);

    var svg = d3.select("body").selectAll("svg")
        .data(juiceData)
        .enter().append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        // Background arc
        svg.selectAll("svg")
        svg.append("path")
            .datum({endAngle: twoPi})
            .style("fill", "#e6e6e6")
            .attr("d", arc);

        // Foreground arc
        svg.selectAll("svg")
        svg.append("path")
            .attr("d", arc.endAngle(function (d) {return (twoPi * (1 - ((d.values - d.sugarQuantity) / d.values)));}))
            .style("fill", "orange");

        // Add the site names to the center of the chart
        svg.append("text")
          .attr("dy", ".35em")
          .style("text-anchor", "middle")
          .attr("transform", "translate(0,0)")
          .text(function (d) {return Math.round(d.sugarQuantity/d.values * 100)+"%";});

        svg.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + 150 + "," + 10 + ")")
        .text(function(d){ return d.key})

  });
};


$(document).ready(function(){
  createChart();
})
