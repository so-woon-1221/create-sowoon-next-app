#!/usr/bin/env node

const { execSync } = require('child_process')
const inquirer = require('inquirer').default
const fs = require('fs')
const path = require('path')

const appName = process.argv[2]

if (!appName) {
  console.error('Please specify the app name')
  process.exit(1)
}

// pick package manager using users choice
const getPackageManager = async () => {
  const { packageManager } = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Pick a package manager',
      choices: ['npm', 'yarn', 'pnpm', 'bun']
    }
  ])

  return packageManager
}

getPackageManager().then(pm => {
  switch (pm) {
    case 'npm':
      execSync(`npx create-next-app ${appName}`, {
        stdio: 'inherit'
      })
      break
    case 'yarn':
      execSync(`yarn create next-app ${appName}`, {
        stdio: 'inherit'
      })
      break
    case 'pnpm':
      execSync(`pnpm create next-app ${appName}`, {
        stdio: 'inherit'
      })
      break
    case 'bun':
      execSync(`bun create next-app ${appName}`, {
        stdio: 'inherit'
      })
      break
  }

  // then install the required packages
  const packageList = [
    '@mantine/core',
    '@mantine/hooks',
    '@tanstack/react-query',
    'jotai'
  ]

  const devPackageList = [
    '@tanstack/eslint-plugin-query',
    'eslint-config-prettier',
    'prettier'
  ]

  const packageManager = pm === 'bun' ? 'bun' : pm

  console.log('Installing required packages...')
  execSync(`${packageManager} add ${packageList.join(' ')}`, {
    cwd: path.join(process.cwd(), appName),
    stdio: 'inherit'
  })

  console.log('Installing dev packages...')
  execSync(`${packageManager} add -D ${devPackageList.join(' ')}`, {
    cwd: path.join(process.cwd(), appName),
    stdio: 'inherit'
  })

  console.log('Setting up the project...')
  //   copy app folder and components, states folder
  const appFolder = path.join(__dirname, '../', 'app')
  const appFolderFiles = fs.readdirSync(appFolder)

  const appFolderDest = path.join(process.cwd(), appName, 'app')
  const componentsFolderDest = path.join(process.cwd(), appName, 'components')
  const statesFolderDest = path.join(process.cwd(), appName, 'states')

  // fs.mkdirSync(appFolderDest)
  fs.mkdirSync(componentsFolderDest)
  fs.mkdirSync(statesFolderDest)

  appFolderFiles.forEach(file => {
    fs.copyFileSync(path.join(appFolder, file), path.join(appFolderDest, file))
  })

  // copy .prettierrc file
  const prettierrcFile = path.join(__dirname, '../', '.prettierrc.json')
  fs.copyFileSync(
    prettierrcFile,
    path.join(process.cwd(), appName, '.prettierrc.json')
  )
})
