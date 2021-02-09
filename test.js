let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();
const fs = require('fs');
chai.use(chaiHttp);


let sadrzaj = fs.readFileSync('testniPodaci.txt', 'utf8');
let podaci = sadrzaj.split("\n");
podaci.forEach((podatak) => {
    let objekat={}
    let operacije=["GET","POST","DELETE"];
    if(!operacije.includes(podatak.split(",")[0])) objekat={operacija:"",ruta:"",ulaz:"",izlaz:""};
    else objekat=kreirajObjekatIzJSON(podatak);

    if (objekat.operacija == 'GET') {
        it(objekat.operacija + objekat.ruta, function (done) {
            chai.request(server)
                .get(objekat.ruta)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.should.be.eql(objekat.izlaz);
                    done();
                });
        });
    } else if (objekat.operacija == 'POST') {
        it(objekat.operacija + objekat.ruta, function (done) {
            chai.request(server)
                .post(objekat.ruta)
                .send(objekat.ulaz)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("message");
                    res.body.should.be.eql(objekat.izlaz);
                    done();
                });
        });
    } else if (objekat.operacija == 'DELETE') {
        it(objekat.operacija + objekat.ruta, function (done) {
            chai.request(server)
                .del(objekat.ruta)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("message");
                    res.body.should.be.eql(objekat.izlaz);
                    done();
                });
        });
    }
});

function kreirajObjekatIzJSON(string){
    let nizVrijednosti=string.replace(/\\/gi,"").split(",");
    let objekat={};
    objekat.operacija=nizVrijednosti[0];
    objekat.ruta=nizVrijednosti[1];
    let ulaz='';
    let izlaz='';
    if(nizVrijednosti[0]=='POST'){
        for(let i=2;i<nizVrijednosti.length-1;i++){
           ulaz+=nizVrijednosti[i];
           if(i!=nizVrijednosti.length-2) ulaz+=",";
        }
        izlaz=nizVrijednosti[nizVrijednosti.length-1];
    }else{
        ulaz=nizVrijednosti[2];
        for(let i=3;i<nizVrijednosti.length;i++){
            izlaz+=nizVrijednosti[i];
            if(i!=nizVrijednosti.length-1) izlaz+=",";
        }
    }
    objekat.ulaz=JSON.parse(ulaz);
    objekat.izlaz=JSON.parse(izlaz);
    return objekat;
}