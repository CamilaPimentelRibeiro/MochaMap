const User = (firstName, lastName, username, password) => {
    return {
        firstName: firstName,
        lastName: lastName,
        username: username,
        password: password,
        points: 0,
        role: "member"
    }
}


module.exports = User;