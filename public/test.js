window.alert = function (msg) {}
/* Ovaj kod je dodan da se alerti ne bi pojavljivali u testovima, ako želite da se pojavljuju samo zakomentarišite
*/

let assert = chai.assert;
describe("Raspored", function () {
    describe("iscrtajRaspored()", function () {
        it("1. Ispisivanje greške u slučaju da je sat početka veći ili jednak od sata kraja", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],6,5);
            assert.equal(div.innerHTML,'Greška!', 'Sat početka mora biti manji od sata kraja!');
        });
        it("2. Ispisivanje greške u slučaju da sat početka ili sat kraja nisu cijeli brojevi:", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],6.1,5.6);
            assert.equal(div.innerHTML,'Greška!', 'Sat početka i sat kraja moraju biti cijeli brojevi!');
        });
        it("3. Ispisivanje greške u slučaju da sat početka ili sat kraja nisu u intervalu [0-24]! Sat početka.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],-1,10);
            assert.equal(div.innerHTML,'Greška!', 'Sat početka i sat kraja moraju biti cijeli brojevi u intervalu 0-24!');
        });
        it("4. Ispisivanje greške u slučaju da sat početka ili sat kraja nisu u intervalu [0-24]! Sat kraja.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],10,-1);
            assert.equal(div.innerHTML,'Greška!', 'Sat početka i sat kraja moraju biti cijeli brojevi u intervalu 0-24!');
        });
        it("5. Ispisivanje greške u slučaju da je niz sa danima prazan", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,[],4,6);
            assert.equal(div.innerHTML,'Greška!', 'Raspored mora sadržavati bar jedan dan!');
        });
        it("6. Uspješno kreiranje rasporeda za vrijednosti sati 8-21! Broj kolona.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
            let tabela=div.getElementsByTagName("table")[0];
            let kolone = tabela.rows[1].getElementsByTagName("td");
            let brojPrikazanih = 0;
            for(let i=0;i<kolone.length;i++){
                let stil = window.getComputedStyle(kolone[i])
                if(stil.display!=='none') brojPrikazanih++;
            }
            assert.equal(brojPrikazanih,27,'Raspored treba imati 27 vidljivih ćelija za Ponedjeljak!');
        });
        it("7. Uspješno kreiranje rasporeda za vrijednosti sati 8-21! Broj redova.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
            let tabela=div.getElementsByTagName("table")[0];
            let brojPrikazanih = 0;
            for(let i=1;i<tabela.rows.length;i++){
                let stil = window.getComputedStyle(tabela.rows[i].cells[0])
                if(stil.display!=='none') brojPrikazanih++;
            }
            assert.equal(brojPrikazanih,5,'Raspored treba imati 5 vidljivih ćelija za sa nazivima dana!');
        });
        it("8. Uspješno kreiranje rasporeda za vrijednosti sati 00:00-01:00! Broj kolona.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],0,1);
            let tabela=div.getElementsByTagName("table")[0];
            let kolone = tabela.rows[1].getElementsByTagName("td");
            let brojPrikazanih = 0;
            for(let i=0;i<kolone.length;i++){
                let stil = window.getComputedStyle(kolone[i])
                if(stil.display!=='none') brojPrikazanih++;
            }
            assert.equal(brojPrikazanih,3,'Raspored treba imati 3 vidljive ćelija za Ponedjeljak!');
        });
        it("9. Uspješno kreiranje rasporeda ako Ponedjeljak nije prvi dan!", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Utorak","Srijeda","Četvrtak","Petak"],10,20);
            let tabela=div.getElementsByTagName("table")[0];
            assert.equal(tabela.rows[1].cells[0].textContent,'Utorak','Prvi dan u rasporedu je Utorak');
        });
        it("10. Uspješno kreiranje rasporeda ako se Srijeda ne nalazi u njemu!", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Pondedjeljak","Utorak","Četvrtak","Petak"],10,20);
            let tabela=div.getElementsByTagName("table")[0];
            assert.equal(tabela.rows[3].cells[0].textContent,'Četvrtak','Treći dan u rasporedu je Četvrtak');
        });
        it("11. Uspješno kreiranje rasporeda za vrijednosti sati 00:00-24:00! Broj kolona.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],0,24);
            let tabela=div.getElementsByTagName("table")[0];
            let kolone = tabela.rows[1].getElementsByTagName("td");
            let brojPrikazanih = 0;
            for(let i=0;i<kolone.length;i++){
                let stil = window.getComputedStyle(kolone[i])
                if(stil.display!=='none') brojPrikazanih++;
            }
            assert.equal(brojPrikazanih,49,'Raspored treba imati 49 vidljivih ćelija za Ponedjeljak!');
        });
        it("12. Uspješno kreiranje rasporeda za vrijednosti sati 00:00-24:00! Provjera prvog ispisanog sata.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],0,24);
            let tabela=div.getElementsByTagName("table")[0];
            assert.equal(tabela.rows[0].cells[1].textContent,"00:00",'Prvi ispisani sat treba biti 00:00!');
        });
        it("13. Uspješno kreiranje rasporeda za vrijednosti sati 01:00-24:00! Provjera prvog ispisanog sata.", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],1,24);
            let tabela=div.getElementsByTagName("table")[0];
            assert.equal(tabela.rows[0].cells[1].textContent,"01:00",'Prvi sat treba uvijek biti ispisan!');
        });
        it("14. Uspješno kreiranje rasporeda za vrijednosti sati 23:00-24:00!", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],23,24);
            let tabela=div.getElementsByTagName("table")[0];
            assert.equal(tabela.rows[0].cells[1].textContent,"23:00",'Prvi sat treba biti 23:00!');
            assert.equal(tabela.rows[1].cells.length,3,'Trebaju biti 3 vidljiva polja.');
        });
        it("15. Uspješno kreiranje rasporeda za vrijednosti sati 12:00-15:00!", function () {
            let div=document.createElement("div");
            Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],12,15);
            let tabela=div.getElementsByTagName("table")[0];
            let brojPrikazanih = 0;
            for(let i=0;i<tabela.rows[0].cells.length;i++){
                if(tabela.rows[0].cells[i].textContent!=="") brojPrikazanih++;
            }
            assert.equal(brojPrikazanih,"1",'Treba biti vidljiv samo jedan sat.');
        });
    });
    
    describe("dodajAktivnost()", function () {
        let div=document.createElement("div");
        Raspored.iscrtajRaspored(div,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
        it("1. Izbacivanje alerta u slučaju da nema kreiranog rasporeda!", function () {
            let div1=document.createElement("div");
            let dodaj=Raspored.dodajAktivnost(div1,"WT","predavanje",10,12,"Ponedjeljak");
            assert.equal(dodaj,false, 'Potrebno je kreirati raspored prije dodavanja u njega!');
        });
        it("2. Izbacivanje alerta u slučaju da je raspored null!", function () {
            let dodaj=Raspored.dodajAktivnost(null,"WT","predavanje",10,12,"Ponedjeljak");
            assert.equal(dodaj,false, 'Potrebno je kreirati raspored prije dodavanja u njega!');
        });
        it("3. Izbacivanje alerta u slučaju da je vrijeme aktivnosti izvan okvira rasporeda!", function () {
            let dodaj=Raspored.dodajAktivnost(div,"WT","predavanje",7,12,"Ponedjeljak");
            assert.equal(dodaj,false, 'Vrijeme aktivnosti je izvan okvira vremena u rasporedu!');
        });
        it("4. Izbacivanje alerta u slučaju da je vrijeme aktivnosti nije u odgovarajućem formatu! Vrijeme početka.", function () {
            let dodaj=Raspored.dodajAktivnost(div,"WT","predavanje",9.1,12,"Ponedjeljak");
            assert.equal(dodaj,false, 'Vrijeme aktivnosti nije u odgovarajućem formatu!');
        });
        it("5. Izbacivanje alerta u slučaju da je vrijeme aktivnosti nije u odgovarajućem formatu! Vrijeme kraja.", function () {
            let dodaj=Raspored.dodajAktivnost(div,"WT","predavanje",9,12.1,"Ponedjeljak");
            assert.equal(dodaj,false, 'Vrijeme aktivnosti nije u odgovarajućem formatu!');
        });
        it("6. Izbacivanje alerta u slučaju da je vrijeme početka veće ili jednako od vremena kraja!", function () {
            let dodaj=Raspored.dodajAktivnost(div,"WT","predavanje",9,9,"Ponedjeljak");
            assert.equal(dodaj,false, 'Vrijeme početka mora biti manje od vremena kraja!');
        });
        it("7. Izbacivanje alerta u slučaju da se aktivnost poklapa sa već postojećom aktivnosti! Slučaj kada počinje poslije postojeće.", function () {
            Raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
            let dodaj=Raspored.dodajAktivnost(div,"WT","tut",11,14,"Ponedjeljak");
            assert.equal(dodaj,false, 'Aktivnost se poklapa sa već postojećom aktivnosti!');
        });
        it("8. Izbacivanje alerta u slučaju da se aktivnost poklapa sa već postojećom aktivnosti! Slučaj kada počinje prije postojeće.", function () {
            Raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
            let dodaj=Raspored.dodajAktivnost(div,"WT","tut",8,11,"Ponedjeljak");
            assert.equal(dodaj,false, 'Aktivnost se poklapa sa već postojećom aktivnosti!');
        });
        it("9. Izbacivanje alerta u slučaju da se aktivnost poklapa sa već postojećom aktivnosti!Slučaj kada se poklapa u potpunosti.", function () {
            Raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
            let dodaj=Raspored.dodajAktivnost(div,"WT","tut",9,12,"Ponedjeljak");
            assert.equal(dodaj,false, 'Aktivnost se poklapa sa već postojećom aktivnosti!');
        });
        it("10. Izbacivanje alerta u slučaju da se aktivnost poklapa sa već postojećom aktivnosti! Slučaj kada traje samo pola sata.", function () {
            Raspored.dodajAktivnost(div,"WT","predavanje",9,12,"Ponedjeljak");
            let dodaj=Raspored.dodajAktivnost(div,"WT","tut",9.5,10,"Ponedjeljak");
            assert.equal(dodaj,false, 'Aktivnost se poklapa sa već postojećom aktivnosti!');
        });
        it("11. Uspjesno dodavanje aktivnosti u raspored!", function () {
            let dodaj=Raspored.dodajAktivnost(div,"WT","tut",12,14,"Ponedjeljak");
            assert.equal(dodaj,true, 'Aktivnost je uspješno dodana!');
        });
        it("12. Uspjesno dodavanje aktivnosti preko cijelog rasporeda!", function () {
            let dodaj=Raspored.dodajAktivnost(div,"OOI","tut",8,21,"Utorak");
            assert.equal(dodaj,true, 'Aktivnost je dodana preko cijelog rasporeda za dan Utorak!');
        });
        it("13. Izbacivanje alerta ako želimo dodati aktivnost za  nepostojeći dan!", function () {
            let div2=document.createElement("div");
            Raspored.iscrtajRaspored(div2,["Ponedjeljak","Utorak","Četvrtak","Petak"],8,21);
            let dodaj=Raspored.dodajAktivnost(div2,"WT","predavanje",10,12,"Srijeda");
            assert.equal(dodaj,false, 'Ne može se dodati aktivnost u nepostojeći dan!');
        });
        it("14. Uspjesno dodavanje aktivnosti koje ne pocinju na cijeli sat", function () {
            let dodaj=Raspored.dodajAktivnost(div,"OOI","tut",9.5,12,"Srijeda");
            assert.equal(dodaj,true, 'Aktivnost treba dodati i na pola sata!');
        });
        it("15. Uspjesno dodavanje aktivnosti koje ne pocinju na cijeli sat! Provjera stila", function () {
            let div15=document.createElement("div");
            Raspored.iscrtajRaspored(div15,["Ponedjeljak","Utorak","Srijeda","Četvrtak","Petak"],8,21);
            Raspored.dodajAktivnost(div15,"OOI","tut",9.5,12,"Petak");
            let stil=getComputedStyle(div15.getElementsByTagName("table")[0].rows[5].cells[4]);
            let body=document.getElementsByTagName("body")[0];
            body.appendChild(div15);
            div15.style.display="none";
            assert.equal(stil.borderLeftStyle,"dashed", 'Aktivnost treba dodati i na pola sata!');
        });
    });
});