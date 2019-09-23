import React, { Component} from 'react';

import withStyles from "@material-ui/core/styles/withStyles";

import CardBody from "../Card/CardBody";
import Card from "../Card/Card";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";

import { connect } from 'react-redux';
import { fetchNews } from "../../actions/newsActions";

import team1 from "assets/img/faces/sorcha.png";

import { CSSTransitionGroup } from 'react-transition-group';
import classNames from "classnames";

class UserProfile extends Component {

    constructor(){
        super();

        this.state = {
            selected: null,
            temp: 'HI'
        }
    }

    componentDidMount() {
        console.log("USER PROFILE VIEW COMPONENT MOUNTED")
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const wrapper = document.getElementById("wrapper");
        wrapper.classList.remove('fade');

        // Literal black magic to reset the animation
        void wrapper.offsetWidth;
        // Lol whaat

        wrapper.classList.add('fade');
    }

    render(){
        const { classes } = this.props;

        let selected_user;

        if (this.props.selected !== undefined && this.props.selected[0] !== undefined) {
            selected_user = this.props.selected[0];

        } else{
            selected_user = {username:"No_username",
                name: "John Appleseed",
                subject:{name:"No subject"},
                accommodation:{name:"No accom"}
            }
        }

        const imageClasses = classNames(
          classes.imgRaised,
          classes.imgRoundedCircle,
          classes.imgFluid
        );

        console.log("SELECTED USER",selected_user);

        return (

        // <div style={{color:"black"}} id="wrapper" className="wrapper">
            /* <div id="left">
                <img src={require(`assets/img/faces/${selected_user.username}.jpg`)} alt="..." className={imageClasses} id="userprofile_image" style={{height:"350px",
                    width:"350px",
                    boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"}} />
            </div>
              <div id="right" style={{paddingTop:"20px"}}>
                <h2 className={classes.cardTitle} style={{display:"inline-block",
                whiteSpace:"pre"}}>
                    <br />
                    {selected_user.name}    |&nbsp;&nbsp;&nbsp;
                    <br />
                </h2>
                <h4 style={{display:"inline-block"}}><i >{selected_user.username}</i></h4>
                <h3 className={classes.title}>
                    Studying: {selected_user.subject.name}
                    <strong style={{display:"block"}}>
                    </strong>
                </h3>
                  <h5>
                      {selected_user.subject.description}
                  </h5>
              </div>

            <Card plain style={{padding:"1rem",margin:"2em"}}>
                <CardBody>
                    <h2 className={classes.title}> User Profile View </h2>
                    <h3 className={classes.cardTitle}>
                        Selected: {selected_user.username}
                    </h3>
                </CardBody>
            </Card> */
        // </div>
        <div style={{paddingBottom:"50px"}} id="wrapper" >
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <img src={require(`assets/img/faces/${selected_user.username}.jpg`)} alt="..." className={imageClasses} id="userprofile_image" style={{height:"350px",
                            width:"350px",
                            boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"}} />
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                    <h2 className={classes.cardTitle} style={{whiteSpace:"pre"}}>
                        <br />
                        {selected_user.name}    |&nbsp;&nbsp;&nbsp;
                        {selected_user.username}
                        <br />
                    </h2>
                    <h4 style={{display:"inline-block"}}><i >{selected_user.username}</i></h4>
                    <h3 className={classes.title}>
                        Studying: {selected_user.subject.name}
                        <strong style={{display:"block"}}>
                        </strong>
                    </h3>
                    <h5>
                        {selected_user.subject.description}
                    </h5>
                </GridItem>
            </GridContainer>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected: state.user.student,
        news: state.news.news
    }
}

export default connect(mapStateToProps,null)(withStyles(teamStyle)(UserProfile))