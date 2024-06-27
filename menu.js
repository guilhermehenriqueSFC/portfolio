document.addEventListener("DOMContentLoaded", function () {
    const githubUsername = 'guilhermehenriqueSFC';
    const repoCount = 5;
    const accessToken = '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';

    const headers = {
        'Authorization': `token ${accessToken}`
    };

    fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=${repoCount}`, {
        headers: headers
    })
        .then(response => response.json())
        .then(repos => {
            const reposContainer = document.querySelector('.repos-container');

            function fetchCommits(repo) {
                return fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/commits`, {
                    headers: headers
                })
                    .then(response => response.json())
                    .then(commits => {
                        return commits.length;
                    })
                    .catch(error => {
                        console.error(`Erro ao carregar os commits do repositório ${repo.name}:`, error);
                        return 0;
                    });
            }

            const commitPromises = [];

            repos.forEach(repo => {
                const repoBox = document.createElement('div');
                repoBox.classList.add('repo-box');

                repoBox.innerHTML = `
          <h3 class="repo-name"><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p class="repo-description">${repo.description || 'Sem descrição.'}</p>
          <p class="repo-commits">Carregando...</p> <!-- Elemento para mostrar o número de commits -->
        `;

                reposContainer.appendChild(repoBox);

                const commitPromise = fetchCommits(repo);
                commitPromises.push(commitPromise);

                commitPromise.then(numCommits => {
                    const repoCommitsElement = repoBox.querySelector('.repo-commits');
                    repoCommitsElement.textContent = `Commits: ${numCommits}`;
                });
            });

            Promise.all(commitPromises)
                .then(() => {
                    console.log('Todos os commits carregados.');
                })
                .catch(error => {
                    console.error('Erro ao carregar os commits:', error);
                });

        })
        .catch(error => console.error('Erro ao carregar os repositórios do GitHub:', error));
});
