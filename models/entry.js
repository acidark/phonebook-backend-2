/* eslint-disable no-undef */
const mongoose = require('mongoose')
// eslint-disable-next-line no-undef
require('dotenv').config()

const url = process.env.DATABASE_URL 

mongoose.connect(url)
// .then(result=>console.log('connected'))
.then(result=>console.log('connected to db')).catch(error=>console.log('error connecting to db',error.message))
const entrySchema = new mongoose.Schema({
  name:{
    type:String,
    minLength:3,
    required:true
  },
  number:{
    type:String,
    minLength:8,
    validate: {
      validator:function(value)
      {
        return /\d{3}-\d{5}/.test(value)
      },
      message: props => `${props.value} malformatted`
    }

}})

entrySchema.set('toJSON',{
  transform:(document,returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry',entrySchema)