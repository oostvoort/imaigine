// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */
enum InteractionType {
  NOT_INTERACTABLE,
  SINGLE,
  MULTIPLE
}

enum TravelStatus {
  NOT_TRAVELLING,
  PREPARING,
  READY_TO_TRAVEL,
  TRAVELLING
}

enum BattleStatus {
  NOT_IN_BATTLE,
  IN_BATTLE,
  DONE_SELECTING,
  LOCKED_IN
}

enum BattleOptions {
  NONE,
  Sword,
  Scroll,
  Potion
}

enum BattleOutcomeType {
  NONE,
  WIN,
  LOSE,
  DRAW
}
