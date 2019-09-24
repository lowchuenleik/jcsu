import React, {Component} from 'react';

import Graph from "react-graph-vis";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import { connect } from 'react-redux';
import history from "../../history";
import { getProfileFetch } from '../../actions/ravenActions';
import {fetchUserProfile,fetchAllUsers} from "../../actions/userActions";
import { fetchStudentsOfSubject,getAllSubjects } from "../../actions/subjectActions";

import UserProfile from "./UserProfile";
import { Link } from "react-router-dom";


import Prim from '../../constants/Prim'

let DIR = 'assets/img/faces/';

class GraphNet extends Component {

    constructor(){
      super();
      this.state = {
          details:{},
          isAuth: false,
          network: null,
          nodes: [],
        };
      this.setNetworkInstance = this.setNetworkInstance.bind(this);
    }

    setNetworkInstance(nw) {
        this.setState({
            network: nw,
        });
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log("Component did update! Here look at props, ",this.props);
        this.props.getProfileFetch();
        // if (prevProps.isAuth !== this.props.isAuth){
        //     this.setState(this.state);
        // }
        // if (prevProps !== this.props){
        // }
        console.log("ALL USERS : ",this.props.all_users);
    }

    logout(){
        localStorage.removeItem("token");
        this.setState({isAuth:false});
        history.push('/');
    }

    componentWillMount(){
        this.setState({nodes:[]})
    }
    componentDidMount() {
        const params = new URLSearchParams(window.location.search);
        const loggedin = params.get('loggedin');

        this.props.getAllUsers();
        this.props.getProfileFetch();
        this.props.getAllSubjects();

        if (loggedin){
            fetch('/api/authenticate', {
                method: 'get',
                headers: {
                  'Content-Type': 'application/json'
            }
            })
            .then(res => {
                if (res.status === 200) {
                    console.log("Succesful repsonse",res);
                    return res.json();
                    // localStorage.setItem('username', data.data.username);
                    // localStorage.setItem('token', data.data.tokenID);
                } else {
                    const error = new Error('Please log in again, session expired.');
                    throw error;
                }
            })
            .then((data)=>{
                console.log("JSON PARSED",data);
                localStorage.setItem('token', data.token);
                this.props.getProfileFetch();
                history.push('/');
            })
            .catch(err => {
                console.error("ERROR IN GRAPHNET MOUNTING",err);
                alert('We\'ve run into a problem \n\n' + err);
            });
        }
    }

    triggerFetch(user){
          this.props.getUser(user);
    }

    graphRescale(direction,scale,pointer){
        if(this.state.network!==null && this.state.network.getScale() <= 0.20 )//the limit you want to stop at
            {
                const newCameraPosition = {
                    scale: scale+0.01
                    // animation: {duration: 1000, easingFunction: "easeInOutQuad"}
                };
                this.state.network.moveTo(newCameraPosition); //set this limit so it stops zooming out here
            }
    }

    isConnected(target,edges,nodes){
        return true;
    }

    getRndInteger(min, max) {
        return ;
    }

    render (){

        const nodes = [];

        // let nodes = this.state.nodes;
        let edges = [];
        let new_edges = [];

        let allusers = this.props.all_users === undefined ? [{username:"broken"}] : this.props.all_users;
        let username_here = this.props.username === undefined ? "None" : this.props.username;

        let random_edge_flag = false;

        //A crude check for complete loading and save the effort otherwise?
        if (true){

            let all_subjects = this.props.all_subjects;
            let subject_mapping = {};

            all_subjects.forEach(function(item,index){
                subject_mapping[item.name] = []
            });

            allusers.forEach(function(item,index){
                item.visited = false;
                try{
                    subject_mapping[item.subject.name].push(item);
                } catch (e) {
                    console.log("ERROR",e);
                }
            });

            //Iterate over each subject in subject mapping now and crudely do some graph connecting
            console.log("ALLSUBJECT UNIQUE CHECK",(new Set(all_subjects)).length,all_subjects.length);
            all_subjects.forEach(function(subject,index){
                //Now operate on a cluster singly, with each cluster being a bunch of users
                let usernodes = subject_mapping[subject.name];

                //Add a central non visible node
                console.log("EXISTING NODES",nodes);

                let random_edges = Math.floor(Math.random() * (1000))
                let subj_node = {
                    id: subject.name + index + random_edges,
                    size:1,
                }

                //Dup checker, get all current node ids
                let node_ids = []
                nodes.map((val,ind)=>{node_ids.push(val.id)})
                if (!node_ids.includes(subj_node.id)){
                    nodes.push(subj_node)
                } else{
                    console.log("INCLUDES ALREADY, LOOK HERE", nodes)
                }

                for (let i=0;i<usernodes.length;i++){

                    //Create an edge from center node to all
                    edges.push({from:subject.name+index+random_edges,
                        to: usernodes[i].username});

                    if (i === usernodes.length - 1) break;
                    
                    //Must have the primary line connecting them sequentially to ensure it's a connected graph
                    edges.push({from:usernodes[i].username,
                            to: usernodes[i+1].username,
                            title: "Studies with"});
                    usernodes[i].visited = true;
                    usernodes[i+1].visited = true;

                    if (random_edge_flag){
                        //Randomly choose how many additional edges to form
                        let max = 3;
                        let min = 0;
                        let random_edges = Math.floor(Math.random() * (max - min) ) + min
                        for (let j=0;j<=random_edges;j++){
                            //Randomly choose one that's not the next or itself!
                            let random_neighbour = Math.floor(Math.random() * (usernodes.length-1));

                            //if already visited then we want to move on to avoid causing repeated loopbacks
                            if (usernodes[random_neighbour].visited){
                                continue
                            }

                            // //Above check might invalidate the need for this...
                            // //Cannot and don't want it to be the next guy or this guy itself
                            // while (random_neighbour === i || random_neighbour === i+1){
                            //     random_neighbour = Math.floor(Math.random() * (usernodes.length-1));
                            // }

                            //Add this new random edge.
                            edges.push({from:usernodes[i].username,
                                to: usernodes[random_neighbour].username,
                                title: "Studies with"})
                        }
                    } 
                }
                try{
                // Make round circles, link them back..
                edges.push({from:usernodes[usernodes.length-1].username,
                    to:usernodes[0].username});   
                } catch (e){
                    console.log("FAILED TO ROUND BACK; usernodes->",usernodes)
                }


            });

            console.log('ALLUSERS',allusers);

            allusers.forEach(function (item, index) {
                //Creates the nodes
                let temp_fix;
                try{
                    temp_fix = require(`assets/img/faces/${item.username}.jpg`);
                } catch (e) {
                    temp_fix = require("assets/img/faces/1.jpg");
                }

                let node_size = item.username === username_here ? 150 : 50;
                nodes.push({id:item.username,
                    shape: 'circularImage',
                    image: temp_fix,
                    font: {
                        color:"black",
                        size:"20",
                        face:"roboto"
                    },
                    size: node_size,
                    label: `${item.username}`,
                    already_linked: false,
                    subject:item.subject.name});
                    // accommodation:item.accommodation.name});

            });

            // allusers.forEach(function (item, index) {
            //     //Now we want to create the edges
            //     //Note right now it will be a BIDIRECTIONAL graph
            //     //Might be rather slow on rendering side. Could push this to backend
            //     for (let i=index+1; i<allusers.length; i++){
            //         let other_item = allusers[i];
            //         if (item.accommodation !== undefined && other_item.accommodation !== undefined && item.accommodation._id === other_item.accommodation._id){
            //             edges.push({
            //                 from:item.username,
            //                 to:other_item.username,
            //                 color:"blue"
            //             })
            //         }
            //         if (item.subject !== undefined && other_item.subject !== undefined && item.subject._id === other_item.subject._id) {
            //             // let condition = this.isConnected(other_item,edges,allusers);
            //             console.log("ALREADY LINKED?",item.already_linked);
            //             if (!item.already_linked){
            //                 edges.push({
            //                     from: item.username,
            //                     to: other_item.username,
            //                     color: "red",
            //                 })
            //                 item.already_linked = true;
            //             }
            //         }
            //     }
            // });


            // //Recolor all edges linked to logged in user
            // edges.forEach(function(edge,index){
            //     if (edge.from === username_here || edge.to === username_here){
            //         new_edges.push(Object.assign({},edge,{width:3,
            //             color:{color:'red',inherit:false,hover:'yellow'},
            //             title: "YOU STUDY WITH"
            //         }))
            //     } else{
            //         new_edges.push(edge)
            //     }
            // })

        }


      // create a network
      const graph = {
        nodes: nodes,
        edges: edges
      };

      const options = {
          nodes: {
              borderWidth: 2,
              size: 30,
              color: {
                  border: '#222222',
                  background: '#666666'
              },
              font: {color: '#eeeeee'},
              shadow: true,
              shapeProperties: {
                interpolation: false    // 'true' for intensive zooming
              }
          },
          edges: {
              color: 'red',
              smooth:{
                  forceDirection: "none"
              }
          },
          layout: {improvedLayout: false},
        //   physics: {
        //     "repulsion": {
        //         "springLength": 90,
        //         "springConstant": 0.37,
        //         "nodeDistance": 100,
        //         "damping": 0.11
        //       },
        //       minVelocity: 0.75,
        //       solver: "repulsion",
        //       timestep: 0.33,
        //       stabilization: {iterations: 150}
        //   }
          physics:{
            "barnesHut": {
                "avoidOverlap": 0.2
              }
          }
      };

      const { classes } = this.props;

      let _this = this; //hacky way to access outer "this"
      const events = {
          select: function (event) {
              let {nodes, edges} = event;
              console.log("Selected nodes:");
              console.log(nodes);
              console.log("Selected edges:");
              console.log(edges);
              if (nodes[0]!==undefined){
                  _this.triggerFetch(nodes[0]);
              }
          },
          zoom: function (event) {
              let {direction,scale,pointer} = event;
              _this.graphRescale(direction,scale,pointer);
          }
      };

      const userLoggedIn = (
          <div>
              <div className={classes.section} style={{paddingTop:0}}>
                <h1 className={classes.title}>Logged in as: {this.props.username}</h1>
                <Link to="/all">
                    <Button
                        color="primary"
                        size="lg"
                        >
                        Grid
                        <i style={{display:'inline-block',marginLeft:".5em"}} className="fas fa-th" />
                    </Button>
                </Link>
                <Button
                  color="primary"
                  size="lg"
                  onClick={this.logout.bind(this)}>
                  Logout
                  <i style={{display:'inline-block',marginLeft:".5em"}} className="fas fa-sign-out-alt fa-fw" />
                </Button>
              </div>
              <div className={classes.section} style={{background:'white',height:800,boxShadow: "5px 10px 18px #888888"}} >
                <Graph graph={graph}
                       options={options}
                       events={events}
                       style={{ height: "100%",width:"100%"}}
                       getNetwork={this.setNetworkInstance} />
              </div>
              {/*<div style={{color:'black'}}>*/}
              {/*  <h5>Users:*/}
              {/*      <ul>*/}
              {/*          {allusers.map(x => <li>{x.username}</li>)}*/}
              {/*      </ul>*/}
              {/*  </h5>*/}
              {/*</div>*/}
          </div>
      );

      let button_url = window.location.origin;
      if (button_url.endsWith('3000')) {
          button_url = button_url.slice(0, button_url.length-4);
          button_url = button_url + '5000/ravenlogin'
      } else{
          button_url += "/ravenlogin"
      }

      const userNotLoggedIn = (
          <Button
              href={button_url}
              color="primary">
              <i className={"fas fa-sign-in-alt"} />
              Sign in please to view the grid.
          </Button>
      );

      // let isAuthenticated = this.state.isAuth === undefined ? false : true;

      // console.log("IM RENDERING >>>>>>>>> isAUth",this.state.isAuth);
      return (
        <div className={classes.section} >
          {this.props.isAuth ? userLoggedIn : userNotLoggedIn}
        </div>
      )
    }
}

const mapStateToProps = state => {
    console.log("GraphNet mapstatetoprops",state);
  return {
        isAuth: state.raven.authenticated,
        username: state.raven.username,
        all_users: state.user.all_users,
        all_subjects: state.subject.subject_list,
        students_by_subject: state.subject.users
  }
}

const mapDispatchToProps = dispatch => ({
    getProfileFetch: () => dispatch(getProfileFetch()),
    getUser: (username) => dispatch(fetchUserProfile(username)),
    getAllUsers: () => dispatch(fetchAllUsers()),
    getAllSubjects: () => dispatch(getAllSubjects()),
    getStudentsOfSubject: (subject) => dispatch(fetchStudentsOfSubject(subject))
})

GraphNet.defaultProps = {
    all_users:[],
    all_subjects:[],
    username: "None aaaaa",
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(GraphNet));
