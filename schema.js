const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLFloat} = require('graphql');
const axios = require('axios')

//LaunchType
const LaunchType = new GraphQLObjectType({
    name : 'Launch',
    fields : ()=>({
        flight_number : {type : GraphQLInt},
        mission_name : {type : GraphQLString},
        mission_id: {type :  GraphQLList(GraphQLString)},
        launch_year : {type : GraphQLString},
        launch_date_local : {type : GraphQLString},
        rocket : {type : RocketType},
        ships : {type : GraphQLList(GraphQLString)},
        telemetry : {type : TelemetryType},
        launch_site : {type : LaunchSiteType},
        launch_success : {type : GraphQLBoolean},
        links : {type : LinksType},
        details  : {type : GraphQLString}

      
    })
});

//RocketType
const RocketType = new GraphQLObjectType({
    name : 'Rocket',
    fields : ()=>({
        rocket_id : {type : GraphQLString},
        rocket_name : {type : GraphQLString},
        rocket_type : {type : GraphQLString},
        first_stage : {type  : FirstStageType},
        second_stage : {type  : SecondStageType}
        

    })
})

//telemetry
const TelemetryType = new GraphQLObjectType({
    name : 'Telemetry',
    fields : ()=>({
        flight_club:{type : GraphQLString}
    })
   
})


//Launch Site Type
const LaunchSiteType = new GraphQLObjectType({
    name : 'LaunchSite',
    fields: ()=>({
        site_id : {type : GraphQLString},
        site_name : {type : GraphQLString},
        site_name_long : {type : GraphQLString}
    })
})


//Links Type
const LinksType = new GraphQLObjectType({
    name : 'Links',
    fields : ()=>({
        mission_patch: {type: GraphQLString},
        reddit_media: {type: GraphQLString},
        wikipedia: {type: GraphQLString},
        video_link: {type: GraphQLString},
        youtube_id: {type: GraphQLString},
        presskit: {type: GraphQLString},
        flickr_images : {type : GraphQLList(GraphQLString)}

    })
})

//cores type
const CoresType = new GraphQLObjectType({
    name : 'Cores',
    fields : ()=>({
        core_serial  : {type : GraphQLString},
        flight : {type : GraphQLInt},
        block : {type : GraphQLInt},
        land_success : {type : GraphQLBoolean},
        landing_type : {type : GraphQLString}

    })
})

//first stage
const FirstStageType = new GraphQLObjectType({
    name : 'FirstStage',
    fields : ()=>({
        cores : {type : GraphQLList(CoresType) }
    })
})

//second stage
const SecondStageType = new GraphQLObjectType({
    name : 'SecondStage',
    fields : ()=>({
        block : {type : GraphQLInt},
        payloads : {type : GraphQLList(PayloadsType) }
    })
})

//Payloads Type
const PayloadsType = new GraphQLObjectType({
    name : 'Payloads',
    fields: ()=>({
        payload_id : {type : GraphQLString},
        norad_id : {type : GraphQLList(GraphQLInt)},
        reused : {type : GraphQLBoolean},
        customers : {type : GraphQLList(GraphQLString)},
        nationality : {type : GraphQLString},
        manufacturer : {type : GraphQLString},
        payload_type : {type : GraphQLString},
        orbit : {type : GraphQLString},
        orbit_params : {type : OrbitParamsType}
    })
})

//Orbit Params Type
const OrbitParamsType = new GraphQLObjectType({
    name : 'OrbitParams',
    fields : ()=>({
        reference_system : {type : GraphQLString},
        regime : {type : GraphQLString},
        longitude : {type : GraphQLFloat},
        eccentricity : {type : GraphQLFloat},
        inclination_deg : {type : GraphQLFloat},
        lifespan_years : {type : GraphQLFloat}

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
        },
        payload : {
            type : PayloadsType,
            args : {
                payload_id : {type : GraphQLString}
            },
            resolve(parent , args){
                return axios.get(`https://api.spacexdata.com/v3/payloads/${args.payload_id}`)
                .then((res)=> res.data)
              }
        },
        payloads :{
            type : GraphQLList(PayloadsType),
            resolve(parent , args){
                return axios.get(`https://api.spacexdata.com/v3/payloads`)
                .then((res)=> res.data)
            }
        }
    }
})



module.exports = new GraphQLSchema({
    query : RootQuery
})