const axios = require('axios');

const actorController = {

    getActorsPage: async (req, res) => {
        try {
            let actorDetails = null;
            if (req.session.actorDetails) {
                actorDetails = req.session.actorDetails;
            }
            res.render('pages/main_page/actors', { user: req.session.user, actorInfo: actorDetails, currentLang: req.i18n.language });
        } catch (error) {
            console.error('Error rendering actors page:', error.message);
            res.status(500).send('Internal Server Error');
        }
    },

    getActorInfo: async (req, res) => {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: 'Please enter an actor name.' });
            return;
        }
        const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${process.env.MOVIE_ACTOR_API_KEY}&query=${encodeURIComponent(name)}`;
    
        try {
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`Failed to search for actors. Status: ${response.status}`);
            }
            const data = await response.json();
            const results = data.results;
            if (results.length > 0) {
                const filteredActors = results.filter(actor => actor.name.toLowerCase().startsWith(name.toLowerCase()));
                if (filteredActors.length > 0) {
                    const actorDetails = await Promise.all(filteredActors.map(async actor => {
                        const actorId = actor.id;
                        const actorDetails = await fetchActorDetails(actorId);
                        const movies = await fetchActorMovies(actorId);
                        return { actorDetails, movies };
                    }));
                    req.session.actorDetails = actorDetails;
                    res.redirect(`/actor`);
                } else {
                    res.status(404).json({ message: 'No actor found with that name.' });
                }
            } else {
                res.status(404).json({ message: 'No actor found with that name.' });
            }
        } catch (error) {
            console.error('Error searching for actors:', error.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    
};

async function fetchActorDetails(actorId) {
    const actorUrl = `https://api.themoviedb.org/3/person/${actorId}?api_key=${process.env.MOVIE_ACTOR_API_KEY}&language=en-US`;

    try {
        const actorResponse = await fetch(actorUrl);
        if (!actorResponse.ok) {
            throw new Error(`Failed to fetch actor details. Status: ${actorResponse.status}`);
        }
        const actor = await actorResponse.json();
        const actorDetails = {
            name: actor.name,
            birthday: actor.birthday,
            profilePicture: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null
        };
        return actorDetails;
    } catch (error) {
        console.error('Error fetching actor details:', error.message);
        throw new Error('Failed to fetch actor details.');
    }
}

async function fetchActorMovies(actorId) {
    const moviesUrl = `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${process.env.MOVIE_ACTOR_API_KEY}&language=en-US`;

    try {
        const moviesResponse = await fetch(moviesUrl);
        if (!moviesResponse.ok) {
            throw new Error(`Failed to fetch actor movies. Status: ${moviesResponse.status}`);
        }
        const moviesData = await moviesResponse.json();
        const moviesList = moviesData.cast.map(movie => ({
            title: movie.title,
            releaseDate: movie.release_date
        }));
        return moviesList;
    } catch (error) {
        console.error('Error fetching actor movies:', error.message);
        throw new Error('Failed to fetch actor movies.');
    }
}

module.exports = { actorController };
