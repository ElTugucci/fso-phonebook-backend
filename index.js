require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')
const cors = require('cors')
const app = express()


morgan.token('post-data', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  const errorHandler = (error, request, response, next) => {
    console.log(error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({error: 'malformatted id'})
    }
    next(error)
  }


app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :post-data')); 
app.use(express.static('dist'))
app.use(cors())

const getDate =() => {
    const date = new Date()
    return date
}

app.post('/api/persons', (request, response)=>{
    const body = request.body
   
    if(!body.name || !body.number) {
      return response.status(400).json({
      error: 'name or number missing'
      })
    }
    if (persons.some(p => p.name === body.name)){
        return response.status(400).json({
            error: 'name must be unique'
            }) 
    }
  
    const person = new Person( {
      name:body.name,
      number: body.number,
    })
    
    person.save().then(savedPerson =>{
      response.json(savedPerson)
    })
  
  })

app.get('/', (request, response) => {
	response.send('<h1>Hello World </h1>')
})


app.get('/api/persons', (request,response)=>{
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response)=> {
  Person.findById(request.params.id).then(note=> {
    response.json(note)
  })
})

app.get('/info', (request,response)=>{
    response.send(`
    <p>Phone book has info for ${persons.length} people</p>
    <p>${getDate()}</p>
    `)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    content: body.name,
    important: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response)=>{
   Person.findByIdAndDelete(request.params.id) 
   .then(result =>{
    response.status(204).end()
   })
   .catch(error => next(error))
  })
  
  app.use(unknownEndpoint)
  app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log("Server running on port", PORT);
})