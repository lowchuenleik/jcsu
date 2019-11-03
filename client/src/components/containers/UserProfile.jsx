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

        console.log("COMP UPDATE IN USER PROFILE",this.props,prevProps);
        let temp = {_id:"beginning"};
        if (this.props.selected.length === 0 
            || prevProps.selected.length === 0 
            || this.props.selected[0] === undefined) {
            wrapper.classList.remove('fade');

            // Literal black magic to reset the animation
            void wrapper.offsetWidth;
            // Lol whaat

            wrapper.classList.add('fade');
        } else {

            if (prevProps.selected.username) {
                temp._id = "beginning"
            } else {
                temp._id = prevProps.selected[0]._id;
            }

            if (this.props.selected[0]._id !== temp._id && this.props.selected[0].subject._id !== "None") {
                wrapper.classList.remove('fade');

                // Literal black magic to reset the animation
                void wrapper.offsetWidth;
                // Lol whaat

                wrapper.classList.add('fade');
                this.props.getStudentsOfSubject(this.props.selected[0].subject._id)
            }
        }
    }

    render(){
        const { classes } = this.props;

        const params = new URLSearchParams(window.location.search);
        let tester = params.get('tester');
        const resume = params.get('resume_public');

        let selected_user;

        if (this.props.selected !== undefined && this.props.selected[0] !== undefined) {
            selected_user = this.props.selected[0];
        } else{
            selected_user = {username:"No_username",
                name: "John Appleseed",
                subject:{name:"No subject",_id:"None"},
                accommodation:{name:"No accom"}
            }
        }
        if(resume){
            tester = true;
        }
        let authentication = tester ? true : this.props.isAuth;

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
        // {this.props.isAuth && jesus_fresh ? userLoggedIn : userNotLoggedIn}

        
        let temp_selected_user = {};
        if (!resume){
            temp_selected_user = selected_user;
        } else{
            temp_selected_user.username = "or_this_either_sorry";
            temp_selected_user.name="Cant_show_this";
            temp_selected_user.subject = selected_user.subject;
        }

        const userLoggedIn = (
            <div style={{paddingBottom:"50px"}} id='wrapper' className="wrapper" >
                <GridContainer>
                    <GridItem xs={12} sm={12} md={4}>
                        <img src={require(`assets/img/faces/${temp_selected_user.username}.jpg`)} alt="..." className={imageClasses} id="userprofile_image" 
                                style={{
                                    width:"500px",
                                    boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"
                                }} />
                    </GridItem>
                    <GridItem xs={12} sm={12} md={8}>
                        <h2 className={classes.cardTitle} style={{whiteSpace:"pre"}}>
                            <br />
                            {temp_selected_user.name}    |&nbsp;&nbsp;&nbsp;&nbsp;
                            {temp_selected_user.username}
                            <br />
                        </h2>
                        <h4 style={{display:"inline-block"}}><i >{temp_selected_user.username}</i></h4>
                        <h3 className={classes.title}>
                            Studying: {temp_selected_user.subject.name}
                            <strong style={{display:"block"}}>
                            </strong>
                        </h3>
                        <h5>
                            {temp_selected_user.subject.description}
                        </h5>
                    </GridItem>
                </GridContainer>
                <br>
                </br>
                <h2 className={classes.cardTitle} style={{whiteSpace:"pre",marginTop:"20px"}}>Subject-mates:</h2>
                <GridContainer justify='center'>
                    {
                        related_by_subject.map((user,index)=>{
                            let temp_username = {};
                            if (resume){
                                temp_username.name="Anonymised name";
                                temp_username.username = "Anonymised_username";
                            } else{
                                temp_username.name=user.name;
                                temp_username.username = user.username;
                            }
                            return(
                            <GridItem xs={12} sm={12} md={3}>
                                <Card plain style={{alignItems:"center",
                            textAlign:"center"}}>

                                    <img src={require(`assets/img/faces/${temp_username.username}.jpg`)} 
                                    className={imageClasses}
                                    id="gridface" 
                                    style={{boxShadow:"0px 20px 38px -6px rgba(0,0,0,0.75)"}} />
                                <CardBody>
                                    <h4 className={classes.description}>
                                        {temp_username.name} | {user.subject.name}
                                    </h4>
                                </CardBody>
                            </Card>
                            </GridItem>
                            )
                        })
                    }
                    </GridContainer>
            </div>
        )

        return (
            <div id='wrapper'>
                {this.props.isAuth || authentication ? userLoggedIn : <br/>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selected: state.user.student,
        isAuth: state.raven.authenticated,
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