// Plan

// init function 
// 1) Fill out dropdown with all of the ids
// 2) Calls a buildPage function that draws the chart and the panel for the first one

// buildPage function 
// 1) That takes one parameter, which is the subject ID
// 2) Draws our plotly charts and fills the panel

// Need an event listener for the dropdown
// optionChanged function
// - That takes as a parameter the user selection
// This function is called when a dropdown menu item is selected


// My code __________________________________________________________________________________________

function updatePlotly() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataset = dropdownMenu.property("value");

  // Initialize x and y arrays
  var x = [];
  var y = [];

  if (dataset === 'dataset1') {
    x = [1, 2, 3, 4, 5];
    y = [1, 2, 4, 8, 16];
  }

  if (dataset === 'dataset2') {
    x = [10, 20, 30, 40, 50];
    y = [1, 10, 100, 1000, 10000];
  }

  // Note the extra brackets around 'x' and 'y'
  Plotly.restyle("plot", "x", [x]);
  Plotly.restyle("plot", "y", [y]);
}

// init();
// My code __________________________________________________________________________________________




function buildPage(subject){

  d3.json("samples.json").then((data) => {

    console.log(subject);
    meta = data.metadata.filter(testid =>{ return testid["id"] == subject})[0]
    samples = data.samples.filter(testid =>{ return testid["id"] == subject})[0]
    console.log(samples)

    // Filter data.samples based on subject
    // The array that you get back you are interested in [0]

    // Use dot notation to get at .otu_ids, .otu_labels, .otu_sample_values
    // Use slice for the horizontal bar chart

    // Plotly charts
    // Horizonatal bar chart- orientation: "h"


    // Panel
    // Filter data.metadata based on subject
    // The array that you get back you are interested in [0]

    var panel = d3.select("#metadataTbl");
    panel.selectAll("tbody").remove();
    var tbodyRef = panel.append("tbody");

    Object.entries(meta).forEach((row) => {
      

                var tr = tbodyRef.append("tr") 
        
                row.forEach(
                    function(cell)
                    {
                        
                        var td = tr.append("td");
                        td.text(cell);
                    }
                )
        
      });

      // Lets build the bar chart
      // slice the top 10
      var otuids = samples.otu_ids.slice(0,10).map(x => {return "OTU "+x}).reverse()
      var otulbls = samples.otu_labels.slice(0,10).reverse()
      var sample_values = samples.sample_values.slice(0,10).reverse()

      var data = [{
        type: 'bar',
        x: sample_values,
        y: otuids,
        orientation: 'h',
        text: otulbls
      }];
      
      Plotly.newPlot('bar', data);



      // Lets build the sactter plot chart


      
      // No need to slice the top 10 for a scatter plot
      var otuids = samples.otu_ids   //(0,10).map(x => {return "OTU "+x}).reverse()
      var otulbls = samples.otu_labels   //(0,10).reverse()
      var sample_values = samples.sample_values //(0,10).reverse()

      var trace1 = {
        x: otuids,
        y: sample_values,
        mode: 'markers',
        marker: {size: sample_values, colorscale: 'YlGnBu', color: otuids, },
        type: 'scatter',

        
      };



      var data = [trace1];
      
      Plotly.newPlot('bubble', data);

  })
}


function init() {

  // Fill dropdown with IDs
  // Get firstOne id and call buildPage with that id

  d3.json("samples.json").then((data) => {

    var selector = d3.select("#selDataset");

    console.log(data);

    data.names.forEach((ids) => {
      selector
        .append("option")
        .text(ids)
        .property("value", ids)
    })

    firstOne = data.names[0];

    buildPage(firstOne);

  })
}

function optionChanged(selection) {

  buildPage(selection);
}


init()


