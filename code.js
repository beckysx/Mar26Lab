
var getQuizeArray=function(d,date){
  var array=[]
  for (var i=0;i<d.length;i++){
    var quize=d[i].quizes
    for (var a=0;a<quize.length;a++){
      var day=parseInt(d[i].quizes[a].day)
      if (day==date){
        var grade=parseInt(d[i].quizes[a].grade)
        array.push(grade)
      }
    }

  }
  console.log(array)
  return array}


var drawHistogram=function(data){
  var date=1

  var datapoint=getQuizeArray(data,date)

  var screen={width:600,height:400};
  var margin = {top: 20, right: 10, bottom: 20, left: 20};
  var h=screen.height-margin.top-margin.bottom
  var w=screen.width-margin.right-margin.left

//scale
   var xScale= d3.scaleLinear()
      .domain([0,10])
      .nice()
      .range([margin.left,w+margin.left]);
   var yScale=d3.scaleLinear()
       .domain([0,23])
       .range([h,margin.top])
       .nice();
   var colors=d3.scaleOrdinal()
   .domain([0,10])
   .range(["#64A38A","#82A176","#A6C48A","#AFD3A2",'#94CEAF'])

// bins
    var binMaker=d3.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(10))

     var bins=binMaker(datapoint)
     console.log(bins)

// draw rects
  var svg=d3.select("body").append("svg")
  .attr('width', screen.width)
  .attr('height', screen.height)


  var plot=svg.append("g")
  .attr('id', 'chart')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top+ ')')

  plot.selectAll("rect")
  .data(bins)
  .enter()
  .append("rect")
  .attr('x', function(d){
    return xScale(d.x0)
  })
  .attr('width', function(d){
    return xScale(d.x1-0.5-d.x0)
  })
  .attr('y', function(d){
    console.log(yScale(d.length))
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})


// axis
  var yAxis=d3.axisLeft(yScale)
  .tickSize(0)
  svg.append("g")
  .attr('class', 'yAxis')
  .call(yAxis)
  .attr('transform', 'translate(' + 15 + ',' + margin.top + ')')
  


}


d3.json('classData.json').then(function(data){
console.log(data)
drawHistogram(data)
})
