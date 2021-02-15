initTable()
document.addEventListener('DOMContentLoaded', Add);



function Add(){
    document.getElementById('New Entry').addEventListener("click", function (event) {
        const form = {
            submit: document.getElementById('New Entry').value,
            name: document.getElementById('Ename').value,
            reps: document.getElementById('Ereps').value,
            weight: document.getElementById('Eweight').value,
            date: document.getElementById('Edate').value,
            lbs: document.getElementById('Eunit').value,
        };
        const req = new XMLHttpRequest();

        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                console.log("Entry Added");
            } else {
                console.log("Error in network request: " + req.statusText);
            }});
        req.open("POST", 'http://localhost:8765/', true);
        req.setRequestHeader('Content-type', "application/json");
        req.send(JSON.stringify(form));
        initTable()
        event.preventDefault();
    })
}








function buildTable(data){
    var table = document.createElement("table");
    table.setAttribute("id", "MyTable");
    var headrow = document.createElement("tr");
    var headcell1 = document.createElement("th");
    headcell1.append(document.createTextNode("Exercise Name"));
    headrow.appendChild(headcell1);
    var headcell2 = document.createElement("th");
    headcell2.append(document.createTextNode("Reps"));
    headrow.appendChild(headcell2);
    var headcell3 = document.createElement("th");
    headcell3.append(document.createTextNode("Weight"));
    headrow.appendChild(headcell3);
    var headcell4 = document.createElement("th");
    headcell4.append(document.createTextNode("Date"));
    headrow.appendChild(headcell4);
    var headcell5 = document.createElement("th");
    headcell5.append(document.createTextNode("Units"));
    headrow.appendChild(headcell5);
    table.appendChild(headrow);

    var tableData = data.results;
    for (var i=0; i<tableData.length; i++) {
        var row = document.createElement("tr");
        var cell1 = document.createElement("td");
        cell1.appendChild(document.createTextNode(tableData[i].name));
        row.appendChild(cell1)
        var cell2 = document.createElement("td");
        cell2.appendChild(document.createTextNode(tableData[i].reps));
        row.appendChild(cell2);
        var cell3 = document.createElement("td");
        cell3.appendChild(document.createTextNode(tableData[i].weight));
        row.appendChild(cell3);
        var cell4 = document.createElement("td");
        cell4.appendChild(document.createTextNode(tableData[i].date));
        row.appendChild(cell4);
        var cell5 = document.createElement("td");
        cell5.appendChild(document.createTextNode(tableData[i].lbs));
        row.appendChild(cell5);



        var cell7 = document.createElement("td");
        var Delete = document.createElement("button");
        Delete.setAttribute("id", "Delete");
        Delete.setAttribute('value', "Delete");
        Delete.innerHTML = "Delete";
        cell7.appendChild(Delete);
        row.appendChild(cell7);
        Delete.addEventListener("click", function (event){
            var id = this.parentNode.parentNode.lastElementChild.firstElementChild.firstElementChild
            id = id.value;
            var curID = {};
            curID.id = id;
            curID.Delete = 'Delete';
            var req = new XMLHttpRequest();
            req.addEventListener('load',function(){
                if(req.status >= 200 && req.status < 400){
                    console.log(req.responseText);
                } else {
                    console.log("Error in network request: " + req.statusText);
                }});
            req.open('POST', "http://localhost:8765/",true);
            req.setRequestHeader('Content-type', "application/json");
            req.send(JSON.stringify(curID));
            initTable()
            event.preventDefault();
        })
        var cell9 = document.createElement("td");
        var hid = document.createElement("input");
        hid.setAttribute("type", "hidden");
        hid.setAttribute('name','id');
        hid.setAttribute("value", tableData[i].id);
        cell9.appendChild(hid);
        row.appendChild(cell9);
        var cell8 = document.createElement("td");
        var Eform = document.createElement('form');
        Eform.setAttribute('action', '/edit');
        Eform.setAttribute('method', 'get');
        Eform.appendChild(hid);
        var Edit2 = document.createElement('input');
        Edit2.setAttribute('type', 'submit');
        Edit2.setAttribute('name', 'Edit');
        Edit2.setAttribute('value', "Edit");
        Eform.appendChild(Edit2);
        cell8.appendChild(Eform);
        row.appendChild(cell8)
        table.appendChild(row);
        }
    return table;
}

function initTable() {
    var req = new XMLHttpRequest();
    const request = {submit: "all"};

    req.addEventListener("load", function(){
        var response = req.responseText;
        response = JSON.parse(response);
        var updatedTable = buildTable(response);
        if (document.body.contains(document.getElementById("MyTable"))){
            document.body.removeChild(document.getElementById("MyTable"));
            updatedTable.id = "MyTable";
            document.body.appendChild(updatedTable);
        } else {
            updatedTable.id = "MyTable";
            document.body.appendChild(updatedTable);
        }
    });
    req.open("POST", "http://localhost:8765/", true);
    req.setRequestHeader('Content-type', "application/json");
    req.send(JSON.stringify(request));

}
