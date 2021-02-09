const db = require('../db.js');
const Student = db.student;
 
exports.create = (req, res) => {  
    let tijelo=req.body;
    Student.findOrCreate({
        where:{
            index:tijelo["index"]
        },
        defaults:{
            ime:tijelo["ime"]
        }
    }).then((student) => {
        if(student[1] || student[0].ime==req.body["ime"] && !student[1]) res.json(student);
        else res.json({message:"Već postoji student sa datim index-om!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findAll = (req, res) => {
    Student.findAll().then( studenti => {
        res.json(studenti);
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.findById = (req, res) => {  
    Student.findOne({where:{id:req.params.id}}).then(student => {
        if(student){
            res.json(student);
        }else{
            res.json({message:"Ne postoji student sa datim id-om!"});
        }
    }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.update = (req, res) => {
    let tijelo=req.body;
    Student.findAll({
        where: { 
            id: {[db.Sequelize.Op.ne]:req.params.id}
           } 
   }).then(async (studenti) => {
           let student=studenti.find(n=>n.index==tijelo["index"]);
           if(student) res.json({message:"Ne može se izvršiti update studenta! Podaci nisu validni!"});
           else {
               await Student.update({ime:tijelo["ime"],index:tijelo["index"]},{where:{id:req.params.id}});
               res.json({message:"Uspješno update-ovan student!"});
           }
   }).catch(function (err) {
        res.json({message:err});
    });
};
 

exports.delete = (req, res) => {
    Student.destroy({
        where: { id: req.params.id }
    }).then((o) => {
        if(o) res.json({message: "Uspješno obrisan student!"});
        else res.json({message:"Student sa datim id-om ne postoji!"});
    }).catch(function (err) {
        res.json({message:err});
    });
};