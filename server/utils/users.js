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
    removeUser(socketid) {
        var user = this.getUserBySocketId(socketid);

        if (user) {
            this.users = this.users.filter((user) => user._socketid !== socketid);
        }
        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserBySocketId(id) {
        return this.users.filter((user) => user._socketid === id)[0];
    }
    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);

        return namesArray;
    }
    getRooms() {
        var tempRoom = this.users.map((user) => user.room);
        return tempRoom.filter(function (room, pos, self) {
            return self.indexOf(room) == pos;
        })

        // var temp = new Users();
        // return temp.removeDuplicate(tempRoom);
    }
    getAllUsers() {
        // console.log(this.users);
        var tempUser = this.users.map((user) => user.name);
        var temp = new Users();
        return temp.removeDuplicate(tempUser);
    }

    getSocketId(userName) {
        var tempList = this.users.filter((user) => user.name === userName);
        return tempList.map((id) => id._socketid)[0];
    }

    getUserId(socketId) {
        var tempList = this.users.filter((user) => user._socketid === socketId);
        // console.log(tempList);
        
        return tempList.map((user) => user.id)[0];
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

    generateRoomToken(senderSocketId, recieverSocketId) {
        
        var senderId = this.getUserId(senderSocketId);
        var recieverId = this.getUserId(recieverSocketId);
    //    console.log(recieverId);
       
        var res = '\0';
        let length = senderId.length;
        for (var i = 0; i < length; i++) {
            let temp = String.fromCharCode((senderId.charCodeAt(i)) + (recieverId.charCodeAt(i)));
            res = res.concat(temp);
        }
        console.log(res);
        
        return res;
    }
}






module.exports = { Users };