const BCRYPT=require('bcryptjs');
const ENCRYPT={};

ENCRYPT.encryptPassword=async (password)=>{
  console.log('password= ', password);
  const SALT=await BCRYPT.genSalt(10);
  //o pongo salt o pongo 10
  const HASH =await BCRYPT.hash(password, SALT);
  return HASH;
};

ENCRYPT.comparePassword= async (myPassword, hash) =>{
  const res= await BCRYPT.compare(myPassword, hash);
  return res;
  // res == true or res == false
};

module.exports=ENCRYPT;