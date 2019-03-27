
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
      .domain([0,11])
      .nice()
      .range([margin.left,w+margin.left]);
   var yScale=d3.scaleLinear()
       .domain([0,23])
       .range([h,margin.top])
       .nice();
   var colors=d3.scaleOrdinal()
   .domain([0,11])
   .range(["#64A38A","#82A176","#A6C48A","#AFD3A2",'#94CEAF'])

   var timeScale= d3.scaleLinear()
      .domain([0,41])
      .range([10,1200]);

// bins
    var binMaker=d3.histogram()
    .domain(xScale.domain())
    .thresholds(xScale.ticks(11))

     var bins=binMaker(datapoint)

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
    return xScale(d.x1-0.1)-xScale(d.x0)
  })
  .attr('y', function(d){
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

// legend

   svg.append("g").selectAll("text")
   .data(bins)
   .enter()
   .append("text")
   .attr('x', function(d){
     console.log(d)
     return xScale(d.x0)+(xScale(d.x1+0.5)-xScale(d.x0))/2
   })
   .attr('y', screen.height-margin.bottom+15)
   .text(function(d,i){return i})
   .style('font-size', 10)

   svg.append("g").append('line')
       .attr('x1', margin.left)
       .attr('y1', screen.height-margin.bottom)
       .attr('x2', margin.left+w+10)
       .attr('y2', screen.height-margin.bottom)
       .style('stroke', '#111');

  // labels
  svg.append("text")
  .attr('x',margin.left)
  .attr('y',margin.top)
  .text("Frequency")
  .style('font-size', 13)

  d3.select("body").append("text")
  .attr('id', 'scoretext')
  .attr('x',0)
  .attr('y',0)
  .text("Score")
  .style('font-size', 13)

  d3.select("body").append("text")
  .attr('id', 'title')
  .attr('x',0)
  .attr('y',0)
  .text("Quizes Scores")
  .style('font-size', 25)


//timeline

var times=d3.range(41)
times.splice(14,1)
times.splice(28,1)
times.splice(38,1)




var timeline=d3.select("body").append("svg")
.attr('id', 'timeline')
.attr('height', 100)
.attr('width', 1200)


timeline.append("g").selectAll('text')
.data(times)
.enter()
.append("text")
.attr('x', function(d,i){return timeScale(i)})
.attr('y',100)
.attr('id',function(d){return "day"+(d+1)} )
.text(function(d){return d+1})
.on("click",function(){
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

})






}


d3.json('classData.json').then(function(data){
console.log(data)
drawHistogram(data)
})
