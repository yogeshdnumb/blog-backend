require("dotenv").config();
const mongoose = require('mongoose');

// Define the Mongoose schema for articles
const articleSchema = mongoose.Schema({
  author: { type: String },
  title: { type: String },
  body: { type: String },
  created: { type: Date, default: Date.now },
});

// Create a Mongoose model for articles
const Article = mongoose.model('Article', articleSchema);

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:mongoo69@cluster0.rpbsye0.mongodb.net/cl-test?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Check for database connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Function to generate a large body
  function generateBody() {
    const dummyText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    let body = '';
    // Repeat the dummy text multiple times to make the body large
    for (let i = 0; i < 10; i++) {
      body += dummyText + '\n\n'; // Add new lines between paragraphs
    }
    return body;
  }

  // Sample article data with large body
  const sampleArticles = [
    {
      author: 'John Doe',
      title: 'Introduction to MongoDB',
      body: generateBody(), // Generate large body
      created: new Date()
    },
    {
      author: 'Jane Smith',
      title: 'Getting Started with Mongoose',
      body: generateBody(), // Generate large body
      created: new Date()
    },
    // Add 10 more sample articles
    {
      author: 'Alice Johnson',
      title: 'Node.js Best Practices',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Bob Thompson',
      title: 'React Hooks Tutorial',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Emily Davis',
      title: 'JavaScript Promises Explained',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'David Brown',
      title: 'CSS Grid Layout Basics',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Sophia Martinez',
      title: 'Vue.js vs React.js',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Michael Wilson',
      title: 'Express.js Middleware Guide',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Olivia Garcia',
      title: 'HTML5 Canvas Tutorial',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'William Rodriguez',
      title: 'Docker Basics for Developers',
      body: generateBody(),
      created: new Date()
    },
    {
      author: 'Emma Anderson',
      title: 'Responsive Web Design Principles',
      body: generateBody(),
      created: new Date()
    }
  ];

  try {
    // Insert sample articles into the database
    const insertedArticles = await Article.insertMany(sampleArticles);
    console.log('Sample articles inserted:', insertedArticles);
  } catch (error) {
    console.error('Error inserting sample articles:', error);
  }

  // Disconnect from MongoDB
  mongoose.disconnect();
});