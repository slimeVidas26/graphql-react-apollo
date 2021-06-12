const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean} = require('graphql');
const axios = require('axios')

//LaunchType
const LaunchType = new GraphQLObjectType({
    name : 'Launch',
    fields : ()=>({
        flight_number : {type : GraphQLInt},
        mission_name : {type : GraphQLString},
        launch_year : {type : GraphQLString},
        launch_date_local : {type : GraphQLString},
        launch_success : {type : GraphQLBoolean},
        rocket : {type : RocketType}
    })
});

//RocketType
const RocketType = new GraphQLObjectType({
    name : 'Rocket',
    fields : ()=>({
        rocket_id : {type : GraphQLString},
        rocket_name : {type : GraphQLString},
        rocket_type : {type : GraphQLString}
        

    })
})


//RootQuery
const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        Launch : {
            type : LaunchType,
            args : {
                flight_number : {type : GraphQLInt}
            },
            resolve(parent , args){
              return axios.get(`https://api.spacexdata.com/v3/launches/${args.flight_number}`)
              .then((res)=> res.data)
            }
        },
        Launches : {
            type : GraphQLList(LaunchType),
            resolve(parent , args){
                return axios.get(`https://api.spacexdata.com/v3/launches`)
                .then((res)=> res.data)
            }
        },
        Rocket : {
            type : RocketType,
            args : {
                id : {type : GraphQLInt}
            },
            resolve(parent , args){
              return axios.get(`https://api.spacexdata.com/v3/rockets/${args.id}`)
              .then((res)=> res.data)
            }
        },
        Rockets : {
            type : GraphQLList(RocketType),
            resolve(parent , args){
                return axios.get(`https://api.spacexdata.com/v3/rockets`)
                .then((res)=> res.data)
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query : RootQuery
})