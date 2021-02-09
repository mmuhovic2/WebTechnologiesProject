var div1 = document.getElementById("divtabela1");
var div2 = document.getElementById("divtabela2");
function f(){
    iscrtajRaspored(div1,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],7,21);
    iscrtajRaspored(div2,["Ponedjeljak","Utorak","Srijeda"],3,18);
    
    dodajAktivnost(div1,"WT","predavanje",7,9,"Ponedjeljak");
    dodajAktivnost(div1,"WT","predavanje",9,12,"Ponedjeljak");
    dodajAktivnost(div1,"WT","vježbe",12,13.5,"Ponedjeljak");
    dodajAktivnost(div1,"RMA","predavanje",14,17,"Ponedjeljak");
    dodajAktivnost(div1,"RMA","vježbe",12.5,14,"Utorak");
    dodajAktivnost(div1,"DM","tutorijal",14,16,"Utorak");
    dodajAktivnost(div1,"DM","predavanje",16,19,"Utorak");
    dodajAktivnost(div1,"OI","predavanje",12,15,"Srijeda");
    dodajAktivnost(div1,"WT","predavanje",7,21,"Četvrtak");
    dodajAktivnost(div1,"WT","predavanje",12.5,15.5,"Petak");  
    
    dodajAktivnost(div2,"WT","predavanje",4,7,"Ponedjeljak");
    dodajAktivnost(div2,"OOI","vjezbe",7.5,9,"Ponedjeljak");
    dodajAktivnost(div2,"PWS","predavanje",12,15,"Ponedjeljak");
    dodajAktivnost(div2,"KAFA","odmor",17.5,18,"Ponedjeljak");
    dodajAktivnost(div2,"SAN","odmor",3,6,"Utorak");
    dodajAktivnost(div2,"KAFA","jutarnja",9,12,"Utorak");
    dodajAktivnost(div2,"OIS","predavanje",13,17.5,"Utorak");
    dodajAktivnost(div2,"RG","tutorijal",6,8,"Srijeda");
    dodajAktivnost(div2,"PJP","predavanje",11,13,"Srijeda");
    dodajAktivnost(div2,"PJP","tutorijal",14,15,"Srijeda");
}

function testVrijeme1(){
    dodajAktivnost(div1,"WT","predavanje",9,7,"Ponedjeljak");
}

function testVrijeme2(){
    dodajAktivnost(div1,"WT","predavanje",7.1,8,"Ponedjeljak");
}

function testVrijeme3(){
    dodajAktivnost(div1,"WT","predavanje",7,9,"Ponedjeljak");
}

function testVrijeme4(){
    dodajAktivnost(div2,"WT","predavanje",7,9,"Četvrtak");
}