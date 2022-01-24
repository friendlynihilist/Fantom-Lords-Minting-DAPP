import React, { Component, useEffect, useState, useRef } from 'react';
import Card from "./Card";

class ListApp extends Component {
    constructor(props){
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
        }
    };

    // fetchRarity = (id) => {
        
    //     fetch(`https://ipfs.io/ipfs/QmWEMQjjimkoAPFz913hGHPf9EtxH2hZKi6STydq7q2Hx1/${id}.json`)
    //         .then(response => response.json())
    //         .then(data => data.image);
    // }

    componentDidMount = (id) => {
        fetch(`https://ipfs.io/ipfs/QmWEMQjjimkoAPFz913hGHPf9EtxH2hZKi6STydq7q2Hx1/${id}.json`)
        .then(resp => resp.json())
        .then(resp => {
            this.setState({
                isLoaded: true,
                items: resp //resp.results
            })
            console.log(this.state.items)      
    })};

    render() {
        // let [fetchID, setData]=useState(null);
        // let [printID, setPrint]=useState(false);
        // const getRarityData = (evt) => {
        //   setData(evt.target.value);
        //   setPrint(false);
        //   this.componentDidMount(evt.target.value);
        // }

        var {isLoaded, items} = this.state;
        return (
            <div>
                {<Card key={items.name} item={items} />};
            </div>
        );
    }
}

export default ListApp;