import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai'; // { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "system",
          "content": "You are a helpful assistant!"
        },
        {
          "role": "user",
          "content": "Write me a python script to say Hello World!"
        },
        {
          "role": "assistant",
          "content": "Certainly! Here is a simple Python script that prints \"Hello World!\":\n\n```python\nprint(\"Hello World!\")\n```\n\nYou can run this script in a Python interpreter or save it in a `.py` file and run it using a Python interpreter. Let me know if you need help with anything else!"
        },
        {
          "role": "user",
          "content": "How can I make a github repository?"
        },
        {
          "role": "assistant",
          "content": "To create a GitHub repository, you can follow these steps:\n\n1. Go to https://github.com in your web browser and log in to your GitHub account. If you don't have an account, you can sign up for free.\n\n2. Once you are logged in, click on the '+' icon in the top right corner of the page and select \"New repository\" from the dropdown menu.\n\n3. In the \"Repository name\" field, enter a name for your repository. You can also add a description, choose whether the repository will be public or private, and select other options if needed.\n\n4. Click on the \"Create repository\" button to create your new repository.\n\n5. After creating the repository, you can add files, folders, and make changes to your repository using Git commands or GitHub's web interface.\n\nRemember to initialize the repository with a README file if you want to have some content in your repository from the start.\n\nI hope this helps! Let me know if you have any other questions."
        }
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });;

    res.status(200).send({
      bot: response.choices[0].text
    });

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error(error.status);  // e.g. 401
      console.error(error.message); // e.g. The authentication token you passed was invalid...
      console.error(error.code);  // e.g. 'invalid_api_key'
      console.error(error.type);  // e.g. 'invalid_request_error'
    } else {
      // Non-API error
      console.log(error);
    }
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))