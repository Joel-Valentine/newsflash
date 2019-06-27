require("babel-polyfill");
const config = require('../config');

function apiCall(section, apiKey) {
	return new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `https://content.guardianapis.com/search?q=${section}&api-key=${apiKey}`, true);
		xhr.onload = (e) => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.response));
				} else {
					console.error(xhr.statusText);
				}
			}
		};
		xhr.onerror = (e) => {
			console.error(xhr.statusText);
		};
		xhr.send(null);
	});
}

function render(type, results) {
	return new Promise((resolve) => {
		const parent = document.getElementById(type);
		const list = document.createElement('ol');

		for (let index = 0; index < results.length; index += 1) {
			const item = document.createElement('li');
			const link = document.createElement('a');
			link.setAttribute('href', results[index].webUrl);
			link.innerHTML = results[index].webTitle;
			item.appendChild(link);
			list.appendChild(item);
		}
		document.getElementById(`load-${type}`).style.display = 'none';
		parent.appendChild(list);
		resolve();
	});
}

// Very statically called at the moment, should be more dynamic
async function asyncCall() {
	const travel = await apiCall('Travel', config.apiKey);
	const news = await apiCall('News', config.apiKey);
	const football = await apiCall('Football', config.apiKey);
	await render('travel', travel.response.results);
	await render('news', news.response.results);
	await render('football', football.response.results);
}

window.addEventListener('DOMContentLoaded', asyncCall(), false);
