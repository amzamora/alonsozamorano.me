const express = require('express')
const app = express()

// Config
app.set('view engine', 'ejs')

// Serve assets folder
app.use(express.static('assets'))
app.use('/imgs', express.static('posts/imgs'));

// Routing
app.get('/', (_, res) => {
    res.render('pages/home')})

app.get('/blog', (req, res) => {
    res.render('pages/blog', {posts: getPosts()})})

app.get('/blog/:slug', (req, res) => {
    res.render('pages/post', {post: getPost(req.params.slug + '.md')})})

// Start listening
app.listen(3000)

// Utilities
// ---------
const fs = require('fs-extra');
const matter = require('gray-matter');
const { DateTime } = require("luxon");
const hljs = require('highlight.js');
const markdown = require('markdown-it')({
	html: true,
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return '<pre class="hljs"><code>' +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					'</code></pre>';
			} catch (__) {}
		}

		return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(str) + '</code></pre>';
	}
});

function getPosts() {
	let posts = [];

	fs.readdirSync('posts').map(path => {
        try {
		    posts.push(getPost(path));
        } catch (__) {}
	});

	return posts;
}

function getPost(path) {
	const file = matter(fs.readFileSync('posts/' + path).toString());
	const data = file.data;
	const content = file.content;

	// Get date
	const date = DateTime.fromISO(data.date);

	// Get title
	const title = data.title

	// Get excerpt
	let index = 0;
	while (content[index] === '\n') index += 1;
	let start = index;
	while (content.substr(index, 13) !== '<!-- more -->') {
		index = index + 1;
	}
	let excerpt = markdown.render(content.substring(start, index));

	// Get url
	let url = `/blog/${path.split('.')[0]}/`;

	return {
		title: title,
		date: date,
		excerpt: excerpt,
		url: url,
		content: markdown.render(content),
	}
}

function deleteFile(file) {
	if (fs.lstatSync(file).isDirectory()) {
		deleteFolderRecursive(file);
	}
	else {
		fs.unlinkSync(file);
	}
}

// From: https://stackoverflow.com/a/12761924
function deleteFolderRecursive(path) {
	var files = [];
	if(fs.existsSync(path)) {
		files = fs.readdirSync(path);
		files.forEach(function(file, index) {
			var curPath = path + "/" + file;
			if(fs.lstatSync(curPath).isDirectory()) {
				deleteFolderRecursive(curPath);
			}
			else { // delete file
				fs.unlinkSync(curPath);
			}
		});
		fs.rmdirSync(path);
	}
};