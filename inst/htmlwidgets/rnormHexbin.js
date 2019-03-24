HTMLWidgets.widget({

  name: 'rnormHexbin',

  type: 'output',

  factory: function(el, width, height) {

    const margin = {
      top: 0.1 * height,
      bottom: 0.1 * height,
      left: 0.1 * height,
      right: 0.1 * height
    };
    
    const histogram = {
      height: 0.25 * height
    }
    
    const w = height - margin.left - 2 * margin.right - histogram.height;
    const h = height - 2 * margin.top - margin.bottom - histogram.height;

    var svg = d3.select(el).append("svg")
      .attr("width", height)
      .attr("height", height);

    return {

      renderValue: function(widgetInput) {
        
        // Generate data points
        
        let randX = d3.randomNormal(w / 2, widgetInput.stdev[0]);
        let randY = d3.randomNormal(h / 2, widgetInput.stdev[1]);
        
        let points = d3.range(20000).map(() => [randX(), randY()]);
        
        // Plot hexbin
        
        const hexbin = d3.hexbin().size([w, h]).radius(2);
        
        const color = d3.scaleLinear().domain([0,10])
          .range(["white", "steelblue"])
          .interpolate(d3.interpolateRgb);
        
        const hexPlot = svg.append("g")
          .attr("class", "hex-plot")
          .attr("transform", "translate(" + margin.left + "," + (2 * margin.top + histogram.height) + ")");
        
        hexPlot.append("clipPath")
          .attr("id", "hex-clip")
          .append("rect")
          .attr("width", w)
          .attr("height", h)
        
        hexagon = hexPlot.append("g")
          .attr("clip-path", "url(#hex-clip)")
          .selectAll(".hexagon")
          .data(hexbin(points));
        
        hexagon.enter()
          .append("path")
          .attr("class", "hexagon")
          .attr("transform", d => "translate(" + d.x + "," + d.y + ")")
          .attr("d", hexbin.hexagon())
          .style("fill", d => color(d.length));
        
        // Add axes
        
        const xScale = d3.scaleIdentity().domain([0, w]);
        const yScale = d3.scaleLinear().domain([0, h]).range([h, 0]);
        
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        const yAxisRight = d3.axisRight(yScale);
        
        hexPlot.append("g").attr("class", "hex-x-axis")
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);
          
        hexPlot.append("g").attr("class", "hex-x-axis axis-top")
          .call(xAxis.tickSize(0).tickValues([]));
          
        hexPlot.append("g").attr("class", "hex-y-axis")
          .call(yAxis);
          
        hexPlot.append("g").attr("class", "hex-y-axis axis-right")
          .attr("transform", "translate(" + w + ", 0)")
          .call(yAxisRight.tickSize(0).tickValues([]));
       
        // Add histograms
        
        const bins = d3.histogram()
          .domain(xScale.domain())
          .thresholds(xScale.ticks(70));
        
        // Add top histogram
        
        const histTop = bins(points.map(d => d[0]));
        
        const gHistTop = svg.append("g")
          .attr("class", "hist-top")
          .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");
          
        gHistTop.append("g")
          .attr("class", "hist-x-axis")
          .attr("transform", "translate(0," + histogram.height + ")")
          .call(d3.axisBottom(xScale));
          
        const gHistTopChart = gHistTop.append("g")
          .attr("class", "hist-chart")
          .selectAll(".bar")
          .data(histTop);
        
        const yScaleTop = d3.scaleLinear()
          .domain([0, d3.max(histTop, d => d.length)])
          .range([0, histogram.height]);
          
        gHistTopChart
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", d => d.x0)
          .attr("y", d => (histogram.height - yScaleTop(d.length)))
          .attr("width", d => xScale(d.x1 - d.x0) - 1)
          .attr("height", d => yScaleTop(d.length))
          .style("fill", "steelblue");

        // Add right histogram
          
        const histRight = bins(points.map(d => d[1]));
        
        const gHistRight = svg.append("g")
          .attr("class", "hist-right")
          .attr("transform", "translate(" + (margin.left + w + margin.right) + "," + (2 * margin.top) + ")");
        
        gHistRight.append("g")
          .attr("class", "hist-y-axis")
          .attr("transform", "translate(0" + "," + histogram.height + ")")
          .call(d3.axisLeft(yScale));
          
        const gHistRightChart = gHistRight.append("g")
          .attr("class", "hist-chart")
          .attr("transform", "translate(0," + histogram.height + ")");
        
        const yScaleRight = d3.scaleLinear()
          .domain([0, d3.max(histRight, d => d.length)])
          .range([0, histogram.height]);
          
        gHistRightChart.selectAll(".bar")
          .data(histRight)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", 0)
          .attr("y", d => d.x0)
          .attr("width", d => yScaleRight(d.length))
          .attr("height", d => xScale(d.x1 - d.x0) - 1)
          .style("fill", "steelblue");
      
      },

      resize: function(width, height) {

        const margin = {
          top: 40,
          bottom: 40,
          left: 40,
          right: 40
        };
    
        const histogram = {
          height: 100
        }

        var svg = d3.select(el).append("svg")
          .attr("width", height + histogram.height + margin.top)
          .attr("height", height + histogram.height + margin.top);
          
      }
    };
  }
});