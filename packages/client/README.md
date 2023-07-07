# Global UI States
- Player Setup
  - player driven
- Player Generation
  - waiting
  - ends with "Let's Go" to move on
- Location
- WorldMap
- Traveling
  - ends with "Enter xxxxx" to go to Location

# Modal states
- History
- Settings
- Profile
- startTravel
- InteractMulti

# State variables
- GlobalState
- ModalState

# Example for LocationInteraction
- Location


# Mud contains the player state
- Setup
- Location: Ready
- Location: Waiting for effects
- Traveling (activeLocationId)
- MultiInteraction: Ready
- MultiInteraction: Waiting
