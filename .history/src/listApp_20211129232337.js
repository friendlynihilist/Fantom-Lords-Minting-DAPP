import React, { Component } from 'react';
import Card from "./Card";

class ListApp extends Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
        }
    };
    componentDidMount = () => {
        fetch("https://ipfs.io/ipfs/QmWEMQjjimkoAPFz913hGHPf9EtxH2hZKi6STydq7q2Hx1/4.json")
        .then(resp => resp.json())
        .then(resp => {
            this.setState({
                isLoaded: true,
                items: resp //resp.results
            })
            console.log(this.state.items)      
    })};

    render() {
        var {isLoaded, items} = this.state;
        return (
            <div>
                {<Card key={item.name} item={item} />};
            </div>
        );
    }
}

export default ListApp;