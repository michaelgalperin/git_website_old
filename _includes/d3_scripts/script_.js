try { window.regltick.cancel() } catch (e) {}
console.clear()

var data
var maxLength
var totalCount
var totalVizLength = 180
var offset = 0.2         //the offset of the regl element from the edges of the 

var sel = d3.select('#graph').html('')

c = d3.conventions({
  sel,
  layers: 'sds',
  margin: { left: 0, bottom: 0, right: 0, top: 20 },
  width: 960,
  height: 800
})
c.y.domain([-1,1])
c.x.domain([0,1])

var yScale = d3.scaleLinear()
  .domain([0, 8])
  .range([.8,-.8])

/*
  Layer 1: background elements
*/
bgSVG = c.layers[0] //this is the background SVG element.

var xVals = d3.range(0,1.01,0.05); //xvals that get passed into the curve constructor

var areaConstructor = function(ylims) { //function makes the limits of the area shaders
  var bezScale = d3.scaleLinear()
    .domain([0,1])
    .range(ylims)
  var curveData = [];
  for (var i = 0; i < xVals.length; i++) {
    var val1 = xVals[i];
    var val2 = bezScale(d3.easeCubicInOut(val1));
    curveData.push({
      x: val1,
      y0: val2,
      y1: val2 + 0.1
    })
  }
  return curveData;
}

testData2 = areaConstructor([0.8,-0.2]);

testData3 = [];
var yOrigins = [0.4];
var yDests   = [0.8, 0.6, 0.4, 0.2, 0, -0.2, -0.4];
for (i = 0; i < yOrigins.length; i++) {
  for (j = i; j < yDests.length; j++) {
    testData3.push(areaConstructor([
      yOrigins[i],
      yDests[j]
      ]));
  }
}

var curveFunc = d3.area()
  .curve(d3.curveBasis)
  .x(d => c.x(d.x))
  .y1(d => c.y(d.y1))
  .y0(d => c.y(d.y0));

bgSVG.appendMany('path.bgArea',testData3)
  .attr('d',curveFunc)
  .attr('stroke','none')
  .attr('fill','#f2f2f2')
  .attr('opacity',0.3)


/*
  Layer 3: Labels for felony types
*/
fgSVG = c.layers[2]

var inlabel = fgSVG.append("svg.labeltext")
  .append("text")
  .attr("x",c.x(0.01))
  .attr("y",c.y(0.447))
  .attr("font-size","18px")
  .attr("dominant-baseline","middle")
  .text("Class 1")

var outLabelData = [];
var felonyClasses = ["M","X","1","2","3","4","A","B","C"]
for (i = 0; i < yDests.length; i++) {
  var xval     = 0.99;
  var yval     = yDests[i] + 0.047;
  var thisText = "Class ".concat(felonyClasses[i])
  outLabelData.push({
    x: xval,
    y: yval,
    text: thisText
  })
}

var outLabels = fgSVG.appendMany("svg.labeltext",outLabelData)
  .append("text")
  .attr("x",d => c.x(d.x))
  .attr("y",d => c.y(d.y))
  .text(d => d.text)
  .attr("font-size","18px")
  .attr("dominant-baseline","middle")
  .attr("text-anchor","end")

var initHeadLabel = fgSVG.append("svg.headingtext")
  .append("text")
  .attr("x",c.x(0.01))
  .attr("y",c.y(0.95))
  .text("Crime Class at Initiation")
  .attr("font-size","20px")

var endHeadLabel = fgSVG.append("svg.headingtext")
  .append("text")
  .attr("x",c.x(0.99))
  .attr("y",c.y(0.95))
  .text("Crime Class at Disposition")
  .attr("font-size","20px")
  .attr("text-anchor","end")

var monthLabel = fgSVG.append("svg.headingtext.it")
  .append("text")
  .attr("x",c.x(0.01))
  .attr("y",c.y(-0.25))
  .attr("font-size","18px")


/*
  Layer 2: Cells showing progress of cases.
*/
d3.loadData('foxx_data_2.csv','mthresh.csv', (err,res) => {
	data = res[0]

  data_filtered = data.filter(i => i.severity == 2);

	maxLength = Math.max.apply(Math,data_filtered.map(i => parseFloat(i.length))); //the length of the longest case in days
	minLength = Math.min.apply(Math,data_filtered.map(i => parseFloat(i.length))); //the length of the shortest case in days

	minRecDate  = Math.min.apply(Math,data_filtered.map(i => parseFloat(i.recDate)));  //the date (in Stata format) of the first received case.
	maxDispDate = Math.max.apply(Math,data_filtered.map(i => parseFloat(i.dispDate))); //the date (in Stata format) of the last disposed case.

	/*Create a time scale to determine how quickly points go across the screen
	 */
	var enterExitScale = d3.scaleLinear()
	  .domain([minRecDate,maxDispDate])
	  .range([0,1])

  /*Time scale to sync regl timer with d3-rendered month*/
  var timerSyncScale = d3.scaleLinear()
    .range([minRecDate,maxDispDate])
    .domain([0,totalVizLength])


	data_processed = data_filtered.map(i => {
		var m = parseFloat(i.severity)
		var q = parseFloat(i.severity_final)
 
		var entryTime        = enterExitScale(i.recDate)
		var exitTime         = enterExitScale(i.dispDate)
		var traverseDuration = exitTime - entryTime
		var s = 1 / traverseDuration

		return {
			speed: s,
			x: 0,
			y0: yScale(m),
			y1: yScale(q),
			dy: Math.random() * 0.1,
			isB: m,
			entryTime: entryTime,
			exitTime: exitTime
		}
	})

	totalCount = data_processed.length

	reglLib({onDone: run, container: c.layers[1].node()});

  monthThreshHolds = res[1];

  var monthNow = monthThreshHolds[0].mtext;
  var yearNow = monthThreshHolds[0].year;
  monthLabel.text("Date: ".concat(yearNow).concat(", ").concat(monthNow))

  var mindex = 0;
  var tm = d3.timer(function(elapsed) {
    if (regl.now() < totalVizLength && mindex+1 <= monthThreshHolds.length-1) {
      var dateNow = timerSyncScale(regl.now());
      var nextMonth = monthThreshHolds[mindex+1].thresh;
      if (dateNow > nextMonth) {
        mindex = mindex + 1;
      }
      monthNow = monthThreshHolds[mindex].mtext
      yearNow  = monthThreshHolds[mindex].year
      var stringNow = "Date: ".concat(yearNow).concat(", ").concat(monthNow)

      monthLabel.transition().text(stringNow)

    }
    if (mindex == monthThreshHolds.length) tm.stop();
  });

})

function run(err, regl) {
	if (err) return console.log(err);
	window.regl = regl;

	var drawPoints = regl({
    vert: `
      precision mediump float;
      attribute vec4 p;                                     // p = [x, y1, dy + isB, speed]. so speed is the 4th dimension.
      attribute vec2 entryExit;
      varying float c;
      uniform float interp;      
      void main() {
        float t = interp < entryExit.x ? -1.0 : (interp - entryExit.x)*p.w;
        // cubic ease
        float ct = t < 0.5                                  // is it before halfway through the x dimension?
          ? 4.0 * t * t * t                                 // if not, then y = 4t^3
          : -0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;           // if yes, then y = -0.5(2t-2)^3 - 1

        float x = mix(-1.0, 1.0, t);          // this gives the t-proportion between -1 and 1.
        float y = mix(p.x, p.y, ct);                // this gives the y-proportion between -0.8 and the destination y p.y

        gl_Position = vec4(x, y + fract(p.z), 0, 1);        // fract(p.z) is the leftover positioning
        gl_PointSize = 5.0;

        c = floor(p.z);
      }`,

    frag: `
      precision mediump float;
      varying float c;
      void main() {
        vec4 blue = vec4(0.00, 0.65, 1.00, 1);              // specifies the blue color
        vec4 orng = vec4(0.99, 0.45, .011, 1);              // specifies the orange color

		vec4 col0 = vec4(0.8,0,0.19,1);
		vec4 col1 = vec4(0.87,0.31,0.17,1);
		vec4 col2 = vec4(0.94,0.49,0.13,1);
		vec4 col3 = vec4(0.77,0.36,0.33,1);
		vec4 col4 = vec4(0.6,0.26,0.53,1);
		vec4 col5 = vec4(0.31,0.19,0.72,1);
				 
        //gl_FragColor = c == 1.0 ? col0 : col1;
        if (c == 0.0) {
        	gl_FragColor = col0;
        } else if (c == 1.0) {
        	gl_FragColor = col1;
        } else if (c == 2.0) {
        	gl_FragColor = col2;
        } else if (c == 3.0) {
        	gl_FragColor = col3;
        } else if (c == 4.0) {
        	gl_FragColor = col4;
        } else {
        	gl_FragColor = col5;
        }

      }`,

    attributes: {
    	p: function() {
    		dataVal = data_processed.map(({y0, y1, dy, isB, speed}) =>
    			[y0, y1, dy+isB, speed]
    			)

    		return dataVal;
    		},
    	entryExit: function() {
    		dataVal = data_processed.map(({entryTime,y0}) =>
    			[entryTime,y0]
    			)
    		return dataVal;
    	},
    },
    uniforms: {
      interp: (ctx, props) => props.interp,
    },
    primitive: 'point',
    count: totalCount
  })

  window.regltick = regl.frame(({ time }) => {
    drawPoints({ interp: time / totalVizLength })
  })

}
