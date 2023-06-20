// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "forge-std/Test.sol";
import { MudV2Test } from "@latticexyz/std-contracts/src/test/MudV2Test.t.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import {
  PlayerComponent,
  CharacterComponent,
  StoryComponent,
  StoryComponentData,
  NameComponent,
  SummaryComponent,
  ImageComponent,
  LocationComponent,
  InteractComponent,
  InteractComponentData,
  AliveComponent,
  SceneComponent,
  ItemComponent,
  OwnerComponent,
  RaceComponent
} from "../src/codegen/Tables.sol";

import { ArrayLib } from "../src/lib/ArrayLib.sol";
import { Constants } from "../src/lib/Constants.sol";

contract CreationSystemTest is MudV2Test {
  using ArrayLib for bytes;
  using ArrayLib for bytes32[];

  IWorld public world;

  bytes32 mockLocationID;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);

    mockLocationID = world.createLocation("A", "B", "C");
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testFuzz_CreateStory(
    string memory name,
    string memory summary,
    string memory theme,
    string[] memory races,
    string memory currency
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(theme).length > 0);
    vm.assume(races.length > 0);
    vm.assume(bytes(currency).length > 0);

    for (uint256 i=0; i<races.length; i++) {
      vm.assume(bytes(races[i]).length > 0);
    }

    bytes32 storyID = world.createStory(
      name,
      summary,
      theme,
      races,
      currency
    );

    StoryComponentData memory story = StoryComponent.get(world, storyID);

    assertTrue(storyID != story.themeID, "testFuzz_CreateStory::1");

    assertEq(NameComponent.get(world, storyID), name, "testFuzz_CreateStory::2");
    assertEq(SummaryComponent.get(world, storyID), summary, "testFuzz_CreateStory::3");
    assertEq(NameComponent.get(world, story.themeID), theme, "testFuzz_CreateStory::4");
    assertEq(NameComponent.get(world, story.currencyID), currency, "testFuzz_CreateStory::5");

    bytes32[] memory cached_racesID = story.racesID.decodeBytes32Array();
    for (uint256 i=0; i<cached_racesID.length; i++) {
      assertTrue(RaceComponent.get(cached_racesID[i]), "testFuzz_CreateStory::6");
      assertEq(NameComponent.get(cached_racesID[i]), races[i], "testFuzz_CreateStory::7");
    }
  }

  function testFuzz_CreatePlayer(
    string memory name,
    string memory summary,
    string memory imgHash
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(imgHash).length > 0);

    bytes32 playerID = world.createPlayer(name, summary, imgHash, mockLocationID);

    string memory playerName = NameComponent.get(world, playerID);
    string memory playerSummary = SummaryComponent.get(world, playerID);
    string memory playerImgHash = ImageComponent.get(world, playerID);
    bytes32 playerLocation = LocationComponent.get(world, playerID);

    assertTrue(PlayerComponent.get(world, playerID));
    assertTrue(CharacterComponent.get(world, playerID));
    assertTrue(AliveComponent.get(world, playerID));
    assertEq(name, playerName);
    assertEq(summary, playerSummary);
    assertEq(imgHash, playerImgHash);
    assertEq(mockLocationID, playerLocation);
  }

  function testFuzz_CreateNpc(
    string memory name,
    string memory summary,
    string memory imgHash,
    string memory initialMsg,
    string[] memory initialActions
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(imgHash).length > 0);
    vm.assume(bytes(initialMsg).length > 0);
    vm.assume(initialActions.length > 0);

    bytes32 npcID = world.createCharacter(name, summary, imgHash, mockLocationID, initialMsg, initialActions);

    string memory npcName = NameComponent.get(world, npcID);
    string memory npcSummary = SummaryComponent.get(world, npcID);
    string memory npcImgHash = ImageComponent.get(world, npcID);
    bytes32 npcLocation = LocationComponent.get(world, npcID);
    InteractComponentData memory interactData = InteractComponent.get(world, npcID);

    assertFalse(PlayerComponent.get(world, npcID));
    assertTrue(CharacterComponent.get(world, npcID));
    assertTrue(AliveComponent.get(world, npcID));
    assertEq(name, npcName);
    assertEq(summary, npcSummary);
    assertEq(imgHash, npcImgHash);
    assertEq(mockLocationID, npcLocation);
    assertEq(initialMsg, interactData.initialMsg);
  }

  function test_revert_CreatePlayerAlreadyExist() public {
    bytes32 playerID = world.createPlayer("name", "race", "0xabc", mockLocationID);

    vm.expectRevert(abi.encodePacked("player already exist"));
    world.createPlayer("name", "race", "0xabc", mockLocationID);
  }

  function test_revert_CreatePlayer() public {
    vm.expectRevert(abi.encodePacked("invalid name length"));
    world.createPlayer("", "race", "0xabc", mockLocationID);

    vm.expectRevert(abi.encodePacked("invalid summary length"));
    world.createPlayer("name", "", "0xabc", mockLocationID);

    vm.expectRevert(abi.encodePacked("invalid imgHash length"));
    world.createPlayer("name", "race", "", mockLocationID);

    vm.expectRevert(abi.encodePacked("location does not exist"));
    world.createPlayer("name", "race", "0xabc", bytes32(uint256(100)));
  }

  function testFuzz_CreateItem(
    string memory name,
    string memory summary,
    string memory imgHash,
    string memory initialMsg,
    string[] memory initialActions,
    bytes32 ownerID
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(imgHash).length > 0);
    vm.assume(bytes(initialMsg).length > 0);
    vm.assume(initialActions.length > 0);
    vm.assume(ownerID.length > 0);

    bytes32 itemID = world.createItem(
      name,
      summary,
      imgHash,
      mockLocationID,
      initialMsg,
      initialActions,
      ownerID
    );

    assertTrue(ItemComponent.get(world, itemID), "testFuzz_CreateItem::1");
    assertEq(NameComponent.get(world, itemID), name, "testFuzz_CreateItem::2");
    assertEq(SummaryComponent.get(world, itemID), summary, "testFuzz_CreateItem::3");
    assertEq(ImageComponent.get(world, itemID), imgHash, "testFuzz_CreateItem::4");
    assertEq(InteractComponent.getInitialMsg(world, itemID), initialMsg, "testFuzz_CreateItem::5");
    assertEq(LocationComponent.get(world, itemID), mockLocationID, "testFuzz_CreateItem::6");
    assertEq(OwnerComponent.get(world, itemID), ownerID, "testFuzz_CreateItem::6");
  }

  function testFuzz_CreateLocation(
    string memory name,
    string memory summary,
    string memory imgHash
  ) public {
    vm.assume(bytes(name).length > 0);
    vm.assume(bytes(summary).length > 0);
    vm.assume(bytes(imgHash).length > 0);

    bytes32 locationID = world.createLocation(name, summary, imgHash);

    assertTrue(SceneComponent.get(world, locationID));
    assertEq(NameComponent.get(world, locationID), name);
    assertEq(SummaryComponent.get(world, locationID), summary);
    assertEq(ImageComponent.get(world, locationID), imgHash);
  }

  function test_CreateLocation() public {
    string memory name = "name";
    string memory summary = "summary";
    string memory imgHash = "imgHash";

    vm.expectRevert(abi.encodePacked("invalid name length"));
    world.createLocation("", summary, imgHash);
    vm.expectRevert(abi.encodePacked("invalid summary length"));
    world.createLocation(name, "", imgHash);
    vm.expectRevert(abi.encodePacked("invalid imgHash length"));
    world.createLocation(name, summary, "");
  }
}
