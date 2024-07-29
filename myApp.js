require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log(`uri is: ${uri}`);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: {
    w: "majority",
    wtimeout: 5000
  }
})
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Connection error", error);
  });


// Define the schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  favoriteFoods: { type: [String] }
});

// Create the model
let Person = mongoose.model('Person', personSchema);

const createAndSavePerson = async () => {
  const person = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["pizza", "burger"]
  });

  const data = await person.save();
  return data;

};

const createManyPeople = async (arrayOfPeople) => {
  await Person.deleteMany({});
  const result = await Person.create(arrayOfPeople);
  return result;
};

const findPeopleByName = async (personName) => {
  const people = await Person.find({ name: personName });
  return people;
};

const findOneByFood = async (food) => {
  const person = await Person.findOne({ favoriteFoods: food });
  return person;
};

const findPersonById = async (personId) => {
  const person = await Person.findById({ _id: personId });
  return person;
};

const findEditThenSave = async (personId) => {
  const foodToAdd = "hamburger";

  const person = await Person.findById(personId);
  person.favoriteFoods.push(foodToAdd);
  await person.save();
  return person;
};

const findAndUpdate = async (personName) => {
  const ageToSet = 20;
  const filter = { name: personName };
  const update = { age: ageToSet };

  const updatedPerson = await Person.findOneAndUpdate(filter, update, {
    new: true
  });
  return updatedPerson;
};

/* const removeById = async(personId) => {
  const filter = { _id: personId };
  const deletedPerson = await Person.findOneAndRemove(filter);
  console.log('deletedPerson is: ',deletedPerson);
  return deletedPerson;
}; */
const removeById = (personId, done) => {
  Person.findOneAndRemove({ _id: personId }, (err, deletedPerson) => {
    if (err) {
      return done(err);
    }
    console.log('deletedPerson is: ', deletedPerson);
    done(null, deletedPerson);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove},(err, data) => {
    if (err) {
      return done(err);
    }
    console.log('deletedPersons are: ', data);
    done(null, data);
})  
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods: foodToSearch})
  .sort({ name: 1 })
  .limit(2)
  .select('-age')
  .exec((err, data) => {
    if (err) {
      return done(err);
    }
    done(null , data);
})  
};


/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
