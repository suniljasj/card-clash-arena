# 🎯 Card Clash Legends Arena

> **A comprehensive multiplayer card battle arena game featuring real-time combat, deck building, guild systems, and competitive ranked gameplay.**

![Card Clash Legends Arena](https://img.shields.io/badge/Game-Card%20Battle%20Arena-gold?style=for-the-badge&logo=game&logoColor=white)
![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

## 📖 Table of Contents

- [🎮 Game Overview](#-game-overview)
- [✨ Key Features](#-key-features)
- [🛠 Technology Stack](#-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [💾 Database Schema](#-database-schema)
- [🎨 UI Design System](#-ui-design-system)
- [🎯 Game Mechanics](#-game-mechanics)
- [🌐 API Documentation](#-api-documentation)
- [📱 Screen Components](#-screen-components)
- [🔄 Real-time Features](#-real-time-features)
- [🛡 Security Features](#-security-features)
- [📊 Performance](#-performance)
- [🧪 Development](#-development)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🎮 Game Overview

Card Clash Legends Arena is a sophisticated multiplayer card battle game that combines strategic deck building with real-time combat mechanics. Players engage in epic duels using carefully crafted decks, compete in ranked matches, complete challenging quests, and participate in guild activities.

### 🎯 Core Gameplay Loop

1. **Account Creation & Tutorial** - New players start with guided tutorial
2. **Deck Building** - Customize decks with collected cards
3. **Battle Arena** - Engage in turn-based combat with real-time elements
4. **Quest System** - Complete daily/weekly challenges for rewards
5. **Collection Management** - Acquire new cards through store and rewards
6. **Competitive Ranking** - Climb leaderboards in ranked matches
7. **Social Features** - Join guilds, add friends, and participate in community events

## ✨ Key Features

### 🃏 **Card Battle System**
- **Turn-based Combat** with real-time multiplayer synchronization
- **Mana System** for resource management
- **Card Types**: Creatures, Spells, Artifacts, and Special Cards
- **Battle Effects**: Stunning visual effects and animations
- **Victory Conditions**: Multiple win scenarios and comeback mechanics

### 🏗 **Deck Building**
- **30-card decks** with strategic composition limits
- **Card Rarity System**: Common, Rare, Epic, Legendary
- **Deck Validation** ensuring balanced gameplay
- **Multiple Deck Slots** for different strategies
- **Import/Export** deck codes for sharing

### 🏆 **Progression System**
- **Player Levels** with experience-based advancement
- **Ranking System**: Bronze → Silver → Gold → Platinum → Diamond → Master
- **Achievement System** with 50+ unlockable achievements
- **Daily Login Bonuses** and streak rewards
- **Seasonal Rewards** and special events

### 🎯 **Quest & Reward System**
- **Daily Quests**: 3 new quests every day
- **Weekly Challenges**: Complex multi-stage objectives
- **Achievement Tracking**: Long-term goals and milestones
- **Reward Types**: Gold, Gems, Card Packs, and Exclusive Items

### 🛒 **In-Game Economy**
- **Dual Currency**: Gold (earned) and Gems (premium)
- **Card Packs**: Basic, Premium, and Special Event packs
- **Store Rotation**: Daily and weekly featured items
- **Crafting System**: Convert duplicate cards to resources

### 👥 **Social Features**
- **Friends System**: Add friends and view their progress
- **Guild System**: Create/join guilds with up to 50 members
- **Guild Wars**: Competitive inter-guild battles
- **Chat System**: Real-time messaging in guilds and matches
- **Spectator Mode**: Watch friends' battles

### 🎮 **Game Modes**
- **Tutorial Mode**: Guided learning experience
- **Practice Mode**: AI opponents for skill development
- **Ranked Battles**: Competitive ladder climbing
- **Casual Matches**: Unranked gameplay
- **Tournament Mode**: Bracket-style competitions
- **Guild Battles**: Team-based guild vs guild combat

## 🛠 Technology Stack

### **Frontend Architecture**
- **⚛️ React 18.3.1** - Modern React with hooks and context
- **📱 TypeScript 5.6.3** - Type-safe development
- **🎨 Tailwind CSS 3.4.14** - Utility-first styling with custom design system
- **🏗 Vite 5.4.19** - Lightning-fast build tool and development server
- **🎭 Framer Motion 11.13.1** - Advanced animations and transitions
- **🔗 Wouter 3.3.5** - Minimal routing solution
- **📊 TanStack Query 5.60.5** - Server state management and caching

### **Backend Infrastructure**
- **🟢 Node.js + Express 4.21.2** - RESTful API server
- **🔌 WebSocket (ws 8.18.0)** - Real-time multiplayer communication
- **🗄 PostgreSQL** - Robust relational database via Neon
- **🛠 Drizzle ORM 0.39.1** - Type-safe database operations
- **🔐 Passport.js** - Authentication middleware with local strategy
- **🎯 Express Sessions** - Secure session management

### **UI Component System**
- **🎨 Radix UI** - Accessible, unstyled component primitives
- **💎 shadcn/ui** - Beautiful, customizable component library
- **📦 Lucide React** - Comprehensive icon library
- **🎵 Howler.js** - Web audio management for game sounds
- **✨ React Confetti** - Celebration animations for victories

### **Development Tools**
- **📝 ESBuild** - Ultra-fast JavaScript bundler
- **🔧 TSX** - TypeScript execution for development
- **🎯 Drizzle Kit** - Database schema management
- **📊 Zod** - Runtime type validation
- **🧪 Type Safety** - End-to-end TypeScript coverage

## 📁 Project Structure

```
card-clash-arena/
├── 📁 client/                          # Frontend React application
│   ├── 📁 public/                      # Static assets
│   │   ├── 📁 fonts/                   # Custom fonts and typography
│   │   ├── 📁 sounds/                  # Game audio files
│   │   └── 📁 textures/                # Visual assets and backgrounds
│   └── 📁 src/
│       ├── 📁 components/              # Reusable UI components
│       │   ├── 📁 game/                # Game-specific components
│       │   │   ├── BattleEffects.tsx  # Combat animations
│       │   │   ├── BattleField.tsx    # Main battle interface
│       │   │   ├── CardHand.tsx       # Player hand management
│       │   │   ├── Navigation.tsx     # App navigation
│       │   │   └── PlayerHUD.tsx      # Player information display
│       │   └── 📁 ui/                  # Generic UI components
│       │       ├── card-component.tsx # Card display component
│       │       ├── button.tsx         # Button variants
│       │       ├── dialog.tsx         # Modal dialogs
│       │       ├── input.tsx          # Form inputs
│       │       └── ...                # 40+ additional UI components
│       ├── 📁 data/                    # Static game data
│       │   ├── cards.ts               # Card definitions and abilities
│       │   └── quests.ts              # Quest templates and rewards
│       ├── 📁 hooks/                   # Custom React hooks
│       │   └── use-is-mobile.tsx      # Responsive design utilities
│       ├── 📁 lib/                     # Core application logic
│       │   ├── 📁 stores/              # State management (Zustand)
│       │   │   ├── useAudio.tsx       # Audio state management
│       │   │   ├── useAuth.tsx        # Authentication state
│       │   │   ├── useBattle.tsx      # Battle state management
│       │   │   ├── useCards.tsx       # Card collection state
│       │   │   ├── useGame.tsx        # Global game state
│       │   │   ├── usePlayer.tsx      # Player profile state
│       │   │   ├── useQuests.tsx      # Quest progress tracking
│       │   │   ├── useStore.tsx       # Shop and economy state
│       │   │   └── useWebSocket.tsx   # Real-time communication
│       │   ├── queryClient.ts         # TanStack Query configuration
│       │   └── utils.ts               # Utility functions
│       ├── 📁 screens/                 # Full-screen components
│       │   ├── AuthScreen.tsx         # Login/Registration
│       │   ├── BattleArenaScreen.tsx  # Main battle interface
│       │   ├── CardCollectionScreen.tsx # Card management
│       │   ├── DashboardScreen.tsx    # Main menu and overview
│       │   ├── DeckBuilderScreen.tsx  # Deck creation/editing
│       │   ├── MatchmakingScreen.tsx  # Player matching
│       │   ├── MultiplayerBattleScreen.tsx # Real-time battles
│       │   ├── ProfileScreen.tsx      # Player profile and stats
│       │   ├── QuestsScreen.tsx       # Quest management
│       │   ├── SettingsScreen.tsx     # Game configuration
│       │   ├── StoreScreen.tsx        # In-game shop
│       │   ├── TutorialScreen.tsx     # New player guidance
│       │   └── VictoryDefeatScreen.tsx # Post-battle results
│       ├── 📁 types/                   # TypeScript type definitions
│       │   └── game.ts                # Core game type definitions
│       ├── App.tsx                    # Main application component
│       ├── main.tsx                   # Application entry point
│       └── index.css                  # Global styles and Tailwind imports
├── 📁 server/                          # Backend Express application
│   ├── db.ts                          # Database connection configuration
│   ├── dbStorage.ts                   # Database storage operations
│   ├── index.ts                       # Server entry point and configuration
│   ├── routes.ts                      # API route definitions
│   ├── storage.ts                     # Data persistence layer
│   ├── types.ts                       # Backend type definitions
│   ├── vite.ts                        # Vite integration for production
│   └── websocket.ts                   # Real-time communication handler
├── 📁 shared/                          # Shared code between client/server
│   └── schema.ts                      # Database schema and validation
├── 📁 scripts/                         # Build and deployment scripts
├── drizzle.config.ts                  # Database ORM configuration
├── package.json                       # Dependencies and scripts
├── tailwind.config.ts                 # Styling configuration
├── tsconfig.json                      # TypeScript configuration
└── vite.config.ts                     # Build tool configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** (Latest LTS recommended)
- **PostgreSQL database** (Neon cloud database supported)
- **Git** for version control

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd card-clash-arena

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 2. Database Setup
```bash
# Set up your database URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/cardclash"

# Push database schema
npm run db:push
```

### 3. Environment Configuration
Create a `.env` file with the following variables:
```env
# Database Configuration
DATABASE_URL="your_postgresql_connection_string"
PGHOST="your_db_host"
PGUSER="your_db_user"
PGPASSWORD="your_db_password"
PGDATABASE="your_db_name"
PGPORT="5432"

# Session Management
SESSION_SECRET="your_secure_session_secret_key"

# Server Configuration
PORT="5000"
NODE_ENV="development"
```

### 4. Start Development
```bash
# Start the development server (includes both backend and frontend)
npm run dev

# The application will be available at:
# Frontend: http://localhost:5000
# Backend API: http://localhost:5000/api
# WebSocket: ws://localhost:5000/ws
```

### 5. Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 💾 Database Schema

The application uses a comprehensive PostgreSQL schema with the following key tables:

### **Core User System**
```sql
-- User authentication and account management
users (id, username, email, password, created_at, updated_at)

-- Player game data and progression
players (
  id, user_id, username, level, experience, gold, gems,
  avatar, rank, wins, losses, total_games, 
  has_completed_tutorial, last_login_bonus,
  achievements[], owned_cards[], card_counts{},
  active_deck_id, created_at, updated_at
)
```

### **Game Content System**
```sql
-- Player deck configurations
decks (
  id, user_id, name, card_ids[], 
  created_at, last_modified
)

-- Quest and achievement tracking
quests (
  id, user_id, title, description, type,
  progress, max_progress, is_completed, is_claimed,
  rewards{}, expires_at, created_at
)

-- Battle session management
battles (
  id, player1_id, player2_id, 
  player1_deck_id, player2_deck_id,
  status, winner, started_at, ended_at,
  game_state{}
)
```

### **Social Features System**
```sql
-- Friend system
friend_requests (
  id, sender_id, receiver_id, status,
  message, created_at, responded_at
)

friendships (
  id, player_one_id, player_two_id, status,
  created_at, last_interaction
)

-- Guild system
guilds (
  id, name, description, tag, owner_id,
  level, experience, max_members, is_public,
  join_requirement, created_at, updated_at
)

guild_members (
  id, guild_id, player_id, role,
  joined_at, contribution_points, last_active
)

guild_invites (
  id, guild_id, inviter_id, invitee_id,
  status, message, created_at, responded_at, expires_at
)
```

### **Data Relationships**
- **Users** → **Players** (1:1) - Account to game profile mapping
- **Players** → **Decks** (1:Many) - Multiple deck configurations per player
- **Players** → **Quests** (1:Many) - Individual quest progress tracking
- **Players** → **Battles** (Many:Many) - Battle participation history
- **Players** → **Friendships** (Many:Many) - Bidirectional friend connections
- **Guilds** → **Guild Members** (1:Many) - Guild membership management

## 🎨 UI Design System

### **Design Philosophy**
The game features an **elegant golden-bordered aesthetic** inspired by premium card games:

- **🏆 Golden Accents**: Luxurious amber/gold color palette
- **🌌 Rich Backgrounds**: Deep purple gradients with cosmic themes
- **💎 Ornate Details**: Decorative borders and corner embellishments
- **✨ Smooth Animations**: Framer Motion-powered transitions
- **🎯 High Contrast**: Excellent readability with dark/light contrasts

### **Color Palette**
```css
/* Primary Golden Theme */
--amber-300: #fcd34d    /* Light golden text */
--amber-400: #fbbf24    /* Primary golden accents */
--amber-500: #f59e0b    /* Golden buttons and highlights */
--amber-600: #d97706    /* Darker golden elements */

/* Purple Gradients */
--purple-900: #581c87   /* Deep purple backgrounds */
--purple-800: #6b21a8   /* Medium purple elements */
--purple-600: #9333ea   /* Accent purple */

/* Supporting Colors */
--black: #000000        /* Pure black for depth */
--white: #ffffff        /* Pure white for contrast */
```

### **Component Design Patterns**

#### **Card Components**
- **Ornate Golden Borders**: 2-4px amber borders with rounded corners
- **Circular Mana Indicators**: Positioned at top-left with centered values
- **Stat Circles**: Attack/Health in bottom corners
- **Hover Effects**: Subtle glow and scale animations
- **Selection States**: Enhanced golden glow when selected

#### **Navigation Elements**
- **Bottom Navigation**: Gradient background with golden active states
- **Icon Styling**: 6x6 icons with amber coloring
- **Active Indicators**: Golden background with shadow effects
- **Smooth Transitions**: 300ms duration for all state changes

#### **Form Components**
- **Input Fields**: Purple background with golden focus borders
- **Button Styling**: Gradient backgrounds with golden border accents
- **Loading States**: Animated spinners with golden coloring
- **Error Messages**: Red gradients with golden border highlights

### **Animation Framework**
- **Framer Motion**: Advanced page transitions and component animations
- **CSS Transitions**: Smooth hover and focus state changes
- **Keyframe Animations**: Pulsing effects for important elements
- **Staggered Animations**: Sequential reveals for lists and grids

## 🎯 Game Mechanics

### **Card System**
```typescript
interface Card {
  id: string;
  name: string;
  cost: number;        // Mana cost (0-10)
  attack?: number;     // Attack value for creatures
  health?: number;     // Health value for creatures
  type: 'creature' | 'spell' | 'artifact';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string; // Card effect description
  abilities?: string[]; // Special abilities
  set: string;         // Card set/expansion
}
```

### **Battle Flow**
1. **🎲 Initialization**
   - Players draw starting hands (7 cards)
   - Starting mana: 1 for each player
   - Turn order determined randomly

2. **🔄 Turn Sequence**
   - Draw phase: Draw 1 card
   - Mana phase: Gain 1 mana (max 10)
   - Main phase: Play cards and attack
   - End phase: Trigger end-of-turn effects

3. **⚔️ Combat System**
   - Creatures can attack opponent or their creatures
   - Spell cards have immediate effects
   - Damage calculation includes buffs/debuffs
   - Health tracking with defeat conditions

4. **🏆 Victory Conditions**
   - Reduce opponent's health to 0
   - Opponent runs out of cards (deck out)
   - Special card-based win conditions

### **Deck Building Rules**
- **Deck Size**: Exactly 30 cards
- **Copy Limits**: Maximum 3 copies of any single card
- **Mana Curve**: Recommended distribution across mana costs
- **Type Balance**: Suggested mix of creatures, spells, and artifacts
- **Rarity Limits**: Legendary cards limited to 1 copy per deck

### **Progression Mechanics**
```typescript
// Experience and leveling
const experienceForLevel = (level: number) => level * 100 + (level - 1) * 50;

// Ranking system progression
const ranks = [
  'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'
];

// Daily quest generation
const generateDailyQuests = () => [
  { type: 'win_battles', target: 3, reward: { gold: 100, experience: 50 }},
  { type: 'play_cards', target: 20, reward: { gold: 75, gems: 5 }},
  { type: 'deal_damage', target: 50, reward: { gold: 150, experience: 25 }}
];
```

## 🌐 API Documentation

### **Authentication Endpoints**
```typescript
POST /api/auth/register
Body: { username: string, email: string, password: string }
Response: { success: boolean, player?: Player, error?: string }

POST /api/auth/login
Body: { username: string, password: string }
Response: { success: boolean, player?: Player, error?: string }

POST /api/auth/logout
Response: { success: boolean }

GET /api/auth/profile
Response: { player: Player, authenticated: boolean }
```

### **Game Data Endpoints**
```typescript
GET /api/cards
Response: { cards: Card[] }

GET /api/player/decks
Response: { decks: Deck[] }

POST /api/player/decks
Body: { name: string, cardIds: string[] }
Response: { deck: Deck, success: boolean }

PUT /api/player/decks/:id
Body: { name?: string, cardIds?: string[] }
Response: { deck: Deck, success: boolean }

DELETE /api/player/decks/:id
Response: { success: boolean }
```

### **Battle System Endpoints**
```typescript
POST /api/battles/create
Body: { deckId: string }
Response: { battleId: string, success: boolean }

GET /api/battles/:id
Response: { battle: Battle, gameState: any }

POST /api/battles/:id/action
Body: { action: string, data: any }
Response: { success: boolean, gameState: any }

POST /api/battles/:id/surrender
Response: { success: boolean }
```

### **Quest System Endpoints**
```typescript
GET /api/quests
Response: { quests: Quest[] }

POST /api/quests/:id/claim
Response: { success: boolean, rewards: any }

GET /api/quests/daily
Response: { dailyQuests: Quest[], nextReset: timestamp }
```

### **Social Features Endpoints**
```typescript
GET /api/friends
Response: { friends: Player[], requests: FriendRequest[] }

POST /api/friends/request
Body: { targetUsername: string, message?: string }
Response: { success: boolean }

POST /api/friends/respond/:id
Body: { accept: boolean }
Response: { success: boolean }

GET /api/guilds
Response: { guilds: Guild[], myGuild?: Guild }

POST /api/guilds/create
Body: { name: string, tag: string, description?: string }
Response: { guild: Guild, success: boolean }
```

## 📱 Screen Components

### **Authentication Flow**
- **AuthScreen**: Elegant login/signup with ornate golden logo
  - Tabbed interface for login vs registration
  - Form validation with real-time feedback
  - Loading states with smooth animations
  - Error handling with user-friendly messages

### **Main Game Screens**
- **DashboardScreen**: Central hub with game overview
  - Daily quest previews with progress bars
  - Recent achievements showcase
  - Store offers and featured items
  - Player stats and quick actions

- **BattleArenaScreen**: Core gameplay interface
  - Real-time battle visualization
  - Card hand management with drag-and-drop
  - Mana tracking and turn indicators
  - Battle effects and animations

- **CardCollectionScreen**: Complete card management
  - Filterable card grid with search
  - Rarity-based organization
  - Card details with zoom functionality
  - Collection statistics and completion tracking

- **DeckBuilderScreen**: Strategic deck creation
  - Visual deck composition with mana curve
  - Card search and filtering tools
  - Deck validation and recommendations
  - Save/load/share deck functionality

### **Social & Progression Screens**
- **ProfileScreen**: Player achievement showcase
  - Battle statistics and win/loss records
  - Achievement gallery with progress tracking
  - Rank progression visualization
  - Customizable avatar and titles

- **QuestsScreen**: Challenge and reward management
  - Daily, weekly, and achievement quest tabs
  - Progress tracking with visual indicators
  - Reward claiming interface
  - Quest history and statistics

- **StoreScreen**: In-game economy hub
  - Featured items with rotating stock
  - Card pack purchases with preview animations
  - Currency display and transaction history
  - Special offers and bundle deals

## 🔄 Real-time Features

### **WebSocket Architecture**
The game implements comprehensive real-time functionality using WebSocket connections:

```typescript
// Client-side WebSocket management
const wsStore = useWebSocket();

// Connection events
wsStore.connect(); // Establish connection
wsStore.disconnect(); // Clean disconnection
wsStore.send(message); // Send real-time message

// Event handlers
wsStore.on('battle_update', handleBattleUpdate);
wsStore.on('friend_online', handleFriendStatus);
wsStore.on('guild_message', handleGuildChat);
```

### **Real-time Battle System**
- **Turn Synchronization**: Server-authoritative turn management
- **Action Broadcasting**: Immediate opponent action updates
- **State Reconciliation**: Conflict resolution for simultaneous actions
- **Reconnection Handling**: Seamless reconnection with state recovery

### **Live Social Features**
- **Friend Status**: Real-time online/offline indicators
- **Guild Chat**: Instant messaging within guild channels
- **Spectator Mode**: Live battle viewing with minimal delay
- **Notifications**: Push notifications for important events

### **Matchmaking System**
```typescript
// Real-time matchmaking process
const startMatchmaking = async (deckId: string) => {
  // 1. Enter matchmaking queue
  await wsStore.send({
    type: 'matchmaking_start',
    data: { deckId, playerRank }
  });

  // 2. Receive match updates
  wsStore.on('matchmaking_update', (data) => {
    updateMatchmakingStatus(data.queuePosition, data.estimatedWait);
  });

  // 3. Match found notification
  wsStore.on('match_found', (data) => {
    navigateToBattle(data.battleId, data.opponent);
  });
};
```

## 🛡 Security Features

### **Authentication Security**
- **Password Hashing**: Bcrypt with configurable salt rounds
- **Session Management**: Secure HTTP-only cookies
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: API endpoint protection against abuse

### **Game Security**
- **Server-side Validation**: All game actions validated on backend
- **Anti-cheat Measures**: Comprehensive input validation
- **Data Sanitization**: SQL injection and XSS prevention
- **Secure WebSocket**: Authenticated real-time connections

### **Privacy Protection**
- **Data Encryption**: Sensitive data encrypted at rest
- **PII Handling**: Minimal personal information collection
- **GDPR Compliance**: Data protection and user rights
- **Audit Logging**: Security event tracking and monitoring

## 📊 Performance

### **Frontend Optimizations**
- **Code Splitting**: Lazy-loaded screen components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Tree Shaking**: Unused code elimination
- **Caching Strategy**: Service worker for offline functionality

### **Backend Performance**
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connection management
- **Caching Layer**: Redis integration for frequently accessed data
- **API Rate Limiting**: Protection against DDoS and abuse
- **Monitoring**: Application performance monitoring (APM)

### **Real-time Performance**
- **WebSocket Optimization**: Efficient message serialization
- **State Compression**: Reduced payload sizes for game state
- **Connection Management**: Automatic reconnection with exponential backoff
- **Scalability**: Horizontal scaling support for WebSocket servers

## 🧪 Development

### **Development Workflow**
```bash
# Development mode with hot reload
npm run dev

# Type checking
npm run check

# Database schema changes
npm run db:push

# Production build
npm run build

# Production server
npm start
```

### **Code Quality Tools**
- **TypeScript**: Strict type checking across the entire codebase
- **ESLint**: Code linting with React and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality assurance

### **Testing Strategy**
```typescript
// Unit tests for game logic
describe('Card Battle System', () => {
  test('mana cost calculation', () => {
    expect(calculateManaCost(card)).toBe(expectedCost);
  });
  
  test('damage calculation with buffs', () => {
    expect(calculateDamage(attacker, defender, buffs)).toBe(expectedDamage);
  });
});

// Integration tests for API endpoints
describe('Battle API', () => {
  test('create battle session', async () => {
    const response = await api.post('/battles/create', { deckId });
    expect(response.status).toBe(200);
    expect(response.data.battleId).toBeDefined();
  });
});
```

### **Database Management**
```bash
# Schema migrations
npm run db:push

# Force schema update (use carefully)
npm run db:push --force

# Generate schema types
npm run db:generate
```

## 🚀 Deployment

### **Production Environment Setup**

#### **Environment Variables**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=your_production_session_secret
PORT=5000
```

#### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

#### **Replit Deployment**
The application is optimized for Replit deployment:
- Automatic dependency installation
- Environment variable management
- Built-in database integration
- One-click deployment to replit.app domains

### **Production Checklist**
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] SSL/TLS certificates installed
- [ ] CDN configured for static assets
- [ ] Monitoring and logging enabled
- [ ] Backup strategy implemented
- [ ] Performance monitoring active

### **Scaling Considerations**
- **Load Balancing**: Multiple server instances behind load balancer
- **Database Scaling**: Read replicas and connection pooling
- **WebSocket Scaling**: Redis adapter for multi-instance coordination
- **CDN Integration**: Static asset delivery optimization
- **Caching Strategy**: Redis for session storage and game state

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `npm install`
4. Set up environment variables
5. Start development server: `npm run dev`

### **Code Style Guidelines**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for complex functions
- Ensure responsive design for all UI components
- Test multiplayer features thoroughly

### **Pull Request Process**
1. Update documentation for any new features
2. Ensure all tests pass: `npm run test`
3. Add tests for new functionality
4. Update the README if needed
5. Submit pull request with detailed description

### **Feature Requests**
We welcome feature requests! Please:
- Check existing issues first
- Provide detailed use cases
- Consider implementation complexity
- Discuss breaking changes beforehand

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Live Demo

Experience Card Clash Legends Arena: [Your Deployment URL]

## 📞 Support

- **Bug Reports**: Create an issue with detailed reproduction steps
- **Feature Requests**: Open a discussion in the Ideas category
- **General Questions**: Check the Wiki or start a discussion

---

*Built with ❤️ by the Card Clash Legends Arena team*

![Footer Image](https://img.shields.io/badge/Made%20with-React%20%26%20Node.js-blue?style=for-the-badge&logo=react&logoColor=white)