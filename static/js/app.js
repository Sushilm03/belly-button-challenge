// define constant variable for url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Fetch JSON data and log it in the console
d3.json(url).then(function(data) {
  console.log(data);
});

// Initialize the dashboard 
function init() {

    // Select the dropdown
    let dropdownMenu = d3.select("#selDataset");

    // Get sample names and populate the dropdown values
    d3.json(url).then((data) => {
        
        // Set a variable for sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log values to the console
            console.log(id);

            dropdownMenu.append("option")
            .text(id)
            .property("value",id);
        });

        // Set the first sample
        let first_sample = names[0];

        // Log value to the console
        console.log(first_sample);

        // Functions using first sample
        funcMetadata(first_sample);
        funcBarChart(first_sample);
        funcBubbleChart(first_sample);
        funcGaugeChart(first_sample);

    });
};

// Function for metadata
function funcMetadata(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {

        // Retrieve metadata
        let metadata = data.metadata;

        // Filter based on sample value
        let value = metadata.filter(result => result.id == sample);

        // Log value to the console
        console.log(value)

        // Retrieve first array value
        let first_value = value[0];

        // Reset metadata
        d3.select("#sample-metadata").html("");

        // Add key/value pairs
        Object.entries(first_value).forEach(([key,value]) => {

            // Log value to the console
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// Function for bar chart
function funcBarChart(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {

        // Retrieve sample data
        let sample_data = data.samples;

        // Filter based on sample data
        let value = sample_data.filter(result => result.id == sample);

        // Retrieve the first array value
        let first_value = value[0];

        // Retrieve otu_ids, lables, and sample values
        let otu_ids = first_value.otu_ids;
        let otu_labels = first_value.otu_labels;
        let sample_values = first_value.sample_values;

        // Log value to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Retrieve top ten in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up trace for bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup layout
        let layout = {
            title: "Bar Chart for the top 10 OTU_IDs"
        };

        // Use Plotly to plot bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function for bubble chart
function funcBubbleChart(sample) {

    // Retrieve all data
    d3.json(url).then((data) => {
        
        // Retrieve sample data
        let sample_data = data.samples;

        // Filter based sample value
        let value = sample_data.filter(result => result.id == sample);

        // Get the first array value
        let first_value = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = first_value.otu_ids;
        let otu_labels = first_value.otu_labels;
        let sample_values = first_value.sample_values;

        // Log value to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up trace for bubble chart
        let traceb = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up layout
        let layout = {
            title: "Bacteria/Sample",
            hovermode: "closest",
            xaxis: {title: "OTU_ID"},
        };

        // Use Plotly to plot bubble chart
        Plotly.newPlot("bubble", [traceb], layout)
    });
};

// Function for dashboard updates
function samplechange(value) { 

    // Log value to the console
    console.log(value); 

    // Call all functions 
    funcMetadata(value);
    funcBarChart(value);
    funcBubbleChart(value);
    funcGaugeChart(value);
};

// Call the initialize function
init();
