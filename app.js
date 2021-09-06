
var express = require("express");
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var flash     = require("connect-flash");
var path = require('path');
var nodemailer = require('nodemailer')
const firebase = require('firebase/app');
const { getStorage, ref, listAll, getDownloadURL, getMetadata } = require("firebase/storage");

const { getFirestore, collection, getDocs } = require('firebase/firestore/lite');

const firebaseConfig = {
    apiKey: "AIzaSyCv0o37DSxyiyHXfnaolH9Xg_ZU8KQ4Uw8",
    authDomain: "testingwebsite-73c46.firebaseapp.com",
    projectId: "testingwebsite-73c46",
    storageBucket: "testingwebsite-73c46.appspot.com",
    messagingSenderId: "937415544789",
    appId: "1:937415544789:web:faf816fc3597ee812af75c",
    measurementId: "G-WMCL0LMT4F"
  };

  const fire = firebase.initializeApp(firebaseConfig);
  const db = getFirestore(fire);

  const storage = getStorage();

  // Create a reference under which you want to list
  const listRef = ref(storage, 'Gallery');
  
  // Find all the prefixes and items.
  let galleryPhotos = [];

  listAll(listRef)
    .then((res) => {
      res.prefixes.forEach((folderRef) => {
        // const albumRef = ref(storage, `${folderRef._location.path_}`);
        // listAll(albumRef).then((result) => console.log("album ", folderRef._location.path_ ,result.items.length))
        // console.log('folder name', folderRef._location.path_);
      });
      // console.log("length of album ", res.items.length)
      res.items.forEach((itemRef) => {
        // All the items under listRef

         getDownloadURL(itemRef).then((url) => {
          galleryPhotos.push(url);
          // console.log('image url ', url)
        })
      });
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log('errror', error)
    });

    


var PORT = 3000 || 5000;

app.use(cors());
app.use(flash());
app.use(require("express-session")({
    secret : "I was framed",
    resave : false,
    saveUninitialized : false
 }));

 app.use(bodyParser.urlencoded({extended:true}));
 app.set("view engine", "ejs");
//  app.use(express.static(path.join(__dirname, 'public')));
 app.use(express.static(__dirname + "/public"));


 async function getReviews(db) {
    const reviewCollection = collection(db, 'CustomerReview');
    const reviewSnapshot = await getDocs(reviewCollection);
    const reviews = reviewSnapshot.docs.map(doc => doc.data());
    return reviews;
  }

  async function getCinematography(db) {
    const cinemaCollection = collection(db, 'Cinematography');
    const cinemaSnapshot = await getDocs(cinemaCollection);
    const cinema = cinemaSnapshot.docs.map(doc => doc.data());
    return cinema;
  }

  async function getWedding(db) {
    const weddingCollection = collection(db, 'Wedding');
    const weddingSnapshot = await getDocs(weddingCollection);
    const wedding = weddingSnapshot.docs.map(doc => doc.data());
    return wedding;
  }


 app.get('/', async (req, res) => {
    let customerReview = await getReviews(db);
    // let gallery = await getGallery(db);
    // console.log('customer review data', galleryPhotos);
  

     res.render('index', { customerReview: customerReview, gallery: galleryPhotos, path: 'home' })
 })

 app.get('/contact', (req, res) => res.render('contact', { path: 'contact', message: req.flash() }))

 app.post('/contact', (req, res) => {
   console.log("contact details", req.body);

   let  transporter = nodemailer.createTransport({
    secure: false,
    service : 'gmail',
    auth: {
      user : "hardik.kuwar@techmatters.com",
      pass : "hardboyyy123"
    } 
  });

  // setup email data with unicode symbols
  let  mailOptions = {
    from: 'hardik kuwar <hardik.kuwar@techmatters.com>', // sender address
    to: "hardik.kuwar@techmatters.com", // list of receivers
    subject: req.body.subject, // Subject line
    text: `Name: ${req.body.fullName}
           Email: ${req.body.email}
           Message: ${req.body.message}`, // plain text body
    // html: "", // html body,
  };

  // send mail with defined transport object
   transporter.sendMail(mailOptions, function(err,response){
    
      if(err){
        console.log(err);
        req.flash("error", "Something went wrong!!!");
        res.redirect('/');

      }else {
        console.log('email sent');
        req.flash("success", "Successfully submited your data");
        res.redirect('/');
      }

   })

   

})

app.get('/cinematography', async (req, res) => {
  let cinematography = await getCinematography(db);
  res.render('cinematography', { cinematography, path: 'cinematography' })
})

app.get('/wedding', async (req, res) => {
  let wedding = await getWedding(db);
  console.log("weddingg", wedding)
  return res.render('wedding', { wedding, path: 'wedding' });
})

app.get('/pre-wedding', async (req, res) => {
  let wedding = await getWedding(db);
  console.log("weddingg", wedding)
  return res.render('wedding', { wedding, path: 'wedding' });
})

app.get('/wedding/:album_name', async (req, res) => {

  console.log(req.params.album_name);

  const listRef = await ref(storage, `Wedding/${req.params.album_name}`);

  let albumPhotos = [];
   listAll(listRef)
    .then((result) => {
        result.items.forEach((itemRef) => {
          return getDownloadURL(itemRef).then((url) => {
          //  console.log('image url ', url)
          return albumPhotos.push(url);
          // console.log('album data', albumPhotos);
        })
      });
      console.log('album phtos', albumPhotos)
      // return res.render('album', { albumPhotos })
    }).catch((error) => {
      // Uh-oh, an error occurred!
      console.log('errror', error)
    });

    setTimeout(function(){
      console.log('album photos', albumPhotos)
      res.render('album', { albumPhotos, albumName: req.params.album_name, path: 'wedding' })
    }, 3000)


    // res.render('album', { albumPhotos })

})



 app.listen(PORT, function(){
    console.log("server has started!!!");
});