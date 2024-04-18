// SPDX-License-Identifier: ICS
pragma solidity 0.8.25;

import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol';
import '@openzeppelin/contracts/token/ERC20/extensions/ERC20Wrapper.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract Satoshi is ERC20Wrapper, ERC20Permit, Ownable {
    uint16 public feeBps;
    uint16 public feeMin;
    uint16 public feeMax;

    uint constant HUNDRED_PERCENT = 10000;

    event SetFees(uint16 feeBpsNew, uint16 feeMinNew, uint16 feeMaxNew);

    error InvalidFee();

    constructor(IERC20 wbtc, address initialOwner)
        ERC20Wrapper(wbtc)
        ERC20('Satoshi', 'SATO')
        ERC20Permit('Satoshi')
        Ownable(initialOwner)
    {}

    function decimals() public view virtual override(ERC20, ERC20Wrapper) returns (uint8) {
        return 0;
    }

    /**
     * @dev Mint SATO to cover any WBTC that have been transferred by mistake.
     */
    function recover(address to) external onlyOwner() returns (uint) {
        return _recover(to);
    }

    function setFees(uint16 feeBpsNew, uint16 feeMinNew, uint16 feeMaxNew) external onlyOwner() {
        if (feeBpsNew > 100) revert InvalidFee();
        if (feeMinNew > 1) revert InvalidFee();
        if (feeMaxNew > 1000) revert InvalidFee();
        if (feeMinNew > feeMaxNew) revert InvalidFee();
        feeBps = feeBpsNew;
        feeMin = feeMinNew;
        feeMax = feeMaxNew;
        emit SetFees(feeBps, feeMin, feeMax);
    }

    function _update(address from, address to, uint256 value) internal virtual override {
        if (from == address(0) || to == address(0)) {
            super._update(from, to, value);
            return;
        }
        uint feeBpsLocal = feeBps;
        uint feeMinLocal = feeMin;
        uint feeMaxLocal = feeMax;
        uint fee = value * feeBpsLocal / HUNDRED_PERCENT;
        if (fee < feeMinLocal) {
            fee = feeMinLocal;
        } else if (fee > feeMaxLocal) {
            fee = feeMaxLocal;
        }
        if (fee >= value) {
            fee = 0;
        }
        super._update(from, to, value - fee);
        if (fee > 0) {
            super._update(from, owner(), fee);
        }
    }
}
