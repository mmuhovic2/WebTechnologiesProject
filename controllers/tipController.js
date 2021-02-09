const db = require('../db.js');
const Tip = db.tip;
 
exports.create = (req, res) => {  
    let tijelo=req.body;
    Tip.findOrCreate({
        where:{
        naziv:tijelo["naziv"]
        } 
    }).then((tip) => {
        res.json(tip);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findAll = (req, res) => {
    Tip.findAll().then( tipovi => {
        res.json(tipovi);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findById = (req, res) => {  
    Tip.findOne({where:{id:req.params.id}}).then(tip => {
        if(tip){
            res.json(tip);
        }else{
            res.json({message:"Ne postoji tip sa datim id-om!"});
        }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.update = (req, res) => {
    let tijelo=req.body;
    Tip.findAll({
         where: { 
             id: {[db.Sequelize.Op.ne]:req.params.id}
            } 
    }).then(async (tipovi) => {
            let tip=tipovi.find(n=>n.naziv==tijelo["naziv"]);
            if(tip) res.json({message:"Ne može se izvršiti update tipa! Podaci nisu validni!"});
            else {
                await Tip.update({naziv:tijelo["naziv"]},{where:{id:req.params.id}});
                res.json({message:"Uspješno update-ovan tip!"});
            }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.delete = (req, res) => {
    Tip.destroy({
        where: { id: req.params.id }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisan tip!"});
        else res.json({message:"Tip sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};