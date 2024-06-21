import axios from 'axios';
import ora from 'ora';

export const fetchGithubRepos = async (token: string) => {
    const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
            Authorization: `token ${token}`
        }
    });
    return response.data.map((repo: { name: string }) => repo.name);
};

export const deleteGithubRepos = async (token: string, repos: string[]) => {
    const spinner = ora();
    for (const repo of repos) {
        spinner.start(`Deleting repository ${repo}...`);
        try {
            const response = await axios.get('https://api.github.com/user', {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            const username = response.data.login;

            await axios.delete(`https://api.github.com/repos/${username}/${repo}`, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            spinner.succeed(`Deleted repository ${repo}.`);
        } catch (error) {
            spinner.fail(`Failed to delete repository ${repo}. ${(error as any).response?.data?.message || (error as Error).message}`);
        }
    }
};