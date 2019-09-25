import React, {Component} from 'react';
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import landingPageStyle from "../../assets/jss/material-kit-react/views/landingPage"

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import TestGraphNet from "../containers/TestGraphNet";

import TeamSection from "../../views/LandingPage/Sections/TeamSection.jsx";

import News from "../containers/News";
import UserProfile from 'components/containers/UserProfile';

const dashboardRoutes = [];

class TestGrid extends Component {
    render() {
        const { classes, ...rest } = this.props;
        return (
          <div>
            <Header
              color="transparent"
              routes={dashboardRoutes}
              brand="JCSU 2019"
              rightLinks={<HeaderLinks />}
              fixed
              changeColorOnScroll={{
                height: 400,
                color: "white"
              }}
              {...rest}
            />
            <Parallax filter image={require("assets/img/homepage.jpg")}>
              <div className={classes.container}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={6}>
                    <h1 className={classes.title}>JCSU 2019</h1>
                    <h4>
                      Welcome to (Test) Jesus College. Come and get to know your fellow freshers.
                    </h4>
                    <br />
                    <Button
                      color="danger"
                      size="lg"
                      href="http://jcsu.jesus.cam.ac.uk/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fas fa-globe" />
                      More info
                    </Button>
                  </GridItem>
                </GridContainer>
              </div>
            </Parallax>
            <div className={classNames(classes.main, classes.mainRaised)}>
              <div className={classes.container}>
                <TeamSection />
                <TestGraphNet style={{marginTop:"-200px"}}/>
                <UserProfile />
              </div>
            </div>
          </div>
        )
    }
}

export default withStyles(landingPageStyle)(TestGrid);
