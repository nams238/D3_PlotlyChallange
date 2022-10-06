const url = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;


// Promise pending
//const dataPromise = d3.json(url);
//console.log("Data Promise: ", dataPromise);

//d3.json(url).then(function(data) {
    //console.log(data)
//});

function init() {
    var dropdown = d3.select("#selDataset");
    d3.json(url).then(function(IDs) {
        var IDs = IDs.names;
        IDs.forEach((id) =>{
            dropdown
            .append("option")
            .text(id)
            .property("value", id);
        });
    var firstID = IDs[0];

    buildDemos(firstID);
    buildPlots(firstID);
    });
};

function buildDemos(ID) {
    d3.json(url).then(function(data) {
        var metadata = data.metadata;
        var filterDemo = metadata.filter(metadataID => metadataID.id == ID)[0];
        d3.select('#sample-metadata').html('');

        Object.entries(filterDemo).forEach(([key, value]) => {
            d3.select('#sample-metadata')
            .append('p').text(`${key}: ${value}`);
        });
    });
};
        //console.log(metadata)

function buildPlots(ID) {
    d3.json(url).then(function(plotData) {
        var samplePlot = plotData.samples.filter(plotID => plotID.id == ID)[0];

        var sliceIds = samplePlot.otu_ids.slice(0,10).map(id => "OTU"+ id.toString());
        var sliceLabels = samplePlot.otu_labels.slice(0,10);
        var sliceValues = samplePlot.sample_values.slice(0,10);
         
        //console.log(sliceValues)

        //Bar Chart
        var trace1 = {
            type: 'bar',
            x: sliceValues.reverse(),
            y: sliceIds.reverse(),
            text: sliceLabels.reverse(),
            orientation: "h"
        
        };
        var traceData = [trace1];

        var layout = {
            title: 'Top 10 Microbes Found',
            margin: {
                l: 100,
                r: 100,
                t: 0,
                b: 100
            }
        };
        Plotly.newPlot('plot', traceData, layout)

        //Bubble Chart
        var otu_IDs = samplePlot.otu_ids.slice(0,10)

        var trace2 = {
            type: 'bubble',
            x: otu_IDs,
            y: sliceValues,
            mode: 'markers',
            marker: {
                color: otu_IDs,
                size: sliceValues
            },
            text: sliceLabels
        };
        var bubbleData = [trace2];

        var bubbleLayout = {
            showlegend: false,
            x: 'OTU ID',
            pointStyle: 'circle'
        };

        Plotly.newPlot('bubble', bubbleData, bubbleLayout )
    });
};
function optionChanged(newID) {
    buildDemos(newID);
    buildPlots(newID);
};

init();