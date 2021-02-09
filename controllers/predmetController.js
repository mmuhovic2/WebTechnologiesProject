const db = require('../db.js');
const Predmet = db.predmet;
 
exports.create = (req, res) => {  
    let tijelo=req.body;
    Predmet.findOrCreate({
        where:{
        naziv:tijelo["naziv"]
        }
    }).then((predmet) => {
        res.json(predmet);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findAll = (req, res) => {
    Predmet.findAll().then( predmeti => {
        res.json(predmeti);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findById = (req, res) => {  
    Predmet.findOne({where:{id:req.params.id}}).then(predmet => {
        if(predmet){
            res.json(predmet);
        }else{
            res.json({message:"Ne postoji predmet sa datim id-om!"});
        }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.update = (req, res) => {
    let tijelo=req.body;
    Predmet.findAll({
        where: { 
            id: {[db.Sequelize.Op.ne]:req.params.id}
           } 
   }).then(async (predmeti) => {
           let predmet=predmeti.find(n=>n.naziv==tijelo["naziv"]);
           if(predmet) res.json({message:"Ne može se izvršiti update predmeta! Podaci nisu validni!"});
           else {
               await Predmet.update({naziv:tijelo["naziv"]},{where:{id:req.params.id}});
               res.json({message:"Uspješno update-ovan predmet!"});
           }
   }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.delete = (req, res) => {
    Predmet.destroy({
        where: { id: req.params.id }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisan predmet!"});
        else res.json({message:"Predmet sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};