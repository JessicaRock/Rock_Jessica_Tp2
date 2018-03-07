const express = require('express');
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient; // le pilote MongoDB
const ObjectID = require('mongodb').ObjectID;

const cookieParser = require('cookie-parser');
const i18n = require('i18n');
i18n.configure({ 
   locales : ['fr', 'en'],
   cookie : 'langueChoisie', 
   directory : __dirname + '/locales' });


const util = require("util");

//Fonction js peupler()
const peupler = require('./mes_modules/peupler');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(i18n.init);


/* on associe le moteur de vue au module «ejs» */
app.set('view engine', 'ejs'); // générateur de template





////////////////////////////////////// PAGES //////////////////////////////////////

/////////////////////////////////////////////////////////////////////////// ACCUEIL
app.get('/', (req, res) => {

    console.log('accueil');
    res.render('accueil.ejs');
});




/////////////////////////////////////////////////////////////////////////// MEMBRES
app.get('/membres', (req, res) => {

    db.collection('adresse').find().toArray(function(err, resultat) {

        if (err) return console.log(err);
        //console.log('util = ' + util.inspect(resultat));

        // transfert du contenu vers la vue gabarit.ejs (renders)
        // affiche le contenu de la BD
        res.render('membres.ejs', { membres: resultat });
    });
});





////////////////////////// AJOUTER - MODIFIER - SUPPRIMER //////////////////////////

/////////////////////////////////////////////////////////////////////////// AJOUTER
app.get('/ajouter', function(req, res) {

    db.collection('adresse').save(req.query, (err, result) => {

        if (err) return console.log(err);
        console.log('sauvegarder dans la BD');
        res.redirect('/membres');

    });
});

app.post('/ajouter_ajax', (req,res) => {
   req.body._id = ObjectID(req.body._id)

   db.collection('adresse').save(req.body, (err, result) => {
   if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.send(JSON.stringify(req.body));
        // res.status(204)
   })
})



/////////////////////////////////////////////////////////////////////////// MODIFIER
app.post('/modifier', function(req, res) {
    /*
    let oModif = {
        "_id": ObjectID(req.body['_id']),
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        courriel: req.body.courriel
    };
    */
    
    console.log('/modifier');
    req.body._id = ObjectID(req.body._id)

    db.collection('adresse').save(req.body, (err, result) => {

        if (err) return console.log(err);
        console.log('sauvegarder dans la BD');
        res.redirect('/membres');

    });
});




/////////////////////////////////////////////////////////////////////////// SUPPRIMER
app.get('/supprimer/:id', (req, res) => {

    let id = req.params.id;
    db.collection('adresse').findOneAndDelete({ "_id": ObjectID(req.params.id) }, (err, resultat) => {

        if (err) return console.log(err);
        res.redirect('/membres'); // redirige vers la route qui affiche la collection
    });
});










/////////////////////////////////////////////////////////////////////////// TRIER
app.get('/trier/:cle/:ordre', function(req, res) {

    let cle = req.params.cle;

    let ordre = (req.params.ordre == 'asc' ? 1 : -1);

    db.collection('adresse').find().sort(cle, ordre).toArray(function(err, resultat) {
        if (ordre == 1) {
            ordre = 'desc';
        } else {
            ordre = 'asc';
        }

        console.log('util = ' + util.inspect(resultat));
        res.render('membres.ejs', { membres: resultat, ordre_url: ordre });
    });
});


/////////////////////////////////////////////////////////////////////////// TRADUIRE
app.get('/:locale(en|fr)', (req, res) =>{
    res.setLocale(req.params.locale);
    res.cookie('langueChoisie', req.params.locale);
    
    res.redirect(req.get("referer"));
})



/////////////////////////////////////////////////////////////////////////// RECHERCHER
app.post('/rechercher', (req, res) => {
    let recherche = req.body.recherche;
    console.log(recherche)

   db.collection('adresse').find({$or: [{"prenom": recherche}, {"nom" : recherche}, {"telephone" : recherche}, {"courriel" : recherche}]}).toArray(function(err, resultat){

        if (err) return console.log(err);

        console.log('***********************')
        //console.log(resultat);
        console.log('util = ' + util.inspect(resultat));

        res.render('listeRecherche.ejs', { membres: resultat });
    })
});


/////////////////////////////////////////////////////////////////////////// AFFICHER
app.get('/afficher/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
   db.collection('adresse').findOne({"_id" : ObjectID(id)}, function(err, resultat){

        if (err) return console.log(err);

        console.log('***********************')
        //console.log(resultat);
        console.log('util = ' + util.inspect(resultat));

        res.render('adresseMembre.ejs', { membre: resultat });
    })
});







///////////////////////// GÉNÉRATION DE DONNÉES DANS MONGODB /////////////////////////

/////////////////////////////////////////////////////////////////////////// PEUPLEMENT
app.get('/peuplement', function (req, res) {

    console.log(__dirname);
    let aoNouvAdd = peupler();

    let iLongueur = aoNouvAdd.length;
    for(let i = 0; i<iLongueur; i++) {

        db.collection('adresse').save(aoNouvAdd[i], (err, result) => {

            if (err) return console.log(err);
            console.log('sauvegarder dans la BD');

        });
    }

    res.redirect('/membres');
});




/////////////////////////////////////////////////////////////////////////// VIDER
app.get('/vider', function (req, res) {

    console.log(__dirname);
    
    db.collection('adresse').remove({}, (err, resultat) => {

        if (err) return console.log(err);
        console.log('Supprimé');
        res.redirect('/membres');
    });

});







let db; // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017', (err, database) => {
    if (err) return console.log(err);
    db = database.db('carnet_adresse');
    // lancement du serveur Express sur le port 8081
    app.listen(8081, () => {
        console.log('connexion à la BD et on écoute sur le port 8081')
    });

});