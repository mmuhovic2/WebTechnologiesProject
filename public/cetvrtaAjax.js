const grupeDiv=document.getElementById("grupe");
const INICIJALIZACIJA=["Neko Nekić,12345","Drugi Neko,18921","Treći Neko,18009"];

function ucitajGrupe() {
    document.getElementById("area").value=INICIJALIZACIJA.join("\n");
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            grupeDiv.innerHTML=kreirajSelect(JSON.parse(ajax.responseText));
        }
    }
    ajax.open("GET", "http://localhost:3000/v2/grupa", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send();
}

function kreirajSelect(grupe){
    let string="<select id=\"grupeselect\">";
    for(let i=0;i<grupe.length;i++){
        string+="<option value="+grupe[i].naziv+">"+grupe[i].naziv+"</option>";
    }
    string+="</select>";
    return string;
}

function kreirajObjekat(studenti,grupa){
    let niz=studenti.split("\n");
    let objekat={}
    let nizStudenata=[];
    niz.forEach(element => {
        if(element.trim()!=""){
        let vrijednosti=element.split(",");
        nizStudenata.push({ime:vrijednosti[0],index:vrijednosti[1]})
        }
    });
    objekat.studenti=nizStudenata;
    objekat.grupa=grupa;
    return objekat;
}
function posaljiStudente(){
    let studenti=document.getElementById("area");
    let grupa=document.getElementById("grupeselect");
     
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            studenti.value=JSON.parse(ajax.responseText).join("\n");
        }
    }
    ajax.open("POST", "http://localhost:3000/v2/zadatak2", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send(JSON.stringify(kreirajObjekat(studenti.value,grupa.value)));
}