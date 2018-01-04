const expect = require('expect');
const { Users } = require('./users');





describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,
            name: 'Sachin',
            room: 'TJ'
        },
        {
            id: 2,
            name: 'Jack',
            room: 'Office'
        },
        {
            id: 3,
            name: 'Stoner',
            room: 'TJ'
        }
        ]
    });


    it('should add new user', () => {
        var users = new Users();
        var user = {
            id: 123,
            name: "John",
            room: 'Office'
        }
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should remove a user', ()=>{
        var userId = 1;
        var user = users.removeUser(userId);

       expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });
    it('should not remove the user', ()=>{
        var userId = 55;
        var user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user',()=>{
        var userId = 1;
        var resUser = users.getUser(userId);
     
        expect(resUser.id).toBe(userId);
    });

    it('should not find user',()=>{
      var userId = '99';
      var resUser = users.getUser(userId);
      expect(resUser).toNotExist();  
    });


    it('should return names for TJ', ()=>{
        var userList = users.getUserList('TJ');

        expect(userList).toEqual(['Sachin', 'Stoner']);
    });
    it('should return names for Office', ()=>{
        var userList = users.getUserList('Office');

        expect(userList).toEqual(['Jack']);
    })
});