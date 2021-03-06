const stateIconOutlineText = document.querySelectorAll(`.state-icon-outline-3`);

function countUpBHCondition() {
  let bhServicesPercent = parseFloat(stateIconOutlineText[0].textContent);
  if (bhServicesPercent !== 54) {
    stateIconOutlineText[0].textContent = bhServicesPercent + 1 + "%";
  } else {
    window.clearInterval(countUpBHCondition);
  }
}

const outlineIcon = document.querySelector(`.state-icon-outline-svg-container`);

const animateOptions = {
  root: null,
  threshold: 0,
  rootMargin: "-300px 0px 0px 200px",
};

const onIntersection = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      if (entry.target === outlineIcon) {
        let stateIconOutlineSVGContainerRect = document.querySelector(
          `.state-icon-outline-svg-container rect`
        );
        stateIconOutlineSVGContainerRect.classList.add("rect-cover-animation");
        setInterval(countUpBHCondition, 30);
      }
    }
  });
};

const observer = new IntersectionObserver(onIntersection, animateOptions);
observer.observe(outlineIcon);

//line chart

const width = 600,
  height = 250;
const margin = { left: 45, right: 0, top: 10, bottom: 20 };

//line chart data

const firstGroupData = [
  { date: "April 23-May 26", rate: 28 },
  { date: "May 28-June 23", rate: 44 },
  { date: "June 25-July 21", rate: 47 },
];

const secondGroupData = [
  { date: "April 23-May 26", rate: 21 },
  { date: "May 28-June 23", rate: 39 },
  { date: "June 25-July 21", rate: 47 },
];

const thirdGroupData = [
  { date: "April 23-May 26", rate: 18 },
  { date: "May 28-June 23", rate: 36 },
  { date: "June 25-July 21", rate: 38 },
];

const fourthGroupData = [
  { date: "April 23-May 26", rate: 18 },
  { date: "May 28-June 23", rate: 35 },
  { date: "June 25-July 21", rate: 43 },
];

const fifthGroupData = [
  { date: "April 23-May 26", rate: 11 },
  { date: "May 28-June 23", rate: 31 },
  { date: "June 25-July 21", rate: 26 },
];

const lineChartColors = ["#0099cd", "#8da7f6", "#f1afff", "#ff5fa6", "#ea0029"];

lineChartColors.reverse()

const lineChartLegendLabels = [
  "18 to 24",
  "25 to 34",
  "35 to 54",
  "55 to 64",
  "65 and older",
];

const xScale = d3
  .scaleBand()
  .range([0, width])
  .domain(
    firstGroupData.map((d) => {
      return d.date;
    })
  );

const yScale = d3
  .scaleLinear()
  .rangeRound([height, 0])
  .domain([
    d3.min(fifthGroupData, (d) => d.rate) - 5,
    d3.max(firstGroupData, (d) => d.rate) + 10,
  ]);

let drawLine = d3
  .line()
  .x((d) => {
    return xScale(d.date) + xScale.bandwidth() / 2;
  })
  .y((d) => {
    return yScale(d.rate);
  })
  .curve(d3.curveLinear);

const lineChartSVG = d3
  .select(".line-chart-wrapper svg")
  .attr("width", width + margin.right + margin.left)
  .attr("height", height + margin.top + margin.bottom);

const xAxis = lineChartSVG
  .append("g")
  .attr("transform", `translate(${margin.left},${height})`)
  .attr("class", "x-axis")
  .call(d3.axisBottom(xScale).tickSizeOuter(0));

const yAxis = lineChartSVG
  .append("g")
  .attr("class", "y-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(yScale).tickFormat((d) => d + "%").ticks(5));

let applyChart = (data, name, colorIndex) => {
  lineChartSVG
    .append("g")
    .attr("class", `${name}-line-chart`)
    .append("path")
    .attr("d", drawLine(data))
    .attr("transform", `translate(${margin.left}, 0)`)
    .style("fill", "none")
    .attr("stroke", lineChartColors[colorIndex])
    .style("stroke-width", "3px");
};

applyChart(secondGroupData, "second-group", 1);
applyChart(thirdGroupData, "third-group", 2);
applyChart(fourthGroupData, "fourth-group", 3);
applyChart(fifthGroupData, "fifth-group", 4);
applyChart(firstGroupData, "first-group", 0);
//function to create the dots for the chart
let applyDots = (data, name, index, r = 7) => {
  lineChartSVG
    .append("g")
    .attr("class", `${name}-dots`)
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => {
      return xScale(d.date) + xScale.bandwidth() / 2;
    })
    .attr("cy", (d) => {
      return yScale(d.rate);
    })
    .attr("r", r)
    .attr("transform", `translate(${margin.left},0)`)
    .attr("data-percent", (d) => {
      return d.rate + "%";
    })
    .attr("data-year", (d) => {
      return d.date;
    })
    .style("fill", lineChartColors[index]);

  let lineChartDots = document.querySelectorAll(`.${name}-dots circle`);
  for (let i = 0; i < lineChartDots.length; i++) {
    lineChartDots[i].dataset.age = lineChartLegendLabels[index];
    let tooltip = document.querySelector(".line-chart-wrapper .tooltip");
    lineChartDots[i].addEventListener("mouseenter", (event) => {
      event.target.style.strokeWidth = "3px"
      event.target.style.stroke = event.target.style.fill
      tooltip.style.display = "block";
      tooltip.style.opacity = 1;
      tooltip.style.left = `${event.clientX}px`;
      tooltip.style.top = `${event.clientY * 1.1}px`;
      tooltip.innerHTML = `<div class="tooltip-interior">
                            <div>
                              <i style="background-color:${event.target.style.fill}"></i>
                            </div> 
                            <div>
                              <p>Age Range: ${event.target.dataset.age}</p>
                              <p>Date Range: ${event.target.dataset.year}</p>
                              <p>Percent Reported: ${event.target.dataset.percent}<p>
                            </div>
                          </div>`;
    });
    lineChartDots[i].addEventListener("mouseleave", (event) => {
      tooltip.style.display = "none";
      tooltip.style.opacity = 0;
      event.target.style.strokeWidth = null;
      event.target.style.stroke = null;
    });
  }
};

applyDots(secondGroupData, "second-group", 1);
applyDots(thirdGroupData, "third-group", 2);
applyDots(fourthGroupData, "fourth-group", 3);
applyDots(fifthGroupData, "fifth-group", 4);
applyDots(firstGroupData, "first-group", 0, 10);

const applyLabels = (data, name, colorIndex) => {
  let labels = lineChartSVG
    .append("g")
    .attr("class", `${name}-labels`)
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text((d) => {
      return d.rate + "%";
    })
    .attr("x", (d) => {
      return xScale(d.date) + xScale.bandwidth() / 2 + 20;
    })
    .attr("y", (d) => {
      return yScale(d.rate) - 17;
    })
    .style("fill", lineChartColors[colorIndex])
    .attr("text-anchor", "middle")
    .style("font-size", "20px");
};

applyLabels(firstGroupData, "first-group", 0);

//adding legend colors and labels to the line chart legend

const lineChartIcons = document.querySelectorAll(
  ".line-chart-wrapper .legend-wrapper i"
);
const lineChartLegendText = document.querySelectorAll(
  ".line-chart-wrapper .legend-wrapper span"
);
for (let i = 0; i < lineChartIcons.length; i++) {
  lineChartIcons[i].style.backgroundColor = lineChartColors[i];
  lineChartLegendText[i].textContent = lineChartLegendLabels[i];
}


//js for the pull quotes textContent 

pullQuotesArray = ["Americans stand at a precipice, with many of the federal COVID relief benefits having expired at the end of July.",
"Without additional financial support, even more families and their children will suffer the psychological and emotional harms of economic distress, on top of anxieties related to isolation, loss of loved ones, and widespread uncertainty.",
"Only by investing in children now can we avoid the long-term repercussions of trauma and unmet mental health needs.",
"New flexibilities to provide telehealth services have been a lifeline for many children and families, allowing them to stay connected to the critical health and behavioral health supports they need.",
"New York cannot afford to be short-sighted by scaling back on existing school-based behavioral health resources; in fact, now is the time to invest more in the student supports so they can thrive social emotionally and academically."]

let pullQuotes = document.querySelectorAll('.pull-quote p')
for (let i =0;i<pullQuotes.length;i++){
  pullQuotes[i].textContent = pullQuotesArray[i]
}