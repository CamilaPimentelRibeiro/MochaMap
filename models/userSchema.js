const userSchema = {
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    points:{
        type: Number,
        required: true
    },
    role:{
        type: String,
        required: true
    }
}

module.exports = userSchema;
