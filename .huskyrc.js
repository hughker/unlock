const tasks = tasks => {
  return (
    tasks
      .map(task => {
        if (task.path) {
          return `cd ${__dirname}/${task.path} && ${task.command} `
        } else if (task.paths) {
          // We need to execute the command in multiple paths
          return task.paths
            .map(path => {
              return `cd ${__dirname}/${path} && ${task.command} `
            })
            .join(`&& cd ${__dirname} && `)
        }
      })
      .join(`&& cd ${__dirname} && `) + `&& cd ${__dirname}`
  )
}

// If svg files are changed, generate the SVG Components
const svg2Components = {
  command:
    'if [[ $(git diff --cached --name-only | grep -c "unlock-app/src/static/images/svg/.*.svg$") > 0 ]] ; then npm run svg-2-components && git add src/components/interface/svg/*.js; fi',
  path: "unlock-app"
}

// Run lint on staged files
const lintStaged = {
  command: "npx lint-staged",
  path: "unlock-app"
}

// Check if installed dependencies match the ones in package-lock.json and re-install if they do not
const installDeps = {
  command: "blabla",
  paths: ["unlock-app", "smart-contracts", "locksmith"]
}

// tasks are given a path
module.exports = {
  hooks: {
    "pre-commit": tasks([svg2Components, lintStaged]),
    "post-checkout": tasks([installDeps])
  }
}
