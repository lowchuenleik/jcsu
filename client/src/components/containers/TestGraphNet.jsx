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

class TestGraphNet extends Component {

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

    render (){

        const nodes = [];

        let edges = [];
        let node_ids = [];

        let allusers = this.props.all_users;
        let username_here =  this.props.username;

        let random_edge_flag = false;

        let subj_node;

        //A crude check for complete loading and save the effort otherwise?
        if (allusers.length > 1){

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

                //Add a central node
                let random_edges = Math.floor(Math.random() * (1000000));
                subj_node = {
                    id: subject.name + index,
                    shape:'circle',
                    color:"black",
                    label: `${subject.name}`,
                    font: {
                        color:"white",
                    },
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
                    edges.push({from:subject.name+index,
                        to: usernodes[i].username});

                    if (i === usernodes.length - 1) break;

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

                            //Add this new random edge.
                            edges.push({from:usernodes[i].username,
                                to: usernodes[random_neighbour].username,
                                title: "Studies with"})
                        }
                    } 
                }

            });

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
          physics:{
            "barnesHut": {
                "avoidOverlap": 0.5
              },
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
                <h1 className={classes.title}>Logged in as: TEST USER</h1>
                <Link to="/all">
                    <Button
                        color="primary"
                        size="lg"
                        >
                        Grid
                        <i style={{display:'inline-block',marginLeft:".5em"}} className="fas fa-th" />
                    </Button>
                </Link>
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
          </div>
      );

      return (
        <div className={classes.section} style={{marginTop:"-150px"}} >
            {userLoggedIn}
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

TestGraphNet.defaultProps = {
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

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(TestGraphNet));
