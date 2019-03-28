
var getQuizeArray=function(d,date){
  var array=[]
  for (var i=0;i<d.length;i++){
    var quize=d[i].quizes
    for (var a=0;a<quize.length;a++){
      var day=parseInt(d[i].quizes[a].day)
      if (day==date){
        var grade=parseInt(d[i].quizes[a].grade)
        array.push(grade)}}
}
  return array
}


var drawHistogram=function(data){

  var screen={width:650,height:420};
  var margin = {top: 20, right: 10, bottom: 40, left: 70};
  var h=screen.height-margin.top-margin.bottom
  var w=screen.width-margin.right-margin.left



  // bins

  var date=1

  var datapoint=getQuizeArray(data,date)

  var xScale= d3.scaleLinear()
     .domain([0,11])
     .nice()
     .range([0,w]);

  var binMaker=d3.histogram()
  .domain(xScale.domain())
  .thresholds(xScale.ticks(11))

   var bins=binMaker(datapoint)


//scale

   var yScale=d3.scaleLinear()
       .domain([0,d3.max(bins,function(d){return d.length})])
       .range([h,margin.top])
       .nice();

   var colors=d3.scaleOrdinal()
   .domain([0,10])
   .range(["#64A38A","#82A176","#A6C48A","#AFD3A2",'#94CEAF'])

   var timeScale= d3.scaleLinear()
      .domain([0,5])
      .range([70,400]);


// draw rects
  var svg=d3.select("body").append("svg")
  .attr('id', 'chart')
  .attr('width', screen.width)
  .attr('height', screen.height)

// rect
  var chart=svg.append("g")
  .attr('transform', 'translate(' + margin.left + ',' + margin.top+ ')')

  chart.selectAll("rect")
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
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.append("g")
  .attr('id', 'yAxis')
  .call(yAxis)
  .attr('transform', 'translate(' + 65 + ',' + margin.top + ')')

  var xAxis=d3.axisBottom(xScale)
  .tickSize(0)
  svg.append("g")
  .attr('id', 'xAxis')
  .call(xAxis)
  .attr('transform', 'translate(' + (margin.left+20)+ ',' + (h+margin.top) + ')')

  d3.select("body").select("#chart").append("g").append("line")
      .attr('x1',65 )
      .attr('y1', h+margin.top+0.5)
      .attr('x2', 100)
      .attr('y2', h+margin.top+0.5)
      .style('stroke', 'black');



  // labels
  svg.append("text")
  .attr('x',margin.left-40)
  .attr('y',margin.top)
  .attr('id', 'frequencytext')
  .text("Frequency")
  .style('font-size', 15)


  d3.select("body").select("#chart").append("text")
  .attr('id', 'scoretext')
  .attr('x',margin.left+w/2)
  .attr('y',margin.top+h+35)
  .text("Score")
  .style('font-size', 15)

  d3.select("body").append("text")
  .attr('id', 'title')
  .attr('x',0)
  .attr('y',0)
  .text("Quizes Scores")
  .style('font-size', 25)


  d3.select("body").append("text")
  .attr('id', 'datetitle')
  .attr('x',0)
  .attr('y',0)
  .text("Date")
  .style('font-size', 25)

  d3.select("body").select("#chart").append("g")
  .attr('id', 'scorelabel')
  .selectAll("text")
  .data(bins)
  .enter()
  .append("text")
  .attr('x', function(d){
    return xScale(d.x1)+(xScale(d.x1-0.3)-xScale(d.x0))
  })
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })


//timeline

var circle=d3.select("body").append("svg")
.attr('width', 530)
.attr('height', 320)
.attr('id', 'circle')

circle.append("svg:image")
.attr('xlink:href', function(){return "circle.png"})
.attr('x', 35)
.attr('y', 5)
.attr('width', 70)
.attr('height', 70)
.attr('id', 'actualImage')

var times=d3.range(7)


var timeline=d3.select("body").append("svg")
.attr('id', 'timeline')
.attr('height', 400)
.attr('width', 500)

var time1=timeline.append("g").attr('id', 'time1')

time1.selectAll("text").data(times)
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',30)
.attr('id',function(d){return "day"+(d+1)} )
.text(function(d){return d+1})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)



  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

  //label
  d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })

})

var time2=timeline.append("g").attr('id', 'time2')

time2.selectAll("text").data(times)
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',80)
.attr('id',function(d){return "day"+(d+8)} )
.text(function(d){return d+8})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)

  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

  //label
  d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })

})

var time3=timeline.append("g").attr('id', 'time3')

time3.selectAll("text").data(times)
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',130)
.attr('id',function(d){return "day"+(d+15)} )
.text(function(d){return d+15})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)

  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var compare=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  var pcx=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('x'))
  var pcy=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('y'))
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  if(compare==15|| compare==30 || compare==41){
    cx=pcx
    cy=pcy
  }
  else{
    cx=cx
    cy=cy
  }
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

  //label
  d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })

})

var time4=timeline.append("g").attr('id', 'time4')

time4.selectAll("text").data(times)
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',180)
.attr('id',function(d){return "day"+(d+22)} )
.text(function(d){return d+22})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)

  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

  //label
  d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })

})

var time5=timeline.append("g").attr('id', 'time5')

time5.selectAll("text").data(times)
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',230)
.attr('id',function(d){return "day"+(d+29)} )
.text(function(d){return d+29})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)

  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var compare=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  var pcx=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('x'))
  var pcy=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('y'))
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  if(compare==15|| compare==30 || compare==41){
    cx=pcx
    cy=pcy
  }
  else{
    cx=cx
    cy=cy
  }
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

    //label
    d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
    .data(bins)
    .transition()
    .ease(d3.easeBounce)
    .duration(200)
    .attr('y', function(d){
      return yScale(d.length)+5})
    .text(function(d){
      if (d.length>0){return d.length}
      })

})

var time6=timeline.append("g").attr('id', 'time6')

time6.selectAll("text").data(d3.range(6))
.enter()
.append("text")
.attr('x', function(d,i){
  return timeScale(i)})
.attr('y',270)
.attr('id',function(d){return "day"+(d+36)} )
.text(function(d){return d+36})
.on("click",function(){
  //date change
  var previousdate=date
  date=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  if(date==15|| date==30 || date==41){
    date=previousdate
  }
  else{date=date}

  var datapoint=getQuizeArray(data,date)
  var bins=binMaker(datapoint)

  var yScale=d3.scaleLinear()
      .domain([0,d3.max(bins,function(d){return d.length})])
      .range([h,margin.top])
      .nice();

  var yAxis=d3.axisLeft(yScale)
  .ticks(d3.max(bins,function(d){return d.length}))
  .tickSize(0)

  svg.select("#yAxis")
  .transition()
  .duration(500)
  .call(yAxis)

  // rects
  d3.select("#chart").selectAll("rect")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)})
  .attr('height', function(d){
    return h-yScale(d.length)
  })
  .attr('fill', function(d,i){return colors(i)})

  // timeline
  var compare=parseInt(d3.select(this).attr("id").replace(/[^0-9]/ig,""))
  var pcx=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('x'))
  var pcy=parseInt(d3.select("body").select("#circle").select("#actualImage").attr('y'))
  var cx=parseInt(d3.select(this).attr('x'))-32
  var cy=parseInt(d3.select(this).attr('y'))-25
  if(compare==15|| compare==30 || compare==41){
    cx=pcx
    cy=pcy
  }
  else{
    cx=cx
    cy=cy
  }
  d3.select("body").select("#circle").select("#actualImage")
  .transition()
  .duration(200)
  .attr('x', cx)
  .attr('y', cy)

  //label
  d3.select("body").select("#chart").select("#scorelabel").selectAll("text")
  .data(bins)
  .transition()
  .ease(d3.easeBounce)
  .duration(200)
  .attr('y', function(d){
    return yScale(d.length)+5})
  .text(function(d){
    if (d.length>0){return d.length}
    })

})

}


d3.json('classData.json').then(function(data){

drawHistogram(data)
})
