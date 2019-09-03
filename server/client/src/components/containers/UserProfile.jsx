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

    updateView(nodes){
        this.setState({
                selected: nodes[0]
            });
    }

    componentDidMount() {
    }

    render(){
        const { classes } = this.props;
        let temp = this;

        return (
            <div style={{color:"black"}}>
                <Card plain style={{padding:"1rem",margin:"2em"}}>
                    <CardBody>
                        <h1> {this.state.temp} </h1>
                        <h4 className={classes.cardTitle}>
                            Selected:
                            {this.state.selected}
                        </h4>
                    </CardBody>
                </Card>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        news: state.news.news
    }
}

export default connect(mapStateToProps,null)(withStyles(teamStyle)(UserProfile))