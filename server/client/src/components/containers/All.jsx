import React, {Component} from 'react';

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import withStyles from "@material-ui/core/styles/withStyles";

import teamStyle from "assets/jss/material-kit-react/views/landingPageSections/teamStyle.jsx";
import { connect } from 'react-redux';
import {fetchUserProfile,fetchAllUsers} from "../../actions/userActions";
import { fetchStudentsOfSubject,getAllSubjects } from "../../actions/subjectActions";
import classNames from "classnames";


class All extends Component {

    constructor(){
        super();
        this.state = {
            details:{},
            isAuth: false,
            network: null,
          };
        // this.setNetworkInstance = this.setNetworkInstance.bind(this);
    }

    componentDidMount(){
        this.props.getAllUsers();
    }

    render(){

        const { classes, ...rest } = this.props;
        const imageClasses = classNames(
            classes.imgRaised,
            classes.imgRoundedCircle,
            classes.imgFluid
          );

        let allusers = this.props.all_users;
        
        return (
        <div className={classNames(classes.main, classes.mainRaised)}>
            <div className={classes.section}
            style={{color:"black",textAlign:"center"}}>
                <h1 className={classes.title}
                style={{color:"black"}}>Grid of Faces</h1>
            </div>
            <div className={classes.section}>
                <GridContainer justify='center'>
                {
                    allusers.map((user,index)=>{
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
                                    {user.subject.name} | Planet Earth
                                </p>
                            </CardBody>
                        </Card>
                        </GridItem>
                        )
                    })
                }
                </GridContainer>
            </div>
        </div>
        )
    }

}

const mapStateToProps = state => {
  return {
        all_users: state.user.all_users,
        all_subjects: state.subject.subject_list,
        students_by_subject: state.subject.users
  }
}

const mapDispatchToProps = dispatch => ({
    getUser: (username) => dispatch(fetchUserProfile(username)),
    getAllUsers: () => dispatch(fetchAllUsers()),
    getAllSubjects: () => dispatch(getAllSubjects()),
    getStudentsOfSubject: (subject) => dispatch(fetchStudentsOfSubject(subject))
})

All.defaultProps = {
    all_users: [{username:"broken",
            name:"Lol what",
            subject:{name:"Bogus"}},
            {username:"cll58",
            name:"Lol what",
            subject:{name:"Bogus"}}],
    cityList: [],
    provinceList: [],
  };

export default connect(mapStateToProps,mapDispatchToProps)(withStyles(landingPageStyle)(All));
