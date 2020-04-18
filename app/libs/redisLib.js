const check = require("./checkLib.js");
const redis = require('redis');
let client = redis.createClient(
    //   port: 3000,
    //   host: '127.0.0.1',
    // no_ready_check: true,
);

//client.auth(process.env.REDIS_PASSWORD);

// redis-19510.c91.us-east-1-3.ec2.cloud.redislabs.com:19510
client.on('connect', () => {

    console.log("redis connection successfully opened");

});



let getAllUsersInAhash = (hashName, callback) => {
    client.HGETALL(hashName, (err, result) => {
        if(err){
            console.log(err);
            callback(err, null)
        }else if(check.isEmpty(result)){
            console.log("online result set is empty");
            callback(result)
            callback(null, {})
        } else {
            console.log(result);
            callback(null, result)
        }
    });
} 

let setANewOnlineUserHash = (hashName, key, value, callback) => {

    client.HMSET(hashName, [
        key, value
    ], (err, result) => {
        if(err){
            console.log(err);
            callback(err, null)
        } else {
            console.log("user has been set in the hash map");
            console.log(result)
            callback(null, result)
        }
    });

}

let deleteUserFromHash = (hashName, key) => {

    client.HDEL(hashName, key);
    return true;

}

module.exports = {
    getAllUsersInAhash: getAllUsersInAhash,
    setANewOnlineUserInHash:setANewOnlineUserHash,
    deleteUserFromHash: deleteUserFromHash
}