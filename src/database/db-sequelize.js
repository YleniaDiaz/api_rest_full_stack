const Sequelize = require('sequelize');

const sequelize = new Sequelize('company', 'root', 'ylenia', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000
        //idle: 10000
    }
});

/**
 * CONNECTION
 */
sequelize.authenticate()
    .then(()=>{
        console.log('CONNECTION SEQUELIZE OK');
    }).catch(err=>{
        console.log(`ERROR SEQUELIZE: ${err.message}`);
    }); 

/**
 * SYNC ALL MODELS WITH DB
 */
//sequelize.sync();
sequelize.sync({force: false}).then(()=>{
    console.log('SYNC MODEL');
});


module.exports=sequelize;