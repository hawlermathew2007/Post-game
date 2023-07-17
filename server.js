// load env var

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const bcrypt = require('bcrypt')
const indexRouter = require('./routes/index')

const app = express()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views') // views is one part of mcv (model, controller, view) => this case we want to put our 'views' to views directory
app.set('layout', 'layouts/layout.ejs') // hook up express layout
app.use(expressLayouts)
app.use(express.static('public'))

// const mongoose = require('mongoose')
// mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
// // when making web with non deploy then just connect with local MongoDB else then it will be the server on the web somewhere
// const db = mongoose.connection
// db.on('error',  error => console.error(error))
// db.once('open',  () => console.log('Connected to mongoose'))

const { MongoClient } = require('mongodb') // mongoClient is used to connect to mongodb database

async function main() {     // connect to cluster

    const uri = process.env.DATABASE_URL

    // an instance of mongo client
    const client = new MongoClient(uri)

    try{
        await client.connect() // this return a promise => use await to indicate that you should block further execution untill the operation has completed

        await listDatabases(client)

    } catch(e){
        console.error(e)
    } finally{
        await client.close()
        console.log('close')
    }

}

async function listDatabases(client) {
    
    const dbList = await client.db().admin().listDatabases()
    console.log(dbList)

    console.log('Databases: ')
    dbList.databases.forEach((database) => {
        console.log(`- ${database.name}`)
    });

}

main().catch(console.error)

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)