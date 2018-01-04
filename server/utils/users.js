// [{
//     id: '',
//     name: 'Andrew',
//     room: 'Office'
// }]

//addUser(id, name, room)
//remove
//getUserId
//getUserList

class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user);
        return user;
    }
    removeUser(id) {
        var user = this.getUser(id);

        if(user){
            this.users = this.users.filter((user)=>user.id !== id);  
        }
        return user;
    }
    getUser(id) {
       return this.users.filter((user)=> user.id === id)[0];
    }
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);

        return namesArray;
    }
}


var me = new Users();
// me.addUser(1, 'sachin', 'TJ');


//console.log(me.addUser(1, 'sachin', 'TJ'));

// class Person {
//     constructor(name, age){
//     this.name = name;
//     this.age = age;
//     }
// getUserDescription(){
//     return `${this.name} is ${this.age} year(s) old`;
// }

// }

// var me = new Person('Sachin', 23);
// console.log(me.name, me.age);
// var description = me.getUserDescription();
// console.log(description);

module.exports = { Users };