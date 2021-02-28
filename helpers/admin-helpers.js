var  db=require('../config/connection')
var collection=require('../config/collection')
const bcrypt=require('bcrypt')
const { response } = require('express')
var objectId=require('mongodb').ObjectID
const { ObjectID } = require('mongodb')
module.exports={
    addUser:(userData)=>{
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
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).removeOne({_id:ObjectID(userId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(userId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(userId,userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:ObjectID(userId)},{
                $set:{
                    Name:userDetails.Name,
                    Username:userDetails.Username,
                    Email:userDetails.Email,
                    Job:userDetails.Job
                }
            }).then((response)=>{
                resolve()
            })
        })
    }
} 