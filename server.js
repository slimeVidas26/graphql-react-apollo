const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema')


const app = express();

//route to graphql
app.use('/graphql' , graphqlHTTP({
    schema ,
    graphiql : true
}))
//server
const PORT = process.env.PORT || 4000;
app.listen(PORT , ()=> console.log(`Server on port ${PORT}`))