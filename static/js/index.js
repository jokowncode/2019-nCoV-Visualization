function showRight(id){
    var rights = document.getElementsByClassName("right");
    for(i=0;i<rights.length;i++){
        var item = rights.item(i);
        if(item.id != id){
           item.style.display = "none";
        }else{
           item.style.display = "block";
        }
    }
}
function setOther(type){
    document.getElementById("epidemic-info").style.display = type;
    document.getElementById("epidemic-hot-map-choose").style.display = type;
   // document.getElementById("epidemic-area-info").style.display = type;
}
function changeFunc(index){
    var map = document.getElementById("map");
    var donation = document.getElementById("donation");
    var disinfo = document.getElementById("disinfo");
    var search = document.getElementById("search");
    if(index === 6){
        closeCityInfo();
        showRight("donation");
        setOther("none");
        document.getElementById("epidemic-incre-accu-sort").style.display = "none";
        document.getElementById("epidemic-world-map-choose").style.display = "none";
        document.getElementById("epidemic-moveout-map-info").style.display = "none";
        donationIndex = 1;
        return ;
    }
    
    if(index === 5){
        closeCityInfo();
        showRight("disinfo");
        setOther("none");
        document.getElementById("epidemic-incre-accu-sort").style.display = "none";
        document.getElementById("epidemic-world-map-choose").style.display = "none";
        document.getElementById("epidemic-moveout-map-info").style.display = "none";
//        getData("https://lab.isaaclin.cn/nCoV/api/rumors?num=all",setDisInfo,1);
//        getData("https://lab.isaaclin.cn/nCoV/api/rumors?num=40",setDisInfo);
        return ;
    }
    
    if(index === 4){
        closeCityInfo();
        showRight("search");
        setOther("none");
        document.getElementById("epidemic-incre-accu-sort").style.display = "none";
        document.getElementById("epidemic-world-map-choose").style.display = "none";
        document.getElementById("epidemic-moveout-map-info").style.display = "none";
        return ;
    }
    
    if(index === 0){
       showRight("epidemic-hot-map");
       setOther("block");
        document.getElementById("epidemic-incre-accu-sort").style.display = "none";
        document.getElementById("epidemic-world-map-choose").style.display = "none";
        document.getElementById("epidemic-moveout-map-info").style.display = "none";
       return ;
    }
    
    if(index === 2){
       closeCityInfo();
       showRight("epidemic-data-sort");
       setOther("none");
       document.getElementById("epidemic-incre-accu-sort").style.display = "block";
       document.getElementById("epidemic-world-map-choose").style.display = "none";
       document.getElementById("epidemic-moveout-map-info").style.display = "none";
       showGeneralDataSort();
       return ;
    }
    
    if(index === 1){
       closeCityInfo();
       showRight("epidemic-world-map");
       setOther("none");
       document.getElementById("epidemic-incre-accu-sort").style.display = "none";  
       document.getElementById("epidemic-moveout-map-info").style.display = "none";
       if(this.worldInfos.length === 0){
           document.getElementById("spinner").style.display = "block";
           getData("https://lab.isaaclin.cn/nCoV/api/area?latest=1",setEpidemicWorldMap,1);
       }else{
           document.getElementById("epidemic-world-map-choose").style.display = "block";
       }
       return ;
    }
    
    if(index === 3){
       closeCityInfo();
       showRight("epidemic-moveout-map");
       setOther("none");
       document.getElementById("epidemic-incre-accu-sort").style.display = "none";
       document.getElementById("epidemic-world-map-choose").style.display = "none";
       if(moveOutInfoMap.size === 0){
           document.getElementById("spinner").style.display = "block";
           var dates = getAndSetDateSphere();
           date = dates[0]+""+dates[1]+""+dates[2];
           getData("http://huiyan.baidu.com/migration/provincerank.jsonp?dt=province&id=420000&type=move_out&date="+date,setMoveoutMap,3);
       }else{
           document.getElementById("epidemic-moveout-map-info").style.display = "block";
       }
       return ;
    }
    closeCityInfo();
    showRight("epidemic-news");
    document.getElementById("epidemic-news").style.display = "none";
    setOther("none");
    document.getElementById("epidemic-incre-accu-sort").style.display = "none";
    document.getElementById("epidemic-world-map-choose").style.display = "none";
    if(newsMap.size === 0){
       document.getElementById("spinner").style.display = "block";
       getData("https://lab.isaaclin.cn/nCoV/api/news?num=50&province=%E6%B9%96%E5%8C%97%E7%9C%81",setNewsInfo,1);    
    }else{
        document.getElementById("epidemic-news").style.display = "block";
    }
}

function Mill2Date(mills){
    var date = new Date(mills);
    var month = (date.getMonth()+1+"").length==1?"0"+(date.getMonth()+1) : date.getMonth()+1;
    var day = (date.getDate()+"").length == 1?"0"+date.getDate():date.getDate();
    var hour = (date.getHours()+"").length == 1?"0"+date.getHours():date.getHours();
    var minute = (date.getMinutes()+"").length == 1?"0"+date.getMinutes():date.getMinutes();
    
    return [month,day,hour,minute];
}

function setNewsInfo(newsInfos){
    document.getElementById("spinner").style.display = "none";
    document.getElementById("epidemic-news").style.display = "block";
    var provinceName = newsInfos[0].provinceName;
    newsMap.set(provinceName, newsInfos);
    
    var ol = document.getElementById("timeline-ol");
    var old = ol.getElementsByTagName("li");
    for(i=0;i<old.length;){
        ol.removeChild(old.item(i));
    }
    
    for(i=0;i<newsInfos.length;i++){
        var li = document.createElement("li");
        var div = document.createElement("div");
        var date = Mill2Date(newsInfos[i].pubDate);
    
        li.title = "信息来源:"+newsInfos[i].infoSource+"\n"+newsInfos[i].title;
        div.innerHTML = "<a target='_blank' id='timeline-a' href='"+newsInfos[i].sourceUrl+"'><time>"+(date[0]+"-"+date[1]+" "+date[2]+":"+date[3])+"</time></a>"+newsInfos[i].summary;
        li.appendChild(div);
        ol.appendChild(li);
    }
    ol.appendChild(document.createElement("li"));
    init();
}

function calDataSphere(pages,type,length){
    var start = (pages-1) * 8;
    var end = start + 7;
//    alert(length);
//    var length = (type===1)?disInfos.length:(type===2)?trueInfos.length:searchInfos.length;
    if(end >= length){
       end = length-1;
    }
    return [start,end];
}

function showContentComplete(info){
    var merge = document.getElementById("merge");
    var infoComplete = document.getElementById("info-complete");
    var completeTitle = document.getElementById("info-complete-title");
    completeTitle.innerHTML = info.title;
    
    var completeContent = document.getElementById("info-complete-content");
    completeContent.innerHTML = info.body;
    
    var completeImg = document.getElementById("info-complete-pic");
    var rumorType = info.rumorType;
    var picName = (rumorType==0)?"false.png":"true.png";
    completeImg.src = "../static/pic/"+picName;
    
    infoComplete.style.display = "block";
    merge.style.display = "block";
}

function closeComplete(){
    var infoComplete = document.getElementById("info-complete");
    var merge = document.getElementById("merge");
    
    infoComplete.style.display = "none";
    merge.style.display = "none";
}

function setDisInfo(disInfos){
    this.disInfos.set(disInfoPages, disInfos);
    setInfo(disInfos,1);
}

function setTrueInfo(trueInfos){
    this.trueInfos.set(trueInfoPages, trueInfos);
    setInfo(trueInfos,2);
}

function setInfo(infos,type){
    var infoContentul = document.getElementById("info-content").getElementsByTagName("ul").item(0);
    
    var old = infoContentul.getElementsByTagName("li");
    for(i=0;i<old.length;){
        infoContentul.removeChild(old[i]);
    }
    
    for(i=0;i<infos.length;i++){
        var li = document.createElement("li");
        var div = document.createElement("div");
        div.setAttribute("class","info-content-container");
        div.style.margin = "20px";
        
        var a = document.createElement("a");
        a.innerHTML = infos[i].title;
        a.setAttribute("class","info-content-title");
        a.name = i;
        a.onclick = function(){
            showContentComplete(infos[this.name]);
        };
        
        var contentDiv = document.createElement("div");
        contentDiv.innerHTML = infos[i].mainSummary;
        contentDiv.setAttribute("class","info-content-summary");
        
        var img = document.createElement("img");
        img.setAttribute("class","info-content-pic");
        var rumorType = infos[i].rumorType;
        var picName = (rumorType==0)?"false.png":"true.png";
        img.src = "../static/pic/"+picName;
    
        div.append(a);
        div.append(contentDiv);
        div.append(img);
        
        li.append(div);
        infoContentul.append(li);
    }
    var infoPage = document.getElementById("info-page");
    infoPage.style.display = "block";
    infoPage.name = type;
    setPageShow(type,null);
}

function getData(url,func,type){
    if(type > 2){
        $.ajax(url,{
           dataType: "jsonp",
           success: function(data){
             if(type === 3){
                func(data.data.list);
             }
           } 
        });
        return ;
    }
    $.ajax(url,{
       success: function(data){
        if(type === 1){
            func(data.results);   
         }else if(type === 2){
            func(data.data);
         }
       } 
    });
}

function donationChange(index){
    if(index === 0){ // 向左
        donationIndex = donationIndex === 1 ?  8 : donationIndex - 1;
    }else{
        donationIndex = donationIndex === 8 ? 1 : donationIndex + 1;
    }
    document.getElementById("donation-img").src = "../static/pic/donation/"+donationIndex+".jpg";
}

function setPageShow(type, otherInfo){
    var pages = (type==1)?disInfoPages:(type==2)?trueInfoPages:searchInfoPages;
    var infos = (type==1)?disInfos:(type==2)?trueInfos:searchInfos;
    if(type > 3){
       infos = otherInfo;
    }
    var totalPages = infos.length % 8 == 0 ? infos.length / 8 : parseInt(infos.length / 8)+1; 
    if(type <= 2){
       totalPages = type===1?disInfoTotalPage:trueInfoTotalPage;
    }
    var last = (type==1||type==2)?document.getElementById("info-page-last"):document.getElementById("find-page-last");
    var next = (type==1||type==2)?document.getElementById("info-page-next"):document.getElementById("find-page-next");
    
    var pageName = (type==1||type==2)?"info-page":"find-content-page";

    if(pages === 1){
       last.style.display = "none";
    }else{
       last.style.display = "block";
    }

    if(pages === totalPages){
       next.style.display = "none";
       document.getElementById(pageName).style.bottom = "50px";
    }else{
       next.style.display = "block";
       document.getElementById(pageName).style.bottom = (type==1||type==2)?"-10px":"-15px";
    }
}

function toDisInfo(pages){
    disInfoPages = pages;
    if(disInfos.has(disInfoPages)){
        setDisInfo(disInfos.get(disInfoPages));   
        return ;
    }
    getData("https://lab.isaaclin.cn/nCoV/api/rumors?page="+pages+"&num=8",setDisInfo,1);
}

function toTrueInfo(pages){
    trueInfoPages = pages;
    if(trueInfos.has(trueInfoPages)){
        setTrueInfo(trueInfos.get(trueInfoPages));   
        return ;
    }
    getData("https://lab.isaaclin.cn/nCoV/api/rumors?page="+pages+"&num=8&rumorType=1",setTrueInfo,1);
}

function togglePage(situation){
    var type = document.getElementById("info-page").name;
    var incre = (situation==1)?1:-1;
    if(type === 1){
        disInfoPages += incre;
        toDisInfo(disInfoPages);
    }else{
        trueInfoPages += incre;  
        toTrueInfo(trueInfoPages);
    }
    setPageShow(type,null);
}

function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
        case 1: 
            return parseInt(Math.random()*minNum+1,10); 
        break; 
        case 2: 
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
        break; 
            default: 
                return 0; 
            break; 
    } 
} 

function setBottomSlogan(){
    var bottomSlogan = document.getElementById("bottom-slogan");
    var index = randomNum(0,19);
    bottomSlogan.innerHTML = this.bottomSlogan[index];
}

function searchReset(){
    var input = document.getElementsByClassName("find-input");
    for(i=0;i<input.length;i++){
        input.item(i).value = "";
    }
}

function changeSearchTraffic(type){
    if(searchInfosforTrafficFlag[type] == 0 && type != 0){
        var index = 0;
        searchInfosforTrafficFlag[type] = 1;
        for(i=0;i<searchInfos.length;i++){
            if(searchInfos[i].t_type === type){
               searchInfosForTraffic[type][index] = searchInfos[i];
               index ++;
            }
        }
    }
    var trafficInfos = type!=0?searchInfosForTraffic[type]:searchInfos;
    var findContentPage = document.getElementById("find-content-page");
    findContentPage.name = type;
    searchInfoPages = 1;
    setSearchInfo(trafficInfos);
    setPageShow(4,trafficInfos);
}

function toggleFindPage(situation){
    var incre = (situation==1)?1:-1;
    var type = document.getElementById("find-content-page").name;
//    alert(type.id+" "+type.name);
    searchInfoPages += incre;
    var infos = [];
    if(type == 0){
        infos = searchInfos;   
    }else if(type > 0){
        infos = searchInfosForTraffic[type];
    }else{
        infos = searchInfoForDetail;
    }
//    alert(type);
    setSearchInfo(infos);
    setPageShow(4,infos);
}

function setSearchInfo(searchInfos){
    if(this.searchInfos.length==0) {
        this.searchInfos = searchInfos;
        document.getElementById("find-content-page").name = 0;
    }
    var findTable = document.getElementById("find-table");
    var old = findTable.getElementsByClassName("find-content-tr");
    
    for(i=0;i<old.length;){
        findTable.removeChild(old.item(i));
    }
    if(searchInfos.length == 0){
        document.getElementById("find-tip").style.display = "block";
        return ;
    }
    document.getElementById("find-tip").style.display = "none";
    var sphere = calDataSphere(searchInfoPages,3,searchInfos.length);
    for(i=sphere[0];i<=sphere[1];i++){
        var tr = document.createElement("tr");
        tr.align = "center";
        tr.setAttribute("class","find-content-tr");
        var item = searchInfos[i];
        var contents = [
            item.t_date,
            item.t_no,
            trafficTypes[item.t_type],
            item.t_pos_start,
            item.t_pos_end,
            item.t_no_sub,
            item.t_memo
        ];
        
        for(x=0;x<7;x++){
            var td = document.createElement("td");
            td.innerHTML = contents[x];
            td.setAttribute("nowrap","nowrap");
            td.title = contents[x];
            tr.appendChild(td);
        }
        findTable.appendChild(tr);
    }
    setPageShow(4,searchInfos);
}

function detailFind(){
    searchInfoForDetail = [];
    var date = document.getElementById("find-date").value;
    var serial = document.getElementById("find-serial").value;
    var start = document.getElementById("find-start").value;
    var end = document.getElementById("find-end").value;
    var index = 0;
    for(i=0;i<searchInfos.length;i++){
        var item = searchInfos[i];
        if(date != "" && item.t_date != date){
           continue;
        }   
        if(serial != "" && !item.t_no.includes(serial)){
           continue;
        }
        if(start != "" && !item.t_pos_start.includes(start)){
           continue;
        }
        if(end != "" && !item.t_pos_end.includes(end)){
           continue;
        }
        searchInfoForDetail[index] = item;
        index ++;
    }
    var findContentPage = document.getElementById("find-content-page");
    findContentPage.name = -1;
    searchInfoPages = 1;
    setSearchInfo(searchInfoForDetail);
    setPageShow(4,searchInfoForDetail);
    searchReset();
}

function closeCityInfo(){
    document.getElementById("city-info").style.display = "none";
    document.getElementById("mapMerge").style.display = "none";
    document.getElementById("city-info-close").style.display = "none";
}

/* 点击按钮，下拉菜单在 显示/隐藏 之间切换 */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// 点击下拉菜单意外区域隐藏
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function changeNewsProvince(provinceName){
    document.getElementById("epidemic-news").style.display = "none";
    document.getElementById("spinner").style.display = "block";
    if(newsMap.has(provinceName)){
       setNewsInfo(newsMap.get(provinceName));
    }else{
        getData("https://lab.isaaclin.cn/nCoV/api/news?num=50&province="+provinceName,setNewsInfo,1);
    }
    dropbtn.innerHTML = provinceName;
}

function setAllProvince(){
    var dropdown = document.getElementById("myDropdown");
    for(i=0;i<names.length;i++){
        var a = document.createElement("a");
        a.innerHTML = names[i];
        a.href = "#";
        a.name = names[i];
        a.onclick = function(){
            changeNewsProvince(this.name);
        };
        dropdown.appendChild(a);
    }
}

window.onload = function(){
    getData("http://www.tianqiapi.com/api?version=epidemic&appid=51942884&appsecret=c1WDHJLd",showEpidemicHotMap,2);
    getData("https://lab.isaaclin.cn/nCoV/api/rumors?page=1&num=8",setDisInfo,1);
    getData("http://2019ncov.nosugartech.com/data.json?439809",setSearchInfo,2);
    setBottomSlogan();
    showEpidemicInfo();
    setAllProvince();
}
