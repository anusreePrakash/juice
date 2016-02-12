var toBeRemoved = ["CTL","ctl","Fruits","banana","Apple","Register User","Banana"];

// var createGraph = function(juiceData,margin,chartNo,juiceName){
  // var width = 400 - margin.left - margin.right;
  // var height = 400 - margin.top - margin.bottom;
//
//   var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
//   var y = d3.scale.linear().range([height, 0]);
//
//   var formatAxis = d3.format("0");
//
//   var yAxis = d3.svg.axis()
//     .scale(y)
//     .ticks(10)
//     .orient("left")
//     .tickSize(-width);
//
//
//   var xAxis = d3.svg.axis()
//     .scale(x)
//     .tickPadding(10)
//     .orient('bottom');
//
//   var svg = d3.select("body").append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     x.domain(juiceData.map(function(d){return d.key;}));
//     y.domain([0,d3.max(juiceData,function(d){return d.values})]);
//
//     svg.append("g")
//         .attr("class", "xAxis axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis)
//         .selectAll("text")
//             .style("text-anchor", "end")
//             .attr("dx", "2em")
//             .attr("dy", ".15em");
//
//    svg.append("text")
//      .attr("text-anchor", "middle")
//      .attr("transform", "translate("+ 20 +","+(30)+")rotate(-90)")
//      .text("Quantity");
//
//    svg.append("text")
//      .attr("text-anchor", "middle")
//      .attr("transform", "translate("+ width/2 +","+260+")")
//      .style("font-size","20px")
//      .style("text-decoration","underline")
//      .text(juiceName);
//
//    svg.append("text")
//      .attr("text-anchor", "middle")
//      .attr("class","value"+chartNo)
//      .attr("transform", "translate("+ width/2 +","+0+")")
//
//      svg.append("g")
//      .attr("class", "yAxis axis")
//      .attr("transform", "translate(0,0)")
//      .call(yAxis)
//
//    svg.selectAll("bar")
//     .data(juiceData)
//   .enter().append("rect")
//     .style("fill", "steelblue")
//     .attr("x", function(d) { return x(d.key)})
//     .attr("width", x.rangeBand(1))
//     .attr("y", function(d) { return y(d.values); })
//     .attr("height", function(d) { return height - y(d.values); })
//     .on("mouseover",  function(d,i){
//         d3.select(this).style("fill","orange");
//         d3.select('.value'+chartNo)
//           .text("Total Quantity : "+d.values);
//     })
//     .on("mouseout",function(d,i){
//         d3.select(this).style("fill","steelblue");
//         d3.select('.value'+chartNo)
//           .text("");
//     });
//
// }

var createGraph = function(juiceData,margin,chartNo,juiceName){

    var width = 400 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d");
    var formatDate = d3.time.format("%b %d");

    var x = d3.time.scale().range([0, width]),
    y = d3.scale.linear().range([height, 0]),
    z = d3.scale.linear().range(["white", "steelblue"]);

    var xStep = 864e5,
    yStep = 100;

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Compute the scale domains.
    x.domain(d3.extent(juiceData, function(d) { return d.date; }));
    y.domain(d3.extent(juiceData, function(d) { return d.bucket; }));
    z.domain([0, d3.max(juiceData, function(d) { return d.count; })]);

    // Extend the x- and y-domain to fit the last bucket.
    // For example, the y-bucket 3200 corresponds to values [3200, 3300].
    x.domain([x.domain()[0], +x.domain()[1] + xStep]);
    y.domain([y.domain()[0], y.domain()[1] + yStep]);


    svg.selectAll(".tile")
      .data(juiceData)
    .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.date); })
      .attr("y", function(d) { return y(d.bucket + yStep); })
      .attr("width", x(xStep) - x(0))
      .attr("height",  y(0) - y(yStep))
      .style("fill", function(d) { return z(d.count); });


}

var drawChart = function(){
  var parseDate = d3.time.format("%Y-%m-%d").parse
  var margin = {top: 14, right:0, bottom: 180, left: 120};

  var juiceData = [{"date":parseDate("2012-07-20"),"bucket":800,"count":119},
  {"date":parseDate("2015-11-07"),"bucket":800,"count":10},
  {"date":parseDate("2015-11-08"),"bucket":800,"count":122}]
  createGraph(juiceData,margin,1,"orange");

  // var format = d3.time.format("%B");
  // d3.json('./juice_orders.json',function(data){
  //
  //   var juiceData =d3.nest()
  //   			.key(function(d){
  //   				return d.drinkName
  //   			})
  //         .rollup(function(x){
  //           return d3.nest()
  //             .key(function(d){ return format(new Date(d.date))})
  //             .rollup(function(leaf){return d3.sum(leaf, function(d) { return d.quantity; })})
  //             .entries(x);
  //         })
  //   			.entries(data);
  //
  //   juiceData = juiceData.filter(function(d){
  //     if(toBeRemoved.indexOf(d.key) == -1)
  //       return d;
  //   })
  //
  //   juiceData.sort(function(a,b){
  //     if(a.values>b.values)
  //       return 1;
  //     return -1;
  //   })
  //   var count = 0;
  //   for(juice in juiceData){
  //     createGraph(juiceData[juice].values,margin,count,juiceData[juice].key);
  //     count++;

    // foo = data;
  // });


}

$(document).ready(function () {
  drawChart();
})
