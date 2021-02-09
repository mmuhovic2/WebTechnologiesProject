const db = require('../db.js');
const Aktivnost = db.aktivnost;

exports.create = (req, res) => {
    let tijelo = req.body;
    let objekat = {
        naziv: tijelo["naziv"],
        pocetak: tijelo["pocetak"],
        kraj: tijelo["kraj"],
        PredmetId: tijelo["PredmetId"],
        GrupaId: tijelo["GrupaId"],
        DanId: tijelo["DanId"],
        TipId: tijelo["TipId"]
    }
    Aktivnost.findAll().then((aktivnosti) => {
        if (validirajAktivnost(aktivnosti, objekat)) {
            Aktivnost.create(objekat).then((aktivnost) => {
                res.json(aktivnost);
            }).catch((err) => {
                res.json(err)
            });
        } else {
            res.json({
                message: "Aktivnost nije validna!"
            });
        }

    }).catch(function (err) {
        res.json({
            message: err
        });
    });
};


exports.findAll = (req, res) => {
    Aktivnost.findAll().then(aktivnosti => {
        res.json(aktivnosti);
    }).catch(function (err) {
        res.json({
            message: err
        });
    });
};


exports.findById = (req, res) => {
    Aktivnost.findOne({
        where: {
            id: req.params.id
        }
    }).then(aktivnost => {
        if (aktivnost) {
            res.json(aktivnost);
        } else {
            res.json({
                message: "Ne postoji aktivnost sa datim id-om!"
            });
        }
    }).catch(function (err) {
        res.json({
            message: err
        });
    });
};


exports.update = (req, res) => {
    let tijelo = req.body;
    let objekat = {
        naziv: tijelo["naziv"],
        pocetak: tijelo["pocetak"],
        kraj: tijelo["kraj"],
        PredmetId: tijelo["PredmetId"],
        GrupaId: tijelo["GrupaId"],
        DanId: tijelo["DanId"],
        TipId: tijelo["TipId"]
    }

    Aktivnost.findAll({
        where: { 
            id: {[db.Sequelize.Op.ne]:req.params.id}
           } 
   }).then(async (aktivnosti) => {
           if(!validirajAktivnost(aktivnosti,objekat)) res.json({message:"Ne može se izvršiti update aktivnosti! Podaci nisu validni!"});
           else {
               await Aktivnost.update(objekat,{where:{id:req.params.id}});
               res.json({message:"Uspješno update-ovana aktivnost!"});
           }
   }).catch(function (err) {
        res.json({message: err});
    });
};


exports.delete = (req, res) => {
    Aktivnost.destroy({
        where: {
            id: req.params.id
        }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisana aktivnost!"});
        else res.json({message:"Aktivnost sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message: err});
    });
};

function validirajAktivnost(podaci, nova) {
    let poklapanje = false;
    podaci.forEach((stara) => {
        if ((stara.pocetak <= nova.pocetak && stara.kraj > nova.pocetak || stara.pocetak < nova.kraj && stara.kraj >= nova.kraj || nova.pocetak <= stara.pocetak && nova.kraj >= stara.kraj) && stara.DanId == nova.DanId) {
            poklapanje = true;
        }
    });
    return nova.pocetak < nova.kraj && nova.pocetak >= 8 && nova.kraj <= 20 && Number.isInteger(2 * nova.pocetak) && Number.isInteger(2 * nova.kraj) && !poklapanje
}