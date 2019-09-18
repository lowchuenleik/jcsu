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

import Prim from '../../constants/Prim'

let DIR = 'assets/img/faces/';

class GraphNet extends Component {

    constructor(){
      super();
      this.state = {
          details:{},
          isAuth: false,
          network: null,
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

        let nodes = [
            {id: 1,  shape: 'circularImage', image: require("assets/img/faces/1.jpg")},
            {id: 2,  shape: 'circularImage', image: require("assets/img/faces/cll58.jpg")},
            {id: 3,  shape: 'circularImage', image: DIR + 'christian.jpg'},
            {id: 4,  shape: 'circularImage', image: DIR + 'kendall.jpg', label:"Helloo"},
            {id: 5,  shape: 'circularImage', image: DIR + 'marc.jpg'},
            {id: 6,  shape: 'circularImage', image: DIR + 'avatar.jpg'},
        ];

        // create connections between people
        // value corresponds with the amount of contact between two people
        let edges = [
            {from: 1, to: 2},
            {from: 2, to: 3},
            {from: 2, to: 4},
            {from: 4, to: 5},
            {from: 4, to: 10},
            {from: 4, to: 6},
            {from: 6, to: 7},
            {from: 7, to: 8},
            {from: 8, to: 9},
            {from: 8, to: 10},
            {from: 10, to: 11},
            {from: 11, to: 12},
            {from: 12, to: 13},
            {from: 13, to: 14},
        ];

        let new_edges = [];

        let allusers = this.props.all_users === undefined ? [{username:"broken"}] : this.props.all_users;
        let username_here = this.props.username === undefined ? "none" : this.props.username;

        //A crude check for complete loading and save the effort otherwise?
        if (allusers.length >= 100 && allusers[100].username !== undefined){

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
            all_subjects.forEach(function(subject,index){
                //Now operate on a cluster singly, with each cluster being a bunch of users
                let usernodes = subject_mapping[subject.name];
                for (let i=0;i<usernodes.length - 1;i++){
                    //Must have the primary line connecting them sequentially to ensure it's a connected graph
                    edges.push({from:usernodes[i].username,
                            to: usernodes[i+1].username,
                            title: "Studies with"});
                    usernodes[i].visited = true;
                    usernodes[i+1].visited = true;

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

                if (item.username === username_here){
                    nodes.push({id:item.username,
                        shape: 'circularImage',
                        image: temp_fix,
                        font: {
                            color:"black",
                            size:"20",
                            face:"roboto"
                        },
                        size:100,
                        label: `${item.username}`,
                        already_linked: false,
                        subject:item.subject.name});
                        // accommodation:item.accommodation.name});
                } else{
                    nodes.push({id:item.username,
                        shape: 'circularImage',
                        image: temp_fix,
                        font: {
                            color:"black",
                            size:"20",
                            face:"roboto"
                        },
                        size:50,
                        label: `${item.username}`,
                        already_linked: false,
                        subject:item.subject.name});
                        // accommodation:item.accommodation.name});
                }

            });

            allusers.forEach(function (item, index) {
                //Now we want to create the edges
                //Note right now it will be a BIDIRECTIONAL graph
                //Might be rather slow on rendering side. Could push this to backend
                for (let i=index+1; i<allusers.length; i++){
                    let other_item = allusers[i];
                    // if (item.accommodation !== undefined && other_item.accommodation !== undefined && item.accommodation._id === other_item.accommodation._id){
                    //     edges.push({
                    //         from:item.username,
                    //         to:other_item.username,
                    //         color:"blue"
                    //     })
                    // }
                    // if (item.subject !== undefined && other_item.subject !== undefined && item.subject._id === other_item.subject._id) {
                    //     // let condition = this.isConnected(other_item,edges,allusers);
                    //     console.log("ALREADY LINKED?",item.already_linked);
                    //     if (!item.already_linked){
                    //         edges.push({
                    //             from: item.username,
                    //             to: other_item.username,
                    //             color: "red",
                    //         })
                    //         item.already_linked = true;
                    //     }
                    // }
                }


            });


            //Recolor all edges linked to logged in user
            edges.forEach(function(edge,index){
                if (edge.from === username_here || edge.to === username_here){
                    new_edges.push(Object.assign({},edge,{width:3,
                        color:{color:'red',inherit:false,hover:'yellow'},
                        title: "YOU STUDY WITH"
                    }))
                } else{
                    new_edges.push(edge)
                }
            })

        }


      // create a network
      const graph = {
        nodes: nodes,
        edges: new_edges
      };

      const options = {
          nodes: {
              borderWidth: 4,
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
          // physics: {
          //     minVelocity: 0.75,
          //     solver: "repulsion",
          //     timestep: 0.33,
          //     stabilization: {iterations: 150}
          // }
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
                <Button
                  color="primary"
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(GraphNet));
