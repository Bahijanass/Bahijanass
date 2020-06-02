window.addEventListener("load", () => {
    makeChart();
    Store();
});


async function Store() {
    const covidData = await getData();
    const database = firebase.database();
    for (let i= 0 ; i < covidData.countryList.length; i++) {
        
        const rootRef = database.ref(covidData.countryList[i]);
    
        rootRef.set({
 
            confirmed : covidData.confirmed_case_today[i],
            deaths:  covidData.death_today[i],
            recovered : covidData.recovered_until_today[i]

        });
 
    } 
 
}


async function makeChart() {
    const covidData = await getData();


    var d = new Date();
    if(d.getHours()===23 && d.getMinutes()===59){
        Store();
    }


    covidData.countryList.forEach(selectionCountry);
    covidData.countryList.forEach(selectionCountry2);
    covidData.countryList.forEach(selectionCountry3)

    function selectionCountry(country) {
        var x = document.getElementById("select");
        var option = document.createElement("option");
        option.text = country;
        x.add(option);
    }

    function selectionCountry2(country) {
        var x = document.getElementById("select2");
        var option = document.createElement("option");
        option.text = country;
        x.add(option);
    }

    function selectionCountry3(country) {
        var x = document.getElementById("select3");
        var option = document.createElement("option");
        option.text = country;
        x.add(option);
    }

    let y = $('table').find('tbody')
    for (let i= 0 ; i < covidData.countryList.length ; i++) {
        y.append(`<tr><td>${covidData.countryList[i]}</td><td>${covidData.confirmed_case_today[i]}</td><td>${covidData.death_today[i]}</td><td>${covidData.recovered_until_today[i]}</td><td>${ (covidData.confirmed_case_today[i]-covidData.recovered_until_today[i]-covidData.death_today[i])}</td></tr>`);
    }

    document.getElementById("active").innerHTML = (covidData.reported_cases_now-covidData.recovered_today-covidData.death_toll);
    document.getElementById("infected").innerHTML = covidData.reported_cases_now;
    document.getElementById("recover").innerHTML = covidData.recovered_today;
    document.getElementById("death").innerHTML = covidData.recovered_today;


var ctx = document.getElementById('myChart1').getContext('2d');
ctx.height = 500;
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: covidData.date,
        datasets: [{
            label: 'Deaths',
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            borderColor: 'red',
            data: covidData.death,
        },{
            label: 'Recovered',
            backgroundColor: 'rgba(0, 255, 0, 0.7)',
            borderColor: 'green',
            data: covidData.recovered,
        }
        ]
    },

    // Configuration options go here
    options: {
        hover: {mode: null},
        responsive: true,
        maintainAspectRatio: false,
        events:['click'],
    }

})



var ctx = document.getElementById('myChart2').getContext('2d');
ctx.height = 500;
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: covidData.date,
        datasets: [{
            label: 'Infected',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'red',
            data: covidData.confirmed,
        },{
            label: 'Active cases',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'green',
            data: covidData.active_cases,
        }
        ]
    },

    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
    }
})








var ctx = document.getElementById('myChart5').getContext('2d');
ctx.height = 500;
var chart = new Chart(ctx, {
    type: 'pie',

    // The data for our dataset
    data: {
        labels: ["confirmed","death","recovered"],
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['orange',
            'red',
            'green'                           
        ],
            data: [covidData.total_confirmed,covidData.total_recovered,covidData.total_death]
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: true,
        }
    }
    
})


 $(document).ready(function () {
    document.getElementById('select').addEventListener('change', () => {
        countryValue = document.getElementById('select').value
        const confirmed = [];
        const death = [];
        const recovered = [];
        const active = [];
        covidData.data[countryValue].forEach(function(item, index) {
            confirmed.push(item["confirmed"]);
            death.push(item["deaths"]);
            recovered.push(item["recovered"]);
            active.push(parseInt(item["confirmed"])-parseInt(item["deaths"])-parseInt(item["recovered"]));
        });
        var death_toll = death[death.length - 1];
        var recovered_today = recovered[recovered.length - 1];
        var reported_cases_now = confirmed[confirmed.length - 1];
        console.log("aaa");
        
        ///////////


        var death_toll = death[death.length - 1];
        var recovered_today = recovered[recovered.length - 1];
        var reported_cases_now = confirmed[confirmed.length - 1];


        var reported_cases_yesterday1 = confirmed[confirmed.length - 1]-confirmed[confirmed.length - 2];
        var reported_cases_yesterday2 = confirmed[confirmed.length - 13]-confirmed[confirmed.length - 14];
        var reported_cases_yesterday3 = confirmed[confirmed.length - 14]-confirmed[confirmed.length - 15];

        var R0 = (reported_cases_yesterday1/reported_cases_yesterday3);

        var predicted = Math.round(reported_cases_yesterday2*R0);

        console.log("c'est le r0: "+R0);

        //var predicted = Math.round(reported_cases_yesterday2*R0);
        console.log("c'est la prédiction: "+predicted);
        
    

        ////////////

        document.getElementById("active").innerHTML = (reported_cases_now-recovered_today-death_toll);
        document.getElementById("infected").innerHTML = reported_cases_now;
        document.getElementById("recover").innerHTML = recovered_today;
        document.getElementById("death").innerHTML = death_toll;
        document.getElementById("prediction").innerHTML = predicted;
        document.getElementById("country").innerHTML = countryValue;
        


        

        $('#myChart1').remove(); 
        $('#myChart2').remove(); 

        var ctx = document.getElementById('myChart7').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
        labels: covidData.date,
        datasets: [{
            label: 'Infected',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'red',
            data: confirmed,
        },{
            label: 'Active cases',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'green',
            data: active
        }
        ]
    },

    // Configuration options go here
    options: {
        hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
    }
})

        var ctx = document.getElementById('myChart6').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Deaths',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    data: death,
                },{
                    label: 'Recovered',
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderColor: 'green',
                    data: recovered,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })

    });













    document.getElementById('valider').addEventListener('click', () => {
        countryValue = document.getElementById('select2').value
        typevalue = document.getElementById('select4').value
        console.log(typevalue);
        const confirmed = [];
        const death = [];
        const recovered = [];
        const active = [];

        ////////////////////////
        covidData.data[countryValue].forEach(function(item, index) {
            confirmed.push(item["confirmed"]);
            death.push(item["deaths"]);
            recovered.push(item["recovered"]);
            active.push(parseInt(item["confirmed"])-parseInt(item["deaths"])-parseInt(item["recovered"]));
        });
        console.log("aaa");
        ///////////

        if(typevalue==="recovered"){
            $('#myChart8').remove(); 
            $('#myChart11').remove(); 
            $('#myChart12').remove(); 


        var ctx = document.getElementById('myChart3').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
        labels: covidData.date,
        datasets: [{
            label: 'recovered',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'green',
            data: recovered,
        }
        ]
    },

    // Configuration options go here
    options: {
        hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
    }
})

    $('#container3').append('<canvas id="myChart8"><canvas>');
    $('#container3').append('<canvas id="myChart11"><canvas>');
    $('#container3').append('<canvas id="myChart12"><canvas>');
    }


    else if(typevalue==="death"){
        $('#myChart11').remove(); 
        $('#myChart3').remove(); 
        $('#myChart12').remove(); 

        var ctx = document.getElementById('myChart8').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Deaths',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    data: death,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })


        $('#container3').append('<canvas id="myChart11"><canvas>');
        $('#container3').append('<canvas id="myChart3"><canvas>');
        $('#container3').append('<canvas id="myChart12"><canvas>');

    }


        else if(typevalue==="infected"){

            $('#myChart8').remove(); 
            $('#myChart13').remove(); 
            $('#myChart3').remove(); 

        var ctx = document.getElementById('myChart11').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Infected',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    data: confirmed,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })
        $('#container3').append('<canvas id="myChart8"><canvas>');
    $('#container3').append('<canvas id="myChart13"><canvas>');
    $('#container3').append('<canvas id="myChart3"><canvas>');

    }

        else if(typevalue==="active"){

            $('#myChart8').remove(); 
            $('#myChart11').remove(); 
            $('#myChart3').remove(); 

        var ctx = document.getElementById('myChart12').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Active Cases',
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderColor: 'green',
                    data: active,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })
        $('#container3').append('<canvas id="myChart8"><canvas>');
        $('#container3').append('<canvas id="myChart11"><canvas>');
        $('#container3').append('<canvas id="myChart3"><canvas>');

    }



    });



















    document.getElementById('valider').addEventListener('click', () => {
        countryValue = document.getElementById('select3').value
        typevalue = document.getElementById('select4').value
        const confirmed = [];
        const death = [];
        const recovered = [];
        const active = [];
        covidData.data[countryValue].forEach(function(item, index) {
            confirmed.push(item["confirmed"]);
            death.push(item["deaths"]);
            recovered.push(item["recovered"]);
            active.push(parseInt(item["confirmed"])-parseInt(item["deaths"])-parseInt(item["recovered"]));
        });
        var death_toll = death[death.length - 1];
        var recovered_today = recovered[recovered.length - 1];
        var reported_cases_now = confirmed[confirmed.length - 1];
        console.log("aaa");
        ///////////


        

        if(typevalue==="recovered"){

            $('#myChart9').remove(); 
            $('#myChart15').remove(); 
            $('#myChart14').remove(); 

        var ctx = document.getElementById('myChart4').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
        labels: covidData.date,
        datasets: [{
            label: 'recovered',
            backgroundColor: 'rgba(0, 255, 0, 0.5)',
            borderColor: 'green',
            data: recovered,
        }
        ]
    },

    // Configuration options go here
    options: {
        hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
    }
})

$('#container4').append('<canvas id="myChart9"><canvas>');
$('#container4').append('<canvas id="myChart15"><canvas>');
$('#container4').append('<canvas id="myChart14"><canvas>');
        }


        else if(typevalue==="death"){

        $('#myChart4').remove(); 
        $('#myChart15').remove(); 
        $('#myChart14').remove(); 

        var ctx = document.getElementById('myChart9').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Deaths',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    data: death,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })

        $('#container4').append('<canvas id="myChart4"><canvas>');
$('#container4').append('<canvas id="myChart15"><canvas>');
$('#container4').append('<canvas id="myChart14"><canvas>');

    }


        
    else if(typevalue==="infected"){

        $('#myChart9').remove(); 
        $('#myChart4').remove(); 
        $('#myChart14').remove(); 



        var ctx = document.getElementById('myChart15').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Infected',
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'red',
                    data: confirmed
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })

        $('#container4').append('<canvas id="myChart9"><canvas>');
$('#container4').append('<canvas id="myChart4"><canvas>');
$('#container4').append('<canvas id="myChart14"><canvas>');


    }


    else if(typevalue==="active"){

        $('#myChart4').remove(); 
        $('#myChart9').remove(); 
        $('#myChart15').remove(); 

        var ctx = document.getElementById('myChart14').getContext('2d');
        ctx.height = 500;
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',
        
            // The data for our dataset
            data: {
                labels: covidData.date,
                datasets: [{
                    label: 'Active Cases',
                    backgroundColor: 'rgba(0, 255, 0, 0.5)',
                    borderColor: 'green',
                    data: active,
                }
                ]
            },
        
            // Configuration options go here
            options: {
                hover: {mode: null},
                responsive: true,
                maintainAspectRatio: false,
                events:['click'],
            }
        })
        $('#container4').append('<canvas id="myChart9"><canvas>');
$('#container4').append('<canvas id="myChart4"><canvas>');
$('#container4').append('<canvas id="myChart15"><canvas>');
        
    }

    });

    


        
    });

}











async function getData() {
    let response = await fetch(
        "https://pomber.github.io/covid19/timeseries.json"
    );
    let data = await response.json();
    const labels = Object.keys(data);
    const date = [];
    const confirmed = [];
    const death = [];
    const recovered = [];
    const confirmed_case_today = []
    const death_today = []
    const recovered_until_today = []
    const active_cases = []

    var total_death =0 ;
    var total_recovered =0 ;
    var total_confirmed =0 ;
    
    data['Afghanistan'].forEach(function(item, index) {
        date.push(item["date"]);
        confirmed.push(item["confirmed"]);
        death.push(item["deaths"]);
        recovered.push(item["recovered"]);
        active_cases.push(parseInt(item["confirmed"])-parseInt(item["deaths"])-parseInt(item["recovered"]));
    });
    var death_toll = death[death.length - 1];
    var recovered_today = recovered[recovered.length - 1];
    var reported_cases_now = confirmed[confirmed.length - 1];
    var countryList = Object.keys(data);
    


    countryList.forEach(function(country,index) {
        confirmed_case_today.push(data[country][data[country].length - 1]['confirmed'])
        death_today.push(data[country][data[country].length - 1]['deaths'])
        recovered_until_today.push(data[country][data[country].length - 1]['recovered'])
    })

    const newArr = [countryList, confirmed_case_today,death_today, recovered_until_today]

    for(var i=0;i<confirmed_case_today.length;i++){
        total_death += death_today[i];
        total_recovered +=  recovered_until_today[i];
        total_confirmed += confirmed_case_today[i];
    }



    console.log(active_cases);

    return {
        countryList,
        data,
        date,
        confirmed,
        death,
        recovered,
        death_toll,
        recovered_today,
        reported_cases_now,
        confirmed_case_today,
        death_today, 
        recovered_until_today,
        total_death,
        total_recovered,
        total_confirmed,
        active_cases
    };
}

