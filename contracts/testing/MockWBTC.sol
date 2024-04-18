// SPDX-License-Identifier: ICS
pragma solidity 0.8.25;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MockWBTC is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20('MockWBTC', 'MWBTC')
        Ownable(initialOwner)
    {}

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
