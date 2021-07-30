const begYear = 2000;
const finYear = 2019;
const totalNoOfCountriesToLoad = 400;

const margin = {top: 20, right: 120, bottom: 50, left: 50},
    svgWidth = 900,
    svgHeight = 600,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y");

var floatFormatValue = d3.format(".3n");

const type = {
    TOTAL: 0,
    MAHLE: 1,
    FEMAHLE: 2
}

const colors = ["blue",
"orange",
"black",
"lightgray",
"blue",
"green",
"magenta",
"yellow",
"gray"];

const chart = d3.select('#chart')
    .attr("width", svgWidth)
    .attr("height", svgHeight)

const innerChart = chart.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear().range([0,width]);
var yScale = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

var valueline = d3.line()
    .x(function(d){ return xScale(d.date);})
    .y(function(d){ return yScale(d.value);})
    .curve(d3.curveLinear);

var g = innerChart

    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

$('.close').click(function() {
    $('.alert').hide();
})

$('.alert').hide();

$("#nxtscene2").click(function() {

    innerChart.selectAll("g").remove();
    hide('#scene1');
    show('#scene2');
    draw("USA", false, 0);
    draw("USA", false, 1);
    draw("USA", false, 2);
})

$("#nxtscene3").click(function() {

    innerChart.selectAll("g").remove();
    hide('#scene2');
    show('#scene3');
    draw("RUS", false, 0);
    draw("RUS", false, 1);
    draw("RUS", false, 2);

})

$("#nxtscene4").click(function() {

    innerChart.selectAll("g").remove();
    hide('#scene3');
    show('#scene4');
    draw("IND", false, 0);
    draw("IND", false, 1);
    draw("IND", false, 2);
})

$("#nxtscene5").click(function() {

    innerChart.selectAll("g").remove();
    hide('#scene4');
    getNations(appendnations);
    show('#scene5');
    draw("WLD", true, 0);
    draw("USA", true, 0);
    draw("IND", true, 0);
    draw("RUS", true, 0);

})

$("#startover").click(function() {
    innerChart.selectAll("g").remove();
    hide("#scene5");
    hide("#country");

    show("#scene1");
    draw("WLD", false, 0);
    draw("WLD", false, 1);
    draw("WLD", false, 2);
})

$("input[name='type']").click(function() {
    draw('WLD', $('input:radio[name=type]:checked').val());
})


function get(){
    d3.json("https://api.worldbank.org/v2/country/all/indicator/SL.EMP.WORK.ZS?format=json&per_page=60&date=" + begYear + ":" + finYear).then(function(d){
        console.log(d);
    });
}

function getNations(callback){
    if (typeof callback !== "function") throw new Error("Wrong callback in getNations");

    d3.json("https://api.worldbank.org/v2/country?format=json&per_page=" + totalNoOfCountriesToLoad).then(callback);
}

function getempbycc(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.ZS?format=json&per_page=60&date=" + begYear + ":" + finYear)
        .then(callback);
}
function getFemalempbycc(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.FE.ZS?format=json&per_page=60&date=" + begYear + ":" + finYear)
        .then(callback);
}
function getmalempbycc(countryCode, callback){
    d3.json("https://api.worldbank.org/v2/country/" + countryCode + "/indicator/SL.EMP.WORK.MA.ZS?format=json&per_page=60&date=" + begYear + ":" + finYear)
        .then(callback);
}


function getEmploymentByCountryCode(countryCode, type, callback){
    if (type == "male"){
        getmalempbycc(countryCode, callback);
    }
    else if (type == "female"){
        getFemalempbycc(countryCode, callback);
    }
    else if (type == "total"){
        getempbycc(countryCode, callback);
    }
    else {
        console.error("no proper type", type);
    }
}
function debug(d){
    console.log(" geted:", d);
}

function draw(countryCode, countrylabel, type) {
    console.log("nation:", countryCode);

    if (type == 0){
        getEmploymentByCountryCode(countryCode, "total", drawChart(countryCode, countrylabel, "green"));
    }
    else if (type == 1){
        getEmploymentByCountryCode(countryCode, "male", drawChart(countryCode, countrylabel, "blue"));
    }
    else if (type == 2){
        getEmploymentByCountryCode(countryCode, "female", drawChart(countryCode, countrylabel, "magenta"));
    }
    else {
        console.log("mishtake:", type);
    }
}

function drawChart(countryCode, countrylabel, color){

    console.log("muh me lele", color);

    return function(data){

        console.log("jalash na", data[1]);
        if (data == null || data[1] == null){
            $('.alert').show();
            return;
        }

        xScale.domain(d3.extent(data[1], function(d) { return d.date; }));
        yScale.domain([0, 100]);

        console.log("jalash na");
        innerChart
            .append('g')
            .attr('transform', "translate(0," + height + ")")
            .call(xAxis);

        innerChart
            .append("text")
            .attr("transform",
                "translate(" + (width/2) + " ," +
                                (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("year");

        console.log("jalash na");

        innerChart
            .append('g')
            .call(yAxis)
            .attr("y", 6);

        innerChart
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("percentage");


        console.log("jalash na");

        tip = d3.tip().attr('class', 'd3-tip').offset([-5, 5]).html(function(d) {
            return "<strong style='color:" + color + "'>" + countryCode + " " + floatFormatValue(d.value)  + "</strong>";
        });

        var path = innerChart.append("g").append("path")
        .attr("width", width).attr("height",height)
        .datum(data[1].map( (d, i) => {
            console.log("path : date", d.date, "value", d.value);
            return {
                date : d.date,
                value : d.value
            };
        }
        ))
        .attr("class", "line")
        .attr("d", valueline)
        .style("stroke", color);

        innerChart.append("g").selectAll(".dot")
            .attr("width", width).attr("height",height)
            .data(data[1])
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) { return xScale(d.date) })
            .attr("cy", function(d) { return yScale(d.value) })
            .attr("r", 3)
            .call(tip)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

        if (countrylabel == true){
            innerChart.selectAll().data(data[1]).enter().append("g").append("text")
            .attr("transform", "translate(" + (width - 20) + "," + yScale(data[1][data[1].length - 1].value) + ")")
            .attr("dy", ".15em")
            .attr("text-anchor", "start")
            .style("fill", color)
            .text(countryCode);
        }
    }
}

function appendnations(data, i){

    d3.select("body")
        .select("#country_select_container")
        .append("select")
        .attr("id", "country")
        .selectAll("options")
        .data(data[1])
        .enter()
        .append("option")
        .attr("value", function(d){ return d.id; })
        .text(function (d, i){return d.name;});

    d3.select("body").select("#country_select_container").select("select").on("change", function(){
        console.log(d3.select(this).property('value'));
        draw(
            d3.select(this).property('value'),
            true,
            d3.select('input[name=type]:checked').node().value
        );
    });
}

function show(scene){
    $(scene).show();
}

function hide(scene){
    $(scene).hide();
}
