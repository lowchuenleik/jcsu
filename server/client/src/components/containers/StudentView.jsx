/*!

=========================================================
* Material Kit React - v1.7.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-kit-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React,{ Component } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types"
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
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

import profile from "assets/img/faces/cll58.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

import profilePageStyle from "../../assets/jss/material-kit-react/views/profilePage.jsx";

import Housemates from "./Housemates";

import { connect } from 'react-redux';
import { fetchUserProfile,fetchUserAccom,fetchUserSubject } from "../../actions/userActions";

class ProfilePage extends Component {

    componentDidMount() {
        let user_id = this.props.match.params.id;
        console.log(user_id);
        this.props.dispatch(fetchUserProfile(user_id));
        this.props.dispatch(fetchUserSubject(user_id));
        this.props.dispatch(fetchUserAccom(user_id));
        console.log(this.props);
    }

    render() {
        const { classes, ...rest } = this.props;
        const imageClasses = classNames(
              classes.imgRaised,
              classes.imgRoundedCircle,
              classes.imgFluid
        );
        console.log("PROPS IN STUDENT VIEW",this.props);
        let username = this.props.student === undefined ? "": this.props.student.length === 0 ? "Zero length" : this.props.student[0].username;
        let subject = this.props.subject === undefined ? "No subject" : this.props.subject;
        let accommodation = this.props.accommodation === undefined ? "No accommodation" : this.props.accommodation;
        console.log(username);
        const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
        return (
              <div>
                <Header
                  color="transparent"
                  brand="JCSU 2019"
                  rightLinks={<HeaderLinks />}
                  fixed
                  changeColorOnScroll={{
                    height: 200,
                    color: "white"
                  }}
                  {...rest}
                />
                <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
                <div className={classNames(classes.main, classes.mainRaised)}>
                  <div>
                    <div className={classes.container}>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={6}>
                          <div className={classes.profile}>
                            <div>
                              <img src={profile} alt="..." className={imageClasses} />
                            </div>
                            <div className={classes.name}>
                              <h3 className={classes.title}>Username: {username}</h3>
                              <h6> Member of Jesus College </h6>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-twitter"} />
                              </Button>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-instagram"} />
                              </Button>
                              <Button justIcon link className={classes.margin5}>
                                <i className={"fab fa-facebook"} />
                              </Button>
                            </div>
                          </div>
                        </GridItem>
                      </GridContainer>
                      <div className={classes.description}>
                          <p style={{fontWeight:"bolder",fontSize:"30px"}}>
                          Subject: {subject} {" "}
                          </p>
                          <p style={{fontWeight:"bolder",fontSize:"30px"}}>
                          Accommodation: {accommodation}
                          </p>
                      </div>
                      <GridContainer justify="center">
                        <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                          <NavPills
                            alignCenter
                            color="primary"
                            tabs={[
                              {
                                tabButton: "Subject",
                                tabIcon: Camera,
                                tabContent: (
                                    <Housemates username={username}/>
                                )
                              },
                              {
                                tabButton: "Housemates",
                                tabIcon: Palette,
                                tabContent: (
                                <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={4}>
                                      <img
                                        alt="..."
                                        src={require("assets/img/faces/1.jpg")}
                                        className={navImageClasses}
                                      />
                                      <img
                                        alt="..."
                                        src={studio2}
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                      <img
                                        alt="..."
                                        src={studio5}
                                        className={navImageClasses}
                                      />
                                      <img
                                        alt="..."
                                        src={studio4}
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                )
                              },
                              {
                                tabButton: "Favorite",
                                tabIcon: Favorite,
                                tabContent: (
                                  <GridContainer justify="center">
                                    <GridItem xs={12} sm={12} md={4}>
                                      <img
                                        alt="..."
                                        src={work4}
                                        className={navImageClasses}
                                      />
                                      <img
                                        alt="..."
                                        src={studio3}
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={4}>
                                      <img
                                        alt="..."
                                        src={work2}
                                        className={navImageClasses}
                                      />
                                      <img
                                        alt="..."
                                        src={work1}
                                        className={navImageClasses}
                                      />
                                      <img
                                        alt="..."
                                        src={studio1}
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                )
                              }
                            ]}
                          />
                        </GridItem>
                      </GridContainer>
                    </div>
                  </div>
                </div>
                <Footer />
              </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        student: state.user.student,
        subject: state.user.subject,
        accommodation: state.user.accommodation,
        testing: state.user.funState,
        //userProfilePic: state.news.newsItemLoading
    }
}

export default connect(mapStateToProps)(withStyles(profilePageStyle)(ProfilePage));
