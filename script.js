
let expenses = [];
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const xScale = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1);
const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
const xAxisGroup = chartGroup.append("g")
  .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);

const yAxisGroup = chartGroup.append("g");
function updateChart(data) {

  xScale.domain(data.map(d => d.name));
  yScale.domain([0, d3.max(data, d => d.amount)]);

 
  const bars = chartGroup.selectAll('rect').data(data);

  bars.enter()
    .append('rect')
    .attr('x', d => xScale(d.name))
    .attr('y', d => yScale(d.amount))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - margin.top - margin.bottom - yScale(d.amount))
    .attr('fill', 'steelblue')
    .merge(bars)
    .transition()
    .duration(500)
    .attr('y', d => yScale(d.amount))
    .attr('height', d => height - margin.top - margin.bottom - yScale(d.amount));


  bars.exit().remove();
  xAxisGroup.call(d3.axisBottom(xScale));
  yAxisGroup.call(d3.axisLeft(yScale));
}

document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();  
  
  const name = document.getElementById('expense-name').value;
  const amount = +document.getElementById('expense-amount').value;

  expenses.push({ name, amount });

  updateChart(expenses);

  document.getElementById('expense-name').value = '';
  document.getElementById('expense-amount').value = '';
});
