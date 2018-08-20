let express = require('express');
let app = express();

app.use(express.static(__dirname + '/public/dist/public'));

let path = require('path');

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/boilerplate');


let PetSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required."], minlength: [3, "Name must contain more than 3 characters."] },
    type: { type: String, required: [true, "Type is required."], minlength: [3, "Type must contain more than 3 characters."] },
    description: { type: String, required: [true, "Description is required."], minlength: [3, "Description must contain more than 3 characters."] },
    skill_1: { type: String },
    skill_2: { type: String },
    skill_3: { type: String },
}, { timestamps: true });

let Pet = mongoose.model('Pet', PetSchema);

mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/static'));

app.get('/get_pets', function (req, res) {
    Pet.find({}, function (err, pets) {
        if (err) {
            console.log('something went wrong finding all the pets', err);
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully found all pets yo!');
            pets = pets;
            console.log(pets);
            res.json({ message: "Success", pets: pets });
        }
    })
})

//to show pet
app.get('/:_id', function (req, res) {
    console.log("req.params.id:", req.params)
    Pet.findOne({ _id: req.params._id }, function (err, pet) {
        console.log(pet);
        if (err) {
            console.log('something went wrong finding the pet yo', err);
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully found the pet yo!');
            pet = pet;
            res.json({ message: "Success", pet: pet });
        }
    })
})


app.post('/new_pet', function (req, res) {
    console.log(req.body)
    let pet = new Pet({
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        skill_1: req.body.skill_1,
        skill_2: req.body.skill_2,
        skill_3: req.body.skill_3,
    });
    pet.save(function (err) {
        if (err) {
            console.log('something went wrong creating a new pet');
            res.json({ message: "Error", error: err })
        }
        else {
            console.log('successfully created this pet!');
            pet = pet;
            console.log(pet);
            res.json({ message: "Success", pet: pet });
        }
    })
})

app.put('/update/:_id', function (req, res) {
    Pet.find({ _id: req.params._id }, function (err, pet) {
        console.log("PET IN SERVER:", pet);
        pet[0].name = req.body.name;
        pet[0].type = req.body.type;
        pet[0].description = req.body.description;
        pet[0].skill_1 = req.body.skill_1;
        pet[0].skill_2 = req.body.skill_2;
        pet[0].skill_3 = req.body.skill_3;
        pet[0].save(function (err) {
            if (err) {
                console.log("updating pet didn't go so well yo");
                res.json({ message: "Error", error: err })
            }
            else {
                console.log("successfully updated pet yo!");
                pet = pet;
                res.json({ message: "Success", pet: pet })
            }
        })
    })
})

app.delete('/delete/:_id', function (req, res) {
    Pet.remove({ _id: req.params._id }, function (err) {
        if (err) {
            console.log('something went wrong w/ deleting yo');
            res.json({ message: 'Error', error: err });
        }
        else {
            console.log('successfully deleted pet yo!');
            Pet.find({}, function (err, pets) {
                if (err) {
                    console.log('something went wrong finding all the pets yo', err);
                    res.json({ message: "Error", error: err })
                }
                else {
                    console.log('successfully found all pets yo!');
                    pets = pets;
                    console.log(pets);
                    res.json({ message: "Success", pets: pets });
                }
            })
        }
    })
})

// this route will be triggered if any of the routes above did not match
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});

app.listen(8000, function () {
    console.log("listening on port 8000");
})