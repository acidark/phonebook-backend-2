const mongoose = require('mongoose')
if(process.argv.length < 3) {
  console.log('input password as argument')
  process.exit(1)
}
const name = process.argv[3]
const number = process.argv[4]
const password = process.argv[2]
const url = `mongodb://phonebook:${password}@18.153.90.163/phonebookDB?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name:String,
  number:String
})

const Entry = mongoose.model('Entry',entrySchema)
const entry = new Entry({
  name:name,
  number:number
})
if(process.argv.length===3){
  Entry
  .find({})
  .then(persons=>{
    console.log('phonebook')
    persons.map(p=>console.log(p.name,p.number))
    mongoose.connection.close()
  })
} else {
    entry.save().then(result=>{
    console.log('entry saved')
    mongoose.connection.close()
  })
}