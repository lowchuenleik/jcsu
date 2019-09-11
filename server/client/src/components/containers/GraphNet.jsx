import React, {Component} from 'react';

import Graph from "react-graph-vis";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import { getProfileFetch } from '../../actions/ravenActions';
import { connect } from 'react-redux';
import history from "../../history";
import {fetchUserProfile,fetchAllUsers} from "../../actions/userActions";

let DIR = 'assets/img/faces/';

class GraphNet extends Component {

    constructor(){
      super();
      this.state = {
          details:{},
          isAuth: false
        };
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

    triggerFetch(){
          this.props.getUser();
    }

    render (){

        let allusers = this.props.all_users === undefined ? [{username:"broken"}] : this.props.all_users;

        let nodes = [
            {id: 1,  shape: 'circularImage', image: require("assets/img/faces/1.jpg")},
            {id: 2,  shape: 'circularImage', image: require("assets/img/faces/cll58.png")},
            {id: 3,  shape: 'circularImage', image: DIR + '3.jpg'},
            {id: 4,  shape: 'circularImage', image: DIR + '4.jpg', label:"pictures by this guy!"},
            {id: 5,  shape: 'circularImage', image: DIR + '5.jpg'},
            {id: 6,  shape: 'circularImage', image: DIR + '6.jpg'},
        ];

        allusers.forEach(function (item, index) {
            nodes.push({id:item.username,
                    shape: 'circularImage',
                    image:require(`assets/img/faces/${item.username}.png`),
                    label: `${item.username}`})
        });

      // create connections between people
      // value corresponds with the amount of contact between two people
      const edges = [
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

      // create a network
      const graph = {
        nodes: nodes,
        edges: edges
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
              shadow: true
          },
          edges: {
              color: 'lightgray',
              smooth:{
                  forceDirection: "none"
              }
          },
          physics: {
              minVelocity: 0.75,
              solver: "repulsion",
              timestep: 0.33,
              stabilization: {iterations: 150}
          }
      }

      const { classes } = this.props;

      let _this = this;
      const events = {
          select: function (event) {
              let {nodes, edges} = event;
              console.log("Selected nodes:");
              console.log(nodes);
              console.log("Selected edges:");
              console.log(edges);
              _this.triggerFetch();
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
              <div className={classes.section} style={{background:'grey',height:800}} >
                <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
              </div>
              <div className={classes.section} style={{color:'black'}}>
                <h3>Users:
                    <ul>
                        {allusers.map(x => <li>{x.username}</li>)}
                    </ul>
                </h3>
              </div>
          </div>
      );

      let button_url = window.location.origin;
      if (button_url.endsWith('3000')) {
          button_url = button_url.slice(0, button_url.length-4);
          button_url = button_url + '5000/ravenlogin'
      } else{
          button_url += "/ravenlogin"
      }

      console.log("BUTTON_URL: ",button_url);

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
  }
}

const mapDispatchToProps = dispatch => ({
    getProfileFetch: () => dispatch(getProfileFetch()),
    getUser: () => dispatch(fetchUserProfile("cll58")),
    getAllUsers: () => dispatch(fetchAllUsers())
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(GraphNet));
