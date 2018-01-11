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
    addUser(id, name, room, _socketid) {
        var user = { id, name, room, _socketid };
        this.users.push(user);
        return user;
    }
    updateRoom(id, room) {

        var user = this.getUser(id);
        user.room = room;
    }
    removeUser(id) {
        var user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);

        return namesArray;
    }
    getRooms() {

        var tempRoom = this.users.map((user) => user.room);
        var temp = new Users();
        return temp.removeDuplicate(tempRoom);
    }
    getAllUsers() {
        // console.log(this.users);
        var tempUser = this.users.map((user) => user.name);
        var temp = new Users();
        return temp.removeDuplicate(tempUser);
    }



    removeDuplicate(arr) {
        let unique_array = []
        for (let i = 0; i < arr.length; i++) {
            if (unique_array.indexOf(arr[i]) == -1) {
                unique_array.push(arr[i])
            }
        }
        return unique_array
    }
}






module.exports = { Users };