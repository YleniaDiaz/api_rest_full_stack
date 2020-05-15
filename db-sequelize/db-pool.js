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
 * MODEL
 */
const User = sequelize.define('users', {
    //attributes
    username:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    }, 
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }, 
    fullname: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    //options
    freezeTableName: true,
    timestamps: false
});

/**
 * SYNC ALL MODELS WITH DB
 */
//sequelize.sync();
sequelize.sync({force: false})
    .then(()=>{
        console.log('SYNC MODEL');
    });

/**
 * SELECT * USER //LIST
 */
/*User.findAll({attributes: ['username']}).then(users => {
    let usersString = JSON.stringify(users, null, 4);
    let usersObject = JSON.parse(usersString);
    console.log(usersObject);
    //console.log(`ALL USERS: ${JSON.stringify(users, null, 4)}`);
});*/

/*User.findAll().then(users => {
    let usersString = JSON.stringify(users, null, 4);
    let usersObject = JSON.parse(usersString);
    //SELECT *
    console.log(`ALL USERNAMES: ${usersObject.map((user)=>user.username)}`);
    //WHEREs
    console.log(`USER KKK: ${usersObject.filter((user)=>user.username=='kkk')}`);
});*/

/**
 * ADD 
 */

/*User.create({username: 'Juan', password: '1234', fullname: 'Juan Pérez'})
    .then(insertedUser=>{
        console.log(`ID: ${insertedUser.id}`);
    });*/

/**
 * EDIT
 */
    //GET
/*User.findAll({
    where: {
        id: 30
    }
}).then(users=>{
    //console.log(user[0].dataValues);
    if(users.length>0){
        let usersString = JSON.stringify(users, null, 4);
        let usersObject = JSON.parse(usersString);
        console.log(usersObject);
    }else{
        console.log('No hay ningun usuario con ese ID');
    }
    
});*/

//POST
/*User.update({
        username: 'Jon',
        password: '1234',
        fullname: 'Jon Calvo'
    },{
        where: {
            id: 32
        }
    }
).then(users=>console.log('UPDATE OK'));*/

/**
 * DELETE
 */
/*User.destroy({
        where:{
            id: 32
        }
    }
).then(()=>console.log('DELETE OK'))
.catch(err=>console.log(`ERROR DELETE: ${err.message}`));*/

/**
 * AUTH
 */
//POST SIGN UP
/*async function findUser(){
    const users = await sequelize.query(`select username from users where username="pepe"`, {type: sequelize.QueryTypes.SELECT});
    console.log(users);
}
findUser();*/

/*async function insertUser(){
    const query=`insert into users (fullname, username, password) values ('Pepito Grillo', 'Pepito', '1234')`;
    const users = await sequelize.query(query, {type: sequelize.QueryTypes.INSERT});
    console.log('INSERT OK');
}
insertUser();*/