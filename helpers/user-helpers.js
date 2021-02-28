var  db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { log } = require('debug')
const { response } = require('express')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let emailExist=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(!emailExist){
                userData.Password=await bcrypt.hash(userData.Password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
            })
            }else{
                reject()
            }
            console.log(userData);
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            letresponse={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log('login success');
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed');
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed');
                resolve({status:false})
            }
        })
    }
}