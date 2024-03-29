const movieController = {

    getMoviePage: async (req, res) => {
        try {
            let movieData = null;
            if (req.session.movieData) {
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
            if (movieData && movieData.Search && movieData.Search.length > 0) {
                req.session.movieData = movieData;
                res.redirect(`/movie`);
            } else {
                res.status(404).json({ message: 'No movie found with that name.' });
            }
            
        } catch (error) {   
            console.error('Error:', error);
            res.status(500).send('Error fetching movie data.');
        }
    }
}

module.exports = { movieController }