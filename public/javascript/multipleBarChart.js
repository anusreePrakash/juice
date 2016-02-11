var toBeRemoved = ["CTL","ctl","Fruits","banana","Apple","Register User","Banana"];

var creatGraph = function(juiceData,margin,chartNo,juiceName){
  var width = 400 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  var formatAxis = d3.format("0");

  var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(10)
    .orient("left")
    .tickSize(-width);


  var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(10)
    .orient('bottom');

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(juiceData.map(function(d){return d.key;}));
    y.domain([0,d3.max(juiceData,function(d){return d.values})]);

    svg.append("g")
        .attr("class", "xAxis axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-60)"
            });

   svg.append("text")
     .attr("text-anchor", "middle")
     .attr("transform", "translate("+ 20 +","+(30)+")rotate(-90)")
     .text("Quantity");

   svg.append("text")
     .attr("text-anchor", "middle")
     .attr("transform", "translate("+ width/2 +","+330+")")
     .style("font-size","20px")
     .style("text-decoration","underline")
     .text(juiceName);

   svg.append("text")
     .attr("text-anchor", "middle")
     .attr("class","value"+chartNo)
     .attr("transform", "translate("+ width/2 +","+0+")")

     svg.append("g")
     .attr("class", "yAxis axis")
     .attr("transform", "translate(0,0)")
     .call(yAxis)

   svg.selectAll("bar")
    .data(juiceData)
  .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", function(d) { return x(d.key)})
    .attr("width", x.rangeBand(1))
    .attr("y", function(d) { return y(d.values); })
    .attr("height", function(d) { return height - y(d.values); })
    .on("mouseover",  function(d,i){
        d3.select(this).style("fill","orange");
        d3.select('.value'+chartNo)
          .text("Total Quantity : "+d.values);
    })
    .on("mouseout",function(d,i){
        d3.select(this).style("fill","steelblue");
        d3.select('.value'+chartNo)
          .text("");
    });


}

var drawChart = function(){
  var margin = {top: 14, right:0, bottom: 180, left: 120};

  // var juiceData = [{"key":"feb","values":123},{"key":"march","values":223},{"key":"april","values":253}];
  // creatGraph(juiceData,margin,2);

  var format = d3.time.format("%B");
  d3.json('./juice_orders.json',function(data){

    var juiceData =d3.nest()
    			.key(function(d){
    				return d.drinkName
    			})
          .rollup(function(x){
            return d3.nest()
              .key(function(d){ return format(new Date(d.date))})
              .rollup(function(leaf){return d3.sum(leaf, function(d) { return d.quantity; })})
              .entries(x);
          })
    			.entries(data);

    juiceData = juiceData.filter(function(d){
      if(toBeRemoved.indexOf(d.key) == -1)
        return d;
    })

    juiceData.sort(function(a,b){
      if(a.values>b.values)
        return 1;
      return -1;
    })
    var count = 0;
    for(juice in juiceData){
      creatGraph(juiceData[juice].values,margin,count,juiceData[juice].key);
      count++;
    }

    // foo = d3.nest()
    //   .key(function(d){ return format(new Date(d.date))})
    //   .rollup(function(leaf){return d3.sum(leaf, function(d) { return d.quantity; })})
    //   .entries(juiceData[2].values);


  });


}

$(document).ready(function () {
  drawChart();
})
