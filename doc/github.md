# Using GitHub on this project

1. Fork this project on GitHub.
2. Clone your fork.
3. Periodically, and definitely before making any pull requests [sync your fork with the main one](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks/syncing-a-fork):
    1. [Configure a remote that points upstream](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork)
    2. Fetch the branches and their respective commits from the upstream repository:

        ```
        git fetch upstream
        ```

    3. Check out your fork's local default branch, `master` (or whatever you've called it):

        ```
        git checkout main
        ```

    4. Merge the changes from the upstream default branch - in this case, `upstream/master` - into your local default branch. This brings your fork's default branch into sync with the upstream repository, without losing your local changes.

        ```
        git merge upstream/main
        ```

    5. Syncing your fork only updates your local files. Before you can collaborate further, you'll need to push your branch:

        ```
        git push
        ```

4. When you're ready to send your code, do the following:

    1. Sync with upstream and resolve any merge conflicts. Don't make a PR for a branch with merge conflicts!
    2. Push your branch up to your GitHub branch (`git push`).
    3. On GitHub, open a pull request. Give a descriptive title and describe what your PR is about. Alternatively, you can use GitHub's `gh` command if you've installed it.
