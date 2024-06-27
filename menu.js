document.addEventListener("DOMContentLoaded", async function () {
    const githubUsername = 'guilhermehenriqueSFC';
    const repoCount = 5;
    const reposContainer = document.querySelector('#github-repos .repos-container');

    try {
        const repos = await fetchRepos(githubUsername, repoCount);

        const commitPromises = repos.map(async repo => {
            const repoBox = createRepoBox(repo);
            reposContainer.appendChild(repoBox);

            try {
                const numCommits = await fetchCommits(githubUsername, repo.name);
                updateRepoCommits(repoBox, numCommits);
            } catch (error) {
                handleError(`Erro ao carregar os commits do repositório ${repo.name}:`, error);
                updateRepoCommits(repoBox, 0);
            }
        });

        await Promise.all(commitPromises);
        console.log('Todos os commits carregados.');
    } catch (error) {
        console.error('Erro ao carregar os repositórios do GitHub:', error);
    }

    function fetchRepos(username, count) {
        return fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=${count}`)
            .then(response => response.json());
    }

    function fetchCommits(username, repoName) {
        return fetch(`https://api.github.com/repos/${username}/${repoName}/commits`)
            .then(response => response.json())
            .then(commits => commits.length);
    }

    function createRepoBox(repo) {
        const box = document.createElement('div');
        box.classList.add('repo-box');
        box.innerHTML = `
            <h3 class="repo-name"><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p class="repo-description">${repo.description || 'Sem descrição.'}</p>
            <p class="repo-commits">Carregando...</p>
        `;
        return box;
    }

    function updateRepoCommits(repoBox, numCommits) {
        const commitsElement = repoBox.querySelector('.repo-commits');
        commitsElement.textContent = `Commits: ${numCommits}`;
    }

    function handleError(message, error) {
        console.error(message, error);
    }
});
