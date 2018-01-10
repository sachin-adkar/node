var { User } = require('./../models/user');

var authenticate = async (req, res) => {
    try {
        var body = _.pick(req.body, ['name', 'password']);
        var user = await User.findUser(body);
        if (!user) {
            return Promise.reject();
        }
        else 
        next();
    }
    catch(e) {
        res.status(401).send();
    }
};

module.exports = { authenticate };