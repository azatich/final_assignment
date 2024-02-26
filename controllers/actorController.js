const axios = require('axios');

const actorController = {
    getActorsPage: async (req, res) => {
        try {
            let username = req.session.user ? req.session.user.username : null;
            let isAdmin = req.session.user ? req.session.user.isAdmin : false;
            let actorInfo = null;

            if (req.query.actorInfo) {
                actorInfo = JSON.parse(decodeURIComponent(req.query.actorInfo));
                req.session.actorInfo = actorInfo;
            } else if (req.session.actorInfo) {
                actorInfo = req.session.actorInfo;
            }

            res.render('pages/main_page/actors', { username: username, isAdmin: isAdmin, actorInfo: actorInfo });
        } catch (error) {
            console.error('Error rendering actors page:', error.message);
            res.status(500).send('Internal Server Error');
        }
    },

    getActorInfo: async (req, res) => {
        const { name } = req.body;
        const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${process.env.MOVIE_ACTOR_API_KEY}&query=${encodeURIComponent(name)}`;

        try {
            const response = await axios.get(searchUrl);

            if (response.status === 200) {
                const results = response.data.results;
                if (results.length > 0) {
                    const actorId = results[0].id;
                    const actorDetails = await fetchActorDetails(actorId);
                    res.redirect(`/actor?actorInfo=${encodeURIComponent(JSON.stringify(actorDetails))}`);
                } else {
                    res.status(404).json({ message: 'No actor found with that name.' });
                }
            } else {
                res.status(response.status).json({ message: 'Error searching for actors.' });
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
        const actorResponse = await axios.get(actorUrl);

        if (actorResponse.status === 200) {
            const actor = actorResponse.data;
            const actorDetails = {
                name: actor.name,
                birthday: actor.birthday,
                profilePicture: actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : null
            };
            return actorDetails;
        } else {
            throw new Error(`Failed to fetch actor details. Status: ${actorResponse.status}`);
        }
    } catch (error) {
        console.error('Error fetching actor details:', error.message);
        throw new Error('Failed to fetch actor details.');
    }
}

module.exports = { actorController };