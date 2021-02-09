let predmetiJSON = [];
let aktivnostiJSON = [];


function ucitaj() {
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
        if (ajax.readyState == 4 && ajax.status == 200) {
            predmetiJSON = JSON.parse(ajax.responseText);
        }
    }
    ajax.open("GET", "http://localhost:3000/v2/predmet", true);
    ajax.setRequestHeader("Content-Type", "application/json");
    ajax.send();

    var ajax1 = new XMLHttpRequest();
    ajax1.onreadystatechange = function () {
        if (ajax1.readyState == 4 && ajax1.status == 200) {
            aktivnostiJSON = JSON.parse(ajax1.responseText);
        }
    }
    ajax1.open("GET", "http://localhost:3000/v2/aktivnost", true);
    ajax1.setRequestHeader("Content-Type", "application/json");
    ajax1.send();
}


function posalji() {
    let nazivPolje = document.getElementById("nazivPredmeta");
    let tipPolje = document.getElementById("tip");
    let pocetakPolje = document.getElementById("pocetak");
    let krajPolje = document.getElementById("kraj");
    let danPolje = document.getElementById("dan");
    if (nazivPolje.value !== "" && pocetakPolje.value !== "" && krajPolje.value !== "") {
        let nazivAktinvosti=nazivPolje.value+tipPolje.value+pocetakPolje.value+krajPolje.value;
        let aktivnostObjekat = {naziv:nazivAktinvosti,pocetak:Number(pocetakPolje.value),kraj:Number(krajPolje.value)}
        let predmetObjekat = {naziv:nazivPolje.value}
        let danObjekat={naziv:danPolje.value}
        let tipObjekat={naziv:tipPolje.value}
        let objekat={aktivnost:aktivnostObjekat,dan:danObjekat,tip:tipObjekat}
        document.getElementById("forma").reset();
        
        let ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                let povratniPredmet=JSON.parse(ajax.responseText);
                objekat.aktivnost.PredmetId=povratniPredmet[0].id;

                let ajax1 = new XMLHttpRequest(); 
                ajax1.onreadystatechange = function () {
                 
                    if (ajax1.readyState == 4 && ajax1.status == 200) {

                        if (JSON.parse(ajax1.responseText).message == "Aktivnost nije validna!") {
                           
                            if(povratniPredmet[1]){
                            let ajax2 = new XMLHttpRequest();
                            ajax2.onreadystatechange = function () {
                                if (ajax2.readyState == 4 && ajax2.status == 200) {
                                console.log(JSON.parse(ajax2.responseText));
                                }
                            }
                            ajax2.open("DELETE", "http://localhost:3000/v2/predmet/" + povratniPredmet[0].id, true);
                            ajax2.setRequestHeader("Content-Type", "application/json");
                            ajax2.send();
                            }
                         console.log(JSON.parse(ajax1.responseText));

                        } else if(JSON.parse(ajax1.responseText).message == "Aktivnost uspješno kreirana!"){
                            ucitaj();
                            console.log(JSON.parse(ajax1.responseText));
                        }
                    }
                }
                ajax1.open("POST", "http://localhost:3000/v2/zadatak3", true);
                ajax1.setRequestHeader("Content-Type", "application/json");
                ajax1.send(JSON.stringify(objekat));
            }
        }
        ajax.open("POST", "http://localhost:3000/v2/predmet", true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(predmetObjekat));
        
    } else {
        alert("Popunite sva polja!");
    }
}

