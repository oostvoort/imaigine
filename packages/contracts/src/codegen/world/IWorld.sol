// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

import { IBaseWorld } from "@latticexyz/world/src/interfaces/IBaseWorld.sol";

import { IAttributeSystem } from "./IAttributeSystem.sol";
import { IControllerSystem } from "./IControllerSystem.sol";
import { ICreationSystem } from "./ICreationSystem.sol";
import { ILocationSystem } from "./ILocationSystem.sol";
import { IStorySystem } from "./IStorySystem.sol";
import { ITravelSystem } from "./ITravelSystem.sol";

/**
 * The IWorld interface includes all systems dynamically added to the World
 * during the deploy process.
 */
interface IWorld is
  IBaseWorld,
  IAttributeSystem,
  IControllerSystem,
  ICreationSystem,
  ILocationSystem,
  IStorySystem,
  ITravelSystem
{

}
