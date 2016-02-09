var extractData = function(data){
  var juiceData = {};
  var juiceArray = [];
  var toBeRemoved = ["CTL","ctl","Fruits","banana","Apple","Register User"];
  for(var i=0; i<data.length;i++){
      if(toBeRemoved.indexOf(data[i].drinkName) == -1 )
        juiceData[data[i].drinkName] = (juiceData[data[i].drinkName] || 0)+data[i].quantity;
  }
  for(juice in juiceData){
    var juiceObject = {};
    juiceObject.name = juice;
    juiceObject.quantity = juiceData[juice];
    juiceArray.push(juiceObject);
  }
  juiceArray.sort(function(a,b){
      if(a.quantity<b.quantity)
        return -1;
    return +1;
  })
  return juiceArray;
}

var creatGraph = function(){
  var margin = {top: 10, right:0, bottom: 180, left: 120};
  var width = 1500 - margin.left - margin.right;
  var height = 800 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  var formatAxis = d3.format("0");

  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(20)
    .orient("left");

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(10)
    .orient('bottom');

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
       .attr("class", "describe")
       .style("font-size","25px")
       .style("text-decoration","underline")
       .attr("transform", "translate("+(width/2-85)+",30)");

  d3.json('./juice_orders.json',function(data){
    var juiceData = extractData(data);
    x.domain(juiceData.map(function(d){return d.name;}));
    y.domain([0,d3.max(juiceData,function(d){return d.quantity})+1000]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .style("font-size","15px")
            .attr("transform", function(d) {
                return "rotate(-90)"
            });

     svg.append("g")
         .attr("class", "y axis")
         .style("font-size","15px")
         .attr("transform", "translate(0,0)")
         .call(yAxis);

     svg.append("text")
       .attr("text-anchor", "middle")
       .attr("font-size","30px")
       .attr("transform", "translate("+ -70 +","+(height/2)+")rotate(-90)")
       .style("text-decoration","underline")
       .text("Quantity");

     svg.append("text")
       .attr("text-anchor", "middle")
       .attr("font-size","30px")
       .attr("transform", "translate("+ width/2 +","+(height+160)+")")
       .style("text-decoration","underline")
       .text("Juices");


     svg.selectAll("bar")
      .data(juiceData)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.name)+25})
      .attr("width", x.rangeBand(1))
      .attr("y", function(d) { return y(d.quantity); })
      .attr("height", function(d) { return height - y(d.quantity); })
      .on("mouseover",  function(d,i){
          d3.select(this).style("fill","orange");
          d3.select('.describe')
            .text("Total Quantity : "+d.quantity);
      })
      .on("mouseout",function(d,i){
          d3.select(this).style("fill","steelblue");
          d3.select('.describe')
            .text("");
      })

  })

}

$(document).ready(function () {
  creatGraph();
})
