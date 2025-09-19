#!/usr/bin/env tsx

import { getUncachableGitHubClient } from '../server/github.js';
import { execSync } from 'child_process';
import fs from 'fs';

async function setupGitHubRepository() {
  try {
    console.log('🚀 Setting up GitHub repository for Card Clash Arena...');
    
    // Get GitHub client
    const octokit = await getUncachableGitHubClient();
    
    // Get user info
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Connected to GitHub as: ${user.login}`);
    
    // Repository details
    const repoName = 'card-clash-arena';
    const repoDescription = 'A comprehensive card battle game with real-time multiplayer, PostgreSQL database, and advanced animations built with React and Node.js';
    
    try {
      // Check if repository already exists
      const { data: existingRepo } = await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName,
      });
      console.log(`📁 Repository already exists: ${existingRepo.html_url}`);
      return existingRepo.html_url;
    } catch (error) {
      // Repository doesn't exist, create it
      console.log('📁 Creating new GitHub repository...');
      
      const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
        name: repoName,
        description: repoDescription,
        private: false, // Set to true if you want a private repo
        auto_init: false,
      });
      
      console.log(`✅ Repository created: ${repo.html_url}`);
      
      // Initialize git if not already initialized
      try {
        execSync('git status', { stdio: 'ignore' });
        console.log('✅ Git repository already initialized');
      } catch {
        console.log('📝 Initializing git repository...');
        execSync('git init');
      }
      
      // Create .gitignore if it doesn't exist
      if (!fs.existsSync('.gitignore')) {
        const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Database
*.db
*.sqlite
`;
        fs.writeFileSync('.gitignore', gitignore);
        console.log('✅ Created .gitignore file');
      }
      
      // Add remote origin
      try {
        execSync('git remote remove origin', { stdio: 'ignore' });
      } catch {
        // Remote doesn't exist, that's fine
      }
      
      execSync(`git remote add origin ${repo.clone_url}`);
      console.log('✅ Added remote origin');
      
      // Add all files
      execSync('git add .');
      console.log('✅ Added all files to git');
      
      // Commit
      execSync('git commit -m "Initial commit: Complete Card Clash Arena game with multiplayer, animations, and social features"');
      console.log('✅ Created initial commit');
      
      // Push to GitHub
      execSync('git branch -M main');
      execSync('git push -u origin main');
      console.log('✅ Pushed to GitHub');
      
      console.log(`\n🎉 Successfully pushed Card Clash Arena to GitHub!`);
      console.log(`🔗 Repository URL: ${repo.html_url}`);
      console.log(`\n🎮 Your complete card battle game is now on GitHub with:`);
      console.log(`   ✨ Real-time multiplayer battles`);
      console.log(`   ✨ Advanced battle animations`);
      console.log(`   ✨ PostgreSQL database integration`);
      console.log(`   ✨ Complete social features foundation`);
      console.log(`   ✨ Professional UI/UX design`);
      
      return repo.html_url;
    }
    
  } catch (error) {
    console.error('❌ Error setting up GitHub repository:', error);
    throw error;
  }
}

// Run the setup
setupGitHubRepository()
  .then((url) => {
    console.log(`\n🚀 Card Clash Arena is live on GitHub: ${url}`);
  })
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  });