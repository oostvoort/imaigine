// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";

// Import user types
import { BattleOptions } from "./../Types.sol";

bytes32 constant _tableId = bytes32(abi.encodePacked(bytes16(""), bytes16("BattleHistoryCom")));
bytes32 constant BattleHistoryComponentTableId = _tableId;

struct BattleHistoryComponentData {
  bytes32 winner;
  BattleOptions winnerOption;
  bytes32 loser;
  BattleOptions loserOption;
  bool draw;
}

library BattleHistoryComponent {
  /** Get the table's schema */
  function getSchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](5);
    _schema[0] = SchemaType.BYTES32;
    _schema[1] = SchemaType.UINT8;
    _schema[2] = SchemaType.BYTES32;
    _schema[3] = SchemaType.UINT8;
    _schema[4] = SchemaType.BOOL;

    return SchemaLib.encode(_schema);
  }

  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _schema = new SchemaType[](1);
    _schema[0] = SchemaType.UINT256;

    return SchemaLib.encode(_schema);
  }

  /** Get the table's metadata */
  function getMetadata() internal pure returns (string memory, string[] memory) {
    string[] memory _fieldNames = new string[](5);
    _fieldNames[0] = "winner";
    _fieldNames[1] = "winnerOption";
    _fieldNames[2] = "loser";
    _fieldNames[3] = "loserOption";
    _fieldNames[4] = "draw";
    return ("BattleHistoryComponent", _fieldNames);
  }

  /** Register the table's schema */
  function registerSchema() internal {
    StoreSwitch.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Register the table's schema (using the specified store) */
  function registerSchema(IStore _store) internal {
    _store.registerSchema(_tableId, getSchema(), getKeySchema());
  }

  /** Set the table's metadata */
  function setMetadata() internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    StoreSwitch.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Set the table's metadata (using the specified store) */
  function setMetadata(IStore _store) internal {
    (string memory _tableName, string[] memory _fieldNames) = getMetadata();
    _store.setMetadata(_tableId, _tableName, _fieldNames);
  }

  /** Get winner */
  function getWinner(uint256 id) internal view returns (bytes32 winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 0);
    return (Bytes.slice32(_blob, 0));
  }

  /** Get winner (using the specified store) */
  function getWinner(IStore _store, uint256 id) internal view returns (bytes32 winner) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 0);
    return (Bytes.slice32(_blob, 0));
  }

  /** Set winner */
  function setWinner(uint256 id, bytes32 winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setField(_tableId, _keyTuple, 0, abi.encodePacked((winner)));
  }

  /** Set winner (using the specified store) */
  function setWinner(IStore _store, uint256 id, bytes32 winner) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setField(_tableId, _keyTuple, 0, abi.encodePacked((winner)));
  }

  /** Get winnerOption */
  function getWinnerOption(uint256 id) internal view returns (BattleOptions winnerOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 1);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get winnerOption (using the specified store) */
  function getWinnerOption(IStore _store, uint256 id) internal view returns (BattleOptions winnerOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 1);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set winnerOption */
  function setWinnerOption(uint256 id, BattleOptions winnerOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setField(_tableId, _keyTuple, 1, abi.encodePacked(uint8(winnerOption)));
  }

  /** Set winnerOption (using the specified store) */
  function setWinnerOption(IStore _store, uint256 id, BattleOptions winnerOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setField(_tableId, _keyTuple, 1, abi.encodePacked(uint8(winnerOption)));
  }

  /** Get loser */
  function getLoser(uint256 id) internal view returns (bytes32 loser) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 2);
    return (Bytes.slice32(_blob, 0));
  }

  /** Get loser (using the specified store) */
  function getLoser(IStore _store, uint256 id) internal view returns (bytes32 loser) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 2);
    return (Bytes.slice32(_blob, 0));
  }

  /** Set loser */
  function setLoser(uint256 id, bytes32 loser) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setField(_tableId, _keyTuple, 2, abi.encodePacked((loser)));
  }

  /** Set loser (using the specified store) */
  function setLoser(IStore _store, uint256 id, bytes32 loser) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setField(_tableId, _keyTuple, 2, abi.encodePacked((loser)));
  }

  /** Get loserOption */
  function getLoserOption(uint256 id) internal view returns (BattleOptions loserOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 3);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Get loserOption (using the specified store) */
  function getLoserOption(IStore _store, uint256 id) internal view returns (BattleOptions loserOption) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 3);
    return BattleOptions(uint8(Bytes.slice1(_blob, 0)));
  }

  /** Set loserOption */
  function setLoserOption(uint256 id, BattleOptions loserOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setField(_tableId, _keyTuple, 3, abi.encodePacked(uint8(loserOption)));
  }

  /** Set loserOption (using the specified store) */
  function setLoserOption(IStore _store, uint256 id, BattleOptions loserOption) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setField(_tableId, _keyTuple, 3, abi.encodePacked(uint8(loserOption)));
  }

  /** Get draw */
  function getDraw(uint256 id) internal view returns (bool draw) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getField(_tableId, _keyTuple, 4);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Get draw (using the specified store) */
  function getDraw(IStore _store, uint256 id) internal view returns (bool draw) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getField(_tableId, _keyTuple, 4);
    return (_toBool(uint8(Bytes.slice1(_blob, 0))));
  }

  /** Set draw */
  function setDraw(uint256 id, bool draw) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setField(_tableId, _keyTuple, 4, abi.encodePacked((draw)));
  }

  /** Set draw (using the specified store) */
  function setDraw(IStore _store, uint256 id, bool draw) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setField(_tableId, _keyTuple, 4, abi.encodePacked((draw)));
  }

  /** Get the full data */
  function get(uint256 id) internal view returns (BattleHistoryComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = StoreSwitch.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Get the full data (using the specified store) */
  function get(IStore _store, uint256 id) internal view returns (BattleHistoryComponentData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    bytes memory _blob = _store.getRecord(_tableId, _keyTuple, getSchema());
    return decode(_blob);
  }

  /** Set the full data using individual values */
  function set(
    uint256 id,
    bytes32 winner,
    BattleOptions winnerOption,
    bytes32 loser,
    BattleOptions loserOption,
    bool draw
  ) internal {
    bytes memory _data = encode(winner, winnerOption, loser, loserOption, draw);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using individual values (using the specified store) */
  function set(
    IStore _store,
    uint256 id,
    bytes32 winner,
    BattleOptions winnerOption,
    bytes32 loser,
    BattleOptions loserOption,
    bool draw
  ) internal {
    bytes memory _data = encode(winner, winnerOption, loser, loserOption, draw);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.setRecord(_tableId, _keyTuple, _data);
  }

  /** Set the full data using the data struct */
  function set(uint256 id, BattleHistoryComponentData memory _table) internal {
    set(id, _table.winner, _table.winnerOption, _table.loser, _table.loserOption, _table.draw);
  }

  /** Set the full data using the data struct (using the specified store) */
  function set(IStore _store, uint256 id, BattleHistoryComponentData memory _table) internal {
    set(_store, id, _table.winner, _table.winnerOption, _table.loser, _table.loserOption, _table.draw);
  }

  /** Decode the tightly packed blob using this table's schema */
  function decode(bytes memory _blob) internal pure returns (BattleHistoryComponentData memory _table) {
    _table.winner = (Bytes.slice32(_blob, 0));

    _table.winnerOption = BattleOptions(uint8(Bytes.slice1(_blob, 32)));

    _table.loser = (Bytes.slice32(_blob, 33));

    _table.loserOption = BattleOptions(uint8(Bytes.slice1(_blob, 65)));

    _table.draw = (_toBool(uint8(Bytes.slice1(_blob, 66))));
  }

  /** Tightly pack full data using this table's schema */
  function encode(
    bytes32 winner,
    BattleOptions winnerOption,
    bytes32 loser,
    BattleOptions loserOption,
    bool draw
  ) internal view returns (bytes memory) {
    return abi.encodePacked(winner, winnerOption, loser, loserOption, draw);
  }

  /** Encode keys as a bytes32 array using this table's schema */
  function encodeKeyTuple(uint256 id) internal pure returns (bytes32[] memory _keyTuple) {
    _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));
  }

  /* Delete all data for given keys */
  function deleteRecord(uint256 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /* Delete all data for given keys (using the specified store) */
  function deleteRecord(IStore _store, uint256 id) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = bytes32(uint256(id));

    _store.deleteRecord(_tableId, _keyTuple);
  }
}

function _toBool(uint8 value) pure returns (bool result) {
  assembly {
    result := value
  }
}
