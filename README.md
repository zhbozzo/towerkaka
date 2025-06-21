# Tower Defense Game

A complete tower defense game built with React and TypeScript, featuring geometric-style graphics, strategic gameplay mechanics, and multiple levels with varying difficulty.

## 🎮 Game Features

### Core Gameplay
- **Multiple Levels**: 3 unique levels with different layouts and difficulty settings
- **Level Selection**: Choose from Forest Path (Easy), Mountain Pass (Medium), or Desert Maze (Hard)
- **Wave-based Defense**: Progressive waves with increasing difficulty
- **Strategic Tower Placement**: Visual grid system shows valid placement locations
- **Tower Management**: Build, upgrade, and sell towers with refund system
- **Resource Economy**: Earn resources by destroying enemies and managing economy
- **Collapsible Sidebar**: Toggle tower selection panel for better gameplay experience

### Enhanced UI/UX
- **Grid Visualization**: Green squares show valid tower placement when tower is selected
- **Collapsible Sidebar**: Right-side panel for tower selection and management
- **Tower Selling**: Sell towers for 70% of total investment value
- **Level Selection Screen**: Choose difficulty and view level statistics
- **Main Menu**: Professional game interface with navigation options
- **Responsive Design**: Optimized for both desktop and mobile devices

### Tower Types
1. **Basic Tower** (Blue Square)
   - High single-target damage
   - Good range and fire rate
   - Cost: $50/$75/$100 | Sell: $35/$87/$157

2. **Area Tower** (Orange Square)
   - Splash damage to multiple enemies
   - Moderate damage with area effect
   - Cost: $75/$100/$125 | Sell: $52/$122/$210

3. **Freeze Tower** (Cyan Square)
   - Slows enemies while dealing damage
   - Applies slow effect for crowd control
   - Cost: $60/$90/$120 | Sell: $42/$105/$189

4. **Resource Tower** (Yellow Square)
   - Generates additional resources over time
   - Lower combat effectiveness but economic benefit
   - Cost: $100/$150/$200 | Sell: $70/$175/$315

### Enemy Classes
1. **Scout** (Red Circle) - Fast but fragile
2. **Heavy** (Gray Circle) - Slow but very durable
3. **Ghost** (Purple Circle) - Becomes invisible periodically
4. **Healer** (Green Circle) - Regenerates health over time

### Levels
1. **Forest Path** (Easy)
   - Starting Resources: $250
   - Lives: 25
   - Simple winding path perfect for beginners

2. **Mountain Pass** (Medium)
   - Starting Resources: $200
   - Lives: 20
   - Treacherous route with tight corners

3. **Desert Maze** (Hard)
   - Starting Resources: $150
   - Lives: 15
   - Complex maze layout for experienced players

## 🚀 Quick Start

### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Playing the Game
1. **Select Level**: Choose from three difficulty levels in the level selection screen
2. **Start Wave**: Click "Start Wave" to begin enemy spawns
3. **Select Tower**: Use the collapsible sidebar to choose tower types
4. **Place Tower**: Click on green grid squares to place towers
5. **Manage Towers**: Click on existing towers to upgrade or sell them
6. **Strategic Planning**: Balance building new towers vs upgrading existing ones

## 🛠️ New Features Guide

### Grid System
When you select a tower type, the game displays:
- **Grid Lines**: Visual grid overlay on the game field
- **Valid Positions**: Green squares indicate where towers can be placed
- **Invalid Areas**: Path areas and occupied spaces are automatically excluded

### Collapsible Sidebar
- **Toggle Button**: Arrow button on the right side to show/hide sidebar
- **Tower Selection**: Choose from 4 tower types with cost and description
- **Tower Information**: View selected tower stats and sell options
- **Instructions**: Built-in help text for new players

### Tower Selling System
- **Refund Value**: Sell towers for 70% of total investment (base cost + upgrade costs)
- **Strategic Decisions**: Sell underperforming towers to fund better positions
- **Resource Management**: Reclaim resources when repositioning defenses

### Level System
- **Multiple Maps**: Each level has unique waypoint layouts
- **Difficulty Scaling**: Different starting resources and lives
- **Progressive Challenge**: Unlock strategic depth with harder levels
- **Replayability**: Try different strategies on each level

## 🎯 Advanced Strategies

### Grid Placement Tips
- **Corner Positions**: Place towers at path corners for maximum coverage
- **Overlapping Ranges**: Position towers so their ranges overlap for concentrated fire
- **Upgrade Paths**: Leave space around towers for future upgrades
- **Economic Balance**: Use resource towers in safe positions

### Sidebar Management
- **Quick Access**: Keep sidebar open during planning phases
- **Hide for Focus**: Collapse sidebar during intense waves for better visibility
- **Tower Comparison**: Use sidebar to compare tower stats before purchasing

### Selling Strategy
- **Early Game**: Sell basic towers to fund area towers for grouped enemies
- **Mid Game**: Upgrade vs sell decisions based on enemy types
- **Late Game**: Sell resource towers to fund maximum damage output
- **Emergency Funds**: Sell towers to quickly raise resources for critical upgrades

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameCanvas.tsx          # Main game rendering with grid system
│   └── UI/
│       ├── MainMenu.tsx        # Game start screen
│       ├── LevelSelect.tsx     # Level selection interface
│       ├── GameHUD.tsx         # Resource and wave display
│       ├── Sidebar.tsx         # Collapsible tower management
│       ├── TowerUpgrade.tsx    # Tower upgrade/sell modal
│       └── GameOverScreen.tsx  # End game screen with navigation
├── config/
│   └── gameConfig.ts           # Game balance, levels, and tower configs
├── game/
│   └── GameEngine.ts           # Core game logic with level management
├── types/
│   └── game.ts                 # TypeScript definitions including Level type
├── utils/
│   └── gameUtils.ts            # Utility functions including grid helpers
└── App.tsx                     # Main application with screen management
```

## 🎨 Customization Guide

### Adding New Levels
Edit `src/config/gameConfig.ts` to add new levels:

```typescript
export const LEVELS: Level[] = [
  // ... existing levels
  {
    id: 4,
    name: 'Your Level Name',
    description: 'Level description',
    difficulty: 'Medium',
    initialResources: 200,
    initialLives: 20,
    waypoints: [
      { x: -20, y: 250 },
      // ... more waypoints
    ],
    waves: [
      // ... wave definitions
    ]
  }
];
```

### Modifying Tower Economics
Adjust tower costs and sell values:

```typescript
export const TOWER_CONFIG = {
  basic: {
    // ... other properties
    cost: [50, 75, 100],        // Build/upgrade costs
    sellValue: [35, 87, 157]    // Sell values (70% of investment)
  }
};
```

### Customizing Grid System
Modify grid appearance and behavior:

```typescript
export const GAME_CONFIG = {
  GRID_SIZE: 40,                    // Size of grid squares
  TOWER_SELL_PERCENTAGE: 0.7        // Percentage returned when selling
};
```

## 📱 Mobile Optimization

The enhanced game includes improved mobile features:
- **Touch-Friendly Sidebar**: Easy toggle and navigation
- **Responsive Grid**: Grid squares scale appropriately on mobile
- **Optimized UI**: All interface elements work well on touch devices
- **Performance**: Efficient rendering for mobile browsers

## 🔧 Development

### New Component Architecture
- **Screen Management**: Separate components for menu, level select, and gameplay
- **State Management**: Centralized game state with phase management
- **Modular UI**: Reusable components for different game screens

### Enhanced Game Engine
- **Level System**: Support for multiple levels with different configurations
- **Selling Logic**: Tower selling with proper resource refunding
- **UI State**: Sidebar visibility and screen navigation management

---

**Defend your territory with strategic planning and tactical execution!** 🏰⚔️

The enhanced tower defense game now offers a complete gaming experience with multiple levels, advanced tower management, and professional UI design suitable for both casual and strategic gameplay.