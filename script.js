// Initialize an empty array to store the expenses
let expenses = [];

// Select the SVG element for the chart
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

// Set margins, scales, and axes
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const xScale = d3.scaleBand().range([0, width - margin.left - margin.right]).padding(0.1);
const yScale = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add X-axis and Y-axis
const xAxisGroup = chartGroup.append("g")
  .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);

const yAxisGroup = chartGroup.append("g");

// Function to update the chart with the new data
function updateChart(data) {
  // Update the scales
  xScale.domain(data.map(d => d.name));
  yScale.domain([0, d3.max(data, d => d.amount)]);

  // Bind data to the bars
  const bars = chartGroup.selectAll('rect').data(data);

  // Enter new bars
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

  // Exit old bars
  bars.exit().remove();

  // Update the axes
  xAxisGroup.call(d3.axisBottom(xScale));
  yAxisGroup.call(d3.axisLeft(yScale));
}

// Handle form submission to add a new expense
document.getElementById('expense-form').addEventListener('submit', function(e) {
  e.preventDefault();  // Prevent the form from refreshing the page
  
  const name = document.getElementById('expense-name').value;
  const amount = +document.getElementById('expense-amount').value;

  // Add the new expense to the expenses array
  expenses.push({ name, amount });

  // Update the chart with the new expense
  updateChart(expenses);

  // Clear the input fields after submission
  document.getElementById('expense-name').value = '';
  document.getElementById('expense-amount').value = '';
});
