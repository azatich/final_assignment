const movieController = {

    getMoviePage: async (req, res) => {
        try {
            let movieData = null;
            if (req.query.movieData) {
                movieData = JSON.parse(decodeURIComponent(req.query.movieData));
                req.session.movieData = movieData;
            } else if (req.session.movieData) {
                movieData = req.session.movieData;
            }
            res.render('pages/main_page/main', { user: req.session.user, movieData: movieData, t: req.t, currentLang: req.i18n.language});
        } catch (error) {
            console.error('Error rendering main page:', error);
            res.status(500).send('Error rendering main page.');
        }
    },

    getMovieData: async (req, res) => {
        const { movie } = req.body;
        const movieApiKey = process.env.MOVIE_API_KEY;
        const movieURL = `https://omdbapi.com/?s=${movie}&page=1&apikey=${movieApiKey}`;
    
        try {
            const response = await fetch(movieURL);
            const movieData = await response.json();
            res.redirect(`/movie?movieData=${encodeURIComponent(JSON.stringify(movieData))}`);
        } catch (error) {   
            console.error('Error:', error);
            res.status(500).send('Error fetching movie data.');
        }
    }
}

module.exports = { movieController }