//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.7;

contract SimpleStorage {
    // store number
    uint256 internal storeNum;

    // storing number
    function store(uint256 _storeNum) public {
        storeNum = _storeNum;
    }

    // getting number
    function getNum() public view returns (uint256) {
        return storeNum;
    }
}
