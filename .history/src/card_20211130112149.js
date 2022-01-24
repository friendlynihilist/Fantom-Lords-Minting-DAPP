import React from 'react';
import { Container } from 'react-bootstrap';
import { ResponsiveWrapper, StyledImg } from './App';
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const Card = (props) => { 
        const { item } = props
        let imageIPFS = item.image;
        let strippedImageIPFS = imageIPFS ? imageIPFS.replace('ipfs://', '') : '';
        let imageURI = 'https://ipfs.io/ipfs/' + strippedImageIPFS;
        let attributes = [];
        // for (let trait of item.attributes) {
        //     attributes.push({
        //         label: trait.trait_type,
        //         value: trait.value
        //     })
        // }
        return (
            <ResponsiveWrapper
            flex={1}>
            <s.Container flex={1} jc={"start"} ai={"center"}>
                <StyledImg src={imageURI} alt="NO PHOTO" style={{width: '90%'}}></StyledImg>
                {/* <img src={imageURI} alt="NO PHOTO" className="movie-container__img" /> */}
                <div className="movie-container__about">
                    {/* <span className="movie-container__percent">{item.vote_average}</span> */}
                    {/* <h2 className="movie-container__title">{item.name}</h2>
                    <p className="movie-container__date">{attributes[0].label + ': ' + attributes[0].value} </p>
                    <p className="movie-container__date">{attributes[1].label + ': ' + attributes[1].value} </p>
                    <p className="movie-container__date">{attributes[2].label + ': ' + attributes[2].value} </p>
                    <p className="movie-container__date">{attributes[3].label + ': ' + attributes[3].value} </p>
                    <p className="movie-container__date">{attributes[4].label + ': ' + attributes[4].value} </p>
                    <p className="movie-container__date">{attributes[5].label + ': ' + attributes[5].value} </p>
                    <p className="movie-container__date">{attributes[6].label + ': ' + attributes[6].value} </p> */}
                    {/* <p className="movie-container__text">{item.attributes}</p> */}
                    {/* <a href="https://www.themoviedb.org/movie/" className="movie-container__more">MORE</a> */}
                </div>
            </s.Container>
            </ResponsiveWrapper>
            )
}

export default Card;