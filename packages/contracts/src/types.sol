// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

library Types {
  struct ActionEffect {
    int256 karmaChange;
  }

  struct ActionData {
    string mode;
    string content;
    ActionEffect effects;
  }
}
