import React,{ Component } from "react";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";

// core components
import Header from "../Header/Header.jsx";
import Footer from "../Footer/Footer.jsx";
import Button from "../CustomButtons/Button.jsx";
import GridContainer from "../Grid/GridContainer.jsx";
import GridItem from "../Grid/GridItem.jsx";
import HeaderLinks from "../Header/HeaderLinks.jsx";
import NavPills from "../NavPills/NavPills.jsx";
import Parallax from "../Parallax/Parallax.jsx";

import { connect } from 'react-redux';
import {fetchUserAccom, fetchUserProfile, fetchUserSubject} from "../../actions/userActions";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

import profilePageStyle from "../../assets/jss/material-kit-react/views/profilePage";

class Housemates extends Component{
    constructor(incoming){
        super();
        console.log("CONSTRUCTOR ARGS",incoming);

        this.state = {
            username: "temp"
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props){
            console.log("THINGS CHANGED",this.props)
            this.setState({
                username: this.props.username
            })
        }
    }

    render(){
        const { classes, ...rest } = this.props;
        const imageClasses = classNames(
              classes.imgRaised,
              classes.imgRoundedCircle,
              classes.imgFluid
        );
        const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
        return (
            <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                    <img
                        alt="..."
                        src={require("assets/img/faces/cll58.jpg")}
                        className={navImageClasses}
                        />
                    <img
                        alt="..."
                        src={work2}
                        className={navImageClasses}
                        />
                    <img
                        alt="..."
                        src={work3}
                        className={navImageClasses}
                    />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <img
                        alt="..."
                        src={work4}
                        className={navImageClasses}
                    />
                    <img
                        alt="..."
                        src={work5}
                        className={navImageClasses}
                    />
                </GridItem>
            </GridContainer>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps)(withStyles(profilePageStyle)(Housemates));
