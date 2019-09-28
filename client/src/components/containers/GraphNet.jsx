import React, {Component} from 'react';


import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";

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
          jesus_fresh: true,
        };
      this.setNetworkInstance = this.setNetworkInstance.bind(this);
    }

    setNetworkInstance(nw) {
        this.setState({
            network: nw,
        });
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Component did update! Here look at props, ",this.props,prevProps);
        // if (prevProps.isAuth !== this.props.isAuth){
        //     this.setState(this.state);
        // }
        // if (prevProps.isAuth !== this.props.isAuth || prevState.isAuth !== this.state.isAuth){
        //     this.props.getProfileFetch();
        // }
    }

    logout(){
        localStorage.removeItem("token");
        this.setState({isAuth:false});
        this.props.getProfileFetch();
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
        }else{
        }
    }

    triggerFetch(user){
          this.props.getUser(user);
          console.log("TRIGGER FETCH props",this.props);
          if (this.props.selected.length === 0){
              return
          }else if (Array.isArray(this.props.selected) && this.props.selected[0].subject._id !== "None"){
            this.props.getStudentsOfSubject(this.props.selected[0].subject._id)
        }
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

    focusZoom(node_id){
        console.log("ATTEMPTING TO FOCUS ON ",node_id,this.state.network);
        if(this.state.network !== null){
            this.state.network.focus(node_id,{scale:0.9});
        }
    }

    initialScale(){
        if(this.state.network!==null)//the limit you want to stop at
            {
                const scaleOption = { scale : 0.8,x:5000,y:5000 }; 
                this.state.network.moveTo(scaleOption); //set this limit so it stops zooming out here
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
        let node_ids = [];


        let allusers = this.props.all_users;
        let username_here =  this.props.username;

        let random_edge_flag = false;

        let subj_node;

        // Hacky auth stuff lol

        const params = new URLSearchParams(window.location.search);
        const tester = params.get('tester');

        let authentication = tester ? true : this.props.isAuth;

        let all_subjects = this.props.all_subjects;
        let allusernames = this.props.all_users.map((item)=>item.username);

        allusernames.push('broken','sk948','tk523','ow254');

        let temp_auth = allusernames.length === 1 ? true: allusernames.includes(this.props.username);
        console.log("In graphnet component mounting",this.props.username);
        console.log("GRPAHNET rednder\n\n\n,",this.state,this.props,temp_auth);
        let jesus_fresh = tester ? true : temp_auth;

                
        // if(this.state.network !==null){
        //     console.log("STAB STARTED")
        //     let network = this.state.network;
        //     network.once('startStabilizing', function() {
        //         var scaleOption = { scale : 0.4,position:{x:800,y:800} }; 
        //         network.moveTo(scaleOption); });
        // }


        //A crude check for complete loading and save the effort otherwise?
        if (allusers.length > 1){

            
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
            all_subjects.forEach(function(subject,index){
                //Now operate on a cluster singly, with each cluster being a bunch of users
                let usernodes = subject_mapping[subject.name];

                //Add a central node
                let random_edges = Math.floor(Math.random() * (10000));
                let space_replacer = subject.name.split(" ").join("\n");

                let x_pos = index % 6;
                let y_pos = Math.floor(index/6);
                subj_node = {
                    id: subject.name,
                    shape:'circle',
                    color:"black",
                    label: `${space_replacer}`,
                    font: {
                        color:"white",
                    },
                    title:"Subject",
                    x:(x_pos*250)-300, y:(y_pos*250)-300
                };

                //Dup checker, get all current node ids
                nodes.map((val,ind)=>{node_ids.push(val.id)});
                if (!node_ids.includes(subj_node.id)){
                    nodes.push(subj_node)
                } else{
                    console.log("INCLUDES ALREADY, LOOK HERE", nodes)
                }

                for (let i=0;i<usernodes.length;i++){

                    //Create an edge from center node to all
                    edges.push({from:subject.name,
                        to: usernodes[i].username});

                    if (i === usernodes.length - 1) break;
                    
                    //Have the primary line connecting them sequentially to ensure it's a connected graph
                    // edges.push({from:usernodes[i].username,
                    //         to: usernodes[i+1].username,
                    //         title: "Studies with"});
                    // usernodes[i].visited = true;
                    // usernodes[i+1].visited = true;

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
                // try{
                // // Make round circles, link them back..
                // edges.push({from:usernodes[usernodes.length-1].username,
                //     to:usernodes[0].username});
                // } catch (e){
                //     console.log("FAILED TO ROUND BACK; usernodes->",usernodes)
                // }


            });

            // console.log('ALLUSERS',allusers);

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
                    label: `${item.name}`,
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
                "avoidOverlap": 0.5,
                "springLength": 200
              },
            timestep: 0.5,
            stabilization: {iterations: 50}
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
          },
          startStabilizing: function(event){
              _this.initialScale();
          }
      };

      const userLoggedIn = (
          <div>
              <div className={classes.section} style={{paddingTop:"0px",paddingBottom:"0px"}}>
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
              <div className={classes.section} style={{paddingTop:0}}>
                  <h4><i>Pick a subject...</i> </h4>
                {
                        all_subjects.map((subject,index)=>{
                            return(
                            <Button
                                style={{alignItems:"center",
                                    textAlign:"center",
                                    display:"inline-block"}}
                                color="info"
                                size="lg"
                                onClick={()=>{this.focusZoom(subject.name)}}>
                                {subject.name}
                            </Button>
                            )
                        })
                    }
              {/* <GridContainer justify='center'>
                <GridItem xs={4} sm={4} md={1}>
              
                    </GridItem>
                </GridContainer> */}
              </div>
              <div className={classes.section} style={{background:'white',
                  height:800,
                  boxShadow: "5px 10px 18px #888888",
                  padding:"0px"}} >
                
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

      const notJesusFresh = (
          <h1 className={classes.title}>You must be a Jesus Fresher!</h1>
      )


      // let isAuthenticated = this.state.isAuth === undefined ? false : true;

      // console.log("IM RENDERING >>>>>>>>> isAUth",this.state.isAuth);
      return (
        <div className={classes.section} style={{marginTop:"-150px"}} >
          {authentication && jesus_fresh ? userLoggedIn : userNotLoggedIn}
          {!jesus_fresh ? notJesusFresh : <p/>}
        </div>
      )
    }
}

const mapStateToProps = state => {
    return {
        isAuth: state.raven.authenticated,
        username: state.raven.username,
        all_users: state.user.all_users,
        all_subjects: state.subject.subject_list,
        students_by_subject: state.subject.users,
        selected: state.user.student,
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
    all_users:[{username:"broken"}] ,
    all_subjects:[],
    username: "None",
    selected:[{username:"No_username",
            name: "John Appleseed",
            subject:{name:"No subject",_id:"None"},
            accommodation:{name:"No accom"},
            _id:"None"
        },{temp:"tmep"}]
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(GraphNet));
