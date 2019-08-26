import React, { Component} from 'react';
import NewsItemListing from '../presentation/NewsItemListing';
import { connect } from 'react-redux';
import { fetchNews } from "../../actions/newsActions";

class News extends Component {

    componentDidMount() {
        this.props.dispatch(fetchNews());
    }

    render(){
        console.log("News just")
        console.log(this.props)
        const newsItems = this.props.news.map( (news, i) => {
            return ( <li key={i}><NewsItemListing data = {news} /></li> );
        });

        return (
            <div style={{color:"black"}}>
                <h3 >News Items</h3>
                {(this.props.news.length > 0) ? <ul>{newsItems}</ul> : <div> Sorry we have no news </div>}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        news: state.news.news
    }
}

export default connect(mapStateToProps)(News)