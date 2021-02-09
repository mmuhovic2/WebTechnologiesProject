const db = require('../db.js');
const Grupa = db.grupa;
 
exports.create = (req, res) => {  
    let tijelo=req.body;
    Grupa.findOrCreate({
        where:{
            naziv:tijelo["naziv"],
            PredmetId:tijelo["PredmetId"]
        }
    }).then((grupa) => {
        res.json(grupa);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findAll = (req, res) => {
    Grupa.findAll().then( grupe => {
        res.json(grupe);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findById = (req, res) => {  
    Grupa.findOne({where:{id:req.params.id}}).then(grupa => {
        if(grupa){
            res.json(grupa);
        }else{
            res.json({message:"Ne postoji grupa sa datim id-om!"});
        }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.update = (req, res) => {
    let tijelo=req.body;
    Grupa.findAll({
        where: { 
            id: {[db.Sequelize.Op.ne]:req.params.id}
           } 
   }).then(async (grupe) => {
           let grupa=grupe.find(n=>n.naziv==tijelo["naziv"] && n.PredmetId==tijelo["PredmetId"]);
           if(grupa) res.json({message:"Ne može se izvršiti update grupe! Podaci nisu validni!"});
           else {
               await Grupa.update({naziv:tijelo["naziv"],PredmetId:tijelo["PredmetId"]},{where:{id:req.params.id}});
               res.json({message:"Uspješno update-ovana grupa!"});
           }
   }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.delete = (req, res) => {
    Grupa.destroy({
        where: { id: req.params.id }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisana grupa!"});
        else res.json({message:"Grupa sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};