let express = require('express');
const app = express();

// for environment variables
require('dotenv').config();

// used to deliver static files like HTML etc.
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 

app.get('/', (req, res) => {
    res.render('index.html');
});


app.listen(process.env.SITE_PORT, () => {
    console.log(`Listening on port ${process.env.SITE_PORT}...`);
});