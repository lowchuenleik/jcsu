import React, { Component} from 'react';

import withStyles from "@material-ui/core/styles/withStyles";

import CardBody from "../Card/CardBody";
import Card from "../Card/Card";

import teamStyle from "../../assets/jss/material-kit-react/views/landingPageSections/teamStyle";

import { connect } from 'react-redux';
import { fetchNews } from "../../actions/newsActions";

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
        console.log("Component did update! Here look at props, ",this.props);
    }

    render(){
        const { classes } = this.props;

        let selected_user = this.props.selected !== undefined ?  this.props.selected[0].username : "NO username";

        return (
            <div style={{color:"black"}}>
                <Card plain style={{padding:"1rem",margin:"2em"}}>
                    <CardBody>
                        <h2 className={classes.title}> User Profile View </h2>
                        <h3 className={classes.cardTitle}>
                            Selected: {selected_user}
                        </h3>
                    </CardBody>
                </Card>

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