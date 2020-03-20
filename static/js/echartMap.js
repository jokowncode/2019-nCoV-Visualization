function getAreaData(index){
    var areas = epidemicInfos.area;
    var data = [];
    var max = 0;
    var min = 100000;
    for(i=0;i<areas.length;i++){
        var tmp = [
            areas[i].currentConfirmedCount,
            areas[i].confirmedCount,
            areas[i].suspectedCount,
            areas[i].curedCount,
            areas[i].deadCount
        ];
        areaToIndex.set(areas[i].provinceName, i);       
        data[i] = {
            name: areas[i].provinceName,
            value: tmp[index]
        };
        max = (data[i].value > max)?data[i].value:max;
        min = (data[i].value < min)?data[i].value:min;
    }
    return {data: data,max:max,min:min};
}

function areaDataSort(data){
    for(i=0;i<data.length-1;i++){
        for(x=0;x<data.length-1-i;x++){
            if(data[x].value < data[x+1].value){
                var tmp = data[x];
                data[x] = data[x+1];
                data[x+1] = tmp;
            }
        }
    }
}

function changeEpidemicHotMapChoose(){
    var index = document.getElementById("choose-select").options.selectedIndex;
    var datas = this.sources[index];
    areaDataSort(datas.data);
    
    var topData = [];
    for(i=0;i<5;i++){
        topData[i] = [datas.data[i].value,datas.data[i].name];
    }
    
    mapOption.series[0].data = datas.data;
    mapOption.visualMap.min = datas.min;
    mapOption.visualMap.max = datas.max;
    mapOption.series[1].data = topData;
    
    map.setOption(mapOption);
}

function changeEpidemicWorldMapChoose(){
    var index = document.getElementById("world-choose-select").options.selectedIndex;
    var datas = getWorldData(index);
    areaDataSort(datas.datas);
    
    var topData = [];
    for(i=0;i<5;i++){
        topData[i] = [datas.datas[i].value,datas.datas[i].name];
    }
    
    worldMapOption.series[0].data = datas.datas;
    worldMapOption.visualMap.min = datas.min;
    worldMapOption.visualMap.max = datas.max;
    worldMapOption.series[1].data = topData;
    
    worldMap.setOption(worldMapOption);
}

function showEpidemicInfo(){
    var divs = document.getElementById("epidemic-general-info").getElementsByTagName("div");
    for(i=1;i<divs.length;i++){
        divs[i].innerHTML = epidemicInfoContent[i-1];
    }
}

function setEpidemicInfoData(epidemicInfos){
    var increSpans = document.getElementById("epidemic-info-data-incre").getElementsByTagName("span");
    var dataSpans = document.getElementById("epidemic-info-data").getElementsByTagName("span");

    var incres = [
        epidemicInfos.currentDiagnosedIncr,
        epidemicInfos.diagnosedIncr,
        epidemicInfos.suspectIncr,
        epidemicInfos.seriousIncr,
        epidemicInfos.deathIncr,
        epidemicInfos.curedIncr
    ];
    
    var datas = [
        epidemicInfos.currentDiagnosed,
        epidemicInfos.diagnosed,
        epidemicInfos.suspect,
        epidemicInfos.serious,
        epidemicInfos.death,
        epidemicInfos.cured
    ];
    
    for(i=0;i<increSpans.length;i++){
        var inc = (incres[i]+"").includes("-")?incres[i]:"+"+incres[i];
        increSpans.item(i).innerHTML = inc;
    }
    
    for(i=0;i<dataSpans.length;i++){
        dataSpans.item(i).innerHTML = datas[i];
    }
}

function showProvinceDetail(name){
    var cities = epidemicInfos.area[areaToIndex.get(name)].cities;
    
    var cityNames = [];
    var cityDatas = [[],[],[],[]];
    for(i=0;i<cities.length;i++){
        cityNames[i] = cities[i].cityName;
        cityDatas[0][i] = cities[i].confirmedCount;
        cityDatas[1][i] = cities[i].suspectedCount;
        cityDatas[2][i] = cities[i].curedCount;
        cityDatas[3][i] = cities[i].deadCount;
    }

    document.getElementById("mapMerge").style.display = "block";
    var cityChart = echarts.init(document.getElementById('city-info'));
    var cityChartOption = {
        tooltip:{
          trigger: "axis",
          axisPointer: {
              type: "shadow"
          }    
        },
        toolbox:{
          show: true,
          orient: 'vertical',
          right: "2%",
          top: 'center',
          feature:{
            dataZoom: {show: true},
            dataView: {show: true, readOnly: true},
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        dataZoom: [
            {
                show: true,
                start: 0,
                end: 100
            },
            {
                type: 'inside',
                start: 0,
                end: 100
            }
        ],
        legend: {
          data: ["累计确诊","现存疑似","累计治愈","累计死亡"]  
        },
        grid:{
          left: "9%",
          bottom: "12%"
        },
        xAxis: {
            type: "category",
            data: cityNames,
            axisLabel:{
                interval: 0,
                rotate: 30
            }
        },
        yAxis:{
            type: "value"
        },
        animationEasing: 'bounceOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        },
        series: [
            {
                type: "bar",
                name: "累计确诊",
                data: cityDatas[0]
            },
            {
                type: "bar",
                name: "现存疑似",
                data: cityDatas[1]
            },
            {
                type: "bar",
                name: "累计治愈",
                data: cityDatas[2]
            },
            {
                type: "bar",
                name: "累计死亡",
                data: cityDatas[3]
            }
        ]
    };
    document.getElementById("city-info").style.display = "block";
    document.getElementById("city-info-close").style.display = "block";
    cityChart.setOption(cityChartOption);
}

function showEpidemicHotMap(epidemicInfos){
    this.epidemicInfos = epidemicInfos;
    setEpidemicInfoData(epidemicInfos);
    var sources = [];
    
    for(x=0;x<5;x++){
        sources[x] = getAreaData(x);
    }
    this.sources = sources;
    var datas = sources[0];
    areaDataSort(datas.data);
    
    var topData = [];
    for(i=0;i<5;i++){
        topData[i] = [datas.data[i].value,datas.data[i].name];
    }

    var map = echarts.init(document.getElementById('epidemic-hot-map'));
    var option = {
        tooltip:{
            trigger: "item"
        },
        title:[
            {
                text: 'TOP5',
                left: '87%',
                top: '5%',
                textAlign: 'center',
                textStyle: {
                    color: "red"
                }
            }
        ],
        xAxis: {
            type: "log",
            name: "人数",
            nameLocation: "middle",
            nameTextStyle:{
                padding: 8
            }
        },
        yAxis: {
            name: "省名",
            type: "category",
            inverse: true,
            nameLocation: "start",
        },
        grid:[
            {
                width: "20%",
                height: "30%",
                x: "76%",
                y: "13%"
            }
        ],
        series: [{
            name:'epidemic-hot-map',
            type: 'map',
            mapType: 'china',
            data: datas.data,
            tooltip:{
                formatter: function(params){
                    var area = epidemicInfos.area[areaToIndex.get(params.name)];
                    var str = params.name+"<br/>";
                    str += "现存确诊："+area.currentConfirmedCount+"<br/>";
                    str += "累计确诊："+area.confirmedCount+"<br/>";
                    str += "现存疑似："+area.suspectedCount+"<br/>";
                    str += "累计治愈："+area.curedCount+"<br/>";
                    str += "累计死亡："+area.deadCount;
                    return str;
                }
            }
        },{
            type: 'bar',
            data: topData,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    color: "red"
                }
            },
            itemStyle:{
                normal:{
                    color: function(params) {
                        var colorList = [
                           '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD'
                        ];
                        return colorList[params.dataIndex];
                    }
                }
            }
        }],
        visualMap: [{
            show: true,
            type: 'piecewise',
            seriesIndex: 0,
            min: datas.min,
            max: datas.max,
            text: ['High','Low'],
            right: "10%",
            bottom: "10%",
            minOpen: true,
            maxOpen: true,
            showLabel:true,
            hoverLink:true,
            pieces: [
              {value: 0 ,color: "white",label: "0"},
              {min: 1, max: 9,label: "1-9",color: "#FAEBD2"},
              {min: 10,max:99,label: "10-99",color: "#E9A188"},
              {min: 100, max:499,label: "100-499",color: "#D56355"},
              {min: 500, max:999,label: "500-999",color: "#BB3937"},
              {min: 1000, max: 10000,label: "1000-10000",color: "#772526"},
              {min: 10001,label: ">10000",color: "#480F10"}
            ]
        }],
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: true},
                restore: {},
                saveAsImage: {}
            }
        }
    };
    this.map = map;
    this.mapOption = option;
    map.on("click",function(param){
        showProvinceDetail(param.name);
    });
    map.setOption(this.mapOption);
}

function showGeneralDataSort(){
    var areas = epidemicInfos.area;
    var provinceNames = [];
    var provinceDatas = [[],[],[],[],[]];
    
    for(i=0;i<areas.length;i++){
        provinceNames[i] = areas[i].provinceName;
        provinceDatas[0][i] = areas[i].currentConfirmedCount;
        provinceDatas[1][i] = areas[i].confirmedCount;
        provinceDatas[2][i] = areas[i].suspectedCount;
        provinceDatas[3][i] = areas[i].curedCount;
        provinceDatas[4][i] = areas[i].deadCount;
    }
    
    var dates = [];
    var generalDatas = [[],[],[],[],[]];
    var increDatas = [[0],[0],[0]];
    var history = epidemicInfos.history;
    var confirmPre;
    var curePre;
    var deathPre;
    for(i=0;i<history.length;i++){
        dates[i] = history[i].date.substring(history[i].date.indexOf("-")+1);
        generalDatas[0][i] = history[i].treatingNum;
        generalDatas[1][i] = history[i].confirmedNum;
        generalDatas[2][i] = history[i].suspectedNum;
        generalDatas[3][i] = history[i].curesNum;
        generalDatas[4][i] = history[i].deathsNum;
    }
    
    for(i=history.length-1;i>=0;i--){
        if(i == history.length-1){
           increDatas[0][i] = history[i].confirmedNum;
           increDatas[1][i] = history[i].curesNum;
           increDatas[2][i] = history[i].deathsNum;
        }else{
           increDatas[0][i] = history[i].confirmedNum - confirmPre;
           increDatas[1][i] = history[i].curesNum - curePre;
           increDatas[2][i] = history[i].deathsNum - deathPre;
        }
        confirmPre = history[i].confirmedNum;
        curePre = history[i].curesNum;
        deathPre = history[i].deathsNum;
    }
    
    var generalDataChart = echarts.init(document.getElementById('epidemic-data-sort'));
    var generalDataChartOption = {
        title:[{
            text: '全国新增数量走势图',
            bottom: "45%",
            left: "19%"
        },{
            text: "全国累计数量走势图",
            bottom: "45%",
            right: "19%"
        }],
        tooltip:{
          trigger: "axis",
          axisPointer: {
              type: "shadow"
          }    
        },
        toolbox:{
          show: true,
          orient: 'vertical',
          right: "2%",
          top: "center",
          feature:{
            dataZoom: {show: true},
            dataView: {show: true, readOnly: true},
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        dataZoom: [
            {
                type: 'inside',
                start: 3,
                end: 100
            }
        ],
        legend: [{
          data: ["现存确诊","累计确诊","现存疑似","累计治愈","累计死亡"]  
        },{
          bottom: "40%",
          left: "15%",
          data: ["新增确诊","新增治愈","新增死亡"]
        },{
          bottom: "40%",
          right: "10%",
          data: [
              {name:"现存确诊",
              icon:"circle"},
              {name:"累计确诊",
              icon:"circle"},
              {name:"现存疑似",
              icon:"circle"},
              {name:"累计治愈",
              icon:"circle"},
              {name:"累计死亡",
              icon:"circle"}
          ]
        }],
        grid:[{
          left: "9%",
          top: "12%",
          height:"30%"
        },
        {
            height: "30%",
            bottom: "40%;",
            right: "5%",
            width: "40%"
        },{
            height: "30%",
            bottom: "40%;",
            width: "40%",
            left: "5%"
        }],
        xAxis: [{
            type: "category",
            data: provinceNames,
            gridIndex: 0,
            axisLabel:{
                interval: 0,
                rotate: 30
            }
        },
        {
            type: "category",
            gridIndex: 1,
            inverse: true,
            data: dates
        },
        {
            type: "category",
            gridIndex: 2,
            inverse: true,
            data: dates
        }],
        yAxis:[{
            gridIndex: 0,
            type: "value"
        },
        {
            gridIndex: 1,
            type: "value"
        },{
            gridIndex: 2,
            type: "value"
        }],
        animationEasing: 'bounceOut',
        animationDelayUpdate: function (idx) {
            return idx * 5;
        },
        series: [
            {
                type: "bar",
                name: "现存确诊",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: provinceDatas[0]
            },
            {
                type: "bar",
                name: "累计确诊",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: provinceDatas[1]
            },
            {
                type: "bar",
                name: "现存疑似",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: provinceDatas[2]
            },
            {
                type: "bar",
                name: "累计治愈",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: provinceDatas[3]
            },
            {
                type: "bar",
                name: "累计死亡",
                xAxisIndex: 0,
                yAxisIndex: 0,
                data: provinceDatas[4]
            },
            {
             type: 'line',
             smooth: true, 
             name: "现存确诊",
             xAxisIndex: 1,
             yAxisIndex: 1,
             seriesLayoutBy: 'row', 
             data: generalDatas[0]
            },
            {
             type: 'line',
             smooth: true,
             name: "累计确诊",
             xAxisIndex: 1,
             yAxisIndex: 1,
             seriesLayoutBy: 'row', 
             data: generalDatas[1]
            },
            {
             type: 'line',
             smooth: true,
             name: "现存疑似",
             xAxisIndex: 1,
             yAxisIndex: 1,
             seriesLayoutBy: 'row', 
             data: generalDatas[2]
            },
            {
             type: 'line',
             smooth: true,
             name: "累计治愈",
             xAxisIndex: 1,
             yAxisIndex: 1,
             seriesLayoutBy: 'row', 
             data: generalDatas[3]
            },
            {
             type: 'line',
             smooth: true,
             name: "累计死亡",
             xAxisIndex: 1,
             yAxisIndex: 1,
             seriesLayoutBy: 'row', 
             data: generalDatas[4]
            },
            {
             type: 'line',
             smooth: true,
             name: "新增确诊",
             xAxisIndex: 2,
             yAxisIndex: 2,
             seriesLayoutBy: 'row', 
             data: increDatas[0]
            },
            {
             type: 'line',
             smooth: true,
             name: "新增治愈",
             xAxisIndex: 2,
             yAxisIndex: 2,
             seriesLayoutBy: 'row', 
             data: increDatas[1]
            },
            {
             type: 'line',
             smooth: true,
             name: "新增死亡",
             xAxisIndex: 2,
             yAxisIndex: 2,
             seriesLayoutBy: 'row', 
             data: increDatas[2]
            }
        ]
    };
    generalDataChart.setOption(generalDataChartOption);
}

function getWorldData(index){
    var datas = [];
    var max = 0;
    var min = 100000;
    var x = 0;
    
    for(i=0;i<worldInfos.length;i++){
        if(worldInfos[i].continentName === "亚洲"){
           continue;
        }
        
        var tmp = [
            worldInfos[i].currentConfirmedCount,
            worldInfos[i].confirmedCount,
            worldInfos[i].suspectedCount,
            worldInfos[i].curedCount,
            worldInfos[i].deadCount
        ];
        
        datas[x] = {
            name: worldInfos[i].countryName,
            value: tmp[index],
            currentConfirmedCount: tmp[0],
            confirmedCount: tmp[1],
            suspectedCount: tmp[2],
            curedCount: tmp[3],
            deadCount: tmp[4]
        };
        max = Math.max(max,datas[x].value);
        min = Math.min(min,datas[x].value);
        x ++;
    }
    return {datas:datas,max:max,min:min};
}


function setEpidemicWorldMap(worldInfos){
    this.worldInfos = worldInfos;
    var datas = getWorldData(0);
    
    areaDataSort(datas.datas);
    
    var topData = [];
    for(i=0;i<5;i++){
        topData[i] = [datas.datas[i].value,datas.datas[i].name];
    }
    
    document.getElementById("spinner").style.display = "none";
    document.getElementById("epidemic-world-map-choose").style.display = "block";
    document.getElementById("epidemic-world-map").style.backgroundColor = "#d1d8e0";
    var worldMap = echarts.init(document.getElementById('epidemic-world-map'));
    var worldMapOption = {
        tooltip:{
            trigger: "item"
        },
        title:[
            {
                text: 'TOP5',
                left: '17%',
                top: '53%',
                textAlign: 'center',
                textStyle: {
                    color: "red"
                }
            }
        ],
        visualMap:[{
            show: true,
            type: 'piecewise',
            min: datas.min,
            max: datas.max,
            seriesIndex: 0,
            right: "5%",
            top: "5%",
            text: ['High','Low'],
            showLabel:true,
            hoverLink:true,
            pieces: [
              {value: 0 ,color: "white",label: "0"},
              {min: 1, max: 9,label: "1-9",color: "#FAEBD2"},
              {min: 10,max:99,label: "10-99",color: "#E9A188"},
              {min: 100, max:499,label: "100-499",color: "#D56355"},
              {min: 500, max:999,label: "500-999",color: "#BB3937"},
              {min: 1000, max: 10000,label: "1000-10000",color: "#772526"},
              {min: 10001,label: ">10000",color: "#480F10"}
            ]
        }],
        xAxis: {
            type: "log",
            name: "人数",
            nameLocation: "middle",
            nameTextStyle:{
                padding: 8
            }
        },
        yAxis: {
            name: "国家",
            type: "category",
            inverse: true,
            nameLocation: "start"
        },
        grid:[
            {
                width: "20%",
                height: "30%",
                y: "60%",
                x: "8%"
            }
        ],
        series: [{
            name:'epidemic-world-map',
            type: 'map',
            mapType: 'world',
            nameMap: this.nameMap,
            data: datas.datas,
            tooltip:{
                formatter: function(params){
                    var datas = params.data;
                    var str = params.name+"<br/>";
                    if(typeof(datas) == "undefined"){
                       var content = (params.name == "中国")?"请前往国内疫情查看": "暂无数据";
                       return str+content;
                    }
                    str += "现存确诊："+datas.currentConfirmedCount+"<br/>";
                    str += "累计确诊："+datas.confirmedCount+"<br/>";
                    str += "现存疑似："+datas.suspectedCount+"<br/>";
                    str += "累计治愈："+datas.curedCount+"<br/>";
                    str += "累计死亡："+datas.deadCount;
                    return str;
                }
            }
        },{
            name: "TOP5",
            type: 'bar',
            data: topData,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    color: "red"
                }
            },
            itemStyle:{
                normal: {
                    color: function(params) {
                        var colorList = [
                           '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                        ];
                        return colorList[params.dataIndex];
                    },
                }
            }
        }],
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                dataView: {readOnly: true},
                restore: {},
                saveAsImage: {}
            }
        }
    };
    worldMap.setOption(worldMapOption);
    this.worldMap = worldMap;
    this.worldMapOption = worldMapOption;
}

function getLatAndLong(provinceName){
    provinceName = provinceName.replace("省","").replace("市","").replace("自治区","").replace("壮族","")
                                .replace("维吾尔","").replace("回族","");
    for(i=0;i<chinaLatAndLong.length;i++){
        if(chinaLatAndLong[i].name == provinceName){
           return chinaLatAndLong[i].value;
        }
    }
    return null;
}

function convertData(data){
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord = getLatAndLong(dataItem[0].name);
        var toCoord = getLatAndLong(dataItem[1].name);
        if (fromCoord && toCoord) {
            res.push([{
                coord: fromCoord
            }, {
                coord: toCoord
            }]);
        }
    }
    return res;
}

function getAndSetDateSphere(){
	var date_now = new Date();
	var year = date_now.getFullYear();
	var month = date_now.getMonth()+1 < 10 ? "0"+(date_now.getMonth()+1) : (date_now.getMonth()+1);
	var date = date_now.getDate() < 10 ? "0"+date_now.getDate() : date_now.getDate();
	$("#moveout-input").attr("max",year+"-"+month+"-"+date);
    $("#moveout-input").attr("value",year+"-"+month+"-"+date);
    return [year, month, date];
}

function setMoveoutInfo(datas,type=1){
    var table = document.getElementById("moveout-info-table");
    
    var old = table.getElementsByTagName("tr");
    for(i=1;i<old.length;){
        table.removeChild(old.item(i));
    }
    
    if(datas.length === 0){
       document.getElementById("moveout-no-data").style.display = "block";
        return ;
    }
    
    for(i=0;i<datas.length;i++){
        var tr = document.createElement("tr");
        tr.align = "center";
        var tdName = document.createElement("td");
        tdName.setAttribute("class","moveout-input-td");
        var li = document.createElement("li");
        li.innerHTML = (type===1)?datas[i][1].name:datas[i][0].name;
        tdName.appendChild(li);
        var tdRatio = document.createElement("td");
        tdRatio.innerHTML = datas[i][1].value+"%";
        tr.appendChild(tdName);
        tr.appendChild(tdRatio);
        table.appendChild(tr);
    }
}

function setMoveoutMap(moveOutInfos){
//    alert(moveOutInfos);
    var dates = getAndSetDateSphere();
    date = dates[0]+""+dates[1]+""+dates[2];
    moveOutInfoMap.set(date,moveOutInfos);
    document.getElementById("spinner").style.display = "none";
    document.getElementById("epidemic-moveout-map").style.backgroundColor = "#d1d8e0";
    document.getElementById("epidemic-moveout-map-info").style.display = "block";
    var datas = [];
    for(i=0;i<moveOutInfos.length;i++){
        datas[i] = [
            {name: "湖北"},
            {name: moveOutInfos[i].province_name, value: moveOutInfos[i].value}
        ];
    }
    setMoveoutInfo(datas);
    
    var series = [{
        name: "hubei-move-out",
        type: "lines",
        zlevel: 1,
        effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
        },
        lineStyle:{
            normal: {
                color: "#ffa022",
                width: 0,
                curveness: 0.2
            }
        },
        data: convertData(datas)
    },{
        name: "hubei-move-out",
        type: "lines",
        zlevel: 2,
        effect: {
            show: true,
            period: 6,
            trailLength: 0,
            symbol: this.planePath,
            symbolSize: 15
        },
        lineStyle: {
            normal: {
                color: "#ffa022",
                width: 1,
                opacity: 0.4,
                curveness: 0.2
            }
        },
        data: convertData(datas)
    },{
        name: "hubei-move-out",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: {
            brushType: 'stroke'
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}'
            }
        },
        symbolSize: function (val) {
            return val[2];
        },
        itemStyle: {
            normal: {
                color: "#ffa022"
            }
        },
        data: datas.map(function (dataItem) {
            return {
                name: dataItem[1].name,
                value: getLatAndLong(dataItem[1].name).concat([dataItem[1].value]),
                v: dataItem[1].value
            };
        }),
        tooltip:{
            formatter: function(params){
                return params.data.name + "：" + params.data.v+"%";
            }
        }
    }];
    
    var moveOutMap = echarts.init(document.getElementById('epidemic-moveout-map'));
    var moveOutMapOption = {
        title:{
            text: "湖北迁出轨迹图",
            subtext: "    数据来源百度地图",
            sublink: "http://qianxi.baidu.com/",
            left: "30%",
            top: "5%"
        },
        tooltip: {
            trigger: "item"
        },
        geo: {
            map: "china",
            roam: true,
            left: "10%",
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#404a59'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        series: series
    };
    moveOutMap.setOption(moveOutMapOption);
    this.moveOutMap = moveOutMap;
    this.moveOutMapOption = moveOutMapOption;
}

function changeMapAndInfoOut(moveOutInfos){
    var datas = [];
    moveOutInfoMap.set(moveOutDate,moveOutInfos);
    for(i=0;i<moveOutInfos.length;i++){
        datas[i] = [
            {name: "湖北"},
            {name: moveOutInfos[i].province_name, value: moveOutInfos[i].value}
        ];
    }
    setMoveoutInfo(datas);
    
    moveOutMapOption.title.text = "湖北迁出轨迹图";
    document.getElementById("move-title").innerHTML = "湖北迁出目的地";
    
    for(i=0;i<3;i++){
        if(i===2){
            moveOutMapOption.series[i].itemStyle.normal.color = "#ffa022";
        }else{
            moveOutMapOption.series[i].lineStyle.normal.color = "#ffa022";
        }
    }
    
    moveOutMapOption.series[0].data = convertData(datas);
    moveOutMapOption.series[1].data = convertData(datas);
    moveOutMapOption.series[2].data = datas.map(function (dataItem) {
        return {
            name: dataItem[1].name,
            value: getLatAndLong(dataItem[1].name).concat([dataItem[1].value]),
            v: dataItem[1].value
        };
    });
    moveOutMap.setOption(moveOutMapOption);
}

function changeMapAndInfoIn(moveInInfos){
    var datas = [];
    moveInInfoMap.set(moveInDate,moveInInfos);
    for(i=0;i<moveInInfos.length;i++){
        datas[i] = [
            {name: moveInInfos[i].province_name},
            {name: "湖北", value: moveInInfos[i].value}
        ];
    }
    setMoveoutInfo(datas,2);
    
    moveOutMapOption.title.text = "迁入湖北轨迹图";
    document.getElementById("move-title").innerHTML = "迁入湖北出发地";
    
    for(i=0;i<3;i++){
        if(i===2){
            moveOutMapOption.series[i].itemStyle.normal.color = "#46bee9";
        }else{
            moveOutMapOption.series[i].lineStyle.normal.color = "#46bee9";
        }
    }
    
    moveOutMapOption.series[0].data = convertData(datas);
    moveOutMapOption.series[1].data = convertData(datas);
    moveOutMapOption.series[2].data = datas.map(function (dataItem) {
        return {
            name: dataItem[0].name,
            value: getLatAndLong(dataItem[0].name).concat([dataItem[1].value]),
            v: dataItem[1].value
        };
    });
    moveOutMap.setOption(moveOutMapOption);
}

function changeMoveOutDate(){
    document.getElementById("moveout-no-data").style.display = "none";
    var date = document.getElementById("moveout-input").value.replace("-","").replace("-","");
    this.moveOutDate = date;
    if(moveOutInfoMap.has(date)){
        changeMapAndInfoOut(moveOutInfoMap.get(date));
    }else{
        getData("http://huiyan.baidu.com/migration/provincerank.jsonp?dt=province&id=420000&type=move_out&date="+date,changeMapAndInfoOut,3);
    }
}

function changeMoveInDate(){
    document.getElementById("moveout-no-data").style.display = "none";
    var date = document.getElementById("moveout-input").value.replace("-","").replace("-","");
    this.moveInDate = date;
    if(moveInInfoMap.has(date)){
        changeMapAndInfoIn(moveInInfoMap.get(date));
    }else{
        getData("http://huiyan.baidu.com/migration/provincerank.jsonp?dt=province&id=420000&type=move_in&date="+date,changeMapAndInfoIn,3);
    }
}

function changeMoveWay(){
    var index = document.getElementById("move-in-out-select").options.selectedIndex;
    if(index === 0){
       changeMoveOutDate();
    }else{
       changeMoveInDate();
    }
}

