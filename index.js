const express = require('express')
const app = express()
const date = new Date()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
morgan.token('body',function(req){return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
  response.json(phonebook)
})
app.get('/info',(request,response) => {
  const Npeople = phonebook.length
  response.send(`<h1>Phonebook has ${Npeople} entries</h1>
                <br>${date}</br>`
    )
})

const generateId = ()=>{
  const newId = Math.random() * phonebook.length+1
  return phonebook.filter(p=>p.id===newId) > 0 ? generateId() : newId
}


const errorHandler = (persona) => {
  if(persona.name===undefined||persona.number === undefined){
    return 'name missing or number missing'
  } else if (phonebook.filter(p=>p.number===persona.number).length >0){
    return 'number already exists'
  } return null
}


app.post('/api/persons',(request,response)=>{
  const body = request.body
  const anyError = errorHandler(body)
  const person = {
    name : body.name,
    number : body.number,
    id:generateId()
  }
  if(!anyError){
    phonebook= phonebook.concat(person)
    response.status(201).json(person)
  } else {
    response.status(400).json({error:anyError})
  }
})
app.get('/api/persons/:id',(request,response)=> {
  const found = phonebook.filter(p=>request.params.id === p.id)
  console.log(found)
  if(found.length>0){ 
    const person = phonebook.filter(p=>p.id === request.params.id)
    response.json(person)}
  else {
    response.status(404).end()
  }
})
app.delete('/api/persons/:id',(request,response) => {
  const id = request.params.id
  phonebook= phonebook.filter(n=>n.id!=id)
  response.status(204).end()
})
const PORT = 3001
app.listen(PORT,()=>{
  console.log('server started')
})