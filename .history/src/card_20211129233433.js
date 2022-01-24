import React from 'react';

const Card = (props) => { 
        const { item } = props
        let imageUri = item.image.replace('ipfs://', '');
        console.log(imageUri);
        return (
            <div className="movie-container">
                <img src="https://ipfs.io/ipfs/QmWEMQjjimkoAPFz913hGHPf9EtxH2hZKi6STydq7q2Hx1/{id}.json" alt="NO PHOTO" className="movie-container__img" />
                <div className="movie-container__about">
                    {/* <span className="movie-container__percent">{item.vote_average}</span> */}
                    <h2 className="movie-container__title">{item.name}</h2>
                    {/* <p className="movie-container__date">{item.release_date}</p> */}
                    {/* <p className="movie-container__text">{item.overview}</p> */}
                    <a href="https://www.themoviedb.org/movie/" className="movie-container__more">MORE</a>
                </div>
            </div>
            )
}

export default Card;