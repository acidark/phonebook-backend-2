
const express = require('express')
const app = express()
const date = new Date()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
const unknownEndpoint = (request,response) => {
  response.status(404).send({error:'unknown endpoint'})
}
morgan.token('body',function(req){return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const Entry = require('./models/entry')
// let phonebook = [
    // { 
      // "id": "1",
      // "name": "Arto Hellas", 
      // "number": "040-123456"
    // },
    // { 
      // "id": "2",
      // "name": "Ada Lovelace", 
      // "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]
app.get('/api/persons',(request,response)=>{
  // response.json(phonebook)
  Entry
  .find({})
  .then(persons=>{
    response.json(persons)
    // mongoose.connection.close()
  })
})
app.get('/info',(request,response) => {
  // const Npeople = phonebook.length
  Entry
  .find({})
  .then(persons=>{
    response.send(`<h1>Phonebook has ${persons.length} entries</h1>`)
  })
  
  // response.send(`<h1>Phonebook has ${Npeople} entries</h1>
                // <br>${date}</br>`
    // )
})

const generateId = ()=>{
  const newId = Math.random() * phonebook.length+1
  return phonebook.filter(p=>p.id===newId) > 0 ? generateId() : newId
}
const errorHandler =(error,request,response,next) => {
  console.log(error.message)
  if(error.name==='CastError'){
    return response.status(400).send({error:'malformated url'})
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}

const inputHandler = (persona) => {
  if(persona.name===undefined||persona.number === undefined){
    return 'name missing or number missing'
  } else if (phonebook.filter(p=>p.number===persona.number).length >0){
    return 'number already exists'
  } return null
}
// app.get('/api/persons/info')
app.put('/api/persons/:id',(request,response,next)=>{
  const id = request.params.id
  const body = request.body
  const entry = {
    name : body.name,
    number :body.number
  }
  Entry.findByIdAndUpdate(id,entry,{new:true})
  .then(updatedEntry=>{
    response.json(updatedEntry)
  })
  .catch(error=>next(error))
})

app.post('/api/persons',(request,response,next)=>{
  const body = request.body
  // const anyError = errorHandler(body)
  const person = new Entry({
    name : body.name,
    number : body.number,
    // id:generateId()
  })
  // if(!anyError){
    // phonebook= phonebook.concat(person)
    person.save()
    .then(savedPerson=>{
      response.status(201).json(savedPerson)
    }).catch(error=>next(error))
    
    // mongoose.connection.close()
  // } else {
    // response.status(400).json({error:anyError})
  // }
})
app.get('/api/persons/:id',(request,response,next)=> {
  // const found = phonebook.filter(p=>request.params.id === p.id)
  // console.log(found)
  const id= request.params.id
  Entry.findById(id)
  .then(entry =>{
    if(entry){ 
    // const person = phonebook.filter(p=>p.id === request.params.id)
    response.json(person)}
  else {
    response.status(404).end()
  }})
  .catch(error=>{
    next(error)
    // console.log(error)

    // response.status(400).send({error:'malformated url'})
  }
  )
})
app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  // phonebook= phonebook.filter(n=>n.id!=id)
  // response.status(204).end()
  Entry.findByIdAndDelete(id)
  .then(result => response.status(204).end())
  .catch(error => next(error))
})
app.use(unknownEndpoint)
app.use(errorHandler)
const PORT = 3001
app.listen(PORT,()=>{
  console.log('server started')
})