/* global d3 */

export class LineChart {

  line_color = "#FFF";
  line_size = "1px";

  constructor(container, {dataLength, width = 500, height = 250}) {
    this.container = d3.select(container);

    this.width = width;
    this.height = height;
    this.DRAW_DATA_LENGTH = ~~(dataLength / 2) - 1;

    var g = this.container
      .append("svg")
      .attr("width", this.width)
      .attr('height', this.height)
      .append("g")
      ;

    g
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("class", "clip-overlay")
    ;

    g
      .append("g")
      .attr("class", "path layer")
      .append("path")
      .attr("class", "line")
      .attr("clip-path", "url(#clip)")
      .style({ fill: "none", "stroke-width": this.line_size, stroke: this.line_color })
    ;

    g
      .select("rect.clip-overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("x", 0)
      .attr("y", 0)
    ;
  }

  draw(data) {
    const width = this.width;
    const height = this.height;

    var hFreqData = data.slice(0, this.DRAW_DATA_LENGTH);

    // point to coordinate converter
    var x = d3.scale.linear()
      .domain([0, hFreqData.length])
      .range([0, width]);

    var y = d3.scale.linear()
      .domain([0, 255])
      .range([height, 0]);

    //create d3 path generation function
    var line = d3.svg.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); })
      ;

   this.container
      .select("path.line")
      .attr('d', line(hFreqData))
      ;
  }
}

export class ColumnChart {
  color = "#FFF";

  constructor(container, {dataLength, width = 500, height = 250}) {
    this.container = d3.select(container);
    this.DRAW_DATA_LENGTH = ~~(dataLength / 2) - 1;

    this.width = width;
    this.height = height;

    var g = this.container
      .append("svg")
      .attr("width", this.width)
      .attr('height', this.height)
      .append('g')
      ;

    g
      .append('g')
      .attr('class', 'layer bar')
      ;

    var columns = Array.apply(null, new Array( this.DRAW_DATA_LENGTH )).map((x, i) => i);

    var barSelection = this.container
      .select('g.layer.bar')
      .selectAll("g.bar.item")
      .data(columns)
      ;

    barSelection.enter()
      .append('g')
      .attr('class', 'bar item')
      .append('rect')
      .attr('class', 'bar item')
      .style({'fill': this.color})
      ;

    barSelection.exit().remove();
  }

  draw(data) {
    const width = this.width;
    const height = this.height;

    var hFreqData = data.slice(0, this.DRAW_DATA_LENGTH);

    var x = d3.scale.ordinal()
      .domain(hFreqData.map(d => d.x))
      .rangeRoundBands([0, width], .1)
    ;

    var y = d3.scale.linear()
      .domain([0, 255])
      .range([height, 0])
    ;

    this.container
      .select('g.layer.bar')
      .selectAll("g.bar.item")
      .data(hFreqData)
      .each(function(d) {
        var bar = d3.select(this);

        bar
          .select('rect.bar.item')
          .attr('x', x(d.x))
          .attr('y', y(d.y))
          .attr("width", x.rangeBand())
          .attr('height', height - y(d.y))
          ;
      })
  }
}
