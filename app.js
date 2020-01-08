let express = require('express');
const app = express();
let port = process.env.PORT;
if(!port || port == '')
    port = 8000;

// for environment variables
require('dotenv').config();

// used to deliver static files like HTML etc.
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 

app.get('/', (req, res) => {
    res.render('index.html');
});

app.get('/:smth', (req, res) => {
    res.redirect('/');
});


app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});