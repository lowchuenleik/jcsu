import React, { Component } from 'react';
import classNames from "classnames";
import Header from "../Header/Header.jsx";
import Parallax from "../Parallax/Parallax.jsx";
import HeaderLinks from "../Header/HeaderLinks.jsx";

class Layout extends Component {
    render() {
        const { classes, ...rest } = this.props;
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
            <div>
                { this.props.children }
            </div>
        </div>
        )
    }
}

export default Layout;