import React from 'react';
import parseColour from 'parse-color';
import ReactHighcharts from 'react-highcharts';
const HighchartsMore = require('highcharts-more')(ReactHighcharts.Highcharts);

console.log('ffs', parseColour('red').rgb);

const formatDate = (date, tiny = false) => tiny ? `${date.getDate()}/${date.getMonth() + 1}` : `${date.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${date.getFullYear()}`;

const setColourOpacity = (colour, opacity) => `rgba(${parseColour(colour).rgb.join(', ')}, ${opacity})`;

const getColourScheme = baseColour => ({
    color: setColourOpacity(baseColour, 0.6),
    marker: {
        fillColor: setColourOpacity(baseColour, 1.0),
        symbol: 'circle'
    }
});

const getConfig = data => ({
	chart: {
	},
	
	title: {
		text: null,
	},
	
	credits: {
		enabled: false,
	},
	
	xAxis: {		
		type: 'category'
	},

	yAxis: {
		title: {
			text: 'Cases'
		},
		min: 0,
		max: Math.max(1000, ...data.map(( { confirmed }) => confirmed)),
	},
	
	legend: {
		layout: 'horizontal',
		align: 'center',
		verticalAlign: 'bottom'
	},

	plotOptions: {
		series: {
			label: {
				connectorAllowed: false
			},
		}
	},

	series: [
		{
            name: 'Confirmed cases',
            data:  data.map(({ date, confirmed }) => [ formatDate(new Date(date)), confirmed ]),
            ...getColourScheme('royalblue'),
        },
        {
            name: 'Deaths',
            data:  data.map(({ date, deaths }) => [ formatDate(new Date(date)), deaths ]),
            lineWidth: 1,
            ...getColourScheme('red'),
        },
        {
            name: 'Recovered',
            data:  data.map(({ date, recovered }) => [ formatDate(new Date(date)), recovered ]),
            lineWidth: 1,
            ...getColourScheme('green'),
        }
	],

	responsive: {
		rules: [{
			condition: {
				maxWidth: 740,
			},
			chartOptions: {
				legend: {
					layout: 'vertical',
					align: 'center',
					verticalAlign: 'bottom'
				}
			}
		}]
	}
});

function Chart({ countryData }) {
    return <ReactHighcharts
        config={getConfig(countryData)}
    />;
}

export default Chart;