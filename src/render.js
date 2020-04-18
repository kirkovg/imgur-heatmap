import {
  range, scaleQuantize, select, timeDays, timeFormat
} from 'd3';
import * as $ from 'jquery';

const cellSize = 14;
const width = 900;
const height = 110;

const renderLegend = () => {
  select('#heatmap-chart').selectAll('svg.legend')
    .enter()
    .append('svg')
    .data([1])
    .enter()
    .append('svg')
    .attr('width', 800)
    .attr('height', 20)
    .append('g')
    .attr('transform', 'translate(644,0)')
    .selectAll('.legend-grid')
    .data(() => range(7))
    .enter()
    .append('rect')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', d => d * cellSize + 35)
    .attr('class', d => `day color${d - 1}`);
};

const renderXAxis = () => {
  // Render x axis to show months
  select('#heatmap-months').selectAll('svg.months')
    .enter()
    .append('svg')
    .data([1])
    .enter()
    .append('svg')
    .attr('width', 800)
    .attr('height', 20)
    .append('g')
    .attr('transform', 'translate(0,10)')
    .selectAll('.month')
    .data(() => range(12))
    .enter()
    .append('text')
    .attr('x', d => d * (4.5 * cellSize) + 35)
    .text(d => timeFormat('%b')(new Date(0, d + 1, 0)));
};

const renderActivityData = (rect, formatColor, dates) => {
  rect.selectAll('.day')
    .data(d => timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)))
    .enter()
    .append('rect')
    .attr('class', 'day')
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('x', d => timeFormat('%U')(d) * cellSize)
    .attr('y', d => d.getDay() * cellSize)
    .attr('data-toggle', 'tooltip')
    .datum(timeFormat('%Y-%m-%d'))
    .attr('title', d => {
      const countData = dates[d];
      const date = timeFormat('%b %d, %Y')(new Date(d));
      if (!countData || !countData.count) {
        return `No comments on ${date}`;
      } if (countData.count === 1) {
        return `1 comment on ${date}`;
      }
      return `${countData.count} comments on ${date}`;
    })
    .attr('date', d => d)
    .call(() => $('[data-toggle="tooltip"]').tooltip({
      container: 'body',
      placement: 'top',
      position: { my: 'top' }
    }))
    .filter(d => Object.keys(dates).indexOf(d) > -1)
    .attr('class', d => `${'day'} ${formatColor(dates[d].count)}`);
};

const renderContainer = (startDate) => {
  const yearFormat = timeFormat('%Y');
  const startYear = yearFormat(startDate);
  const endYear = Number(yearFormat(new Date())) + 1;


  const svg = select('#heatmap-legend').selectAll('svg.heatmap')
    .enter()
    .append('svg')
    .data(range(startYear, endYear))
    .enter()
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'color');

  const rect = svg.append('g')
    .attr('transform', `translate(${35},0)`);

  rect.append('text')
    .attr('transform', `translate(-9,${cellSize * 3.5})rotate(-90)`)
    .style('text-anchor', 'middle')
    .text(d => d);

  return rect;
};

const getFormatColor = (maxCount) => scaleQuantize()
  .domain([0, maxCount])
  .range(range(6)
    .map(d => `color${d}`));

const transformData = (data) => {
  let oldestDatetime = new Date();
  let maxCount = 0;
  const dateTable = {};
  data.forEach(entity => {
    const convertedDateTime = new Date(entity.datetime * 1000);
    oldestDatetime = Math.min(oldestDatetime, convertedDateTime);
    const formattedDate = timeFormat('%Y-%m-%d')(convertedDateTime);
    if (dateTable[formattedDate]) {
      dateTable[formattedDate].count += 1;
    } else {
      dateTable[formattedDate] = { count: 1 };
    }

    maxCount = Math.max(maxCount, dateTable[formattedDate].count);
  });

  return {
    startDate: new Date(oldestDatetime),
    dates: dateTable,
    maxCount
  };
};

const renderHeatMap = (data) => {
  const { startDate, dates, maxCount } = transformData(data);
  const formatColor = getFormatColor(maxCount);
  const rect = renderContainer(startDate);
  renderActivityData(rect, formatColor, dates);
  renderXAxis();
  renderLegend();
};


const renderErrorMessage = (data) => {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.innerText = data;
  errorMessage.style.color = 'red';
  errorMessage.style.display = 'inline';
};

const cleanOldRenderedData = () => {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';
  errorMessage.innerText = '';

  document.getElementById('heatmap-chart').innerHTML = '';
  document.getElementById('heatmap-legend').innerHTML = '';
  document.getElementById('heatmap-months').innerHTML = '';
};


export default (data) => {
  cleanOldRenderedData();
  if (typeof data === 'string') {
    renderErrorMessage(data);
    return;
  }

  renderHeatMap(data);
};
