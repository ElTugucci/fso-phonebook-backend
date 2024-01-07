const express = require('express')
const morgan = require('morgan')
const app = express()


morgan.token('post-data', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
  });

app.use(express.json())
app.use(morgan(':method :url :status :response-time ms :post-data')); 

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    return Math.floor(Math.random() * 10000)
  }

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
  
    const person = {
      name:body.name,
      number: body.number,
      id: generateId(),
    }
  
      persons = persons.concat(person)
  
    response.json(person)
  })

app.get('/', (request, response) => {
	response.send('<h1>Hello World </h1>')
})


app.get('/api/persons', (request,response)=>{
    response.json(persons)
})

app.get('/api/persons/:id', (request, response)=> {
	const id = Number(request.params.id)
	const person = persons.find(person => { 
    return person.id === id})
 if(person){
  response.json(person)
 }else{
  response.status(404).end()
 }
})

app.get('/info', (request,response)=>{
    response.send(`
    <p>Phone book has info for ${persons.length} people</p>
    <p>${getDate()}</p>
    `)
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=> person.id !== id)
    response.status(204).end()
  })

const PORT = 3001
app.listen(PORT, () =>{
    console.log("Server running on port", PORT);
})