import React from 'react';
import { Container } from 'react-bootstrap';
import { ResponsiveWrapper, StyledImg } from './App';

const Card = (props) => { 
        const { item } = props
        let imageIPFS = item.image;
        let strippedImageIPFS = imageIPFS ? imageIPFS.replace('ipfs://', '') : '';
        let imageURI = 'https://ipfs.io/ipfs/' + strippedImageIPFS;
        return (
            <ResponsiveWrapper
            style={{flex={1}}}>
            <Container>
                <StyledImg src={imageURI} alt="NO PHOTO" style={{width: '50%'}}></StyledImg>
                {/* <img src={imageURI} alt="NO PHOTO" className="movie-container__img" /> */}
                <div className="movie-container__about">
                    {/* <span className="movie-container__percent">{item.vote_average}</span> */}
                    <h2 className="movie-container__title">{item.name}</h2>
                    {/* <p className="movie-container__date">{item.release_date}</p> */}
                    {/* <p className="movie-container__text">{item.attributes}</p> */}
                    <a href="https://www.themoviedb.org/movie/" className="movie-container__more">MORE</a>
                </div>
            </Container>
            </ResponsiveWrapper>
            )
}

export default Card;