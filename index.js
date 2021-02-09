const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const db = require('./db.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

const aktivnostRouter = require('./routes/aktivnostRoute');
const danRouter = require('./routes/danRoute');
const grupaRouter = require('./routes/grupaRoute');
const predmetRouter = require('./routes/predmetRoute');
const studentRouter = require('./routes/studentRoute');
const tipRouter = require('./routes/tipRoute');

app.use('/v2/aktivnost', aktivnostRouter);
app.use('/v2/dan', danRouter);
app.use('/v2/grupa', grupaRouter);
app.use('/v2/predmet', predmetRouter);
app.use('/v2/student', studentRouter);
app.use('/v2/tip', tipRouter);

//SPIRALA 4

db.sequelize.sync({force:true}).then(async n=> {
    const RMA = await db.predmet.create({naziv:"RMA"});
    const WT = await db.predmet.create({naziv:"WT"});
    const grupa1 = await db.grupa.create({naziv:"RMAgrupa1",PredmetId:RMA.id});
    const grupa2 = await db.grupa.create({naziv:"WTgrupa1",PredmetId:WT.id});
    const grupa3 = await db.grupa.create({naziv:"WTgrupa2",PredmetId:WT.id});
    const student1 = await db.student.create({ime:"Neko Nekić",index:"12345"});
    const student2 = await db.student.create({ime:"Četvrti Neko",index:"18009"});
    await student1.addGrupa(grupa2);
    await student2.addGrupa(grupa1);
    const dan1 = await db.dan.create({naziv:"Ponedjeljak"});
    const dan2 = await db.dan.create({naziv:"Utorak"});
    const tip1 = await db.tip.create({naziv:"Predavanje"});
    const tip2 = await db.tip.create({naziv:"Tutorijal"});
    await db.aktivnost.create({naziv:"RMApredavanje1",pocetak:9,kraj:12,PredmetId:RMA.id,DanId:dan1.id,TipId:tip1.id});
    await db.aktivnost.create({naziv:"WTtutorijal1",pocetak:12,kraj:13,PredmetId:WT.id,DanId:dan2.id,TipId:tip2.id,GrupaId:grupa2.id});
    console.log(" ");
    console.log("--------BAZA KREIRANA------------");
});

app.post('/v2/zadatak2', function (req, res) {
    let studentiNiz = req.body["studenti"];
    let grupa1 = req.body["grupa"];
    let povratniNiz = [];
    db.grupa.findOne({
        where: {
            naziv: grupa1
        }
    }).then(grupa => {
        db.student.findAll({
            include: 'grupe'
        }).then(async studenti => {
            for (clan of studentiNiz) {
                let student = studenti.find(n => n.index == clan.index);
                if (!student) {
                    const s = await db.student.create({
                        ime: clan.ime,
                        index: clan.index
                    });
                    await s.setGrupe(grupa);
                } else if (clan.ime != student.ime && clan.index == student.index) {
                    povratniNiz.push("Student " + clan.ime + " nije kreiran jer postoji student " + student.ime + " sa istim indexom " + clan.index);
                } else {
                    let staraGrupa = student.grupe.find(g => g.PredmetId == grupa.PredmetId);
                        if (staraGrupa) {
                            await student.removeGrupa(staraGrupa);
                            await student.addGrupe(grupa);
                        } else {
                            await student.addGrupe(grupa);
                        }

                }
            }
            res.send(povratniNiz);
        });
    }).catch(err => {
        console.log(err);
    })
});

app.post('/v2/zadatak3',(req,res)=>{
   let danPoslani=req.body["dan"];
   let tipPoslani=req.body["tip"];
   let aktivnostPoslana=req.body["aktivnost"];
   db.dan.findOrCreate({
    where:{naziv:danPoslani.naziv}
   }).then((dan) => {
          db.tip.findOrCreate({
              where:{naziv:tipPoslani.naziv}
          }).then((tip) => {
             aktivnostPoslana.DanId=dan[0].id;
             aktivnostPoslana.TipId=tip[0].id;
            db.aktivnost.findAll().then(async (aktivnosti) => {
                if (validirajAktivnost1(aktivnosti, aktivnostPoslana)) {
                    await db.aktivnost.create(aktivnostPoslana);
                    res.json({message:"Aktivnost uspješno kreirana!"});
                } else {
                   if(dan[1]) await db.dan.destroy({where:{id:dan[0].id}});
                   if(tip[1]) await db.tip.destroy({where:{id:tip[0].id}});
                    res.json({message:"Aktivnost nije validna!"});
                }
            }).catch((err)=>{
                  res.json({message:err});
            });
          }).catch((err)=> {
              res.json({message:err});
          });
   }).catch( (err)=> {
    res.json({message:err});
   });
});

function validirajAktivnost1(podaci, nova) {
    let poklapanje = false;
    podaci.forEach((stara) => {
        if ((stara.pocetak <= nova.pocetak && stara.kraj > nova.pocetak || stara.pocetak < nova.kraj && stara.kraj >= nova.kraj || nova.pocetak <= stara.pocetak && nova.kraj >= stara.kraj) && stara.DanId == nova.DanId) {
            poklapanje = true;
        }
    });
    return nova.pocetak < nova.kraj && nova.pocetak >= 8 && nova.kraj <= 20 && Number.isInteger(2 * nova.pocetak) && Number.isInteger(2 * nova.kraj) && !poklapanje
}















//--------------------SPIRALA3-----------------------------------

app.post('/v1/predmet', function (req, res) {
    let tijelo = req.body;
    let novaLinija = tijelo["naziv"] + "\n";
    fs.readFile('predmeti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let podaci = data.split("\n");
        if (podaci.includes(tijelo["naziv"]))
            res.json({
                message: "Naziv predmeta postoji!"
            });
        else {
            fs.appendFile('predmeti.txt', novaLinija, function (err) {
                if (err) throw err;
                res.json({
                    message: "Uspješno dodan predmet!"
                });
            });
        }
    });
});

app.get('/v1/predmeti', function (req, res) {
    fs.readFile('predmeti.txt', 'utf8', function (err, data) {

        if (err) throw err;
        let podaci = data.split("\n");
        let predmeti = []
        podaci.forEach((podatak) => {
            if (podatak !== "") predmeti.push({
                naziv: podatak
            });
        });
        res.json(predmeti);
    });
});

app.post('/v1/aktivnost', function (req, res) {
    let tijelo = req.body;
    let novaLinija = tijelo["naziv"] + "," + tijelo["tip"] + "," + tijelo["pocetak"] + "," + tijelo["kraj"] + "," + tijelo["dan"] + "\n";
    fs.readFile('aktivnosti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let aktivnost = {
            naziv: tijelo["naziv"],
            tip: tijelo["tip"],
            pocetak: Number(tijelo["pocetak"]),
            kraj: Number(tijelo["kraj"]),
            dan: tijelo["dan"]
        };
        let podaci = data.split("\n");
        if (tijelo["naziv"] == "" || tijelo["tip"] == "" || !validirajAktivnost(podaci, aktivnost))
            res.json({
                message: "Aktivnost nije validna!"
            });
        else {
            fs.appendFile('aktivnosti.txt', novaLinija, function (err) {
                if (err) throw err;
                res.json({
                    message: "Uspješno dodana aktivnost!"
                });
            });
        }
    });
});

app.get('/v1/aktivnosti', function (req, res) {
    fs.readFile('aktivnosti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let podaci = data.split("\n");
        let aktivnosti = []
        podaci.forEach((podatak) => {
            if (podatak !== "") {
                let vrijednosti = podatak.split(",");
                aktivnosti.push({
                    naziv: vrijednosti[0],
                    tip: vrijednosti[1],
                    pocetak: Number(vrijednosti[2]),
                    kraj: Number(vrijednosti[3]),
                    dan: vrijednosti[4]
                });
            }
        });
        res.json(aktivnosti);
    });
});
app.get('/v1/predmet/:naziv/aktivnost', function (req, res) {
    fs.readFile('aktivnosti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let podaci = data.split("\n");
        let aktivnosti = []
        podaci.forEach((podatak) => {
            if (podatak !== "") {
                let vrijednosti = podatak.split(",");
                if (vrijednosti[0] === req.params.naziv) aktivnosti.push({
                    naziv: vrijednosti[0],
                    tip: vrijednosti[1],
                    pocetak: Number(vrijednosti[2]),
                    kraj: Number(vrijednosti[3]),
                    dan: vrijednosti[4]
                });
            }
        });
        res.json(aktivnosti);
    });
});

app.delete('/v1/predmet/:naziv', function (req, res) {
    fs.readFile('predmeti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let podaci = data.split("\n");
        let duzina = podaci.length;
        podaci = podaci.filter((podatak) => {
            return podatak != req.params.naziv;
        });
        if (duzina == podaci.length) {
            res.json({
                message: "Greška - predmet nije obrisan!"
            });
        } else {
            let sadrzaj = podaci.join("\n");
            fs.writeFile('predmeti.txt', sadrzaj, 'utf8', function (err) {
                if (err) throw err;
                res.json({
                    message: "Uspješno obrisan predmet!"
                });
            });
        }
    });
});

app.delete('/v1/aktivnost/:naziv', function (req, res) {
    fs.readFile('aktivnosti.txt', 'utf8', function (err, data) {
        if (err) throw err;
        let podaci = data.split("\n");
        let duzina = podaci.length;
        podaci = podaci.filter((podatak) => {
            let niz = podatak.split(",");
            return niz[0] != req.params.naziv;
        });
        if (duzina == podaci.length) {
            res.json({
                message: "Greška - aktivnost nije obrisana!"
            });
        } else {
            let sadrzaj = podaci.join("\n");
            fs.writeFile('aktivnosti.txt', sadrzaj, 'utf8', function (err) {
                if (err) throw err;
                res.json({
                    message: "Uspješno obrisana aktivnost!"
                });
            });
        }
    });
});

app.delete('/v1/all', function (req, res) {
    fs.writeFile('predmeti.txt', "", 'utf8', function (err) {
        if (err) {
            res.json({
                message: "Greška - sadržaj datoteka nije moguće obrisati!"
            });
            throw err;
        }
        fs.writeFile('aktivnosti.txt', "", 'utf8', function (err) {
            if (err) {
                res.json({
                    message: "Greška - sadržaj datoteka nije moguće obrisati!"
                });
                throw err;
            }
            res.json({
                message: "Uspješno obrisan sadržaj datoteka!"
            });
        });
    });
});

function validirajAktivnost(podaci, aktivnost) {
    let dani = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak", "Cetvrtak", "Petak"];
    let poklapanje = false;
    podaci.forEach((podatak) => {
        let vrijednosti = podatak.split(",");
        if ((vrijednosti[2] <= aktivnost.pocetak && vrijednosti[3] > aktivnost.pocetak || vrijednosti[2] < aktivnost.kraj && vrijednosti[3] >= aktivnost.kraj || aktivnost.pocetak <= vrijednosti[2] && aktivnost.kraj >= vrijednosti[3]) && vrijednosti[4] == aktivnost.dan) {
            poklapanje = true;
        }

    });
    return dani.includes(aktivnost.dan) && aktivnost.pocetak < aktivnost.kraj && aktivnost.pocetak >= 8 && aktivnost.kraj <= 20 && Number.isInteger(2 * aktivnost.pocetak) && Number.isInteger(2 * aktivnost.kraj) && !poklapanje
}
app.listen(3000);

module.exports = app;