const db = require('../db.js');
const Dan = db.dan;
 
exports.create = (req, res) => {  
    let tijelo=req.body;
    Dan.findOrCreate({
        where:{naziv:tijelo["naziv"]}
    }).then((dan) => {
        res.json(dan);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findAll = (req, res) => {
    Dan.findAll().then( dani => {
        res.json(dani);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findById = (req, res) => {  
    Dan.findOne({where:{id:req.params.id}}).then(dan => {
        if(dan){
            res.json(dan);
        }else{
            res.json({message:"Ne postoji dan sa datim id-om!"});
        }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.update = (req, res) => {
    let tijelo=req.body;
    Dan.findAll({
        where: { 
            id: {[db.Sequelize.Op.ne]:req.params.id}
           } 
   }).then(async (dani) => {
           let dan=dani.find(n=>n.naziv==tijelo["naziv"]);
           if(dan) res.json({message:"Ne može se izvršiti update dana! Podaci nisu validni!"});
           else {
               await Dan.update({naziv:tijelo["naziv"]},{where:{id:req.params.id}});
               res.json({message:"Uspješno update-ovan dan!"});
           }
   }).catch(function (err) {
        res.json({message:err});
   });
};
 

exports.delete = (req, res) => {
    Dan.destroy({
        where: { id: req.params.id }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisan dan!"});
        else res.json({message:"Dan sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};