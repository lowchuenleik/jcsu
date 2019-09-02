import React, {Component} from 'react';

import Graph from "react-graph-vis";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "components/CustomButtons/Button.jsx";
import { ravenLogin } from '../../actions/authActions';
import { connect } from 'react-redux';

let DIR = 'assets/img/faces/';

class GraphNet extends Component {

    constructor(){
      super();

      this.state = {
          details:{}
        };
    }


    login(){
      this.props.dispatch(ravenLogin());
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

      const isAuthenticated = this.props.auth === undefined ? false : true;
      const { classes } = this.props;

      const events = {
          select: function (event) {
              let {nodes, edges} = event;
              console.log("Selected nodes:");
              console.log(nodes);
              console.log("Selected edges:");
              console.log(edges);
              this.updateView(nodes);

              //REDUX IN ACTION

              this.props.dispatch()
          }
      };

      const userLoggedIn = (
        <div className={classes.section} style={{background:'grey',height:800}} >
            <Graph graph={graph} options={options} events={events} style={{ height: "640px" }} />
        </div>
      )

      const userNotLoggedIn = (
          <Button
              color="primary"
              onClick={this.login.bind(this)}>
              <i className={"fab fa-sign-in"} />
              Sign in please to view the grid.
          </Button>
      )
      return (
        <div className={classes.section}>
          {isAuthenticated ? userLoggedIn : userNotLoggedIn}
        </div>
      )
    }
}

const mapStateToProps = state => {
  return {
  }
}

export default connect(mapStateToProps,null)(withStyles(teamStyle)(GraphNet));
