import React, { Component} from 'react';

import withStyles from "@material-ui/core/styles/withStyles";

import CardBody from "../Card/CardBody";
import Card from "../Card/Card";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";

import { connect } from 'react-redux';

import { fetchStudentsOfSubject,getAllSubjects } from "../../actions/subjectActions";
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

        console.log("COMP UPDATE IN USER PROFILE",this.props,prevProps);
        let temp = {_id:"EBEGINNIN"};
        if (prevProps.selected.username){
            temp._id = "beginning"
        } else{
            temp._id = prevProps.selected[0]._id;;
        }
        if (this.props.selected[0]._id !== temp._id && this.props.selected[0].subject._id !== "None"){
            this.props.getStudentsOfSubject(this.props.selected[0].subject._id)
        }
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

        let related_by_subject = this.props.students_by_subject.filter(function(student){
            if (student.username === selected_user.username){
                return false
            }
            return true
        });

        const imageClasses = classNames(
          classes.imgRaised,
          classes.imgRoundedCircle,
          classes.imgFluid
        );

        console.log("SELECTED USER",selected_user);
        console.log("RELATED BY SUBJECT USERS",related_by_subject);

        return (


        <div style={{paddingBottom:"50px"}} id='wrapper' className="wrapper" >
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                    <img src={require(`assets/img/faces/${selected_user.username}.jpg`)} alt="..." className={imageClasses} id="userprofile_image" 
                            style={{
                                width:"500px",
                                boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"
                            }} />
                </GridItem>
                <GridItem xs={12} sm={12} md={8}>
                    <h2 className={classes.cardTitle} style={{whiteSpace:"pre"}}>
                        <br />
                        {selected_user.name}    |&nbsp;&nbsp;&nbsp;&nbsp;
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
            <br>
            </br>
            <h2 className={classes.cardTitle} style={{whiteSpace:"pre",marginTop:"20px"}}>Subject-mates:</h2>
            <GridContainer justify='center'>
                {
                    related_by_subject.map((user,index)=>{
                        return(
                        <GridItem xs={12} sm={12} md={3}>
                            <Card plain style={{alignItems:"center",
                        textAlign:"center"}}>

                                <img src={require(`assets/img/faces/${user.username}.jpg`)} 
                                className={imageClasses}
                                id="gridface" 
                                style={{boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"}} />
                            <CardBody>
                                <h4 className={classes.cardTitle}>
                                    {user.name}
                                    <br />
                                </h4>
                                <p className={classes.description}>
                                    {user.subject.name} | Jesus College
                                </p>
                            </CardBody>
                        </Card>
                        </GridItem>
                        )
                    })
                }
                </GridContainer>
        </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected: state.user.student,
        news: state.news.news,
        students_by_subject: state.subject.users
    }
}

const mapDispatchToProps = dispatch => ({
    getStudentsOfSubject: (subject) => dispatch(fetchStudentsOfSubject(subject))
})

UserProfile.defaultProps = {
    subject:"None",
    accommodation:"None",
    username: "None",
    selected:[{username:"No_username",
                name: "John Appleseed",
                subject:{name:"No subject",_id:"None"},
                accommodation:{name:"No accom"},
                _id:"None"
            },{temp:"tmep"}]
  }

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(teamStyle)(UserProfile))