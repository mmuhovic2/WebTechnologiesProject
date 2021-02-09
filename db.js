const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt2018355', 'root', '', {
   host: 'localhost',
   dialect: 'mysql',
   pool: {
       max: 5,
       min: 0,
       acquire: 30000,
       idle: 10000
   },
   define:{
       timestamps:false
   }
});

const db={}
db.Sequelize=Sequelize;
db.sequelize=sequelize;

db.aktivnost = require(__dirname+"/modeli/aktivnost.js")(sequelize, Sequelize.DataTypes);
db.dan = require(__dirname+"/modeli/dan.js")(sequelize, Sequelize.DataTypes);
db.grupa = require(__dirname+"/modeli/grupa.js")(sequelize, Sequelize.DataTypes);
db.predmet = require(__dirname+"/modeli/predmet.js")(sequelize, Sequelize.DataTypes);
db.student = require(__dirname+"/modeli/student.js")(sequelize, Sequelize.DataTypes);
db.tip = require(__dirname+"/modeli/tip.js")(sequelize, Sequelize.DataTypes);

//Relacija Predmet 1-N Grupa
db.predmet.hasMany(db.grupa,{foreignKey:{allowNull:false}});
db.grupa.belongsTo(db.predmet);

//Relacija Aktivnost N-1 Predmet
db.predmet.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.predmet);

//Relacija Aktivnost N-0 Grupa;
db.grupa.hasMany(db.aktivnost);
db.aktivnost.belongsTo(db.grupa);

//Relacija Aktivnost N-1 Dan 
db.dan.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.dan);

//Relacija Aktivnost N-1 Tip
db.tip.hasMany(db.aktivnost,{foreignKey:{allowNull:false}});
db.aktivnost.belongsTo(db.tip);

//Relacija Student N-M Grupa
db.student.belongsToMany(db.grupa, { as: {singular:'grupa',plural:'grupe'}, through: 'studentgrupa', foreignKey: 'studentId' });
db.grupa.belongsToMany(db.student, { as: 'studenti', through: 'studentgrupa', foreignKey: 'grupaId' });


module.exports=db;