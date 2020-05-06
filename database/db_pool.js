const {DATABASE}=require('./db');

const MYSQL = require('mysql');

//convert callback code to promises 
const {promisify}=require('util');

const POOL = MYSQL.createPool(DATABASE);

POOL.getConnection((err, conn)=>{
    if(conn && !err){
        conn.release(); 
        console.log('OK CONNECTION DATABASE_POOL');   
        return;
    }else{
        console.log(`ERROR CONNECTION DATABASE_POOL -> ${err.message}`);
    }
});

//cada vez que quiera hacer una consulta puedo usar promesas
POOL.query=promisify(POOL.query);

module.exports=POOL;