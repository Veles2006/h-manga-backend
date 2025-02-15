const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://127.0.0.1/h-manga');

        console.log('Connect successfully!!!')
    } catch (error) {
        console.log('Connect false!!!')
    }
}

module.exports = { connect };