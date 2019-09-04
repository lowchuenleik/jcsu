import React, {Component} from 'react';

import Graph from "react-graph-vis";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import { getProfileFetch } from '../../actions/ravenActions';
import { connect } from 'react-redux';
import history from "../../history";
import {fetchUserProfile} from "../../actions/userActions";

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
        console.log("Component did update! Here look at props, ",this.props);
        this.props.getProfileFetch();
        if (prevProps.isAuth !== this.props.isAuth){
            this.setState(this.state);
        }
    }

    logout(){
        localStorage.removeItem("token");
        this.setState({isAuth:false});
        history.push('/');
    }

    componentDidMount() {
        console.log("THIS HERE PROPS : ",this.props);
        console.log("THIS HERE IS URL : ",window.location.origin);
        const params = new URLSearchParams(window.location.search);
        const loggedin = params.get('loggedin');
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

      const nodes = [
        {id: 1,  shape: 'circularImage', image: require("assets/img/faces/1.jpg")},
        {id: 2,  shape: 'circularImage', image: DIR + '2.jpg'},
        {id: 3,  shape: 'circularImage', image: DIR + '3.jpg'},
        {id: 4,  shape: 'circularImage', image: DIR + '4.jpg', label:"pictures by this guy!"},
        {id: 5,  shape: 'circularImage', image: DIR + '5.jpg'},
        {id: 6,  shape: 'circularImage', image: DIR + '6.jpg'},
        {id: 7,  shape: 'circularImage', image: DIR + '7.jpg'},
        {id: 8,  shape: 'circularImage', image: DIR + '8.jpg'},
        {id: 9,  shape: 'circularImage', image: DIR + '9.jpg'},
        {id: 10, shape: 'circularImage', image: DIR + '10.jpg'},
        {id: 11, shape: 'circularImage', image: DIR + '11.jpg'},
        {id: 12, shape: 'circularImage', image: DIR + '12.jpg'},
        {id: 13, shape: 'circularImage', image: DIR + '13.jpg'},
        {id: 14, shape: 'circularImage', image: DIR + '14.jpg'},
      ];


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
          borderWidth:4,
          size:30,
          color: {
            border: '#222222',
            background: '#666666'
          },
          font:{color:'#eeeeee'}
        },
        edges: {
          color: 'lightgray'
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
        username: state.raven.username
  }
}

const mapDispatchToProps = dispatch => ({
  getProfileFetch: () => dispatch(getProfileFetch()),
  getUser: () => dispatch(fetchUserProfile("temp"))
})

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(GraphNet));
